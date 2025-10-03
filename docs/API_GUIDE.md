# Gemini API Integration Guide

This document details how the Gaen Tech platform interacts with the Google Gemini API, which is the core of our analysis engine.

## 1. Service Abstraction

All communication with the Gemini API is handled within `services/geminiService.ts`. This abstraction provides several benefits:
- **Separation of Concerns**: UI components are not directly responsible for making API calls.
- **Centralized Logic**: Prompt engineering, data parsing, and error handling are all located in one place, making it easy to manage and update.
- **Testability**: The service can be easily mocked for testing purposes.

## 2. Core Function: `analyzeCompanyWebsite`

This is the primary function responsible for generating the AI-powered analysis.

- **Input**: It takes a `Company` object (`{ id, name, website, industry, ... }`).
- **Output**: It returns a `Promise<AnalysisResult>`, which contains the AI Opportunity Score, Key Opportunities, Estimated ROI, and the grounding sources.

## 3. Prompt Engineering

The quality of the AI's output is highly dependent on the quality of the prompt. Our prompt is carefully constructed to guide the model towards the desired output format and content.

**Key elements of the prompt:**

1.  **Persona**: The prompt begins by assigning a role to the AI: `"You are a senior AI business consultant for 'Gaen Tech'..."`. This sets the context and tone for the response.
2.  **Goal**: The objective is clearly stated: `"...to identify high-value opportunities for AI-driven ROI."`.
3.  **Mandatory Tools**: The prompt explicitly instructs the model to use its search tool: `"You MUST use real-time data from your search tool..."`. This is critical for the grounding feature.
4.  **Input Data**: The company's `name`, `industry`, and `website` are dynamically injected into the prompt.
5.  **Structured Output**: The prompt provides a precise structure for the response, detailing the main keys (`aiOpportunityScore`, `keyOpportunities`, `estimatedRoi`) and the sub-fields for each opportunity.
6.  **Format Constraint**: The prompt concludes with a strict instruction to return *only* a JSON object: `"Return your analysis strictly in JSON format... Do not include any explanatory text, markdown formatting..."`. This simplifies parsing.

## 4. Grounding with Google Search

To ensure our analysis is not based on outdated information and to provide data verifiability, we use Gemini's built-in Google Search grounding tool.

This is enabled in the `generateContent` call via the `config` object:

```typescript
const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: prompt,
  config: {
    tools: [{googleSearch: {}}], // This enables the feature
    temperature: 0.5,
  },
});
```

The URLs of the websites the model used for its analysis are returned in the `response.candidates[0].groundingMetadata.groundingChunks`. We extract these sources and attach them to our `AnalysisResult` object. This allows us to display them in the UI and the final PDF proposal, fulfilling the critical business requirement of data legitimacy.

## 5. Response Handling and Parsing

The Gemini API returns a response object, and the generated text is available in `response.text`.

1.  **Extraction**: We extract the raw text using `response.text.trim()`.
2.  **Cleaning**: A simple cleanup step removes potential markdown code fences (e.g., `` ```json ``) that the model might occasionally add despite instructions.
3.  **Parsing**: `JSON.parse()` is used to convert the cleaned string into a JavaScript object.
4.  **Source Extraction**: The grounding sources are extracted from the `groundingMetadata` path.
5.  **Combination**: The parsed analysis and the extracted sources are combined into a single `AnalysisResult` object.

## 6. Error Handling

API calls can fail for various reasons (network issues, invalid API key, model errors, etc.). The `analyzeCompanyWebsite` function is wrapped in a `try...catch` block.

- If an error occurs during the API call or during JSON parsing (if the model returns an invalid format), the error is caught.
- It is logged to the console for debugging purposes.
- A user-friendly error message is thrown, which is then caught by the UI component and displayed to the user.
