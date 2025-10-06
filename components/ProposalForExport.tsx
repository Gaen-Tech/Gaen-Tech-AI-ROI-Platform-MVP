import React from 'react';
import { Lead } from '../types';

interface Props {
  lead: Lead;
  innerRef: React.Ref<HTMLDivElement>;
}

export const ProposalForExport: React.FC<Props> = ({ lead, innerRef }) => {
  return (
    <div 
      ref={innerRef}
      className="bg-gray-800 text-gray-100 p-10 font-sans"
      style={{ width: '800px', lineHeight: '1.6' }} // A fixed width helps with consistent PDF layout
    >
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white">Gaen Technologies</h1>
        <p className="text-lg text-brand-primary">Simplify Life</p>
      </header>

      {/* Main Content */}
      <main>
        <h2 className="text-3xl font-bold text-white mb-4 border-b-2 border-brand-primary pb-2">
          Digital Transformation Proposal for {lead.name}
        </h2>
        
        <section className="my-8">
          <h3 className="text-2xl font-semibold text-white mb-3">Executive Summary</h3>
          <p className="text-gray-300">
            Our comprehensive analysis reveals an exceptional opportunity for {lead.name}, scoring {lead.aiOpportunityScore}/100, with a potential to unlock over <span className="text-green-400 font-bold">${lead.estimatedRoi.toLocaleString()} in annual ROI</span>. Gaen Tech is poised to deliver a significant, tangible transformation for your business by leveraging cutting-edge AI solutions that directly impact your bottom line and strategic growth.
          </p>
        </section>

        <section className="my-8">
          <h3 className="text-2xl font-semibold text-white mb-3">The Opportunity Gap</h3>
          <p className="text-gray-300">
             {lead.name} holds a strong market presence, yet our insights indicate substantial, untapped digital revenue streams and efficiency gains. Generic approaches and manual processes are leaving significant value on the table. Gaen Tech's tailored AI solutions are designed to bridge this gap, converting latent potential into measurable financial success.
          </p>
        </section>

        <section className="my-8">
          <h3 className="text-2xl font-semibold text-white mb-3">Proposed AI-Powered Solutions</h3>
          <p className="text-gray-300 mb-4">
              Gaen Tech will implement strategic AI initiatives designed to address your most critical business challenges and capitalize on high-impact opportunities:
          </p>
          <ul className="space-y-4 list-disc list-inside text-gray-300">
              {lead.keyOpportunities.map((op, index) => (
                  <li key={index} className="pl-2">
                      <strong className="text-brand-primary">{op.opportunity}:</strong> {op.solution} This initiative is projected to deliver an estimated annual impact of <span className="text-green-400 font-bold">${op.estimatedImpact.toLocaleString()}</span> with an ROI timeline of <span className="font-semibold text-yellow-300">{op.roiTimeline}</span>.
                  </li>
              ))}
          </ul>
        </section>

        <section className="my-8">
            <h3 className="text-2xl font-semibold text-white mb-3">Projected Impact</h3>
            <p className="text-gray-300">
                Based on our analysis, these solutions are projected to deliver a <span className="font-bold text-white">Total Estimated Annual ROI of ${lead.estimatedRoi.toLocaleString()}</span>. Our clients typically see a payback period on their investment within approximately {lead.keyOpportunities[0]?.roiTimeline || 'a few months'}, demonstrating the rapid value creation our solutions deliver.
            </p>
        </section>

         <section className="my-8">
            <h3 className="text-2xl font-semibold text-white mb-3">Next Steps</h3>
            <p className="text-gray-300">
                We are eager to discuss this proposal in detail and outline a bespoke implementation plan. We recommend scheduling a dedicated discovery session to finalize a project charter and commence your digital transformation.
            </p>
        </section>

        {lead.sources && lead.sources.length > 0 && (
            <section className="my-8">
                <h3 className="text-2xl font-semibold text-white mb-3">Sources</h3>
                <p className="text-gray-400 text-sm mb-4">
                    This analysis was grounded in real-time data from the following public web sources:
                </p>
                <ul className="space-y-1 list-disc list-inside text-sm">
                    {lead.sources.map((source, index) => (
                        <li key={index} className="text-gray-300 truncate">
                           <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline" title={source.web.uri}>
                                {source.web.title || source.web.uri}
                            </a>
                        </li>
                    ))}
                </ul>
            </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 pt-6 border-t border-gray-700 text-center text-xs text-gray-500">
        {lead.isMockData && (
          <div className="mb-4 text-center font-bold text-yellow-400 text-base p-2 bg-yellow-500/10 rounded-md border border-yellow-500/30">
            SAMPLE PROPOSAL - DEMO DATA
          </div>
        )}
        {/* Fix: Replaced typo `newgetFullYear` with `new Date().getFullYear()` */}
        <p>&copy; {new Date().getFullYear()} Gaen Technologies | Confidential</p>
      </footer>
    </div>
  );
};
