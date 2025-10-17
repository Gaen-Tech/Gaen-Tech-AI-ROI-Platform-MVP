import React, { useState } from 'react';
import type { Lead, View } from '../types';
import { getAllConfigs, getActiveConfig, setActiveConfig } from '../config/industryConfigs';

interface DashboardProps {
  leads: Lead[];
  setView: (view: View) => void;
  onAnalyzeRequest: (url: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ leads, setView, onAnalyzeRequest }) => {
  const [activeConfigId, setActiveConfigId] = useState<string>(() => getActiveConfig().id);
  const [urlInput, setUrlInput] = useState('');
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

  const handleAnalyzeClick = () => {
    if (urlInput.trim()) {
      onAnalyzeRequest(urlInput.trim());
    } else {
      setView('discovery');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAnalyzeClick();
    }
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="text-center mb-16 relative">
        <div className="glow-effect" style={{ top: '-100px', left: '50%', transform: 'translateX(-50%)' }}></div>
        <h1 className="text-4xl md:text-6xl font-bold text-text-light dark:text-white leading-tight">
            Uncover Hidden<br/>Revenue Opportunities
        </h1>
        <p className="mt-4 text-lg text-muted-light dark:text-muted-dark max-w-2xl mx-auto">
            Our AI analyzes any company website to reveal tailored sales insights and predict ROI, turning cold outreach into warm opportunities.
        </p>
      </header>

      <section className="mb-16">
        <div className="relative rounded-2xl p-8 md:p-12 overflow-hidden bg-card-light dark:bg-card-dark/50 backdrop-blur-sm border border-white/10 shadow-lg">
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 z-10">
            <div className="md:w-2/3">
              <h2 className="text-3xl font-bold text-text-light dark:text-white">Start Your Analysis</h2>
              <p className="mt-2 text-muted-light dark:text-muted-dark">Enter a company website and let our AI do the heavy lifting.</p>
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                  <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark">public</span>
                  <input 
                    className="w-full bg-background-light dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-light dark:text-text-dark" 
                    placeholder="Enter company website URL" 
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>
                <button 
                  onClick={handleAnalyzeClick}
                  className="bg-primary text-white font-semibold py-3 px-6 rounded-lg shadow-lg shadow-primary/50 hover:bg-primary-700 transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105"
                >
                  <span className="material-symbols-outlined">rocket_launch</span>
                  <span>Analyze Now</span>
                </button>
              </div>
            </div>
            <div className="hidden md:flex justify-center items-center">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse"></div>
                <div className="absolute inset-4 bg-primary/30 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                <span className="material-symbols-outlined text-white text-7xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">insights</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-card-light/80 dark:bg-card-dark/50 backdrop-blur-sm border border-white/10 p-6 rounded-xl shadow-md flex items-center gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full"><span className="material-icons text-blue-500">people</span></div>
            <div><p className="text-sm text-muted-light dark:text-muted-dark">LEADS ANALYZED</p><p className="text-2xl font-bold dark:text-white">{totalLeads}</p></div>
        </div>
        <div className="bg-card-light/80 dark:bg-card-dark/50 backdrop-blur-sm border border-white/10 p-6 rounded-xl shadow-md flex items-center gap-4">
            <div className="bg-primary-100 dark:bg-primary-900/50 p-3 rounded-full"><span className="material-icons text-primary">track_changes</span></div>
            <div><p className="text-sm text-muted-light dark:text-muted-dark">QUALIFIED</p><p className="text-2xl font-bold dark:text-white">{qualifiedLeads}</p></div>
        </div>
        <div className="bg-card-light/80 dark:bg-card-dark/50 backdrop-blur-sm border border-white/10 p-6 rounded-xl shadow-md flex items-center gap-4">
            <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full"><span className="material-icons text-green-500">attach_money</span></div>
            <div><p className="text-sm text-muted-light dark:text-muted-dark">PIPELINE</p><p className="text-2xl font-bold dark:text-white">${totalROI.toLocaleString()}</p></div>
        </div>
        <div className="bg-card-light/80 dark:bg-card-dark/50 backdrop-blur-sm border border-white/10 p-6 rounded-xl shadow-md flex items-center gap-4">
            <div className="bg-yellow-100 dark:bg-yellow-900/50 p-3 rounded-full"><span className="material-icons text-yellow-500">leaderboard</span></div>
            <div><p className="text-sm text-muted-light dark:text-muted-dark">AVG SCORE</p><p className="text-2xl font-bold dark:text-white">{avgOpportunityScore}/100</p></div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card-light/80 dark:bg-card-dark/50 backdrop-blur-sm border border-white/10 p-8 rounded-2xl shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold dark:text-white">Recent Discoveries</h3>
            <a onClick={() => setView('leads')} className="text-sm text-primary font-medium hover:underline flex items-center gap-1 cursor-pointer">View All <span className="material-icons text-sm">arrow_forward</span></a>
          </div>
          {recentLeads.length === 0 ? (
            <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <span className="material-symbols-outlined text-4xl text-muted-light dark:text-muted-dark">flare</span>
                </div>
                <h4 className="text-lg font-semibold dark:text-white">Your lab is empty</h4>
                <p className="text-muted-light dark:text-muted-dark mt-2">Start an analysis to discover new opportunities.</p>
            </div>
           ) : (
            <div className="space-y-4">
              {recentLeads.map(lead => (
                <div key={lead.id} onClick={() => setView('leads')} className="p-4 bg-background-light dark:bg-background-dark/50 rounded-lg border border-gray-200 dark:border-gray-700/50 hover:border-primary/50 transition cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-text-light dark:text-white">{lead.company.name}</h4>
                      <p className="text-sm text-muted-light dark:text-muted-dark">{lead.company.website}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-primary">${lead.analysis.estimatedAnnualROI.toLocaleString()}</p>
                      <p className="text-xs text-muted-light dark:text-muted-dark">Score: {lead.analysis.opportunityScore}/100</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
           )}
        </div>
        <div className="space-y-8">
          <div className="bg-card-light/80 dark:bg-card-dark/50 backdrop-blur-sm border border-white/10 p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Analysis Persona</h3>
            <div>
              <label className="block text-sm font-medium text-muted-light dark:text-muted-dark mb-1" htmlFor="persona">Active Persona</label>
              <select 
                id="persona" 
                name="persona"
                value={activeConfigId}
                onChange={handleConfigChange}
                className="w-full bg-background-light dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm text-text-light dark:text-text-dark"
              >
                 {allConfigs.map(config => (
                    <option key={config.id} value={config.id}>{config.name}</option>
                  ))}
              </select>
              <p className="text-xs text-muted-light dark:text-muted-dark mt-2">{activeConfig.description}</p>
            </div>
          </div>
          <div className="bg-card-light/80 dark:bg-card-dark/50 backdrop-blur-sm border border-white/10 p-6 rounded-2xl shadow-md flex items-start gap-4">
            <div className="bg-cyan-100 dark:bg-cyan-900/50 p-3 rounded-full"><span className="material-icons text-cyan-500">bolt</span></div>
            <div><h4 className="font-semibold dark:text-white">60x Faster</h4><p className="text-sm text-muted-light dark:text-muted-dark">Reduce research from hours to minutes.</p></div>
          </div>
          <div className="bg-card-light/80 dark:bg-card-dark/50 backdrop-blur-sm border border-white/10 p-6 rounded-2xl shadow-md flex items-start gap-4">
            <div className="bg-primary-100 dark:bg-primary-900/50 p-3 rounded-full"><span className="material-symbols-outlined text-primary">psychology</span></div>
            <div><h4 className="font-semibold dark:text-white">Data-Driven Insights</h4><p className="text-sm text-muted-light dark:text-muted-dark">Proposals based on public web data.</p></div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
