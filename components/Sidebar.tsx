
import React from 'react';
import { View } from '../types';
import { DashboardIcon, SearchIcon, LeadsIcon } from './icons/Icon';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-brand-primary text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  return (
    <div className="flex flex-col w-64 bg-gray-800 border-r border-gray-700 p-4">
      <div className="flex items-center mb-8">
        <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center font-bold text-xl text-white">
          G
        </div>
        <h1 className="text-xl font-bold ml-3">Gaen Tech</h1>
      </div>
      <nav className="flex flex-col space-y-2">
        <NavItem
          icon={<DashboardIcon className="w-5 h-5" />}
          label="Dashboard"
          isActive={currentView === 'dashboard'}
          onClick={() => setView('dashboard')}
        />
        <NavItem
          icon={<SearchIcon className="w-5 h-5" />}
          label="Discovery"
          isActive={currentView === 'discovery'}
          onClick={() => setView('discovery')}
        />
        <NavItem
          icon={<LeadsIcon className="w-5 h-5" />}
          label="Leads"
          isActive={currentView === 'leads'}
          onClick={() => setView('leads')}
        />
      </nav>
      <div className="mt-auto text-center text-xs text-gray-600">
        <p>AI ROI Generation Platform</p>
        <p>&copy; {new Date().getFullYear()} Gaen Tech</p>
      </div>
    </div>
  );
};
