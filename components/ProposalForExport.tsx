
import React from 'react';
import { Lead } from '../types';
import { 
    ExternalLinkIcon, 
    BarChart3Icon, 
    DollarSignIcon, 
    ClockIcon, 
    LinkIcon,
    LightbulbIcon,
    ZapIcon,
    SparklesIcon
} from './icons/Icon';

interface Props {
  lead: Lead;
  innerRef: React.RefCallback<HTMLDivElement>;
}

export const ProposalForExport: React.FC<Props> = ({ lead, innerRef }) => {
  return (
    <div 
      ref={innerRef}
      className="bg-slate-900 text-gray-100 p-10 font-sans"
      style={{ width: '800px', lineHeight: '1.6' }}
    >
      <header className="flex items-center justify-between mb-8 pb-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
            <SparklesIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Gaen Technologies</h1>
            <p className="text-sm text-cyan-400">Simplify Life</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-lg font-semibold text-white">AI-Powered Proposal</h2>
          <p className="text-sm text-gray-400">Date: {new Date().toLocaleDateString()}</p>
        </div>
      </header>
      
      <main>
        <section className="mb-8">
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
        </section>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <div className="flex items-center gap-3 text-gray-400 mb-2"><BarChart3Icon className="w-5 h-5 text-cyan-400" /><span>Opportunity Score</span></div>
            <p className="text-3xl font-bold text-white">{lead.analysis.opportunityScore}<span className="text-xl text-gray-400">/100</span></p>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <div className="flex items-center gap-3 text-gray-400 mb-2"><DollarSignIcon className="w-5 h-5 text-green-400" /><span>Estimated Annual ROI</span></div>
            {/* FIX: Corrected property access for estimatedAnnualROI based on the AnalysisResult type. */}
            <p className="text-3xl font-bold text-white">${(lead.analysis.estimatedAnnualROI).toLocaleString()}</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <div className="flex items-center gap-3 text-gray-400 mb-2"><ClockIcon className="w-5 h-5 text-orange-400" /><span>Analyzed On</span></div>
            <p className="text-3xl font-bold text-white">{new Date(lead.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <section className="my-8">
          <h3 className="text-2xl font-semibold text-white mb-3 border-b border-slate-700 pb-2">Executive Summary</h3>
          <p className="text-gray-300 mt-3">
            This document outlines the key AI-driven opportunities identified for {lead.company.name}. Our analysis, based on real-time data, indicates a significant potential for growth and operational efficiency. We have identified several high-impact areas where Gaen Technologies' tailored AI solutions can deliver measurable ROI and a distinct competitive advantage.
          </p>
        </section>

        <section className="my-8">
          <h3 className="text-2xl font-semibold text-white mb-4 border-b border-slate-700 pb-2">Key Opportunities</h3>
          <div className="space-y-4">
            {lead.analysis.keyOpportunities.map((op, index) => (
              <div key={index} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                <h4 className="text-lg font-bold text-cyan-400 mb-3">{op.opportunity}</h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
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
                    <span className="text-gray-400">Est. Impact:</span>
                    <strong className="text-white">${op.estimatedImpact.toLocaleString()} / year</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-orange-400" />
                    <span className="text-gray-400">ROI Timeline:</span>
                    <strong className="text-white">{op.roiTimeline}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="my-8">
            <h3 className="text-2xl font-semibold text-white mb-3 border-b border-slate-700 pb-2">Next Steps</h3>
            <p className="text-gray-300 mt-3">
                We are confident that our proposed solutions will deliver significant value to {lead.company.name}. We recommend scheduling a follow-up call to discuss these opportunities in greater detail, answer any questions, and outline a tailored implementation roadmap.
            </p>
        </section>

        {lead.analysis.sources && lead.analysis.sources.length > 0 && (
            <section className="my-8">
                <h3 className="text-2xl font-semibold text-white mb-3 border-b border-slate-700 pb-2">Analysis Sources</h3>
                <p className="text-gray-400 text-sm mb-3">
                    This analysis was grounded in real-time data from the following public web sources:
                </p>
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
      </main>

      <footer className="mt-12 pt-6 border-t border-slate-700 text-center text-xs text-gray-500">
        <p>This proposal is confidential and intended for the exclusive use of {lead.company.name}.</p>
        <p>&copy; {new Date().getFullYear()} Gaen Technologies | www.gaentechnologies.com</p>
      </footer>
    </div>
  );
};