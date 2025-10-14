import React from 'react';
import { View } from '../types';

interface SecurityFooterProps {
  setView: (view: View) => void;
}

const SecurityFooter: React.FC<SecurityFooterProps> = ({ setView }) => {
  return (
    <footer className="bg-slate-800/50 backdrop-blur-sm border-t border-slate-700/50 text-gray-400 text-sm">
      <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center">
        <p className="mb-2 sm:mb-0">&copy; {new Date().getFullYear()} Gaen Technologies</p>
        <div className="flex gap-4">
          <a href="#" onClick={(e) => { e.preventDefault(); setView('privacy'); }} className="hover:text-white transition">Privacy Policy</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setView('terms'); }} className="hover:text-white transition">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default SecurityFooter;
