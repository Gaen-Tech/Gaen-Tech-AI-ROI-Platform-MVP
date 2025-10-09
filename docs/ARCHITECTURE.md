
# Application Architecture

This document provides a high-level overview of the technical architecture for the Gaen Tech AI ROI Generation Platform.

## 1. Core Philosophy

The architecture is designed around the principles of a Minimum Viable Product (MVP): simplicity, speed, and focus on core value. We use a modern, component-based frontend architecture that is easy to understand, maintain, and extend. The design prioritizes reliability and user trust.

## 2. Technology Stack

- **React**: The core UI library for building the user interface with a component-based model.
- **TypeScript**: Provides static typing to reduce runtime errors and improve developer experience and code maintainability.
- **Tailwind CSS**: A utility-first CSS framework for rapid and consistent styling without leaving the HTML.
- **Google Gemini API**: The AI service used for company analysis and ROI prediction.
- **jsPDF**: A library used for generating client-side PDF proposals programmatically.

## 3. Project Structure

The codebase is organized into logical directories to maintain separation of concerns:

- `components/`: Contains all reusable React components. This is the primary building block of the UI.
- `services/`: Handles external API communication, abstracting the data-fetching logic from the components. `geminiService.ts` and `proposalService.ts` are the key files here.
- `hooks/`: Stores custom React hooks.
- `types.ts`: A central location for all TypeScript type definitions, ensuring data consistency across the application.

## 4. State Management

For the MVP, we have adopted a localized state management approach using **React Hooks** (`useState`, `useCallback`, `useMemo`, `useEffect`).

- **Why this approach?**: It avoids the overhead and complexity of a global state management library (like Redux or Zustand) which is not necessary for the current scale of the application.
- **State Location**: The primary application state (the list of `leads` and the `userProfile`) is lifted up to the main `App.tsx` component.
- **Data Flow**: State and state-updating functions are passed down to child components as props. This follows a unidirectional data flow, making the application easier to reason about and debug.

## 5. Architectural Patterns

### Robust Service Layer (`geminiService.ts`)

The service layer is designed to be highly resilient. Instead of just making an API call, it's responsible for:
- **Error Handling**: Throwing a clear error if the required `API_KEY` is not configured.
- **Prompt Engineering**: Crafting precise, dynamic instructions for the AI model, injecting the user-defined sales persona to tailor the analysis.
- **Resilient Parsing**: Intelligently extracting a valid JSON object from the AI's response, even if it contains extraneous text.
- **Response Validation**: Proactively checking if the AI's response is empty or blocked by safety filters, providing clear errors to the user.
- **Data Integrity**: Validating the structure of the AI's response and providing fallbacks for critical missing data (e.g., calculating `estimatedAnnualROI` if it's not provided).

## 6. Data Flow Diagram (Conceptual)

This diagram illustrates the primary workflow of analyzing a company and generating a lead.

```
[User Interaction]        (In Discovery.tsx)
       |
       v
[Click "Analyze Company"]
       |
       v
[handleAnalyze(company)] --> Calls geminiService.analyzeCompanyWebsite(company, userProfile)
       |
       v
[geminiService.ts] -----> Injects userProfile into the prompt. Checks for API_KEY.
       |                 If present, makes API call to Google Gemini via proxy.
       |                          |
       |                          v
       |                      [Google Cloud]
       |                          |
       |                          v
       |<---- [AnalysisResult] --- Returns JSON response (which is then cleaned, validated, and parsed)
       |
       v
[onAnalyzeComplete(company, analysisResult)] is called in Discovery.tsx
       |
       v
[addLead(company, analysis)] is called in App.tsx
       |
       v
[setLeads(...)] --> Updates the main application state
       |
       v
[React Re-renders] --> UI is updated to show the new lead in Leads.tsx
```

## 7. Future Considerations

- **Global State Management**: If the application grows in complexity with more shared state between deeply nested components, introducing a library like Zustand or React Context API might become necessary.
- **API Abstraction**: As more external services are added, the `services/` directory can be expanded with more specific handlers, potentially with a shared API client for handling auth, headers, and errors.
- **Component Library**: For a larger application, creating a more formal component library with a tool like Storybook would be beneficial for consistency and reusability.