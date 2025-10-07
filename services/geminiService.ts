import { GoogleGenAI } from "@google/genai";
import { Company, AnalysisResult, OpportunityDetail } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is required. Please add your Gemini API key.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const analyzeCompanyWebsite = async (company: Company): Promise<AnalysisResult> => {
  const prompt = `
    You are a senior AI business consultant for "Gaen Tech", a company that delivers digital transformation and simplifies business through AI.
    Your goal is to analyze a potential lead based on their company information and website to identify high-value opportunities for AI-driven ROI. You MUST use real-time data from your search tool to ensure the analysis is accurate and up-to-date.
    
    Analyze the following company:
    - Name: ${company.name}
    - Industry: ${company.industry}
    - Website: ${company.website}

    Based on your search findings and analysis, provide a concise but impactful report.
    
    **CRITICAL BUSINESS RULE**: The "Estimated Total ROI" MUST be between $0 and $500,000. Adjust the "Estimated Impact" for each key opportunity accordingly to meet this requirement. This constraint reflects our current focus on small to medium-sized projects.

    1.  **AI Opportunity Score**: Calculate a score out of 100 based on their digital presence, industry, and potential for AI integration.
    2.  **Key Opportunities**: Identify the 2-3 most impactful AI opportunities. For each opportunity:
        - **opportunity**: Brief title of the opportunity
        - **problem**: Clearly state the business problem or inefficiency, supported by your search. Frame it in terms of missed revenue or high operational costs.
        - **solution**: Describe Gaen Tech's AI solution in simple terms. Focus on the value proposition.
        - **roiTimeline**: Provide a realistic timeframe for seeing a positive return (e.g., "2-8 months").
        - **estimatedImpact**: Quantify the potential annual financial benefit in USD.
    3.  **estimatedRoi**: Sum up the impacts to give a total estimated annual ROI. This value MUST NOT exceed $500,000.

    Return your analysis strictly in JSON format, containing an object with keys: "aiOpportunityScore", "keyOpportunities", and "estimatedRoi". Do not include any explanatory text, markdown formatting, or anything outside of the JSON object.
    
    Example format:
    {
      "aiOpportunityScore": 85,
      "keyOpportunities": [
        {
          "opportunity": "AI Chatbot",
          "problem": "High customer service costs",
          "solution": "Automated 24/7 support",
          "roiTimeline": "3-6 months",
          "estimatedImpact": 150000
        }
      ],
      "estimatedRoi": 150000
    }
  `;

  try {
    console.log("🔍 Analyzing company:", company.name);
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
        temperature: 0.5,
      },
    });

    if (!response.candidates || response.candidates.length === 0) {
      console.error("❌ Gemini API returned no candidates.", response);
      throw new Error("Analysis failed: The AI returned no content. This may be due to safety filters or an issue with the target website.");
    }
    
    let jsonText = response.text.trim();
    console.log("📄 Raw AI Response (first 500 chars):", jsonText.substring(0, 500));
    
    // Robustly find the JSON object within the response text
    const jsonStartIndex = jsonText.indexOf('{');
    const jsonEndIndex = jsonText.lastIndexOf('}');

    if (jsonStartIndex === -1 || jsonEndIndex === -1 || jsonEndIndex < jsonStartIndex) {
        console.error("❌ Gemini API response did not contain a valid JSON object.", response.text);
        throw new Error("Analysis failed: The AI response was not in the expected format.");
    }

    jsonText = jsonText.substring(jsonStartIndex, jsonEndIndex + 1);
    console.log("📋 Extracted JSON:", jsonText);
    
    const analysis = JSON.parse(jsonText);
    console.log("✅ Parsed analysis:", analysis);
    
    // --- Data Validation and Fallbacks ---
    const validatedAnalysis: Partial<AnalysisResult> = {};

    // Validate aiOpportunityScore
    validatedAnalysis.aiOpportunityScore = typeof analysis.aiOpportunityScore === 'number'
      ? analysis.aiOpportunityScore
      : 75; // Default score if missing
    
    console.log("✅ AI Score:", validatedAnalysis.aiOpportunityScore);

    // Validate keyOpportunities
    if (Array.isArray(analysis.keyOpportunities) && analysis.keyOpportunities.length > 0) {
      console.log("🔍 Validating", analysis.keyOpportunities.length, "opportunities");
      
      validatedAnalysis.keyOpportunities = analysis.keyOpportunities.filter((op: OpportunityDetail, index: number) => {
        const isValid = op && 
          typeof op.opportunity === 'string' && 
          typeof op.estimatedImpact === 'number' &&
          typeof op.problem === 'string' &&
          typeof op.solution === 'string';
        
        if (!isValid) {
          console.warn(`⚠️ Opportunity ${index} failed validation:`, op);
        }
        return isValid;
      });
      
      console.log("✅ Valid opportunities:", validatedAnalysis.keyOpportunities.length);
      
      if (validatedAnalysis.keyOpportunities.length === 0) {
        throw new Error("Analysis failed: All opportunities were invalid. The AI may have returned incomplete data.");
      }
    } else {
      console.error("❌ No opportunities array in response:", analysis);
      throw new Error("Analysis failed: The AI response was missing key opportunity data.");
    }
    
    // Validate or calculate estimatedRoi
    if (typeof analysis.estimatedRoi === 'number' && analysis.estimatedRoi > 0) {
      validatedAnalysis.estimatedRoi = analysis.estimatedRoi;
      console.log("✅ ROI from API:", validatedAnalysis.estimatedRoi);
    } else {
      console.warn("⚠️ API response missing 'estimatedRoi'. Calculating from opportunities.");
      validatedAnalysis.estimatedRoi = validatedAnalysis.keyOpportunities.reduce(
        (sum, op) => sum + (op.estimatedImpact || 0), 0
      );
      console.log("✅ Calculated ROI:", validatedAnalysis.estimatedRoi);
    }
    
    // Ensure ROI is not 0
    if (validatedAnalysis.estimatedRoi === 0) {
      console.error("❌ Final ROI is 0! Opportunities:", validatedAnalysis.keyOpportunities);
      throw new Error("Analysis failed: ROI calculated to $0. This indicates a data problem.");
    }
    
    // --- End Validation ---

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    console.log("✅ Found", sources.length, "sources");
    
    return { ...validatedAnalysis as AnalysisResult, sources };

  } catch (error) {
    console.error("❌ Error analyzing company website with Gemini API:", error);
    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse AI analysis. The model returned malformed JSON. Please try again.");
    }
    throw new Error(error instanceof Error ? error.message : "An unknown error occurred during AI analysis.");
  }
};