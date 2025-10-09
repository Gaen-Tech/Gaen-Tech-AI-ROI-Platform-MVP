
# Gemini API Integration Guide

This document details how the Gaen Tech platform interacts with the Google Gemini API, which is the core of our analysis engine.

## 1. Service Abstraction

All communication with the Gemini API is handled within `services/geminiService.ts`. This abstraction provides several benefits:
- **Separation of Concerns**: UI components are not directly responsible for making API calls.
- **Centralized Logic**: Prompt engineering, data parsing, validation, and error handling are all located in one place, making it easy to manage and update.
- **Environment Dependency**: The service layer now requires a valid `API_KEY` to function, throwing an error if it is not present.

## 2. Core Function: `analyzeCompanyWebsite`

This is the primary function responsible for generating the AI-powered analysis.

- **Input**: It takes a `Company` object and a `UserProfile` object (`{ companyName, productDescription }`).
- **Output**: It returns a `Promise<AnalysisResult>`, which contains the AI Opportunity Score, Key Opportunities, Estimated ROI, and the grounding sources.

## 3. Prompt Engineering

The quality of the AI's output is highly dependent on the quality of the prompt. Our prompt is carefully constructed to guide the model towards the desired output format and content.

**Key elements of the prompt:**

1.  **Dynamic Persona**: The prompt begins by assigning a role to the AI based on the user's configurable profile: `"You are a senior business consultant for '${userProfile.companyName}', a company that specializes in '${userProfile.productDescription}'"`. This sets a dynamic context and tone for the response, transforming the application into a versatile platform for any sales vertical.
2.  **Goal**: The objective is clearly stated: `"...to identify high-value opportunities where they would benefit from your company's solutions."`.
3.  **Mandatory Tools**: The prompt explicitly instructs the model to use its search tool: `"You MUST use real-time data from your search tool..."`. This is critical for the grounding feature.
4.  **Business Rules**: Critical constraints, such as the **$0 - $500,000 ROI limit**, are explicitly stated to ensure the output aligns with our business strategy.
5.  **Structured Output**: The prompt provides a precise structure for the response, detailing the main keys (`opportunityScore`, `keyOpportunities`, `totals`) and the sub-fields for each opportunity.
6.  **Format Constraint**: The prompt concludes with a strict instruction to return *only* a JSON object: `"Return your analysis strictly in JSON format... Do not include any explanatory text, markdown formatting..."`.

## 4. Response Handling: From Raw Text to Trusted Data

The service layer is designed to be resilient to inconsistent API responses.

1.  **Extraction**: The raw text is extracted from the API response.
2.  **Robust JSON Search**: Instead of assuming the entire response is JSON, the code searches for the first `{` and the last `}` to isolate the JSON block. This handles cases where the model adds introductory text or other artifacts.
3.  **Parsing**: `JSON.parse()` is used to convert the cleaned string into a JavaScript object.
4.  **Validation & Fallbacks**: After parsing, the object is validated.
    - It checks for the presence and correct type of `opportunityScore` and `keyOpportunities`.
    - It validates that each opportunity within `keyOpportunities` contains all required fields. Incomplete opportunities are discarded.
    - If `totals.estimatedAnnualROI` is missing, it is **calculated on the fly** by summing the `estimatedImpact` of each valid opportunity. This prevents data integrity issues and ensures leads are always displayed correctly.
5.  **Source Extraction**: The grounding sources are extracted from the `groundingMetadata` path. This provides the verifiable data that builds trust in the analysis.

## 5. Error Handling

The `analyzeCompanyWebsite` function has multi-layered error handling:
- **Configuration Error**: It first checks if the `API_KEY` is available on the server. If not, it throws an error to prevent any API calls.
- **No Content Error**: It then checks if the API response contains any `candidates`. If not, it means the response was likely blocked (e.g., by safety filters), and it throws a specific, user-friendly error.
- **Invalid Format Error**: If a JSON object cannot be found or parsed from the response text, it throws an error indicating the AI's response was malformed.
- **Data Integrity Error**: Throws specific errors if the response is missing the `keyOpportunities` array, if all opportunities fail validation, or if the final calculated ROI is $0. This prevents bad data from entering the application.
- **General Errors**: A top-level `try...catch` block handles network errors or other unexpected issues during the API call, relaying the message to the UI.