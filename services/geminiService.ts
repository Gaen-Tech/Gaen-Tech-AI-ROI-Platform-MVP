
import { GoogleGenAI, Type } from "@google/genai";
import { Company, AnalysisResult, Lead, OpportunityDetail } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development. In a real environment, the API key should be set.
  console.warn("API_KEY environment variable not set. Using a placeholder. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "YOUR_API_KEY_HERE" });

/**
 * Generates dynamic and varied mock analysis data.
 * This is used as a fallback when the Gemini API key is not available.
 */
const generateMockAnalysis = (): AnalysisResult => {
    const opportunitiesPool = [
        { opportunity: 'AI Conversational Agent', problem: 'High bounce rate on landing pages due to unanswered user questions.', solution: 'Deploy an AI agent to engage visitors, answer queries in real-time, and guide them to conversion.' },
        { opportunity: 'Automated Content Personalization', problem: 'Generic content fails to engage a large user base, leading to low subscription conversion.', solution: 'Use AI to analyze user behavior and dynamically present articles and offers tailored to their interests, boosting engagement and subscriptions.' },
        { opportunity: 'Predictive Lead Scoring', problem: 'Sales team wastes time on low-quality leads, reducing efficiency.', solution: 'Implement an AI model to score leads based on their likelihood to convert, allowing sales to focus on high-value prospects.' },
        { opportunity: 'Dynamic Pricing Engine', problem: 'Leaving revenue on the table with a static, one-size-fits-all pricing model.', solution: 'Use AI to adjust prices in real-time based on market demand, competitor pricing, and customer behavior to maximize revenue.' },
        { opportunity: 'AI-Powered Inventory Optimization', problem: 'High carrying costs due to overstocking or lost sales from stockouts.', solution: 'Leverage AI to forecast demand more accurately and optimize inventory levels across all sales channels.' },
        { opportunity: 'Internal Knowledge Base AI', problem: 'Employees struggle to find information in scattered internal documents, slowing down operations.', solution: 'Create an AI-powered search for the internal knowledge base that understands natural language queries and provides instant answers.' }
    ];

    const shuffledOpportunities = opportunitiesPool.sort(() => 0.5 - Math.random());
    const selectedCount = Math.floor(Math.random() * 2) + 2; // Select 2 or 3 opportunities
    const keyOpportunities: OpportunityDetail[] = [];
    let estimatedRoi = 0;

    for (let i = 0; i < selectedCount; i++) {
        const opportunity = shuffledOpportunities[i];
        // Ensure estimated impact is a round number, looks more professional
        const estimatedImpact = Math.round((Math.random() * (150000 - 50000) + 50000) / 5000) * 5000;
        const roiTimeline = `${Math.floor(Math.random() * 4) + 2}-${Math.floor(Math.random() * 6) + 6} months`;
        
        keyOpportunities.push({ ...opportunity, roiTimeline, estimatedImpact });
        estimatedRoi += estimatedImpact;
    }

    // Adhere to the < $500k business rule
    while (estimatedRoi > 480000) {
        estimatedRoi = 0;
        keyOpportunities.forEach(op => {
            op.estimatedImpact = Math.round((op.estimatedImpact * 0.9) / 1000) * 1000;
            estimatedRoi += op.estimatedImpact;
        });
    }

    return {
        aiOpportunityScore: Math.floor(Math.random() * (96 - 75 + 1)) + 75, // Score between 75 and 96
        keyOpportunities,
        estimatedRoi: Math.round(estimatedRoi / 1000) * 1000,
        sources: [],
        isMockData: true, // Explicitly flag this as mock data
    };
};

export const analyzeCompanyWebsite = async (company: Company): Promise<AnalysisResult> => {
  if (!API_KEY) {
    console.log("No API Key, returning dynamic mock data.");
    // Return DYNAMIC mock data if API key is not available
    return new Promise(resolve => setTimeout(() => resolve(generateMockAnalysis()), 1500));
  }

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
        - **Problem**: Clearly state the business problem or inefficiency, supported by your search. Frame it in terms of missed revenue or high operational costs.
        - **Solution**: Describe Gaen Tech's AI solution in simple terms. Focus on the value proposition.
        - **ROI Timeline**: Provide a realistic timeframe for seeing a positive return (e.g., "1-4 months").
        - **Estimated Impact**: Quantify the potential annual financial benefit in USD.
    3.  **Estimated Total ROI**: Sum up the impacts to give a total estimated annual ROI. This value MUST NOT exceed $500,000.

    Return your analysis strictly in JSON format, containing an object with keys: "aiOpportunityScore", "keyOpportunities", and "estimatedRoi". Do not include any explanatory text, markdown formatting, or anything outside of the JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
        temperature: 0.5,
      },
    });

    if (!response.candidates || response.candidates.length === 0) {
        console.error("Gemini API returned no candidates. The response may have been blocked.", response);
        throw new Error("Analysis failed: The AI returned no content. This may be due to safety filters or an issue with the target website.");
    }
    
    let jsonText = response.text.trim();
    
    // Robustly find the JSON object within the response text
    const jsonStartIndex = jsonText.indexOf('{');
    const jsonEndIndex = jsonText.lastIndexOf('}');

    if (jsonStartIndex === -1 || jsonEndIndex === -1 || jsonEndIndex < jsonStartIndex) {
        console.error("Gemini API response did not contain a valid JSON object.", response.text);
        throw new Error("Analysis failed: The AI response was not in the expected format.");
    }

    jsonText = jsonText.substring(jsonStartIndex, jsonEndIndex + 1);
    
    const analysis = JSON.parse(jsonText);
    
    // --- Data Validation and Fallbacks ---
    const validatedAnalysis: Partial<AnalysisResult> = {};

    // Validate aiOpportunityScore
    validatedAnalysis.aiOpportunityScore = typeof analysis.aiOpportunityScore === 'number'
      ? analysis.aiOpportunityScore
      : 75; // Default score if missing

    // Validate keyOpportunities
    if (Array.isArray(analysis.keyOpportunities) && analysis.keyOpportunities.length > 0) {
      validatedAnalysis.keyOpportunities = analysis.keyOpportunities.filter(op => 
        op && typeof op.opportunity === 'string' && typeof op.estimatedImpact === 'number'
      );
    } else {
      throw new Error("Analysis failed: The AI response was missing key opportunity data.");
    }
    
    // Validate or calculate estimatedRoi
    if (typeof analysis.estimatedRoi === 'number') {
      validatedAnalysis.estimatedRoi = analysis.estimatedRoi;
    } else {
      console.warn("API response missing 'estimatedRoi'. Calculating from opportunities.");
      validatedAnalysis.estimatedRoi = validatedAnalysis.keyOpportunities.reduce(
        (sum, op) => sum + (op.estimatedImpact || 0), 0
      );
    }
    // --- End Validation ---

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    return { ...validatedAnalysis as AnalysisResult, sources, isMockData: false }; // Flag live data

  } catch (error) {
    console.error("Error analyzing company website with Gemini API:", error);
    if (error instanceof SyntaxError) { // This means JSON.parse failed
        throw new Error("Failed to parse AI analysis. The model returned malformed JSON. Please try again.");
    }
    throw new Error(error instanceof Error ? error.message : "An unknown error occurred during AI analysis.");
  }
};
