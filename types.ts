export type View = 'dashboard' | 'discovery' | 'leads' | 'configuration';

export enum Industry {
  TECH = 'Technology',
  ECOMMERCE = 'E-commerce',
  FINANCE = 'Finance',
  HEALTHCARE = 'Healthcare',
  RETAIL = 'Retail',
  MEDIA = 'Media & Entertainment',
  HOSPITALITY = 'Hospitality',
  MANUFACTURING = 'Manufacturing',
  REAL_ESTATE = 'Real Estate',
}

export interface Company {
  name: string;
  website: string;
  industry: Industry;
  location: string;
  contact: string;
}

export interface OpportunityDetail {
  opportunity: string; // Title of the opportunity
  problem: string;
  solution: string;
  roiTimeline: string;
  estimatedImpact: number; // in USD
}

export interface GroundingSource {
  web: {
    uri: string;
    title: string;
  }
}

export interface AnalysisResult {
  opportunityScore: number;
  keyOpportunities: OpportunityDetail[];
  estimatedAnnualROI: number; // Now a direct property
  sources?: GroundingSource[];
  
  // Optional fields from new configs
  practiceType?: string;
  practiceTypeJustification?: string; // Added for categorization reasoning
  isTargetPractice?: boolean;
  referralPotential?: {
    type: "receiver" | "generator" | "both" | "none";
    score: "low" | "medium" | "high";
    notes: string;
  };
  keyInsights?: string[];
}

export type LeadStatus = 'prospected' | 'qualified' | 'Unqualified';

export interface Lead {
  id: string;
  company: Company;
  analysis: AnalysisResult;
  status: LeadStatus;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface IndustryConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  systemPrompt: string;
  referralAnalysisPrompt?: string;
  opportunityTemplates: Array<{
    id?: string;
    title: string;
    problemTemplate?: string;
    solutionTemplate?: string;
    estimatedImpactRange?: { min: number; max: number };
    timelineMonths?: { min: number; max: number };
    applicableWhen?: string[];
  }>;
  scoringCriteria: {
    highPriorityIndicators: Array<{ keyword: string; points: number }>;
    mediumPriorityIndicators: Array<{ keyword: string; points: number }>;
    referralIndicators: Array<{ keyword: string; points: number }>;
    disqualifiers: string[];
  };
  productFocus?: string;
  clientName?: string;
  targetCompanyTypes?: string[];
  excludedCompanyTypes?: string[];
  createdAt?: string;
  updatedAt?: string;
}