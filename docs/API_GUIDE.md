# Gemini API Integration Guide

This document details how the Gaen Tech platform interacts with the Google Gemini API, which is the core of our analysis engine.

## 1. Service Abstraction

All communication with the Gemini API is handled within `services/geminiService.ts`. This abstraction provides several benefits:
- **Separation of Concerns**: UI components are not directly responsible for making API calls.
- **Centralized Logic**: Prompt engineering, data parsing, validation, and error handling are all located in one place, making it easy to manage and update.
- **Testability & Development**: The service layer includes a "Demo Mode" fallback, allowing the entire application to be used and tested without a live API key.

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
4.  **Business Rules**: Critical constraints, such as the **$0 - $500,000 ROI limit**, are explicitly stated to ensure the output aligns with our business strategy.
5.  **Structured Output**: The prompt provides a precise structure for the response, detailing the main keys (`aiOpportunityScore`, `keyOpportunities`, `estimatedRoi`) and the sub-fields for each opportunity.
6.  **Format Constraint**: The prompt concludes with a strict instruction to return *only* a JSON object: `"Return your analysis strictly in JSON format... Do not include any explanatory text, markdown formatting..."`.

## 4. Response Handling: From Raw Text to Trusted Data

The service layer is designed to be resilient to inconsistent API responses.

1.  **Extraction**: The raw text is extracted from `response.text.trim()`.
2.  **Robust JSON Search**: Instead of assuming the entire response is JSON, the code searches for the first `{` and the last `}` to isolate the JSON block. This handles cases where the model adds introductory text or other artifacts.
3.  **Parsing**: `JSON.parse()` is used to convert the cleaned string into a JavaScript object.
4.  **Validation & Fallbacks**: After parsing, the object is validated.
    - It checks for the presence and correct type of `aiOpportunityScore` and `keyOpportunities`.
    - If `estimatedRoi` is missing, it is **calculated on the fly** by summing the `estimatedImpact` of each opportunity. This prevents data integrity issues and ensures leads are always displayed correctly.
5.  **Source Extraction**: The grounding sources are extracted from the `groundingMetadata` path. This provides the verifiable data that builds trust in the analysis.
6.  **Data Tagging**: The final `AnalysisResult` object is tagged with `isMockData: false` to clearly distinguish it from demo data.

## 5. Error Handling

The `analyzeCompanyWebsite` function has multi-layered error handling:

- **No Content Error**: It first checks if the API response contains any `candidates`. If not, it means the response was likely blocked (e.g., by safety filters), and it throws a specific, user-friendly error.
- **Invalid Format Error**: If a JSON object cannot be found or parsed from the response text, it throws an error indicating the AI's response was malformed.
- **General Errors**: A top-level `try...catch` block handles network errors or other unexpected issues during the API call, relaying the message to the UI.

## 6. Demo Mode Fallback

If the `API_KEY` environment variable is not set, `analyzeCompanyWebsite` does not call the Gemini API. Instead, it calls `generateMockAnalysis()`. This internal function:
- Simulates an API delay (`setTimeout`).
- Dynamically creates a realistic `AnalysisResult` object with varied opportunities, scores, and ROI figures that adhere to the business rules.
- Tags the data with `isMockData: true`.

This ensures a seamless and informative experience for development, testing, and product demonstrations.
