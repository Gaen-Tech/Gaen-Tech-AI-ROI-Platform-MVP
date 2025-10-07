
import { useState, useCallback } from 'react';
import { Company, Industry } from '../types';

// A larger, geo-targeted pool of potential companies
// FIX: Removed 'id' property from all company objects to match the 'Company' type definition.
const allCompanies: Company[] = [
  // New York City & Environs
  { name: 'Innovate Solutions', website: 'innovatesolutions.com', industry: Industry.TECH, location: 'New York, NY', contact: 'contact@innovatesolutions.com' },
  { name: 'Digital Emporium', website: 'digitalemporium.com', industry: Industry.ECOMMERCE, location: 'Brooklyn, NY', contact: 'sales@digitalemporium.com' },
  { name: 'Capital Bridge', website: 'capitalbridge.com', industry: Industry.FINANCE, location: 'New York, NY', contact: 'info@capitalbridge.com' },
  { name: 'Global Cart', website: 'globalcart.co', industry: Industry.ECOMMERCE, location: 'Jersey City, NJ', contact: 'biz@globalcart.co' },
  { name: 'NextGen Banking', website: 'nextgenbank.io', industry: Industry.FINANCE, location: 'New York, NY', contact: 'partners@nextgenbank.io' },
  { name: 'CineStream', website: 'cinestream.tv', industry: Industry.MEDIA, location: 'New York, NY', contact: 'partners@cinestream.tv' },
  { name: 'Metro Health AI', website: 'metrohealth.ai', industry: Industry.HEALTHCARE, location: 'New York, NY', contact: 'info@metrohealth.ai' },
  { name: 'Gotham Goods', website: 'gothamgoods.com', industry: Industry.RETAIL, location: 'Brooklyn, NY', contact: 'support@gothamgoods.com' },
  { name: 'Stamford Techies', website: 'stamfordtech.io', industry: Industry.TECH, location: 'Stamford, CT', contact: 'hello@stamfordtech.io' },

  // New Jersey
  { name: 'Garden State Analytics', website: 'gsanalytics.com', industry: Industry.TECH, location: 'Newark, NJ', contact: 'contact@gsanalytics.com' },
  { name: 'Jersey Shore E-tail', website: 'jerseyshoretail.com', industry: Industry.ECOMMERCE, location: 'Asbury Park, NJ', contact: 'sales@jerseyshoretail.com' },
  { name: 'Princeton Pharma', website: 'princetonpharma.dev', industry: Industry.HEALTHCARE, location: 'Princeton, NJ', contact: 'dev@princetonpharma.dev' },
  { name: 'Liberty Manufacturing', website: 'libertymanufacturing.com', industry: Industry.MANUFACTURING, location: 'Elizabeth, NJ', contact: 'sales@libertymanufacturing.com' },

  // Philadelphia & Environs
  { name: 'Urban Outfitters Co', website: 'urbanoutfitters.com', industry: Industry.RETAIL, location: 'Philadelphia, PA', contact: 'investors@urbanoutfitters.com' },
  { name: 'Philly Fintech', website: 'phillyfin.tech', industry: Industry.FINANCE, location: 'Philadelphia, PA', contact: 'info@phillyfin.tech' },
  { name: 'Liberty Bell Health', website: 'libertybellhealth.com', industry: Industry.HEALTHCARE, location: 'Philadelphia, PA', contact: 'support@libertybellhealth.com' },
  { name: 'Keystone Logistics', website: 'keystonelogistics.co', industry: Industry.MANUFACTURING, location: 'King of Prussia, PA', contact: 'contact@keystonelogistics.co' },
  { name: 'Brotherly Love Eats', website: 'phillyeats.app', industry: Industry.HOSPITALITY, location: 'Philadelphia, PA', contact: 'partners@phillyeats.app' },

  // Delaware
  { name: 'Wilmington Web Werks', website: 'wilmingtonweb.dev', industry: Industry.TECH, location: 'Wilmington, DE', contact: 'hello@wilmingtonweb.dev' },
  { name: 'First State Financial', website: 'firststate.finance', industry: Industry.FINANCE, location: 'Dover, DE', contact: 'contact@firststate.finance' },
  { name: 'Brandywine Boutique', website: 'brandywine.store', industry: Industry.ECOMMERCE, location: 'Wilmington, DE', contact: 'sales@brandywine.store' }
];

// Fisher-Yates shuffle algorithm
const shuffleArray = (array: Company[]) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
};

const getRandomCompanies = (count = 14): Company[] => {
    const shuffled = shuffleArray([...allCompanies]);
    return shuffled.slice(0, count);
};

export const useMockCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>(() => getRandomCompanies());

  const refreshCompanies = useCallback(() => {
    setCompanies(getRandomCompanies());
  }, []);

  return { companies, setCompanies, refreshCompanies };
};