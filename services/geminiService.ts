import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { Company, AnalysisResult, OpportunityDetail, GroundingSource } from '../types';
import { getActiveConfig } from '../config/industryConfigs';

// Helper to parse currency strings like "$150,000 - $200,000" or "150000" into a number.
// It conservatively takes the first number found in a range.
const parseCurrency = (value: string | number | undefined): number => {
    if (typeof value === 'number') return value;
    if (typeof value !== 'string') return 0;
    
    // Find the first sequence of digits after removing commas
    const match = value.replace(/,/g, '').match(/\d+/);
    return match ? Number(match[0]) : 0;
};

export const analyzeCompanyWebsite = async (
  company: Omit<Company, 'id' | 'location' | 'contact'>,
  systemInstructionOverride?: string
): Promise<AnalysisResult> => {
  const activeConfig = getActiveConfig();
  
  const userPrompt = `
    Analyze the following company:
    - Name: ${company.name}
    - Website: ${company.website}
    - Industry: ${company.industry}
  `;
  
  const systemInstruction = systemInstructionOverride || activeConfig.systemPrompt;

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    console.log(`🔍 Analyzing company: ${company.name} with config: "${activeConfig.name}"`);
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.5,
        tools: [{ googleSearch: {} }],
      },
    });

    const responseText = response.text;
    if (!responseText) {
      console.error("❌ Gemini API returned no text content.", response);
      throw new Error("Analysis failed: The AI returned no content. This may be due to safety filters or an issue with the target website.");
    }
    
    let jsonText = responseText.trim();
    console.log("📄 Raw AI Response (first 500 chars):", jsonText.substring(0, 500));
    
    // Improved JSON extraction: Handle markdown code blocks
    const markdownMatch = jsonText.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
    if (markdownMatch && markdownMatch[1]) {
        jsonText = markdownMatch[1];
    }
    
    const jsonStartIndex = jsonText.indexOf('{');
    const jsonEndIndex = jsonText.lastIndexOf('}');

    if (jsonStartIndex === -1 || jsonEndIndex === -1 || jsonEndIndex < jsonStartIndex) {
        console.error("❌ Gemini API response did not contain a valid JSON object.", jsonText);
        throw new Error("Analysis failed: The AI response was not in the expected format.");
    }

    jsonText = jsonText.substring(jsonStartIndex, jsonEndIndex + 1);
    console.log("📋 Extracted JSON:", jsonText);
    
    const analysis = JSON.parse(jsonText);
    console.log("✅ Parsed analysis:", analysis);
    
    // --- Data Validation and Normalization ---
    const validatedAnalysis: Partial<AnalysisResult> = {};

    validatedAnalysis.opportunityScore = typeof analysis.opportunityScore === 'number'
      ? analysis.opportunityScore
      : 75;

    // Handle both 'keyOpportunities' and 'opportunities'
    const rawOpportunities = analysis.keyOpportunities || analysis.opportunities;

    if (Array.isArray(rawOpportunities) && rawOpportunities.length > 0) {
      validatedAnalysis.keyOpportunities = rawOpportunities
        .map((op: any): OpportunityDetail | null => {
            if (!op || !(op.opportunity || op.title) || !op.problem || !op.solution) {
                return null;
            }
            return {
                opportunity: op.opportunity || op.title,
                problem: op.problem,
                solution: op.solution,
                roiTimeline: op.roiTimeline || op.timeline || "3-9 months",
                estimatedImpact: parseCurrency(op.estimatedImpact),
            };
        })
        .filter((op): op is OpportunityDetail => op !== null); // Allow $0 impact opportunities, the final ROI check will handle invalid totals.

      if (validatedAnalysis.keyOpportunities.length === 0) {
        throw new Error("Analysis failed: All opportunities were invalid or had $0 impact.");
      }
    } else {
      throw new Error("Analysis failed: The AI response was missing key opportunity data.");
    }
    
    // Parse top-level ROI. If it's missing, conservatively use the HIGHEST impact opportunity, not the sum.
    validatedAnalysis.estimatedAnnualROI = parseCurrency(analysis.estimatedAnnualROI);
    if (validatedAnalysis.estimatedAnnualROI === 0 && validatedAnalysis.keyOpportunities.length > 0) {
        validatedAnalysis.estimatedAnnualROI = Math.max(
            ...validatedAnalysis.keyOpportunities.map(op => op.estimatedImpact)
        );
    }
    
    if (validatedAnalysis.estimatedAnnualROI === 0 && !activeConfig.id.includes('dental')) { // Allow $0 for non-targets in dental
        throw new Error("Analysis failed: ROI calculated to $0.");
    }

    // Add new optional fields from configs
    if (analysis.practiceType) validatedAnalysis.practiceType = analysis.practiceType;
    if (analysis.practiceTypeJustification) validatedAnalysis.practiceTypeJustification = analysis.practiceTypeJustification;
    if (typeof analysis.isTargetPractice === 'boolean') validatedAnalysis.isTargetPractice = analysis.isTargetPractice;
    if (analysis.referralPotential) validatedAnalysis.referralPotential = analysis.referralPotential;
    if (analysis.keyInsights) validatedAnalysis.keyInsights = analysis.keyInsights;
    
    const sources: GroundingSource[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    console.log("✅ Found", sources.length, "sources");
    
    return { ...validatedAnalysis as AnalysisResult, sources };

  } catch (error) {
    console.error("❌ Error analyzing company website:", error);
    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse AI analysis. The model returned malformed JSON. Please try again.");
    }
    throw new Error(error instanceof Error ? error.message : "An unknown error occurred during AI analysis.");
  }
};