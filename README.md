# Gaen Tech - AI ROI Generation Platform

## Project Overview

Welcome to the Gaen Tech AI ROI Generation Platform. This is a lean, fast, and profitable Minimum Viable Product (MVP) designed to identify and qualify high-value website leads. The platform analyzes a company's current website using customizable AI personas, identifies opportunities, and generates a professional proposal detailing the potential Return on Investment (ROI).

The core mission is to empower sales and business development teams to quickly turn potential prospects into qualified leads with data-driven, AI-powered insights tailored to their specific market.

---

## Key Features

- **Dashboard Overview**: Get a high-level view of your sales pipeline, including the number of opportunities, qualified leads, and total potential ROI.

- **Multi-Persona Analysis Engine**: The core of the platform. Instead of a single analysis model, you can choose from multiple AI "personas" to conduct analysis. This allows for highly specialized and relevant insights.
    - **Built-in Personas**: Comes with pre-configured personas for General Business, AI Digital Transformation, and specialized industry examples.
    - **Active Persona Selection**: Easily switch the active analysis persona from the Dashboard to change the context for all future discoveries.

- **AI Persona Configuration Page**: A dedicated section to manage your analysis personas.
    - **View & Understand**: See all available built-in and custom personas.
    - **Create & Customize**: Create new personas from scratch to fit your exact needs.
    - **Clone & Tweak**: Clone existing built-in personas to use as a starting point for your own custom versions.
    - **Manage Lifecycle**: Edit, enable/disable, and delete custom personas.

- **On-Demand Company Discovery**: Analyze any company on-the-fly by simply entering their website URL. This allows for targeted, real-time lead generation using the currently active persona.

- **AI-Powered Analysis**:
    - Leverages the Google Gemini API with **Google Search grounding** to ensure analysis is based on real-time, verifiable data.
    - Generates an "AI Opportunity Score" to quickly assess a prospect's potential.
    - Identifies key, high-impact opportunities with clear problem statements and solutions relevant to the active persona.
    - Provides estimated financial impact and an ROI timeline for each opportunity.

- **Lead Management**:
    - Automatically converts every analyzed company into a lead.
    - View detailed breakdowns of the AI analysis for each lead in a modal view.
    - Update lead status through a simple sales funnel (`Prospected`, `Qualified`, `Unqualified`).
    - Filter and sort leads by creation date, opportunity score, or estimated ROI.

- **One-Click PDF Proposals**: Instantly generate a professional, client-ready proposal based on the AI analysis. The proposal is professionally formatted and includes all key data points and verifiable sources.

- **Responsive Design**: A modern, fully responsive interface with a fixed sidebar on desktop and a slide-in menu on mobile.

---

## Tech Stack

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS
- **AI/ML**: Google Gemini API (`gemini-2.5-flash`)
- **PDF Generation**: jsPDF

---

## Project Structure

```
/
├── components/         # Reusable React components
│   ├── icons/          # SVG icon components
│   ├── Dashboard.tsx
│   ├── Discovery.tsx
│   ├── IndustryConfig.tsx # UI for managing AI personas
│   ├── Leads.tsx
│   ├── LeadDetailModal.tsx
│   ├── ProposalForExport.tsx
│   └── Sidebar.tsx      # Handles responsive navigation
├── config/             # Application configuration
│   └── industryConfigs.ts # Defines built-in personas and manages custom ones
├── docs/               # Project documentation
├── hooks/              # Custom React hooks
├── services/           # API interaction and business logic layer
│   ├── configuredAnalysis.ts # High-level service for persona-driven analysis
│   ├── geminiService.ts      # Low-level wrapper for the Gemini API
│   └── proposalService.ts
├── types.ts            # Core TypeScript type definitions
├── App.tsx             # Main application component
├── index.html          # HTML entry point
├── index.tsx           # React root renderer
└── README.md           # This file
```

---

## Setup and Installation

### Prerequisites

- A modern web browser (e.g., Chrome, Firefox, Safari).
- A valid Google Gemini API Key.

### Configuration

The application requires a Google Gemini API key to function. This key must be stored in an environment variable named `API_KEY`.

1.  **Obtain an API Key**: If you don't have one, get a key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  **Set Environment Variable**: The execution environment where this app is hosted must have the `API_KEY` environment variable set. The application is coded to read `process.env.API_KEY` directly.

If the `API_KEY` is not set, the application will not be able to perform AI analysis and will display an error message.