// FIX: Removed self-import of 'Industry' which caused a declaration conflict.

export type View = 'dashboard' | 'discovery' | 'leads';

export enum Industry {
  TECH = 'Technology',
  ECOMMERCE = 'E-commerce',
  FINANCE = 'Finance',
  HEALTHCARE = 'Healthcare',
  RETAIL = 'Retail',
  MEDIA = 'Media & Entertainment',
  HOSPITALITY = 'Hospitality',
  MANUFACTURING = 'Manufacturing',
  REAL_ESTATE = 'Real Estate',
}

export interface Company {
  name: string;
  website: string;
  industry: Industry;
  location: string;
  contact: string;
}

export interface OpportunityDetail {
  opportunity: string; // Title of the opportunity
  problem: string;
  solution: string;
  roiTimeline: string;
  estimatedImpact: number; // in USD
}

export interface GroundingSource {
  web: {
    uri: string;
    title: string;
  }
}

export interface AnalysisResult {
  opportunityScore: number;
  keyOpportunities: OpportunityDetail[];
  estimatedAnnualROI: number; // Now a direct property
  sources?: GroundingSource[];
  
  // Optional fields from new configs
  practiceType?: string;
  practiceTypeJustification?: string; // Added for categorization reasoning
  isTargetPractice?: boolean;
  referralPotential?: {
    type: "receiver" | "generator" | "both" | "none";
    score: "low" | "medium" | "high";
    notes: string;
  };
  keyInsights?: string[];
}

export type LeadStatus = 'prospected' | 'qualified';

export interface Lead {
  id: string;
  company: Company;
  analysis: AnalysisResult;
  status: LeadStatus;
  createdAt: string;
}
