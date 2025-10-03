# Application Architecture

This document provides a high-level overview of the technical architecture for the Gaen Tech AI ROI Generation Platform.

## 1. Core Philosophy

The architecture is designed around the principles of a Minimum Viable Product (MVP): simplicity, speed, and focus on core value. We use a modern, component-based frontend architecture that is easy to understand, maintain, and extend.

## 2. Technology Stack

- **React**: The core UI library for building the user interface with a component-based model.
- **TypeScript**: Provides static typing to reduce runtime errors and improve developer experience and code maintainability.
- **Tailwind CSS**: A utility-first CSS framework for rapid and consistent styling without leaving the HTML.
- **Google Gemini API**: The AI service used for company analysis and ROI prediction.
- **Recharts**: A composable charting library for data visualization on the dashboard.
- **jsPDF & html2canvas**: Libraries used in combination to generate client-side PDF proposals from HTML.

## 3. Project Structure

The codebase is organized into logical directories to maintain separation of concerns:

- `components/`: Contains all reusable React components. This is the primary building block of the UI.
- `services/`: Handles external API communication, abstracting the data-fetching logic from the components. `geminiService.ts` is the key file here.
- `hooks/`: Stores custom React hooks. Currently used for providing mock data (`useMockCompanies.ts`).
- `types.ts`: A central location for all TypeScript type definitions, ensuring data consistency across the application.

## 4. State Management

For the MVP, we have adopted a localized state management approach using **React Hooks** (`useState`, `useCallback`, `useMemo`, `useEffect`).

- **Why this approach?**: It avoids the overhead and complexity of a global state management library (like Redux or Zustand) which is not necessary for the current scale of the application.
- **State Location**: The primary application state (the list of `leads` and `companies`) is lifted up to the main `App.tsx` component.
- **Data Flow**: State and state-updating functions are passed down to child components as props. This follows a unidirectional data flow, making the application easier to reason about and debug.

## 5. Data Flow Diagram (Conceptual)

This diagram illustrates the primary workflow of analyzing a company and generating a lead.

```
[User Interaction]        (In Discovery.tsx)
       |
       v
[Click "Analyze Company"]
       |
       v
[handleAnalyze(company)] --> Calls geminiService.analyzeCompanyWebsite(company)
       |
       v
[geminiService.ts] -----> Makes API call to Google Gemini
       |                          |
       |                          v
       |                      [Google Cloud]
       |                          |
       |                          v
       |<---- [AnalysisResult] --- Returns JSON response
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

## 6. Key Components and Responsibilities

- **`App.tsx`**: The root component. It manages the main application state (`leads`, `companies`), handles view routing, and passes data down to its children.
- **`Sidebar.tsx` & `Header.tsx`**: Responsible for primary navigation and layout. They are stateless UI components.
- **`Dashboard.tsx`**: A data visualization component. It receives the `leads` array as a prop and uses Recharts to display statistics and charts.
- **`Discovery.tsx`**: The "input" section of the application. It allows users to select or enter a company and trigger the AI analysis. It manages its own local state for filters, search terms, and loading states.
- **`Leads.tsx`**: The "output" section. It displays the list of generated leads, allows for status updates, and contains the logic for triggering the `LeadDetailModal` and the PDF export process.
- **`ProposalForExport.tsx`**: A presentational component designed specifically for PDF generation. It is rendered off-screen with the lead's data and captured by `html2canvas`.

## 7. Future Considerations

- **Global State Management**: If the application grows in complexity with more shared state between deeply nested components, introducing a library like Zustand or React Context API might become necessary.
- **API Abstraction**: As more external services are added, the `services/` directory can be expanded with more specific handlers, potentially with a shared API client for handling auth, headers, and errors.
- **Component Library**: For a larger application, creating a more formal component library with a tool like Storybook would be beneficial for consistency and reusability.
