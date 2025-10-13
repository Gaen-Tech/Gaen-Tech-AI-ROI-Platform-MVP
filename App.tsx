import React, { useState, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import { Discovery } from './components/Discovery';
import Leads from './components/Leads';
import { Navigation } from './components/Sidebar';
import { View, Lead } from './types';
import { IndustryConfigPage } from './components/IndustryConfig';

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [leads, setLeads] = useState<Lead[]>([]);
  
  const addLead = useCallback((newLead: Lead) => {
    let leadExists = false;
    setLeads(prevLeads => {
      if(prevLeads.some(l => l.company.website === newLead.company.website)) {
        console.warn("A lead for this website already exists.");
        leadExists = true;
        return prevLeads;
      };
      return [newLead, ...prevLeads];
    });
   
    if (!leadExists) {
      setView('leads');
    }
  }, []);

  const updateLead = useCallback((leadId: string, updates: Partial<Lead>) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === leadId ? { ...lead, ...updates } : lead
      )
    );
  }, []);

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard leads={leads} setView={setView} />;
      case 'discovery':
        return <Discovery onAnalyzeComplete={addLead} setView={setView} />;
      case 'leads':
        return <Leads leads={leads} onUpdateLead={updateLead} setView={setView} />;
      case 'configuration':
        return <IndustryConfigPage setView={setView} />;
      default:
        return <Dashboard leads={leads} setView={setView} />;
    }
  };

  return (
    <div className="relative min-h-screen md:flex bg-slate-900 text-gray-100 font-sans">
      <Navigation currentView={view} setView={setView} />
      <main className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-y-auto">
              {renderView()}
          </div>
      </main>
    </div>
  );
};

export default App;