import React, { useState } from 'react';
import { 
  SparklesIcon, 
  SearchIcon,
  FilterIcon,
  DownloadIcon,
  TrendingUpIcon,
  TargetIcon,
  BarChart3Icon,
  DollarSignIcon,
  ClockIcon,
  ExternalLinkIcon,
  ChevronDownIcon,
  FileTextIcon
} from './icons/Icon';
import type { Lead, View, LeadStatus } from '../types';
import { generateProposal } from '../services/proposalService';
import LeadDetailModal from './LeadDetailModal';

interface LeadsProps {
  leads: Lead[];
  onUpdateLead: (id: string, updates: Partial<Lead>) => void;
  setView: (view: View) => void;
}

const Leads: React.FC<LeadsProps> = ({ leads, onUpdateLead, setView }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | LeadStatus>('all');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'roi'>('date');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const filteredLeads = leads
    .filter(lead => {
      const matchesSearch = lead.company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lead.company.website.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.analysis.opportunityScore - a.analysis.opportunityScore;
        case 'roi':
          return b.analysis.estimatedAnnualROI - a.analysis.estimatedAnnualROI;
        case 'date':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const handleExportPDF = (lead: Lead) => {
    try {
      generateProposal(lead);
    } catch (error) {
      console.error('Failed to generate proposal:', error);
    }
  };

  const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
    onUpdateLead(leadId, { status: newStatus });
  };

  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead);
  };

  const handleCloseModal = () => {
    setSelectedLead(null);
  };

  const totalROI = filteredLeads.reduce((sum, lead) => 
    sum + (lead.analysis.estimatedAnnualROI || 0), 0
  );
  const avgScore = filteredLeads.length > 0
    ? Math.round(filteredLeads.reduce((sum, lead) => sum + lead.analysis.opportunityScore, 0) / filteredLeads.length)
    : 0;

    const statusStyles: Record<LeadStatus, string> = {
        'qualified': 'bg-green-500/20 text-green-400 border-green-500/50 hover:bg-green-500/30',
        'prospected': 'bg-blue-500/20 text-blue-400 border-blue-500/50 hover:bg-blue-500/30',
        'Unqualified': 'bg-slate-600/20 text-slate-400 border-slate-600/50 hover:bg-slate-600/30',
    };
    
  return (
    <div className="relative text-gray-100">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 border border-cyan-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 border border-purple-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 border border-pink-400 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Lead Qualification</h2>
          <p className="text-xl text-gray-300">Manage and qualify your AI-discovered opportunities</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6"><div className="flex items-center justify-between mb-2"><TargetIcon className="w-8 h-8 text-cyan-400" /><span className="text-xs text-gray-400 uppercase tracking-wider">Showing</span></div><div className="text-3xl font-bold text-white">{filteredLeads.length}</div><p className="text-sm text-gray-400">Total Leads</p></div>
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6"><div className="flex items-center justify-between mb-2"><BarChart3Icon className="w-8 h-8 text-purple-400" /><span className="text-xs text-gray-400 uppercase tracking-wider">Average</span></div><div className="text-3xl font-bold text-white">{avgScore}/100</div><p className="text-sm text-gray-400">Opportunity Score</p></div>
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6"><div className="flex items-center justify-between mb-2"><DollarSignIcon className="w-8 h-8 text-pink-400" /><span className="text-xs text-gray-400 uppercase tracking-wider">Pipeline</span></div><div className="text-3xl font-bold text-white">${(totalROI / 1000).toFixed(0)}K</div><p className="text-sm text-gray-400">Total ROI Potential</p></div>
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6"><div className="flex items-center justify-between mb-2"><TrendingUpIcon className="w-8 h-8 text-orange-400" /><span className="text-xs text-gray-400 uppercase tracking-wider">Qualified</span></div><div className="text-3xl font-bold text-white">{leads.filter(l => l.status === 'qualified').length}</div><p className="text-sm text-gray-400">High Priority</p></div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="text" placeholder="Search by company name or website..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" />
            </div>
            <div className="relative">
              <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="pl-10 pr-10 py-3 bg-slate-900/80 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer transition">
                <option value="all">All Status</option>
                <option value="prospected">Prospected</option>
                <option value="qualified">Qualified</option>
                <option value="Unqualified">Unqualified</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
            <div className="relative">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="pl-4 pr-10 py-3 bg-slate-900/80 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer transition">
                <option value="date">Latest First</option>
                <option value="score">Highest Score</option>
                <option value="roi">Highest ROI</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>
        </div>

        {filteredLeads.length === 0 ? (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-12 text-center">
            <TargetIcon className="w-20 h-20 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">{searchQuery || statusFilter !== 'all' ? 'No leads match your filters' : 'No leads yet'}</h3>
            <p className="text-gray-400 mb-6">{searchQuery || statusFilter !== 'all' ? 'Try adjusting your search or filter criteria' : 'Start by analyzing your first company'}</p>
            {!searchQuery && statusFilter === 'all' && (
              <button onClick={() => setView('discovery')} className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition inline-flex items-center gap-2"><SparklesIcon className="w-5 h-5" />Discover First Lead</button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6 hover:border-purple-500/50 transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1"><h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-400 transition">{lead.company.name}</h3>
                    <a href={`https://${lead.company.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-cyan-400 transition flex items-center gap-1" onClick={(e) => e.stopPropagation()}>{lead.company.website}<ExternalLinkIcon className="w-3 h-3" /></a>
                  </div>
                  <div className="relative">
                    <select value={lead.status} onChange={(e) => handleStatusChange(lead.id, e.target.value as any)} onClick={(e) => e.stopPropagation()} className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer border-2 appearance-none pr-6 transition capitalize ${statusStyles[lead.status]}`}>
                      <option value="prospected">Prospected</option>
                      <option value="qualified">Qualified</option>
                      <option value="Unqualified">Unqualified</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-gray-400"><BarChart3Icon className="w-4 h-4 text-cyan-400" /><span className="text-sm">Opportunity Score</span></div><div className="flex items-center gap-2"><div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full" style={{ width: `${lead.analysis.opportunityScore}%` }}></div></div><span className="text-sm font-bold text-white">{lead.analysis.opportunityScore}</span></div></div>
                  <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-gray-400"><DollarSignIcon className="w-4 h-4 text-green-400" /><span className="text-sm">Annual ROI</span></div><span className="text-sm font-bold text-white">${(lead.analysis.estimatedAnnualROI / 1000).toFixed(0)}K</span></div>
                  <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-gray-400"><TargetIcon className="w-4 h-4 text-purple-400" /><span className="text-sm">Opportunities</span></div><span className="text-sm font-bold text-white">{lead.analysis.keyOpportunities.length}</span></div>
                  <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-gray-400"><ClockIcon className="w-4 h-4 text-orange-400" /><span className="text-sm">Analyzed</span></div><span className="text-sm font-bold text-white">{new Date(lead.createdAt).toLocaleDateString()}</span></div>
                </div>
                {lead.analysis.keyOpportunities.length > 0 && (<div className="mb-4 p-3 bg-slate-900/50 rounded-lg border border-slate-700"><p className="text-xs text-gray-400 mb-1">Top Opportunity:</p><p className="text-sm text-white font-semibold line-clamp-2">{lead.analysis.keyOpportunities[0].opportunity}</p></div>)}
                <div className="flex gap-2">
                  <button onClick={() => handleExportPDF(lead)} className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition flex items-center justify-center gap-2" disabled={lead.status === 'Unqualified'}><DownloadIcon className="w-4 h-4" />Export PDF</button>
                  <button className="px-4 py-2 bg-slate-700/50 text-gray-300 font-semibold rounded-lg hover:bg-slate-700 transition flex items-center justify-center gap-2" onClick={() => handleViewDetails(lead)}><FileTextIcon className="w-4 h-4" />Details</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="relative z-10 text-center py-8 mt-8">
        <p className="text-gray-500 text-sm">#FutureIsSimple • www.gaentechnologies.com</p>
      </div>

      <LeadDetailModal lead={selectedLead} onClose={handleCloseModal} />
    </div>
  );
};

export default Leads;