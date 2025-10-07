import React, { useState, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import { Discovery } from './components/Discovery';
import Leads from './components/Leads';
import { View, Lead, Company, AnalysisResult, LeadStatus } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [leads, setLeads] = useState<Lead[]>([]);
  
  const addLead = useCallback((company: Company, analysis: AnalysisResult) => {
    const newLead: Lead = {
      id: Date.now().toString(),
      company,
      analysis,
      status: 'prospected',
      createdAt: new Date().toISOString(),
    };
    
    setLeads(prevLeads => {
      if(prevLeads.some(l => l.company.website === newLead.company.website)) {
        alert("A lead for this website already exists.");
        return prevLeads;
      };
      return [newLead, ...prevLeads];
    });
   
    setView('leads');
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
      default:
        return <Dashboard leads={leads} setView={setView} />;
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-gray-100 font-sans">
      {renderView()}
    </div>
  );
};

export default App;