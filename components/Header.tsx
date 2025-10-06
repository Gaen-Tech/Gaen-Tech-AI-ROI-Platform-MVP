
import React from 'react';
import { View } from '../types';

interface HeaderProps {
  currentView: View;
  isDemoMode: boolean;
}

const viewTitles: Record<View, string> = {
  dashboard: 'Dashboard Overview',
  discovery: 'Company Discovery',
  leads: 'Lead Management',
};

export const Header: React.FC<HeaderProps> = ({ currentView, isDemoMode }) => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 px-6 py-4 flex items-center">
      <h1 className="text-2xl font-semibold text-white capitalize">{viewTitles[currentView]}</h1>
      {isDemoMode && (
        <span className="ml-4 bg-yellow-500/20 text-yellow-300 text-xs font-medium px-3 py-1 rounded-full border border-yellow-500/50">
          Demo Mode
        </span>
      )}
    </header>
  );
};