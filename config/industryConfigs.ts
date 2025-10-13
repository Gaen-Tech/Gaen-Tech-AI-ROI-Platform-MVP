export interface OpportunityTemplate {
  id: string;
  title: string;
  problemTemplate: string;
  solutionTemplate: string;
  estimatedImpactRange: {
    min: number;
    max: number;
  };
  timelineMonths: {
    min: number;
    max: number;
  };
  applicableWhen: string[]; // conditions when this opportunity applies
}

export interface ScoringCriteria {
  highPriorityIndicators: Array<{
    keyword: string;
    points: number;
  }>;
  mediumPriorityIndicators: Array<{
    keyword: string;
    points: number;
  }>;
  referralIndicators: Array<{
    keyword: string;
    points: number;
  }>;
  disqualifiers: string[]; // auto-reject if found
}

export interface IndustryConfig {
  id: string;
  name: string;
  description: string;
  clientName?: string; // e.g., "Millennium Dental Technologies"
  productFocus?: string; // e.g., "PerioLase MVP-7"
  
  targetCompanyTypes: string[];
  excludedCompanyTypes: string[];
  
  searchQueryTemplates: {
    companyType: string[];
    technology: string[];
    services: string[];
    referrals: string[];
  };
  
  systemPrompt: string; // Main analysis instructions for Gemini
  referralAnalysisPrompt?: string; // Optional referral-specific analysis
  
