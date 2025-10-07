
import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Discovery } from './components/Discovery';
import { Leads } from './components/Leads';
import { View, Lead, Company, AnalysisResult } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  
  const refreshCompanies = useCallback(() => {
    // This action now clears the manually discovered companies list if needed.
    setCompanies([]);
  }, []);
  
  const addLead = useCallback((company: Company, analysis: AnalysisResult) => {
    const newLead: Lead = {
      ...company,
      ...analysis,
      status: 'Prospected'
    };
    
    setLeads(prevLeads => {
      // Avoid duplicates based on website
      if(prevLeads.some(l => l.website === newLead.website)) {
        alert("A lead for this website already exists.");
        return prevLeads;
      };
      return [newLead, ...prevLeads];
    });
   
    setView('leads');
  }, []);

  const updateLeadStatus = useCallback((leadId: number, status: Lead['status']) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === leadId ? { ...lead, status } : lead
      )
    );
  }, []);

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard leads={leads} />;
      case 'discovery':
        return <Discovery companies={companies} onAnalyzeComplete={addLead} onRefresh={refreshCompanies} />;
      case 'leads':
        return <Leads leads={leads} onUpdateStatus={updateLeadStatus} />;
      default:
        return <Dashboard leads={leads} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans">
      <Sidebar currentView={view} setView={setView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentView={view} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-6 md:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
