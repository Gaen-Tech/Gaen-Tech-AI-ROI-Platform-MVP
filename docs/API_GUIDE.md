# Gemini API Integration Guide

This document details how the Gaen Tech platform interacts with the Google Gemini API, which is the core of our analysis engine.

## 1. Two-Tier Service Abstraction

All communication with the Gemini API is handled within the `services/` directory, which is organized into a two-tier architecture. This provides a clear separation of concerns.

### Tier 1: `configuredAnalysis.ts` (High-Level Business Logic)
- This service acts as the brain of the analysis process. UI components call functions from this file.
- It is responsible for managing the **persona-driven** analysis logic.
- It fetches the active `IndustryConfig` (persona) and uses it to orchestrate the entire workflow.
- It contains the **prompt engineering** logic, dynamically building highly detailed instructions for the AI.
- It performs **post-processing** on the results returned from the AI, such as adjusting scores based on keyword analysis.

### Tier 2: `geminiService.ts` (Low-Level API Wrapper)
- This service is a direct, robust wrapper for the Gemini API. It has no knowledge of different personas.
- Its sole purpose is to accept a set of instructions (the prompt) and company data, make the API call, and return a clean, validated `AnalysisResult` object.
- All low-level data parsing, validation, and error handling are centralized here.

## 2. Core Function: `performAnalysis`

This is the primary function in `configuredAnalysis.ts` that the UI calls to initiate an analysis.

- **Input**: It takes a `Company` object.
- **Output**: It returns a `Promise<Lead>`, a fully-formed lead object ready to be added to the application state.

## 3. Dynamic Prompt Engineering

The quality of the AI's output is highly dependent on the quality of the prompt. Instead of a single static prompt, we use the `buildConfiguredPrompt` function in `configuredAnalysis.ts` to dynamically construct a unique set of instructions for every analysis based on the active `IndustryConfig`.

**Key elements of the dynamically built prompt:**

1.  **Core System Prompt**: It starts with the main `systemPrompt` from the active persona, which assigns a role to the AI (e.g., "You are an expert senior business analyst" or "You are analyzing dental practices...").
2.  **Company Context**: It injects the specific company name and website into the prompt.
3.  **Conditional Logic**: It can append additional, specialized instructions. For example, the "Millennium Dental" persona adds a detailed `referralAnalysisPrompt` to guide the AI on a specific sub-task.
4.  **Template Injection**: For personas with defined `opportunityTemplates`, the prompt includes context about these templates, guiding the AI on the types of solutions it should propose.
5.  **Branding**: It can inject client and product names (`clientName`, `productFocus`) to generate branded, white-labeled output.
6.  **Strict Formatting Constraint**: Every prompt concludes with a `CRITICAL` instruction to return *only* a valid JSON object, which drastically improves reliability.

## 4. Response Handling: From Raw Text to Trusted Data

The low-level `geminiService.ts` is designed to be resilient to inconsistent API responses.

1.  **Extraction**: The raw text is extracted from the API response.
2.  **Resilient JSON Search**: The code intelligently handles responses where the AI wraps the JSON in markdown code blocks (e.g., ` ```json ... ``` `). It then isolates the JSON block by searching for the first `{` and last `}`.
3.  **Parsing**: `JSON.parse()` is used to convert the cleaned string into a JavaScript object.
4.  **Validation & Fallbacks**: After parsing, the object is validated.
    - It checks for the presence and correct type of key fields.
    - It contains robust `parseCurrency` logic to handle various monetary formats (e.g., "$150,000 - $200,000").
    - If `estimatedAnnualROI` is missing from the top level, it is **calculated on the fly** by summing the `estimatedImpact` of each valid opportunity. This ensures data integrity.
5.  **Source Extraction**: The grounding sources are extracted from the `groundingMetadata` path. This provides the verifiable data that builds trust in the analysis.

## 5. Multi-Layered Error Handling

The analysis process has robust error handling at multiple stages:

- **Configuration Error (`geminiService.ts`)**: Checks if the `API_KEY` is available. If not, it throws a fatal error immediately.
- **API Response Error (`geminiService.ts`)**: Checks if the API response is empty, which could indicate safety blocking.
- **Parsing Error (`geminiService.ts`)**: Throws specific errors if the response is not valid JSON or if it's missing critical data like `keyOpportunities`.
- **Business Logic Error (`configuredAnalysis.ts`)**: The high-level service has a `try...catch` block that can handle failures from the lower-level service and create a special "Unqualified" lead object, ensuring the user always receives feedback even if the analysis fails.