  scoringCriteria: ScoringCriteria;
  opportunityTemplates: OpportunityTemplate[];
  
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

// Default configuration (existing behavior)
export const DEFAULT_CONFIG: IndustryConfig = {
  id: 'default',
  name: 'General B2B Analysis',
  description: 'Standard AI opportunity analysis for any business',
  
  targetCompanyTypes: [],
  excludedCompanyTypes: [],
  
  searchQueryTemplates: {
    companyType: ['"{companyName}" services OR products'],
    technology: ['"{companyName}" technology OR "tech stack"'],
    services: ['"{companyName}" offerings OR solutions'],
    referrals: []
  },
  
  systemPrompt: `
You are analyzing a company for AI-driven digital transformation opportunities.

Analyze the company's digital presence and identify 2-3 high-impact opportunities 
where AI solutions could deliver measurable ROI.

Provide analysis in this JSON structure:
{
  "opportunityScore": 0-100,
  "estimatedAnnualROI": "$XXX,XXX",
  "opportunities": [
    {
      "title": "string",
      "problem": "string", 
      "solution": "string",
      "estimatedImpact": "string",
      "timeline": "string"
    }
  ],
  "keyInsights": ["string"],
  "sources": ["url"]
}
  `.trim(),
  
  scoringCriteria: {
    highPriorityIndicators: [
      { keyword: 'digital transformation', points: 15 },
      { keyword: 'technology', points: 10 }
    ],
    mediumPriorityIndicators: [
      { keyword: 'innovation', points: 5 },
      { keyword: 'growth', points: 5 }
    ],
    referralIndicators: [],
    disqualifiers: []
  },
  
  opportunityTemplates: [],
  enabled: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Millennium Dental Technologies Configuration
export const MILLENNIUM_DENTAL_CONFIG: IndustryConfig = {
  id: 'millennium-dental',
  name: 'Millennium Dental Technologies',
  description: 'PerioLase MVP-7 laser system for dental practices',
  clientName: 'Millennium Dental Technologies, Inc.',
  productFocus: 'PerioLase® MVP-7™ Laser System',
  
  targetCompanyTypes: [
    'periodontics',
    'periodontist',
    'periodontal practice',
    'general dentistry',
    'general dental practice',
    'family dentistry',
    'prosthodontics',
    'prosthodontist',
    'oral surgery',
    'oral surgeon',
    'dental implants',
    'implant dentistry'
  ],
  
  excludedCompanyTypes: [
    'endodontics',
    'endodontist',
    'root canal specialist',
    'orthodontics',
    'orthodontist',
    'pediatric dentistry',
    'pediatric dentist'
  ],
  
  searchQueryTemplates: {
    companyType: [
      '"{companyName}" periodontist OR "periodontal services"',
      '"{companyName}" "dental implants" OR prosthodontist',
      '"{companyName}" "oral surgery" OR "oral surgeon"',
      '"{companyName}" "gum disease treatment"',
      '"{companyName}" services procedures -endodontic'
    ],
    technology: [
      '"{companyName}" "laser dentistry" OR "advanced technology"',
      '"{companyName}" "minimally invasive" OR "patient comfort"',
      '"{companyName}" "periodontal surgery" OR "gum surgery"'
    ],
    services: [
      '"{companyName}" "periodontal treatment"',
      '"{companyName}" "dental implants"',
      '"{companyName}" "gum grafting" OR "bone grafting"'
    ],
    referrals: [
      '"{companyName}" "accepting referrals" OR "referring dentists"',
      '"{companyName}" "specialist" OR "specialty practice"',
      '"{companyName}" "referral network"'
    ]
  },
  
  systemPrompt: `
You are analyzing dental practices for their potential to adopt the PerioLase MVP-7 laser 
and LANAP protocol from Millennium Dental Technologies.

TARGET PRACTICE TYPES (analyze only these):
- Periodontal practices (periodontists) - PRIMARY TARGET
- General dental practices offering periodontal services
- Prosthodontic practices dealing with implants
- Oral surgery practices handling implants and soft tissue

EXCLUDE: Endodontic practices (root canal specialists), orthodontists, pediatric dentists.

TECHNOLOGY FOCUS - PerioLase MVP-7 Laser System enables:
1. LANAP Protocol: Minimally invasive alternative to gum surgery for treating periodontal disease.
2. LAPIP Protocol: Treatment for failing dental implants.
3. Value-Added Procedures (VAPS): Various soft tissue procedures.

REFERRAL POTENTIAL ANALYSIS (CRITICAL):
Your primary goal is to identify "Referral Generators" - general practices that currently send patients to specialists for perio/implant procedures. This represents a major "lost revenue" opportunity for them.
- If a practice is a Referral Generator, frame the "problem" as lost revenue and the "solution" as adopting the PerioLase to keep high-value cases in-house.
- Analyze their website for phrases like "works with specialists", "referrals to periodontists", or a lack of advanced perio/implant services.
- In the 'referralPotential.notes', explain your reasoning, focusing on evidence of them referring cases out.

ROI CALCULATION FRAMEWORK:
- LANAP cases: $200,000-250,000 annual potential
- LAPIP cases: $150,000-180,000 annual potential  
- VAPS procedures: $80,000-120,000 annual potential
- Timeline: 4-15 months depending on practice size

CRITICAL: Use ONLY information from Google Search grounding. Cite all sources.

Provide analysis in this JSON structure:
{
  "practiceType": "periodontics|general_dentistry|prosthodontics|oral_surgery|excluded",
  "practiceTypeJustification": "string (Explain WHY you chose this practice type based on their services, staff, or 'about us' page.)",
  "isTargetPractice": boolean,
  "opportunityScore": 0-100,
  "estimatedAnnualROI": "$XXX,XXX",
  "opportunities": [
    {
      "title": "string",
      "problem": "string",
      "solution": "string",
      "estimatedImpact": "string",
      "timeline": "string"
    }
  ],
  "referralPotential": {
    "type": "receiver|generator|both|none",
    "score": "low|medium|high",
    "notes": "string (Explain WHY you chose this type and score, focusing on evidence of them referring cases out.)"
  },
  "keyInsights": ["string"],
  "sources": ["url"]
}
  `.trim(),
  
  referralAnalysisPrompt: `
REFERRAL NETWORK ASSESSMENT:

1. REFERRAL RECEIVER (Specialist Practice):
   - Does this practice accept referrals from general dentists?
   - Do they market to referring dentists?
   - Are they positioned as a specialty center?
   → If YES: HIGH-VALUE target (referral hub potential)

2. REFERRAL GENERATOR (General Practice):
   - Does this practice currently refer periodontal cases out?
   - Do they refer implant cases to specialists?
   → If YES: Opportunity to KEEP cases in-house with PerioLase

3. NETWORK EXPANSION POTENTIAL:
   - Could this practice attract MORE referrals with PerioLase?
   - Could they become a regional LANAP/LAPIP center?
   
Rate: LOW / MEDIUM / HIGH and explain the opportunity.
  `.trim(),
  
  scoringCriteria: {
    highPriorityIndicators: [
      { keyword: 'periodontist', points: 30 },
      { keyword: 'periodontal surgery', points: 30 },
      { keyword: 'dental implants', points: 30 },
      { keyword: 'advanced technology', points: 30 },
      { keyword: 'minimally invasive', points: 30 }
    ],
    mediumPriorityIndicators: [
      { keyword: 'laser dentistry', points: 20 },
      { keyword: 'gum disease', points: 20 },
      { keyword: 'bone grafting', points: 20 },
      { keyword: 'patient comfort', points: 20 },
      { keyword: 'multiple doctors', points: 20 }
    ],
    referralIndicators: [
      { keyword: 'accepting referrals', points: 20 },
      { keyword: 'referring dentists', points: 20 },
      { keyword: 'specialist', points: 15 },
      { keyword: 'referral network', points: 15 }
    ],
    disqualifiers: [
      'endodontist',
      'endodontic',
      'root canal specialist',
      'orthodontist',
      'orthodontic',
      'pediatric dentist',
      'kids dentistry',
      'children\'s dentistry'
    ]
  },
  
  opportunityTemplates: [
    {
      id: 'lanap-protocol',
      title: 'Elevate Periodontal Disease Treatment with LANAP® Protocol',
      problemTemplate: 'Traditional periodontal surgeries can be invasive, painful, and require extended recovery, potentially leading to patient apprehension and lower treatment acceptance rates. While {companyName} offers advanced care, they may lack the most patient-centric, regenerative laser protocol.',
      solutionTemplate: 'Implement the FDA-cleared LANAP® protocol using the PerioLase® MVP-7™ laser. This minimally invasive treatment offers significantly less pain, faster healing, and true regeneration of bone and tissue, directly aligning with {companyName}\'s commitment to advanced, minimally invasive, and effective patient care. This will enhance patient satisfaction and case acceptance rates, which are reported to exceed 85% for LANAP practitioners.',
      estimatedImpactRange: { min: 200000, max: 250000 },
      timelineMonths: { min: 6, max: 12 },
      applicableWhen: ['isPeriodontist', 'offersPerioSurgery', 'isGeneralDentistWithPerio']
    },
    {
      id: 'lapip-protocol',
      title: 'Introduce Advanced Peri-Implantitis Treatment (LAPIP® Protocol)',
      problemTemplate: 'Dental implant complications, such as peri-implantitis, are a growing concern. Effectively treating ailing or failing implants often requires complex procedures, and traditional methods may not always ensure implant preservation. {companyName} offers dental implants and could benefit from a specialized laser protocol to address these issues.',
      solutionTemplate: 'Integrate the LAPIP® protocol, performed with the PerioLase® MVP-7™, to provide a minimally invasive solution for treating peri-implantitis. This protocol helps preserve compromised implants, encourages osseointegration and bone regeneration, and reduces inflammation, offering a superior outcome for their implant patients and establishing a new revenue stream for the practice.',
      estimatedImpactRange: { min: 150000, max: 180000 },
      timelineMonths: { min: 8, max: 15 },
      applicableWhen: ['offersImplants', 'isProsthodontist', 'isOralSurgeon']
    },
    {
      id: 'vaps-procedures',
      title: 'Expand Minimally Invasive Soft Tissue Procedures and Enhance Patient Comfort',
      problemTemplate: 'Current soft tissue procedures, including those for cosmetic or therapeutic purposes, may involve traditional surgical techniques that result in increased patient discomfort, bleeding, and longer recovery periods. {companyName} emphasizes patient comfort and utilizing state-of-the-art technology.',
      solutionTemplate: 'Leverage the versatile PerioLase® MVP-7™ for its extensive \'Value-Added Procedures\' (VAPS™). This enables the practice to offer a broader range of suture-free soft tissue treatments, such as depigmentation, fibroma removal, and even biostimulation for TMD/nerve pain, with reduced bleeding, faster healing, and enhanced patient comfort, further differentiating their advanced service offerings.',
      estimatedImpactRange: { min: 80000, max: 120000 },
      timelineMonths: { min: 4, max: 10 },
      applicableWhen: ['emphasizesComfort', 'mentionsAdvancedTech', 'hasMultipleDoctors']
    }
  ],
  
  enabled: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Registry of all available configurations
export const INDUSTRY_CONFIGS: Record<string, IndustryConfig> = {
  'default': DEFAULT_CONFIG,
  'millennium-dental': MILLENNIUM_DENTAL_CONFIG
};

// --- Configuration Management Helpers ---

// Helper to get all custom configs from localStorage
export function getCustomConfigs(): Record<string, IndustryConfig> {
  try {
    const stored = localStorage.getItem('customIndustryConfigs');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load custom configs:', e);
  }
  return {};
}

// Helper to get a specific config by ID, checking custom then built-in
export function getConfigById(id: string): IndustryConfig | null {
  const customConfigs = getCustomConfigs();
  // Custom config takes precedence over a built-in one with the same ID
  return customConfigs[id] || INDUSTRY_CONFIGS[id] || null;
}

// Helper to get the active config, ensuring it's always the latest version
export function getActiveConfig(): IndustryConfig {
  try {
    const storedId = localStorage.getItem('activeIndustryConfigId');
    if (storedId) {
      const config = getConfigById(storedId);
      if (config) return config;
    }
  } catch (e) {
    console.error('Failed to load active config ID:', e);
  }
  // Fallback to default if nothing is stored or the ID is invalid
  return DEFAULT_CONFIG;
}

// Helper to save the active config ID to localStorage
export function setActiveConfig(config: IndustryConfig): void {
  try {
    localStorage.setItem('activeIndustryConfigId', config.id);
  } catch (e) {
    console.error('Failed to save active config:', e);
  }
}

// Helper to save a custom config
export function saveCustomConfig(config: IndustryConfig): void {
  try {
    const customConfigs = getCustomConfigs();
    customConfigs[config.id] = config;
    localStorage.setItem('customIndustryConfigs', JSON.stringify(customConfigs));
  } catch (e) {
    console.error('Failed to save custom config:', e);
  }
}

// Helper to get all configs (built-in + custom), ensuring custom configs override built-ins
export function getAllConfigs(): IndustryConfig[] {
  const builtIn = Object.values(INDUSTRY_CONFIGS);
  const custom = Object.values(getCustomConfigs());
  
  // Use a Map to ensure uniqueness and that custom configs override built-ins
  const allConfigsMap = new Map<string, IndustryConfig>();
  builtIn.forEach(c => allConfigsMap.set(c.id, c));
  custom.forEach(c => allConfigsMap.set(c.id, c)); // custom will overwrite built-in if IDs match
  
  return Array.from(allConfigsMap.values());
}