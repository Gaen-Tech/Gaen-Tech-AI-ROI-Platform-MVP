import { IndustryConfig } from '../types';

// 1. General Business Analysis (the new default)
export const DEFAULT_CONFIG: IndustryConfig = {
    id: 'default',
    name: 'General Business Analysis',
    description: 'A general-purpose persona that analyzes companies for common business challenges like operational inefficiencies, marketing gaps, or sales process improvements.',
    enabled: true,
    systemPrompt: `
    You are an expert senior business analyst. Your task is to analyze a company's website to identify 2-3 high-impact business opportunities. Focus on common business challenges, not just technology. Ground your analysis in real-time data using Google Search.

    CRITICAL: Your entire response must be a single, valid JSON object, starting with '{' and ending with '}'. Do not include any text, explanation, or markdown formatting before or after the JSON object.

    Analyze the company: {companyName} ({websiteUrl}).

    Respond with the following JSON structure:
    {
      "opportunityScore": <number, 0-100, assessing overall potential>,
      "estimatedAnnualROI": "<string, e.g., '$XXX,XXX'>",
      "opportunities": [
        {
          "title": "<string, concise title of the opportunity>",
          "problem": "<string, the specific business problem this opportunity solves>",
          "solution": "<string, a strategic, high-level solution>",
          "estimatedImpact": "<string, estimated annual financial impact, e.g., '$XXX,XXX'>",
          "timeline": "<string, e.g., '3-6 months'>"
        }
      ],
      "keyInsights": [
        "<string, a key insight about the company's market, strategy, or operations>"
      ]
    }
    `,
    opportunityTemplates: [],
    scoringCriteria: {
        highPriorityIndicators: [{ keyword: 'outdated', points: 10 }, { keyword: 'manual process', points: 15 }],
        mediumPriorityIndicators: [{ keyword: 'customer engagement', points: 5 }],
        referralIndicators: [],
        disqualifiers: ['non-profit', 'government']
    }
};

// 2. AI Digital Transformation Analysis (the cloned persona)
const AI_TRANSFORMATION_CONFIG: IndustryConfig = {
    id: 'ai_transformation_v1',
    name: 'AI Digital Transformation Analysis',
    description: 'A specialized persona that focuses on identifying opportunities where AI and automation can drive significant digital transformation and ROI.',
    enabled: true,
    systemPrompt: `
    You are an expert AI implementation consultant. Your task is to analyze a company's website to identify 2-3 high-impact opportunities where AI solutions could deliver measurable ROI. Ground your analysis in real-time data using Google Search.

    CRITICAL: Your entire response must be a single, valid JSON object, starting with '{' and ending with '}'. Do not include any text, explanation, or markdown formatting before or after the JSON object.

    Analyze the company: {companyName} ({websiteUrl}).

    Respond with the following JSON structure:
    {
      "opportunityScore": <number, 0-100, assessing overall potential>,
      "estimatedAnnualROI": "<string, e.g., '$XXX,XXX'>",
      "opportunities": [
        {
          "title": "<string, concise title of the AI opportunity>",
          "problem": "<string, the specific problem this opportunity solves for the company>",
          "solution": "<string, a high-level description of the proposed AI solution>",
          "estimatedImpact": "<string, estimated annual financial impact, e.g., '$XXX,XXX'>",
          "timeline": "<string, e.g., '6-9 months'>"
        }
      ],
      "keyInsights": [
        "<string, a key insight about the company's readiness for AI adoption>"
      ]
    }
    `,
    opportunityTemplates: [],
    scoringCriteria: {
        highPriorityIndicators: [{ keyword: 'digital transformation', points: 15 }, { keyword: 'technology', points: 10 }],
        mediumPriorityIndicators: [{ keyword: 'innovation', points: 5 }, { keyword: 'growth', points: 5 }],
        referralIndicators: [],
        disqualifiers: []
    },
    productFocus: 'AI Implementation Services'
};

