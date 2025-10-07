
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Lead } from '../types';
import { EyeIcon, FileTextIcon, LoadingSpinner, LinkIcon } from './icons/Icon';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ProposalForExport } from './ProposalForExport';

const LeadDetailModal: React.FC<{ 
    lead: Lead, 
    onClose: () => void,
    onExport: () => void,
    isExporting: boolean 
}> = ({ lead, onClose, onExport, isExporting }) => {
    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 w-full max-w-2xl rounded-lg border border-gray-700 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                 <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10">&times;</button>
                 <div className="p-4">
                     <h2 className="text-2xl font-bold text-white mb-2">{lead.name}</h2>
                     <p className="text-sm text-brand-primary mb-4"><a href={`http://${lead.website}`} target="_blank" rel="noopener noreferrer">{lead.website}</a></p>

                     <div className="grid grid-cols-2 gap-4 mb-6 text-center">
                        <div className="bg-gray-700/50 p-3 rounded-lg">
                            <div className="text-xs text-gray-400">AI Opportunity Score</div>
                            <div className="text-2xl font-semibold text-brand-primary">{lead.aiOpportunityScore} / 100</div>
                        </div>
                         <div className="bg-gray-700/50 p-3 rounded-lg">
                            <div className="text-xs text-gray-400">Est. Total Annual ROI</div>
                            <div className="text-2xl font-semibold text-green-400">${lead.estimatedRoi.toLocaleString()}</div>
                        </div>
                     </div>

                     <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-600 pb-2">Key Opportunities</h3>
                     <div className="space-y-4">
                        {lead.keyOpportunities.map((op, index) => (
                            <div key={index} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                                <h4 className="font-bold text-brand-primary">{op.opportunity}</h4>
                                <p className="text-sm mt-2"><strong className="text-gray-300">The Problem:</strong> {op.problem}</p>
                                <p className="text-sm mt-1"><strong className="text-gray-300">Our Solution:</strong> {op.solution}</p>
                                <div className="mt-2 text-xs flex justify-between items-center bg-gray-700/50 p-2 rounded">
                                    <span>ROI TIMELINE: <strong className="text-yellow-400">{op.roiTimeline}</strong></span>
                                    <span>EST. IMPACT: <strong className="text-green-400">${op.estimatedImpact.toLocaleString()}</strong></span>
                                </div>
                            </div>
                        ))}
                     </div>
                     
                     {lead.sources && lead.sources.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-600 pb-2 flex items-center">
                                <LinkIcon className="w-5 h-5 mr-2" /> Analysis Sources
                            </h3>
                            <p className="text-xs text-gray-400 mb-3">The AI used the following web pages to ground its analysis. You can review them to verify the findings.</p>
                            <ul className="space-y-2 text-sm">
                                {lead.sources.map((source, index) => (
                                    <li key={index} className="bg-gray-900/50 p-2 rounded-lg border border-gray-700 truncate">
                                        <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline" title={source.web.uri}>
                                            {source.web.title || source.web.uri}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                     )}

                      <div className="mt-6 pt-4 border-t border-gray-700 flex justify-end">
                        <button
                            onClick={onExport}
                            disabled={isExporting}
                            className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isExporting ? <LoadingSpinner className="w-5 h-5 mr-2" /> : <FileTextIcon className="w-5 h-5 mr-2" />}
                            {isExporting ? 'Exporting...' : 'Export as PDF'}
                        </button>
                    </div>
                 </div>
            </div>
        </div>
    );
};

interface LeadsProps {
    leads: Lead[];
    onUpdateStatus: (leadId: number, status: Lead['status']) => void;
}

