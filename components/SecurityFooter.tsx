import React from 'react';
import { View } from '../types';
import { ShieldIcon, LockIcon, DatabaseIcon, SparklesIcon, ExternalLinkIcon } from './icons/Icon';

interface SecurityFooterProps {
  setView: (view: View) => void;
}

const SecurityFooter: React.FC<SecurityFooterProps> = ({ setView }) => {
  const currentYear = new Date().getFullYear();

  const handleNav = (e: React.MouseEvent, view: View) => {
    e.preventDefault();
    setView(view);
  };

  return (
    <footer className="bg-slate-900 text-white">
      {/* Security Badges Section */}
      <div className="border-t border-b border-slate-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Secure & Private */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center">
                  <ShieldIcon className="w-8 h-8 text-cyan-400" />
                </div>
              </div>
              <h3 className="font-semibold text-white mb-2 text-lg">Secure & Private</h3>
              <p className="text-sm text-gray-400">
                Client-side processing ensures your data stays private
              </p>
            </div>
            
            {/* No AI Training */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center">
                  <LockIcon className="w-8 h-8 text-purple-400" />
                </div>
              </div>
              <h3 className="font-semibold text-white mb-2 text-lg">No AI Training</h3>
              <p className="text-sm text-gray-400">
                Your data is never used to train AI models
              </p>
            </div>
            
            {/* No Server Storage */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-pink-500/10 rounded-full flex items-center justify-center">
                  <DatabaseIcon className="w-8 h-8 text-pink-400" />
                </div>
              </div>
              <h3 className="font-semibold text-white mb-2 text-lg">No Server Storage</h3>
              <p className="text-sm text-gray-400">
                All analysis data stays in your browser
              </p>
            </div>
            
            {/* AI-Powered */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center">
                  <SparklesIcon className="w-8 h-8 text-orange-400" />
                </div>
              </div>
              <h3 className="font-semibold text-white mb-2 text-lg">AI-Powered Analysis</h3>
              <p className="text-sm text-gray-400">
                Leveraging advanced AI for insights
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-1">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                   <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-3">
                  <h3 className="text-white font-bold text-lg">Gaen Technologies</h3>
                  <p className="text-cyan-400 text-sm">Simplify Life</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered sales intelligence platform transforming how professionals research, 
                qualify, and engage with prospects.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" onClick={(e) => handleNav(e, 'dashboard')} className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#" onClick={(e) => handleNav(e, 'discovery')} className="text-gray-400 hover:text-white transition-colors">Discovery</a></li>
                <li><a href="#" onClick={(e) => handleNav(e, 'leads')} className="text-gray-400 hover:text-white transition-colors">Leads</a></li>
                <li><a href="#" onClick={(e) => handleNav(e, 'configuration')} className="text-gray-400 hover:text-white transition-colors">Configuration</a></li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" onClick={(e) => handleNav(e, 'privacy')} className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" onClick={(e) => handleNav(e, 'terms')} className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" onClick={(e) => handleNav(e, 'privacy')} className="text-gray-400 hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="mailto:info@gaentechnologies.com" className="text-gray-400 hover:text-white transition-colors">info@gaentechnologies.com</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <div className="mb-4 md:mb-0">
              <p>&copy; {currentYear} Gaen Technologies. All rights reserved.</p>
            </div>
            <p className="text-xs">AI ROI Generation Platform</p>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-900/50 py-3 text-center">
        <p className="text-cyan-400 font-mono text-sm">#FutureIsSimple</p>
      </div>
    </footer>
  );
};

export default SecurityFooter;