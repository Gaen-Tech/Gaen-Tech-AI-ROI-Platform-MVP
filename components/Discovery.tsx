
import React, { useState, useMemo } from 'react';
import { Company, Industry, AnalysisResult } from '../types';
import { analyzeCompanyWebsite } from '../services/geminiService';
import { SearchIcon, LoadingSpinner } from './icons/Icon';

interface DiscoveryProps {
    companies: Company[];
    onAnalyzeComplete: (company: Company, analysis: AnalysisResult) => void;
}

export const Discovery: React.FC<DiscoveryProps> = ({ companies, onAnalyzeComplete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [industryFilter, setIndustryFilter] = useState<Industry | 'All'>('All');
    const [analyzingId, setAnalyzingId] = useState<number | null>(null);
    const [url, setUrl] = useState('');
    const [isAnalyzingUrl, setIsAnalyzingUrl] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const filteredCompanies = useMemo(() => {
        return companies.filter(company => {
            const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  company.location.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesIndustry = industryFilter === 'All' || company.industry === industryFilter;
            return matchesSearch && matchesIndustry;
        });
    }, [companies, searchTerm, industryFilter]);

    const handleAnalyze = async (company: Company) => {
        setAnalyzingId(company.id);
        setError(null);
        try {
            const analysisResult = await analyzeCompanyWebsite(company);
            onAnalyzeComplete(company, analysisResult);
        } catch (err) {
            console.error("Analysis failed for company:", company.name, err);
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setAnalyzingId(null);
        }
    };

    const handleUrlAnalyze = async () => {
        if (!url) return;
        let formattedUrl = url.trim();
        if (!formattedUrl.startsWith('http')) {
            formattedUrl = 'https://' + formattedUrl;
        }

        setIsAnalyzingUrl(true);
        setError(null);
        try {
            const hostname = new URL(formattedUrl).hostname.replace('www.', '');
            const tempCompany: Company = {
                id: Date.now(),
                name: hostname.split('.')[0].charAt(0).toUpperCase() + hostname.split('.')[0].slice(1),
                website: hostname,
                industry: Industry.TECH,
                location: 'Online',
                contact: `info@${hostname}`
            };
            const analysisResult = await analyzeCompanyWebsite(tempCompany);
            onAnalyzeComplete(tempCompany, analysisResult);
            setUrl('');
        } catch (err) {
            console.error("URL Analysis failed:", err);
            setError(err instanceof Error ? err.message : "Failed to analyze URL. Please ensure it's a valid and accessible website.");
        } finally {
            setIsAnalyzingUrl(false);
        }
    };
    
    const handleExport = () => {
        const headers = "Company Name,Website,Industry,Location,Contact\n";
        const csvContent = filteredCompanies.map(c => 
            `"${c.name}","${c.website}","${c.industry}","${c.location}","${c.contact}"`
        ).join("\n");
        
        const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "gaen_tech_discovery_export.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Analyze New Company by URL</h3>
                <div className="flex flex-col md:flex-row gap-2">
                    <input
                        type="text"
                        placeholder="Enter website URL (e.g., example.com)"
                        className="flex-grow bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleUrlAnalyze()}
                    />
                    <button
                        onClick={handleUrlAnalyze}
                        disabled={isAnalyzingUrl || analyzingId !== null}
                        className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isAnalyzingUrl ? <LoadingSpinner className="w-5 h-5" /> : 'Analyze URL'}
                    </button>
                </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div className="relative w-full md:w-1/3">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search existing companies..."
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="w-full md:w-auto bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        value={industryFilter}
                        onChange={(e) => setIndustryFilter(e.target.value as Industry | 'All')}
                    >
                        <option value="All">All Industries</option>
                        {Object.values(Industry).map(ind => <option key={ind} value={ind}>{ind}</option>)}
                    </select>
                    <button 
                      onClick={handleExport}
                      className="w-full md:w-auto bg-brand-secondary hover:bg-brand-primary text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                        Export List
                    </button>
                </div>
                {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 text-center">{error}</div>}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-gray-600">
                            <tr>
                                <th className="p-3 text-sm font-semibold">Company Name</th>
                                <th className="p-3 text-sm font-semibold">Website</th>
                                <th className="p-3 text-sm font-semibold">Industry</th>
                                <th className="p-3 text-sm font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCompanies.map(company => (
                                <tr key={company.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                    <td className="p-3">{company.name}</td>
                                    <td className="p-3 text-brand-primary hover:underline"><a href={`http://${company.website}`} target="_blank" rel="noopener noreferrer">{company.website}</a></td>
                                    <td className="p-3">{company.industry}</td>
                                    <td className="p-3 text-center">
                                        <button
                                            onClick={() => handleAnalyze(company)}
                                            disabled={analyzingId !== null || isAnalyzingUrl}
                                            className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center w-36"
                                        >
                                            {analyzingId === company.id ? (
                                                <>
                                                    <LoadingSpinner className="w-5 h-5 mr-2" />
                                                    Analyzing...
                                                </>
                                            ) : (
                                                'Analyze Company'
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredCompanies.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                            <p>No companies found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
