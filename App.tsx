import React, { useState, useCallback, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import { Discovery } from './components/Discovery';
import Leads from './components/Leads';
import { Navigation } from './components/Sidebar';
import { View, Lead } from './types';
import { IndustryConfigPage } from './components/IndustryConfig';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';
import SecurityFooter from './components/SecurityFooter';
import { CookieConsent } from './components/CookieConsent';

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('gaen-theme');
    // Default to dark theme as per the new design's aesthetic
    return savedTheme || 'dark';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('gaen-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };
  
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
      case 'terms':
        return <TermsOfService setView={setView} />;
      case 'privacy':
        return <PrivacyPolicy setView={setView} />;
      default:
        return <Dashboard leads={leads} setView={setView} />;
    }
  };

  const showNav = view !== 'terms' && view !== 'privacy';

  return (
    <div className="flex flex-col min-h-screen light-gradient-bg dark:main-gradient-bg">
        {showNav && <Navigation currentView={view} setView={setView} theme={theme} toggleTheme={toggleTheme} />}
        <main className="flex-1">
          {renderView()}
        </main>
      {showNav && <SecurityFooter setView={setView} />}
      <CookieConsent setView={setView} />
    </div>
  );
};

export default App;