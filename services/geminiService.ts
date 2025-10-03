
import { GoogleGenAI, Type } from "@google/genai";
import { Company, AnalysisResult, Lead, OpportunityDetail } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development. In a real environment, the API key should be set.
  console.warn("API_KEY environment variable not set. Using a placeholder. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "YOUR_API_KEY_HERE" });

export const analyzeCompanyWebsite = async (company: Company): Promise<AnalysisResult> => {
  if (!API_KEY) {
    console.log("No API Key, returning mock data.");
    // Return mock data if API key is not available
    return new Promise(resolve => setTimeout(() => resolve({
      aiOpportunityScore: Math.floor(Math.random() * 50) + 50,
      keyOpportunities: [
          { opportunity: 'AI Conversational Agent', problem: 'High bounce rate on landing pages due to unanswered user questions.', solution: 'Deploy an AI agent to engage visitors, answer queries in real-time, and guide them to conversion.', roiTimeline: '1-4 months', estimatedImpact: 50000 },
          { opportunity: 'Automated Content Personalization', problem: 'Generic content fails to engage the 400,000+ affluent readers, leading to low subscription conversion.', solution: 'Use AI to analyze reader behavior and dynamically present articles and offers tailored to their interests, boosting engagement and subscriptions.', roiTimeline: '6-12 months', estimatedImpact: 80000 },
      ],
      estimatedRoi: 130000,
      sources: [],
    }), 1500));
  }

 const prompt = `
    You are a senior AI business consultant for "Gaen Tech", a company that delivers digital transformation and simplifies business through AI.
    Your goal is to analyze a potential lead based on their company information and website to identify high-value opportunities for AI-driven ROI. You MUST use real-time data from your search tool to ensure the analysis is accurate and up-to-date.
    
    Analyze the following company:
    - Name: ${company.name}
    - Industry: ${company.industry}
    - Website: ${company.website}

    Based on your search findings and analysis, provide a concise but impactful report.
    1.  **AI Opportunity Score**: Calculate a score out of 100 based on their digital presence, industry, and potential for AI integration.
    2.  **Key Opportunities**: Identify the 2-3 most impactful AI opportunities. For each opportunity:
        - **Problem**: Clearly state the business problem or inefficiency, supported by your search. Frame it in terms of missed revenue or high operational costs.
        - **Solution**: Describe Gaen Tech's AI solution in simple terms. Focus on the value proposition.
        - **ROI Timeline**: Provide a realistic timeframe for seeing a positive return (e.g., "1-4 months").
        - **Estimated Impact**: Quantify the potential annual financial benefit in USD.
    3.  **Estimated Total ROI**: Sum up the impacts to give a total estimated annual ROI.

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

    let jsonText = response.text.trim();
    // Clean up potential markdown formatting
    if (jsonText.startsWith('```json')) {
        jsonText = jsonText.substring(7, jsonText.length - 3).trim();
    }
    
    const analysis = JSON.parse(jsonText);
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    return { ...analysis, sources };

  } catch (error) {
    console.error("Error analyzing company website with Gemini API:", error);
    throw new Error("Failed to analyze company with AI. The model may have returned an invalid format. Please try again or check the console for details.");
  }
};