
import React, { useState } from 'react';
import { View } from '../types';

interface NavigationProps {
  currentView: View;
  setView: (view: View) => void;
  theme: string;
  toggleTheme: () => void;
}

const NavItem: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => (
  <a
    href="#"
    onClick={(e) => { e.preventDefault(); onClick(); }}
    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'text-white bg-primary-600'
        : 'text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-white'
    }`}
  >
    {label}
  </a>
);

export const Navigation: React.FC<NavigationProps> = ({ currentView, setView, theme, toggleTheme }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { view: 'dashboard', label: 'Dashboard' },
        { view: 'discovery', label: 'Discovery' },
        { view: 'leads', label: 'Leads' },
        { view: 'configuration', label: 'Configuration' },
    ];

    const handleNavClick = (view: View) => {
        setView(view);
        setIsMobileMenuOpen(false);
    }
    
    return (
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-500 text-3xl">auto_awesome</span>
            <span className="text-xl font-bold text-text-light dark:text-white">Gaen Tech</span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2">
                {navItems.map(item => (
                    <NavItem
                        key={item.view}
                        label={item.label}
                        isActive={currentView === item.view}
                        onClick={() => handleNavClick(item.view as View)}
                    />
                ))}
            </div>
            <button 
                onClick={toggleTheme} 
                className="text-muted-light dark:text-muted-dark hover:text-primary-500 dark:hover:text-white transition-colors p-2 rounded-full"
                aria-label="Toggle theme"
            >
                <span className="material-icons">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
             <button 
                onClick={toggleTheme} 
                className="text-muted-light dark:text-muted-dark hover:text-primary-500 dark:hover:text-white transition-colors p-2 rounded-full"
                aria-label="Toggle theme"
            >
                <span className="material-icons">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-muted-light dark:text-muted-dark" aria-label="Open menu">
                <span className="material-icons">{isMobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
            <div className="md:hidden mt-4 bg-card-light dark:bg-card-dark/80 backdrop-blur-sm rounded-lg p-4">
                <nav className="flex flex-col space-y-2">
                    {navItems.map(item => (
                        <a
                            key={item.view}
                            href="#"
                            onClick={(e) => { e.preventDefault(); handleNavClick(item.view as View); }}
                            className={`block px-4 py-2 rounded-md text-base font-medium ${currentView === item.view ? 'bg-primary-500 text-white' : 'text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>
            </div>
        )}
      </nav>
    );
};
