import React, { useState } from 'react';
import {
    SparklesIcon,
    TrendingUpIcon,
    TargetIcon,
    BarChart3Icon,
    LeadsIcon,
    DollarSignIcon,
    ClockIcon,
    ChevronRightIcon,
    LightbulbIcon,
    ZapIcon,
} from './icons/Icon';
// FIX: The IndustryConfig type should be imported from the types file, not the config file.
import type { Lead, View, IndustryConfig } from '../types';
import { getAllConfigs, getActiveConfig, setActiveConfig } from '../config/industryConfigs';

interface DashboardProps {
  leads: Lead[];
  setView: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ leads, setView }) => {
  const [activeConfigId, setActiveConfigId] = useState<string>(() => getActiveConfig().id);
  const allConfigs = getAllConfigs();
  const activeConfig = getActiveConfig();

  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter(lead => lead.status === 'qualified').length;
  const totalROI = leads.reduce((sum, lead) => sum + (lead.analysis.estimatedAnnualROI || 0), 0);
  const avgOpportunityScore = leads.length > 0
    ? Math.round(leads.reduce((sum, lead) => sum + lead.analysis.opportunityScore, 0) / leads.length)
    : 0;

  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const handleConfigChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newConfigId = e.target.value;
    const newConfig = allConfigs.find(c => c.id === newConfigId);
    if (newConfig) {
      setActiveConfig(newConfig);
      setActiveConfigId(newConfigId);
    }
  };


  return (
    <div className="relative text-gray-100">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 border border-cyan-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 border border-purple-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 border border-pink-400 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="text-center mb-12 max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI ROI Platform
            </h2>
            <p className="text-xl text-gray-300 mb-2">
                Transform Sales Intelligence with Data-Driven Insights
            </p>
            <p className="text-gray-400">
                From URL to Revenue in Minutes • Powered by AI Intelligence
            </p>
        </div>
        
        <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-600 rounded-2xl p-8 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Ready to discover your next opportunity?</h3>
                    <p className="text-cyan-100 mb-4">
                    Enter a company website and let AI analyze their ROI potential
                    </p>
                    <button
                    onClick={() => setView('discovery')}
                    className="px-6 py-3 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-100 transition flex items-center gap-2"
                    >
                    <SparklesIcon className="w-5 h-5" />
                    Start AI Analysis
                    <ChevronRightIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="hidden md:block">
                    <LightbulbIcon className="w-32 h-32 text-white opacity-20" />
                </div>
                </div>
            </div>
        </div>

        <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6 hover:border-cyan-500/50 transition">
                    <div className="flex items-center justify-between mb-4"><div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center"><LeadsIcon className="w-6 h-6 text-cyan-400" /></div><span className="text-xs text-gray-400 uppercase tracking-wider">Total</span></div>
                    <div className="text-3xl font-bold text-white mb-1">{totalLeads}</div><p className="text-sm text-gray-400">Leads Analyzed</p>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6 hover:border-purple-500/50 transition">
                    <div className="flex items-center justify-between mb-4"><div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center"><TargetIcon className="w-6 h-6 text-purple-400" /></div><span className="text-xs text-gray-400 uppercase tracking-wider">Qualified</span></div>
                    <div className="text-3xl font-bold text-white mb-1">{qualifiedLeads}</div><p className="text-sm text-gray-400">High Priority Leads</p>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6 hover:border-pink-500/50 transition">
                    <div className="flex items-center justify-between mb-4"><div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center"><DollarSignIcon className="w-6 h-6 text-pink-400" /></div><span className="text-xs text-gray-400 uppercase tracking-wider">Pipeline</span></div>
                    <div className="text-3xl font-bold text-white mb-1">${totalROI.toLocaleString()}</div><p className="text-sm text-gray-400">Estimated Annual ROI</p>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6 hover:border-orange-500/50 transition">
                    <div className="flex items-center justify-between mb-4"><div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center"><BarChart3Icon className="w-6 h-6 text-orange-400" /></div><span className="text-xs text-gray-400 uppercase tracking-wider">Average</span></div>
                    <div className="text-3xl font-bold text-white mb-1">{avgOpportunityScore}/100</div><p className="text-sm text-gray-400">Opportunity Score</p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">Recent Discoveries</h3>
                            <button onClick={() => setView('leads')} className="text-cyan-400 hover:text-cyan-300 transition flex items-center gap-1 text-sm">View All <ChevronRightIcon className="w-4 h-4" /></button>
                        </div>
                        {recentLeads.length === 0 ? (
                            <div className="text-center py-12"><TargetIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" /><h4 className="text-gray-400 font-semibold mb-2">No leads yet</h4><p className="text-gray-500 text-sm mb-6">Start by analyzing your first company</p><button onClick={() => setView('discovery')} className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition">Discover First Lead</button></div>
                        ) : (
                            <div className="space-y-4">
                            {recentLeads.map((lead) => (
                                <div key={lead.id} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-purple-500/50 transition cursor-pointer" onClick={() => setView('leads')}>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2"><h4 className="text-white font-semibold">{lead.company.name}</h4><span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${lead.status === 'qualified' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>{lead.status}</span></div>
                                        <p className="text-gray-400 text-sm mb-2">{lead.company.website}</p>
                                        <div className="flex flex-wrap items-center gap-4 text-sm">
                                            <div className="flex items-center gap-1 text-gray-400"><BarChart3Icon className="w-4 h-4 text-cyan-400" />Score: {lead.analysis.opportunityScore}/100</div>
                                            <div className="flex items-center gap-1 text-gray-400"><DollarSignIcon className="w-4 h-4 text-green-400" />${lead.analysis.estimatedAnnualROI.toLocaleString()} ROI</div>
                                            <div className="flex items-center gap-1 text-gray-400"><ClockIcon className="w-4 h-4 text-purple-400" />{new Date(lead.createdAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <ChevronRightIcon className="w-5 h-5 text-gray-600 mt-1" />
                                </div>
                                </div>
                            ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6">
                      <h3 className="text-xl font-bold text-white mb-4">Analysis Configuration</h3>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="configSelector" className="block text-sm font-medium text-gray-400 mb-1">
                            Active Persona
                          </label>
                          <select
                            id="configSelector"
                            name="configSelector"
                            value={activeConfigId}
                            onChange={handleConfigChange}
                            className="w-full px-3 py-2 bg-slate-900/80 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            {allConfigs.map(config => (
                              <option key={config.id} value={config.id}>{config.name}</option>
                            ))}
                          </select>
                          <p className="text-xs text-gray-500 mt-2">
                            {activeConfig.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6 hover:border-cyan-500/50 transition">
                        <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4"><ZapIcon className="w-6 h-6 text-cyan-400" /></div>
                        <h4 className="text-white font-bold mb-2">60x Faster</h4><p className="text-gray-400 text-sm">Reduce research from hours to under a minute</p>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6 hover:border-purple-500/50 transition">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4"><TargetIcon className="w-6 h-6 text-purple-400" /></div>
                        <h4 className="text-white font-bold mb-2">Data-Driven</h4><p className="text-gray-400 text-sm">Proposals based on public web data</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="relative z-10 text-center py-8">
        <p className="text-gray-500 text-sm">#FutureIsSimple • www.gaentechnologies.com</p>
      </div>
    </div>
  );
};

export default Dashboard;