// 3. The highly specialized Millennium Dental Config
const MILLENNIUM_DENTAL_CONFIG: IndustryConfig = {
    id: 'millennium_dental_v1',
    name: 'Millennium Dental (PerioLase)',
    description: 'Analyzes dental practices for their potential to adopt the PerioLase MVP-7 laser and LANAP/LAPIP protocols.',
    enabled: true,
    clientName: 'Millennium Dental Technologies, Inc.',
    productFocus: 'PerioLase® MVP-7™ Laser System',
    systemPrompt: `
    You are analyzing dental practices for their potential to adopt the PerioLase MVP-7 laser 
    and LANAP protocol from Millennium Dental Technologies.

    TARGET PRACTICE TYPES (analyze only these):
    - Periodontal practices (periodontists) - PRIMARY TARGET
    - General dental practices offering periodontal services
    - Prosthodontic practices dealing with implants
    - Oral surgery practices handling implants and soft tissue

    EXCLUDE: Endodontic practices (root canal specialists), orthodontists, pediatric dentists

    TECHNOLOGY FOCUS - PerioLase MVP-7 Laser System enables:
    1. LANAP Protocol: A minimally invasive alternative to traditional gum surgery for periodontal disease.
    2. LAPIP Protocol: Treatment for failing dental implants.
    3. Value-Added Procedures (VAPS): Various soft tissue procedures.
    
    ROI CALCULATION FRAMEWORK:
    - LANAP cases: $200,000-250,000 annual potential
    - LAPIP cases: $150,000-180,000 annual potential  
    - VAPS procedures: $80,000-120,000 annual potential
    - Timeline: 4-15 months depending on practice size

    CRITICAL: Your entire response must be a single, valid JSON object, starting with '{' and ending with '}'. Do not include any text, explanation, or markdown formatting before or after the JSON object.
    CRITICAL: Provide a clear 'practiceTypeJustification' based on evidence from the website (e.g., 'Website lists "Dr. Smith, Periodontist" on staff page.').

    Analyze the dental practice: {companyName} ({websiteUrl}).

    Provide analysis in this JSON structure:
    {
      "practiceType": "periodontics|general_dentistry|prosthodontics|oral_surgery|excluded",
      "practiceTypeJustification": "<string, the reason for the practice type classification based on website content>",
      "isTargetPractice": <boolean>,
      "opportunityScore": <number, 0-100>,
      "estimatedAnnualROI": "<string, e.g., '$XXX,XXX'>",
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
        "notes": "string"
      },
      "keyInsights": ["string"]
    }
    `,
    referralAnalysisPrompt: `
    REFERRAL NETWORK ASSESSMENT:

    Your key objective is to identify practices that are currently REFERRING OUT high-value periodontal and implant cases. Frame this as a 'lost revenue' problem.

    1. REFERRAL GENERATOR (General Practice):
      - Does this practice currently refer periodontal cases out to specialists?
      - Do they refer implant cases to specialists?
      → If YES: This is a prime opportunity. The solution is to adopt the PerioLase MVP-7 to KEEP these valuable cases in-house, significantly boosting their revenue. Frame your 'notes' around this 'lost revenue' angle.

    2. REFERRAL RECEIVER (Specialist Practice):
      - Does this practice accept referrals from general dentists?
      - Are they positioned as a specialty center?
      → If YES: HIGH-VALUE target. They can expand their referral network by offering advanced, minimally-invasive LANAP/LAPIP procedures, making them more attractive to referring GPs.
      
    Rate: LOW / MEDIUM / HIGH and explain the opportunity based on the above.
    `,
    scoringCriteria: {
        highPriorityIndicators: [ { keyword: 'periodontist', points: 30 }, { keyword: 'periodontal surgery', points: 30 }, { keyword: 'dental implants', points: 30 } ],
        mediumPriorityIndicators: [ { keyword: 'laser dentistry', points: 20 }, { keyword: 'gum disease', points: 20 } ],
        referralIndicators: [ { keyword: 'accepting referrals', points: 20 }, { keyword: 'referring dentists', points: 20 } ],
        disqualifiers: [ 'endodontist', 'orthodontist', 'pediatric dentist' ]
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
};


export const INDUSTRY_CONFIGS: Record<string, IndustryConfig> = {
    [DEFAULT_CONFIG.id]: DEFAULT_CONFIG,
    [AI_TRANSFORMATION_CONFIG.id]: AI_TRANSFORMATION_CONFIG,
    [MILLENNIUM_DENTAL_CONFIG.id]: MILLENNIUM_DENTAL_CONFIG
};


const CUSTOM_CONFIGS_KEY = 'gaen_custom_industry_configs';
const ACTIVE_CONFIG_KEY = 'gaen_active_industry_config_id';

// --- Custom Config Management ---

export function getCustomConfigs(): IndustryConfig[] {
    try {
        const stored = localStorage.getItem(CUSTOM_CONFIGS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error("Failed to parse custom configs from localStorage", error);
        return [];
    }
}

export function saveCustomConfig(configToSave: IndustryConfig): void {
    const customConfigs = getCustomConfigs();
    const existingIndex = customConfigs.findIndex(c => c.id === configToSave.id);

    if (existingIndex > -1) {
        customConfigs[existingIndex] = configToSave;
    } else {
        customConfigs.push(configToSave);
    }
    localStorage.setItem(CUSTOM_CONFIGS_KEY, JSON.stringify(customConfigs));
}

export function deleteCustomConfig(configId: string): void {
    let customConfigs = getCustomConfigs();
    customConfigs = customConfigs.filter(c => c.id !== configId);
    localStorage.setItem(CUSTOM_CONFIGS_KEY, JSON.stringify(customConfigs));
}

// --- Combined & Active Config Management ---

export function getAllConfigs(): IndustryConfig[] {
    const builtIn = Object.values(INDUSTRY_CONFIGS);
    const custom = getCustomConfigs();
    // Show enabled configs first, then sort by name
    const all = [...builtIn, ...custom].sort((a, b) => {
      if (a.enabled && !b.enabled) return -1;
      if (!a.enabled && b.enabled) return 1;
      return a.name.localeCompare(b.name);
    });
    return all;
}

export function setActiveConfig(config: IndustryConfig): void {
    localStorage.setItem(ACTIVE_CONFIG_KEY, config.id);
}

export function getActiveConfig(): IndustryConfig {
    const allConfigs = getAllConfigs();
    const activeId = localStorage.getItem(ACTIVE_CONFIG_KEY);

    if (activeId) {
        const activeConfig = allConfigs.find(c => c.id === activeId && c.enabled);
        if (activeConfig) {
            return activeConfig;
        }
    }
    
    // Fallback logic: find first enabled config, or default.
    const firstEnabled = allConfigs.find(c => c.enabled);
    if (firstEnabled) {
        setActiveConfig(firstEnabled);
        return firstEnabled;
    }

    return DEFAULT_CONFIG;
}