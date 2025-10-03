
import { useState } from 'react';
import { Company, Industry } from '../types';

const initialCompanies: Company[] = [
  { id: 1, name: 'Innovate Solutions', website: 'innovatesolutions.com', industry: Industry.TECH, location: 'San Francisco, CA', contact: 'contact@innovatesolutions.com' },
  { id: 2, name: 'Digital Emporium', website: 'digitalemporium.com', industry: Industry.ECOMMERCE, location: 'New York, NY', contact: 'sales@digitalemporium.com' },
  { id: 3, name: 'Capital Bridge', website: 'capitalbridge.com', industry: Industry.FINANCE, location: 'Chicago, IL', contact: 'info@capitalbridge.com' },
  { id: 4, name: 'Wellness Forward', website: 'wellnessforward.com', industry: Industry.HEALTHCARE, location: 'Austin, TX', contact: 'support@wellnessforward.com' },
  { id: 5, name: 'The Modern Shopper', website: 'modernshopper.com', industry: Industry.RETAIL, location: 'Los Angeles, CA', contact: 'help@modernshopper.com' },
  { id: 6, name: 'Quantum Computing Inc.', website: 'quantum.ai', industry: Industry.TECH, location: 'Boston, MA', contact: 'press@quantum.ai' },
  { id: 7, name: 'Global Cart', website: 'globalcart.co', industry: Industry.ECOMMERCE, location: 'Miami, FL', contact: 'biz@globalcart.co' },
  { id: 8, name: 'NextGen Banking', website: 'nextgenbank.io', industry: Industry.FINANCE, location: 'New York, NY', contact: 'partners@nextgenbank.io' },
  { id: 9, name: 'HealthSphere', website: 'healthsphere.app', industry: Industry.HEALTHCARE, location: 'Seattle, WA', contact: 'contact@healthsphere.app' },
  { id: 10, name: 'Urban Outfitters Co', website: 'urbanoutfitters.com', industry: Industry.RETAIL, location: 'Philadelphia, PA', contact: 'investors@urbanoutfitters.com' },
  { id: 11, name: 'CineStream', website: 'cinestream.tv', industry: Industry.MEDIA, location: 'Hollywood, CA', contact: 'partners@cinestream.tv' },
  { id: 12, name: 'StayWell Hotels', website: 'staywellhotels.com', industry: Industry.HOSPITALITY, location: 'Las Vegas, NV', contact: 'bookings@staywellhotels.com' },
  { id: 13, name: 'Forge Industrial', website: 'forgeindustrial.com', industry: Industry.MANUFACTURING, location: 'Detroit, MI', contact: 'sales@forgeindustrial.com' },
  { id: 14, 'name': 'Homestead Realty', 'website': 'homestead.re', 'industry': Industry.REAL_ESTATE, 'location': 'Denver, CO', 'contact': 'agents@homestead.re' }
];

export const useMockCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  return { companies, setCompanies };
};
