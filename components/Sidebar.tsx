import React, { useState } from 'react';
import { View } from '../types';
import { DashboardIcon, SearchIcon, LeadsIcon, MenuIcon, XIcon, SparklesIcon, SettingsIcon } from './icons/Icon';

interface NavigationProps {
  currentView: View;
  setView: (view: View) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <a
    href="#"
    onClick={(e) => { e.preventDefault(); onClick(); }}
    className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative ${
      isActive
        ? 'text-white'
        : 'text-gray-400 hover:bg-slate-700/50 hover:text-white'
    }`}
  >
    {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/50 to-purple-600/50 rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
    )}
    <div className={`absolute inset-0 bg-slate-800/50 rounded-lg group-hover:bg-slate-700/50 transition-colors duration-200 ${isActive ? 'bg-gradient-to-r from-cyan-500/30 to-purple-600/30 ring-1 ring-inset ring-white/10' : ''}`}></div>
    <div className="relative flex items-center">
        {icon}
        <span className="ml-3">{label}</span>
    </div>
  </a>
);


export const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { view: 'dashboard', label: 'Dashboard', icon: <DashboardIcon className="w-5 h-5" /> },
        { view: 'discovery', label: 'Discovery', icon: <SearchIcon className="w-5 h-5" /> },
        { view: 'leads', label: 'Leads', icon: <LeadsIcon className="w-5 h-5" /> },
        { view: 'configuration', label: 'Configuration', icon: <SettingsIcon className="w-5 h-5" /> },
    ];

    const handleNavClick = (view: View) => {
        setView(view);
        setIsMobileMenuOpen(false);
    }
    
    const navContent = (
        <div className="flex flex-col h-full p-4 bg-slate-800/50">
            <div className="flex items-center mb-8 shrink-0 px-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
                    <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold ml-3 text-white">Gaen Tech</h1>
            </div>
            <nav className="flex flex-col space-y-2">
                {navItems.map(item => (
                    <NavItem
                        key={item.view}
                        icon={item.icon}
                        label={item.label}
                        isActive={currentView === item.view}
                        onClick={() => handleNavClick(item.view as View)}
                    />
                ))}
            </nav>
            <div className="mt-auto text-center text-xs text-gray-500">
                <p>AI ROI Generation Platform</p>
                <p>&copy; {new Date().getFullYear()} Gaen Tech</p>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 backdrop-blur-xl border-r border-slate-700/50 shrink-0">
                {navContent}
            </aside>

            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between p-4 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-40">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center">
                        <SparklesIcon className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-lg font-semibold text-white">Gaen Tech</h1>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-300 hover:text-white" aria-label="Open menu">
                    <MenuIcon className="w-6 h-6"/>
                </button>
            </header>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md animate-fade-in" onClick={() => setIsMobileMenuOpen(false)}></div>
                    <aside className="relative flex flex-col w-64 h-full border-r border-slate-700 animate-slide-up">
                        <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white z-10" aria-label="Close menu">
                            <XIcon className="w-6 h-6" />
                        </button>
                        {navContent}
                    </aside>
                </div>
            )}
        </>
    );
};