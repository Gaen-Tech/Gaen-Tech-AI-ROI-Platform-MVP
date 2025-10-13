import { analyzeCompanyWebsite } from './geminiService';
import { getActiveConfig, type IndustryConfig } from '../config/industryConfigs';
import type { Lead, Company, AnalysisResult, Industry } from '../types';

/**
 * The main entry point for performing a comprehensive, configuration-driven analysis.
 * It returns a fully formed Lead object.
 */
export async function performAnalysis(
  company: Omit<Company, 'id' | 'location' | 'contact'>
): Promise<Lead> {
  const config = getActiveConfig();
  
  console.log(`Using industry config: ${config.name}`);
  
  try {
    const enhancedSystemInstruction = buildConfiguredPrompt(company, config);
    const analysis = await analyzeCompanyWebsite(company, enhancedSystemInstruction);
    
    // Check if the AI analysis resulted in a non-target/disqualified lead
    if (analysis.opportunityScore === 0 && config.id.includes('dental')) {
      return createExcludedLead(company, analysis, "Practice was determined to be a non-target type by AI analysis.");
    }

    let lead: Lead = {
      id: Date.now().toString(),
      company: { ...company, location: 'Online', contact: `info@${company.website}` },
      analysis,
      status: 'prospected',
      createdAt: new Date().toISOString(),
    };
    
    return postProcessResult(lead, config);
    
  } catch (error) {
    console.error('Configured analysis failed:', error);
    // Create a failed lead object to still provide feedback
    return createExcludedLead(company, {} as AnalysisResult, error instanceof Error ? error.message : 'Unknown analysis error');
  }
}

/**
 * Builds an enhanced prompt incorporating the industry configuration
 */
function buildConfiguredPrompt(
  company: Omit<Company, 'id' | 'location' | 'contact'>,
  config: IndustryConfig
): string {
  let prompt = config.systemPrompt;
  prompt = prompt.replace(/\{companyName\}/g, company.name);
  prompt = prompt.replace(/\{websiteUrl\}/g, company.website);
  
  if (config.referralAnalysisPrompt) {
    prompt += '\n\n' + config.referralAnalysisPrompt;
  }
  
  if (config.opportunityTemplates.length > 0) {
    prompt += '\n\nAVAILABLE OPPORTUNITY TEMPLATES:\n';
    config.opportunityTemplates.forEach((template, idx) => {
      prompt += `\n${idx + 1}. ${template.title}`;
      prompt += `\n   Estimated Impact: $${template.estimatedImpactRange.min.toLocaleString()} - $${template.estimatedImpactRange.max.toLocaleString()}`;
      prompt += `\n   Timeline: ${template.timelineMonths.min}-${template.timelineMonths.max} months`;
      prompt += `\n   Applicable when: ${template.applicableWhen.join(', ')}`;
    });
  }
  
  if (config.productFocus) {
    prompt += `\n\nPRODUCT FOCUS: ${config.productFocus}`;
  }
  
  if (config.clientName) {
    prompt += `\nCLIENT: ${config.clientName}`;
  }
  
  return prompt;
}

/**
 * Post-processes the analysis result based on configuration, like recalculating score.
 */
function postProcessResult(lead: Lead, config: IndustryConfig): Lead {
  const calculatedScore = calculateConfigScore(lead, config);
  
  if (Math.abs(calculatedScore - lead.analysis.opportunityScore) > 15) {
    console.log(`Adjusting score from ${lead.analysis.opportunityScore} to ${calculatedScore} based on config`);
    lead.analysis.opportunityScore = calculatedScore;
  }
  
  if (calculatedScore === 0) {
    lead.status = 'Unqualified';
  }
  
  lead.metadata = {
    ...lead.metadata,
    industryConfigId: config.id,
    industryConfigName: config.name,
    productFocus: config.productFocus,
    clientName: config.clientName
  };
  
  return lead;
}

/**
 * Calculates opportunity score based on keywords and rules in the configuration.
 */
function calculateConfigScore(lead: Lead, config: IndustryConfig): number {
  let score = lead.analysis.opportunityScore || 50;
  
  const fullText = `
    ${lead.company.name} 
    ${lead.analysis.keyInsights?.join(' ') || ''}
    ${(lead.analysis.keyOpportunities || []).map(o => `${o.opportunity} ${o.problem} ${o.solution}`).join(' ')}
  `.toLowerCase();
  
  config.scoringCriteria.highPriorityIndicators.forEach(indicator => {
    if (fullText.includes(indicator.keyword.toLowerCase())) {
      score += indicator.points;
    }
  });
  
  config.scoringCriteria.mediumPriorityIndicators.forEach(indicator => {
    if (fullText.includes(indicator.keyword.toLowerCase())) {
      score += indicator.points;
    }
  });
  
  config.scoringCriteria.referralIndicators.forEach(indicator => {
    if (fullText.includes(indicator.keyword.toLowerCase())) {
      score += indicator.points;
    }
  });
  
  const hasDisqualifier = config.scoringCriteria.disqualifiers.some(disqualifier => 
    fullText.includes(disqualifier.toLowerCase())
  );
  
  if (hasDisqualifier) {
    return 0;
  }
  
  return Math.min(Math.max(score, 0), 100);
}

/**
 * Creates a lead object for companies that are excluded or fail analysis.
 */
function createExcludedLead(
  company: Omit<Company, 'id' | 'location' | 'contact'>,
  baseAnalysis: Partial<AnalysisResult>,
  reason: string
): Lead {
  return {
    id: Date.now().toString(),
    company: { ...company, location: 'Online', contact: `info@${company.website}` },
    analysis: {
        opportunityScore: 0,
        estimatedAnnualROI: 0,
        keyOpportunities: [{
            opportunity: 'Analysis Halted',
            problem: reason,
            solution: 'This company was identified as a non-target or an error occurred during analysis.',
            estimatedImpact: 0,
            roiTimeline: 'N/A'
        }],
        keyInsights: [`Company was excluded: ${reason}`],
        ...baseAnalysis
    },
    status: 'Unqualified',
    createdAt: new Date().toISOString(),
    metadata: {
      excluded: true,
      exclusionReason: reason,
      industryConfigId: getActiveConfig().id
    }
  };
}

/**
 * Interface for tracking batch analysis progress.
 */
export interface BatchAnalysisProgress {
  total: number;
  completed: number;
  failed: number;
  results: Lead[];
  errors: Array<{ company: Omit<Company, 'id' | 'location' | 'contact'>; error: string }>;
}

/**
 * Analyzes a batch of companies with progress tracking.
 */
export async function analyzeBatch(
  companies: Array<Omit<Company, 'id' | 'location' | 'contact'>>,
  onProgress?: (progress: BatchAnalysisProgress) => void
): Promise<BatchAnalysisProgress> {
  const progress: BatchAnalysisProgress = {
    total: companies.length,
    completed: 0,
    failed: 0,
    results: [],
    errors: []
  };
  
  for (const company of companies) {
    try {
      const result = await performAnalysis(company);
      progress.results.push(result);
      progress.completed++;
      
      onProgress?.({ ...progress });
      
      // Rate limiting: wait 2 seconds between analyses to avoid API limits
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      progress.failed++;
      progress.errors.push({
        company: company,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      onProgress?.({ ...progress });
    }
  }
  
  return progress;
}