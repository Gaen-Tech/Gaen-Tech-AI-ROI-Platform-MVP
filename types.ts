
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
  id: number;
  name: string;
  website: string;
  industry: Industry;
  location: string;
  contact: string;
}

export interface OpportunityDetail {
  opportunity: string;
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
  aiOpportunityScore: number;
  keyOpportunities: OpportunityDetail[];
  estimatedRoi: number;
  sources?: GroundingSource[];
  isMockData?: boolean; // Flag to indicate if the data is from the mock generator
}

export type LeadStatus = 'Prospected' | 'Contacted' | 'Qualified' | 'Closed';

export interface Lead extends Company, AnalysisResult {
  status: LeadStatus;
}