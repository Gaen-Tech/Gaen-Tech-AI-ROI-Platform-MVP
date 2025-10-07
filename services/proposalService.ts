import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Lead } from '../types';
import { ProposalForExport } from '../components/ProposalForExport';

const generatePdfFromElement = async (element: HTMLElement, lead: Lead): Promise<void> => {
    try {
        const canvas = await html2canvas(element, {
            scale: 2,
            backgroundColor: '#1F2937', // bg-gray-800
            useCORS: true,
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();

        while (heightLeft > 0) {
            position -= pdf.internal.pageSize.getHeight();
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdf.internal.pageSize.getHeight();
        }

        pdf.save(`GaenTech_Proposal_${lead.company.name.replace(/\s+/g, '_')}.pdf`);

    } catch (error) {
        console.error("Failed to export PDF:", error);
        throw new Error("An error occurred while exporting the PDF.");
    }
};

export const generateProposal = (lead: Lead): Promise<void> => {
    return new Promise((resolve, reject) => {
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '0';
        document.body.appendChild(container);

        const root = createRoot(container);

        const onRendered = (element: HTMLDivElement | null) => {
            if (element) {
                // Use a short timeout to ensure all assets (e.g., images) are loaded and rendered
                setTimeout(() => {
                    generatePdfFromElement(element, lead)
                        .then(resolve)
                        .catch(reject)
                        .finally(() => {
                            root.unmount();
                            if (document.body.contains(container)) {
                                document.body.removeChild(container);
                            }
                        });
                }, 500);
            }
        };

        root.render(React.createElement(ProposalForExport, { lead, innerRef: onRendered }));
    });
};