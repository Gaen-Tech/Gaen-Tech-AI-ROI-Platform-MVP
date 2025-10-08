
import React, { useEffect } from 'react';
import { Lead } from '../types';
import { 
    ExternalLinkIcon, 
    BarChart3Icon, 
    DollarSignIcon, 
    ClockIcon, 
    LinkIcon,
    LightbulbIcon,
    ZapIcon
} from './icons/Icon';

interface LeadDetailModalProps {
  lead: Lead | null;
  onClose: () => void;
}

const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ lead, onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!lead) return null;

  return (
    <div 
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl shadow-purple-500/20 relative animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <header className="mb-6 pb-4 border-b border-slate-700">
          <h2 className="text-3xl font-bold text-white mb-1">{lead.company.name}</h2>
          <a 
            href={`https://${lead.company.website}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-cyan-400 hover:text-cyan-300 transition flex items-center gap-1"
          >
            {lead.company.website}
            <ExternalLinkIcon className="w-4 h-4" />
          </a>
        </header>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
            <div className="flex items-center gap-3 text-gray-400 mb-2"><BarChart3Icon className="w-5 h-5 text-cyan-400" /><span>Opportunity Score</span></div>
            <p className="text-3xl font-bold text-white">{lead.analysis.opportunityScore}<span className="text-xl text-gray-400">/100</span></p>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
            <div className="flex items-center gap-3 text-gray-400 mb-2"><DollarSignIcon className="w-5 h-5 text-green-400" /><span>Estimated Annual ROI</span></div>
            <p className="text-3xl font-bold text-white">${(lead.analysis.totals.estimatedAnnualROI / 1000).toFixed(0)}K</p>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
            <div className="flex items-center gap-3 text-gray-400 mb-2"><ClockIcon className="w-5 h-5 text-orange-400" /><span>Analyzed On</span></div>
            <p className="text-3xl font-bold text-white">{new Date(lead.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <section className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Key Opportunities</h3>
          <div className="space-y-4">
            {lead.analysis.keyOpportunities.map((op, index) => (
              <div key={index} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                <h4 className="font-bold text-cyan-400 mb-2">{op.opportunity}</h4>
                <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <div>
                    <strong className="text-gray-400 flex items-center gap-2 mb-1"><ZapIcon className="w-4 h-4" /> Problem:</strong>
                    <p className="text-gray-300 pl-6">{op.problem}</p>
                  </div>
                   <div>
                    <strong className="text-gray-400 flex items-center gap-2 mb-1"><LightbulbIcon className="w-4 h-4" /> Solution:</strong>
                    <p className="text-gray-300 pl-6">{op.solution}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-700 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSignIcon className="w-4 h-4 text-green-400" />
                    <span className="text-gray-400">Impact:</span>
                    <strong className="text-white">${op.estimatedImpact.toLocaleString()}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-orange-400" />
                    <span className="text-gray-400">Timeline:</span>
                    <strong className="text-white">{op.roiTimeline}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {lead.analysis.sources && lead.analysis.sources.length > 0 && (
          <section>
            <h3 className="text-xl font-bold text-white mb-4">Analysis Sources</h3>
            <ul className="space-y-2">
              {lead.analysis.sources.map((source, index) => (
                <li key={index} className="flex items-start gap-2">
                  <LinkIcon className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                  <a 
                    href={source.web.uri} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-cyan-400 hover:underline text-sm truncate"
                    title={source.web.uri}
                  >
                    {source.web.title || source.web.uri}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};

export default LeadDetailModal;
