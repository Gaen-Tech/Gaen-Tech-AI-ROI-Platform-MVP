# Gaen Tech - AI ROI Generation Platform

## Project Overview

Welcome to the Gaen Tech AI ROI Generation Platform. This is a lean, fast, and profitable Minimum Viable Product (MVP) designed to identify and qualify high-value website leads. The platform analyzes a company's current website, identifies opportunities for AI implementation, and generates a professional proposal detailing the potential Return on Investment (ROI).

The core mission is to empower sales and business development teams to quickly turn potential prospects into qualified leads with data-driven, AI-powered insights.

---

## Key Features

- **Dashboard Overview**: Get a high-level view of your sales pipeline, including the number of opportunities, qualified leads, and total potential ROI visualized by status and industry.
- **Company Discovery**:
    - Analyze companies from a pre-populated list of potential targets.
    - Analyze any company on-the-fly by simply entering their website URL.
    - Filter and search through the discovery list to find ideal prospects.
    - Export the discovery list as a CSV file.
- **AI-Powered Analysis**:
    - Leverages the Google Gemini API with **Google Search grounding** to ensure analysis is based on real-time, verifiable data.
    - Generates an "AI Opportunity Score" to quickly assess a prospect's potential.
    - Identifies 2-3 key, high-impact opportunities with clear problem statements and AI-driven solutions.
    - Provides estimated financial impact and an ROI timeline for each opportunity.
- **Lead Management**:
    - Automatically converts every analyzed company into a lead.
    - View detailed breakdowns of the AI analysis for each lead.
    - Update lead status through a simple sales funnel (`Prospected`, `Contacted`, `Qualified`, `Closed`).
    - Filter leads by minimum estimated ROI.
- **One-Click PDF Proposals**: Instantly generate a professional, client-ready digital transformation proposal based on the AI analysis. The proposal is professionally formatted and includes all key data points and verifiable sources.

---

## Tech Stack

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS
- **AI/ML**: Google Gemini API (`gemini-2.5-flash`)
- **Charts**: Recharts
- **PDF Generation**: jsPDF, html2canvas

---

## Project Structure

```
/
├── components/         # Reusable React components
│   ├── icons/          # SVG icon components
│   ├── Dashboard.tsx
│   ├── Discovery.tsx
│   ├── Header.tsx
│   ├── Leads.tsx
│   ├── ProposalForExport.tsx
│   └── Sidebar.tsx
├── docs/               # Project documentation
│   ├── ARCHITECTURE.md
│   ├── API_GUIDE.md
│   └── USER_GUIDE.md
├── hooks/              # Custom React hooks (e.g., useMockCompanies.ts)
├── services/           # API interaction layer (e.g., geminiService.ts)
├── types.ts            # Core TypeScript type definitions
├── App.tsx             # Main application component
├── index.html          # HTML entry point
├── index.tsx           # React root renderer
├── README.md           # This file
└── ...
```

---

## Setup and Installation

### Prerequisites

- A modern web browser (e.g., Chrome, Firefox, Safari).
- A valid Google Gemini API Key.

### Configuration

The application requires a Google Gemini API key to function. This key should be stored in an environment variable named `API_KEY`.

1.  **Obtain an API Key**: If you don't have one, get a key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  **Set Environment Variable**: The execution environment where this app is hosted must have the `API_KEY` environment variable set. The application is coded to read `process.env.API_KEY` directly.

**Note**: For local development or environments where setting environment variables is not straightforward, the application has a fallback. However, for security and best practices, always use environment variables in production.

### Running the Application

This web application is designed to be served by a static file server. Ensure that the server is configured to serve `index.html` as the entry point. All necessary scripts are loaded via ES modules and an import map within `index.html`.
