
import React from 'react';
import { View } from '../types';

interface HeaderProps {
  currentView: View;
}

const viewTitles: Record<View, string> = {
  dashboard: 'Dashboard Overview',
  discovery: 'Company Discovery',
  leads: 'Lead Management',
};

export const Header: React.FC<HeaderProps> = ({ currentView }) => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 px-6 py-4 flex items-center">
      <h1 className="text-2xl font-semibold text-white capitalize">{viewTitles[currentView]}</h1>
    </header>
  );
};
