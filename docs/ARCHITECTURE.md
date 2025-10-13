# Application Architecture

This document provides a high-level overview of the technical architecture for the Gaen Tech AI ROI Generation Platform.

## 1. Core Philosophy

The architecture is designed around the principles of a Minimum Viable Product (MVP): simplicity, speed, and focus on core value. We use a modern, component-based frontend architecture that is easy to understand, maintain, and extend. The design prioritizes reliability, user trust, and configurability.

## 2. Technology Stack

- **React**: The core UI library for building the user interface with a component-based model.
- **TypeScript**: Provides static typing to reduce runtime errors and improve developer experience and code maintainability.
- **Tailwind CSS**: A utility-first CSS framework for rapid and consistent styling without leaving the HTML.
- **Google Gemini API**: The AI service used for company analysis and ROI prediction.
- **jsPDF**: A library used for generating client-side PDF proposals programmatically.

## 3. Project Structure

The codebase is organized into logical directories to maintain separation of concerns:

- `components/`: Contains all reusable React components. This is the primary building block of the UI.
- `config/`: Home to the core configuration logic, most importantly `industryConfigs.ts`, which defines the AI personas.
- `services/`: Handles external API communication and business logic, abstracting it from the UI.
- `hooks/`: Stores custom React hooks.
- `types.ts`: A central location for all TypeScript type definitions, ensuring data consistency across the application.

## 4. State Management

For the MVP, we have adopted a localized state management approach using **React Hooks** (`useState`, `useCallback`) and **Browser `localStorage`** for persistence.

- **Why this approach?**: It avoids the overhead of a global state library (like Redux) which is not necessary for the current scale. `localStorage` provides simple, effective persistence for user configurations.
- **Application State**: The primary application state (the list of `leads`) is managed in the main `App.tsx` component.
- **Configuration State**: The active AI persona and all custom-created personas are managed by the helper functions in `config/industryConfigs.ts` and persisted in `localStorage`. This decouples the powerful configuration system from the component tree's state.
- **Data Flow**: State and state-updating functions are passed down to child components as props, following a unidirectional data flow.

## 5. Architectural Patterns

### Two-Tier Service Layer

The service layer is designed to be highly resilient and organized. It's split into two distinct levels:

1.  **High-Level: `configuredAnalysis.ts`**
    - This is the **business logic** layer and the primary entry point for any analysis.
    - It is responsible for retrieving the active `IndustryConfig` (persona).
    - It dynamically constructs a detailed, highly-specific prompt for the AI by merging the company's details with the persona's system instructions, templates, and rules.
    - It performs post-processing on the AI's results, such as re-calculating scores based on keywords, to ensure alignment with the persona's goals.

2.  **Low-Level: `geminiService.ts`**
    - This is the **API communication** layer. It acts as a robust, resilient wrapper around the Gemini API.
    - It knows nothing about different personas; it simply accepts a prompt and a company's details.
    - Its responsibilities include: checking for the `API_KEY`, making the raw API call, handling low-level errors, intelligently parsing JSON from the AI's potentially messy response, and validating the basic structure of the data.

### Config-Driven UI

The entire application's analysis capability is driven by the objects defined in `config/industryConfigs.ts`. This makes the platform highly extensible. Adding a new, complex analysis capability is as simple as defining a new `IndustryConfig` object, with no changes needed to the React components.

## 6. Data Flow Diagram (Conceptual)

This diagram illustrates the primary workflow of analyzing a company.

```
[User Interaction]        (In Discovery.tsx)
       |
       v
[Click "Analyze Company"]
       |
       v
Calls performAnalysis(company) in [configuredAnalysis.ts]
       |
       |--> Reads active persona ID from localStorage.
       |--> Gets the full persona object from [config/industryConfigs.ts].
       |--> Builds a dynamic, detailed system instruction prompt.
       |
       v
Calls analyzeCompanyWebsite(company, dynamicPrompt) in [geminiService.ts]
       |
       |--> Checks for API_KEY.
       |--> Makes the API call to [Google Gemini API].
       |
       |<---- Returns raw text response.
       |
       |--> Cleans, validates, and parses the text into a JSON [AnalysisResult].
       |
       v
Returns [AnalysisResult] to [configuredAnalysis.ts]
       |
       |--> Performs post-processing (e.g., score adjustment).
       |--> Constructs a full [Lead] object.
       |
       v
Returns [Lead] object to [Discovery.tsx]
       |
       v
Calls onAnalyzeComplete(lead)
       |
       v
[addLead(lead)] is called in App.tsx
       |
       v
[setLeads(...)] --> Updates the main application state
       |
       v
[React Re-renders] --> UI is updated to show the new lead.
```