export const Leads: React.FC<LeadsProps> = ({ leads, onUpdateStatus }) => {
    const [roiFilter, setRoiFilter] = useState(0);
    const [statusFilter, setStatusFilter] = useState<'All' | Lead['status']>('All');
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [leadForExport, setLeadForExport] = useState<Lead | null>(null);
    const [isExporting, setIsExporting] = useState(false);
    const proposalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (leadForExport) {
            const exportDoc = async () => {
                // Use requestAnimationFrame to ensure the component has been painted to the DOM before capture.
                // This is more reliable than a fixed setTimeout.
                requestAnimationFrame(async () => {
                    if (!proposalRef.current) {
                        console.error("Proposal component ref is not available for PDF export.");
                        alert("Could not generate PDF: component not ready. Please try again.");
                        setIsExporting(false);
                        setLeadForExport(null);
                        return;
                    }
    
                    setIsExporting(true);
                    try {
                        const canvas = await html2canvas(proposalRef.current, {
                            scale: 2,
                            backgroundColor: '#1F2937',
                            useCORS: true,
                        });
                        
                        const imgData = canvas.toDataURL('image/png');
                        const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
                        
                        const pdfWidth = pdf.internal.pageSize.getWidth();
                        const pdfHeight = pdf.internal.pageSize.getHeight();
                        const imgProps = pdf.getImageProperties(imgData);
                        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

                        let heightLeft = imgHeight;
                        let position = 0;
    
                        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                        heightLeft -= pdfHeight;
    
                        while (heightLeft > 0) {
                            position -= pdfHeight;
                            pdf.addPage();
                            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                            heightLeft -= pdfHeight;
                        }
    
                        pdf.save(`GaenTech_Proposal_${leadForExport.name.replace(/\s+/g, '_')}.pdf`);
    
                    } catch (error) {
                        console.error("Failed to export PDF:", error);
                        alert("An error occurred while exporting the PDF. Please check the console for details.");
                    } finally {
                        setIsExporting(false);
                        setLeadForExport(null);
                    }
                });
            };
            
            exportDoc();
        }
    }, [leadForExport]);
    
    const roiOptions = [0, 50000, 100000, 250000, 500000];
    const leadStatusOptions: ('All' | Lead['status'])[] = ['All', 'Prospected', 'Contacted', 'Qualified', 'Closed'];

    const filteredLeads = useMemo(() => {
        return leads
            .filter(lead => {
                const passesRoi = lead.estimatedRoi >= roiFilter;
                const passesStatus = statusFilter === 'All' || lead.status === statusFilter;
                return passesRoi && passesStatus;
            })
            .sort((a, b) => b.aiOpportunityScore - a.aiOpportunityScore);
    }, [leads, roiFilter, statusFilter]);

    return (
        <>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
                <div className="flex justify-end items-center mb-6 gap-4">
                    <div>
                        <label htmlFor="status-filter" className="text-sm font-medium text-gray-300 mr-2">Status:</label>
                        <select
                            id="status-filter"
                            aria-label="Filter leads by status"
                            className="bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as 'All' | Lead['status'])}
                        >
                            {leadStatusOptions.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="roi-filter" className="text-sm font-medium text-gray-300 mr-2">Minimum ROI:</label>
                        <select
                            id="roi-filter"
                            aria-label="Filter leads by minimum estimated ROI"
                            className="bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            value={roiFilter}
                            onChange={(e) => setRoiFilter(Number(e.target.value))}
                        >
                            {roiOptions.map(val => (
                               <option key={val} value={val}>
                                   {val > 0 ? `$${(val/1000).toFixed(0)}k+` : 'All'}
                               </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-gray-600">
                            <tr>
                                <th className="p-3 text-sm font-semibold">Company</th>
                                <th className="p-3 text-sm font-semibold">AI Score</th>
                                <th className="p-3 text-sm font-semibold">Est. ROI</th>
                                <th className="p-3 text-sm font-semibold">Status</th>
                                <th className="p-3 text-sm font-semibold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLeads.map(lead => (
                                <tr key={lead.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                    <td className="p-3 font-medium">{lead.name}</td>
                                    <td className="p-3 font-semibold text-brand-primary">{lead.aiOpportunityScore} / 100</td>
                                    <td className="p-3 text-green-400">${lead.estimatedRoi.toLocaleString()}</td>
                                    <td className="p-3">
                                         <select 
                                            value={lead.status}
                                            onChange={(e) => onUpdateStatus(lead.id, e.target.value as Lead['status'])}
                                            className="bg-gray-700 border border-gray-600 rounded py-1 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary"
                                            aria-label={`Update status for ${lead.name}`}
                                        >
                                            <option>Prospected</option>
                                            <option>Contacted</option>
                                            <option>Qualified</option>
                                            <option>Closed</option>
                                        </select>
                                    </td>
                                    <td className="p-3 text-center">
                                        <button 
                                            onClick={() => setSelectedLead(lead)} 
                                            title="View Details" 
                                            aria-label={`View details for ${lead.name}`}
                                            className="bg-brand-primary/20 hover:bg-brand-primary/40 text-brand-primary font-semibold py-1 px-4 rounded-lg flex items-center justify-center mx-auto"
                                        >
                                            <EyeIcon className="w-4 h-4 mr-2"/>
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {leads.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                            <p>No leads yet. Go to the Discovery page to analyze companies.</p>
                        </div>
                    )}
                     {leads.length > 0 && filteredLeads.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                            <p>No leads match the current filters.</p>
                        </div>
                    )}
                </div>
            </div>

            {selectedLead && (
              <LeadDetailModal 
                lead={selectedLead} 
                onClose={() => setSelectedLead(null)} 
                onExport={() => setLeadForExport(selectedLead)}
                isExporting={isExporting && leadForExport?.id === selectedLead.id}
              />
            )}

            {/* This component is rendered off-screen to be captured by html2canvas */}
            {leadForExport && (
                <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
                    <ProposalForExport lead={leadForExport} innerRef={proposalRef} />
                </div>
            )}
        </>
    );
};
