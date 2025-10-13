import jsPDF from 'jspdf';
import { Lead } from '../types';

export const generateProposal = (lead: Lead): void => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  const addFooter = () => {
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(107, 114, 128); // gray-500
        pdf.text(
            `This proposal is confidential and intended for the exclusive use of ${lead.company.name}.`,
            pageWidth / 2,
            pageHeight - 15,
            { align: 'center' }
        );
        pdf.text(
            `© ${new Date().getFullYear()} Gaen Technologies | www.gaentechnologies.com`,
            pageWidth / 2,
            pageHeight - 10,
            { align: 'center' }
        );
    }
  };

  // Set consistent styling
  pdf.setFont('helvetica');
  pdf.setFillColor(15, 23, 42); // bg-slate-900
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Header Section
  pdf.setFillColor(30, 41, 59); // bg-slate-800
  pdf.rect(0, 0, pageWidth, 50, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.text('Gaen Technologies', margin, 25);
  
  pdf.setFontSize(12);
  pdf.setTextColor(34, 211, 238); // cyan-400
  pdf.text('Simplify Life', margin, 35);
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - margin, 25, { align: 'right' });
  pdf.text('AI-Powered Proposal', pageWidth - margin, 32, { align: 'right' });
  
  // Company Name and URL
  let yPos = 70;
  pdf.setFontSize(20);
  pdf.setTextColor(255, 255, 255);
  pdf.text(lead.company.name, margin, yPos);
  
  pdf.setFontSize(10);
  pdf.setTextColor(34, 211, 238);
  pdf.textWithLink(lead.company.website, margin, yPos + 7, { url: `https://${lead.company.website}` });
  
  // Score Cards
  yPos += 20;
  const cardWidth = (contentWidth - 20) / 3;
  
  const drawCard = (x: number, y: number, title: string, value: string, valueColor: [number, number, number]) => {
      pdf.setFillColor(30, 41, 59);
      pdf.roundedRect(x, y, cardWidth, 35, 3, 3, 'F');
      pdf.setFontSize(10);
      pdf.setTextColor(156, 163, 175);
      pdf.text(title, x + cardWidth / 2, y + 10, { align: 'center' });
      pdf.setFontSize(24);
      pdf.setTextColor(...valueColor);
      pdf.text(value, x + cardWidth / 2, y + 25, { align: 'center' });
  };
  
  drawCard(margin, yPos, 'Opportunity Score', `${lead.analysis.opportunityScore}/100`, [255, 255, 255]);
  drawCard(margin + cardWidth + 10, yPos, 'Estimated Annual ROI', `$${lead.analysis.estimatedAnnualROI.toLocaleString()}`, [74, 222, 128]);
  drawCard(margin + (cardWidth + 10) * 2, yPos, 'Analyzed On', new Date(lead.createdAt).toLocaleDateString(), [255, 255, 255]);

  // Executive Summary Section
  yPos += 50;
  pdf.setFontSize(16);
  pdf.setTextColor(255, 255, 255);
  pdf.text('Executive Summary', margin, yPos);
  
  yPos += 10;
  pdf.setFontSize(10);
  pdf.setTextColor(209, 213, 219);
  const summaryText = pdf.splitTextToSize(
    `This document outlines the key AI-driven opportunities identified for ${lead.company.name}. Our analysis, based on real-time data, indicates a significant potential for growth and operational efficiency. We have identified several high-impact areas where Gaen Technologies' tailored AI solutions can deliver measurable ROI and a distinct competitive advantage.`,
    contentWidth
  );
  pdf.text(summaryText, margin, yPos);
  yPos += summaryText.length * 4.5 + 10;
  
  // Key Opportunities Section
  pdf.setFontSize(16);
  pdf.setTextColor(255, 255, 255);
  pdf.text('Key Opportunities', margin, yPos);
  yPos += 10;
  
  lead.analysis.keyOpportunities.forEach((op) => {
    const oppCardHeight = 65;
    if (yPos > pageHeight - (oppCardHeight + 30)) {
        addFooter();
        pdf.addPage();
        pdf.setFillColor(15, 23, 42);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
        yPos = margin;
    }
    
    pdf.setFillColor(30, 41, 59);
    pdf.roundedRect(margin, yPos, contentWidth, oppCardHeight, 3, 3, 'F');
    
    pdf.setFontSize(14);
    pdf.setTextColor(34, 211, 238);
    const oppTitle = pdf.splitTextToSize(op.opportunity, contentWidth - 20);
    pdf.text(oppTitle, margin + 10, yPos + 12);
    const titleHeight = oppTitle.length * 5;
    
    const colWidth = (contentWidth - 40) / 2;
    pdf.setFontSize(9);
    pdf.setTextColor(156, 163, 175);
    pdf.text('Problem:', margin + 10, yPos + titleHeight + 10);
    pdf.text('Solution:', margin + contentWidth / 2 + 5, yPos + titleHeight + 10);
    
    pdf.setFontSize(8);
    pdf.setTextColor(209, 213, 219);
    const problemText = pdf.splitTextToSize(op.problem, colWidth - 5);
    pdf.text(problemText, margin + 10, yPos + titleHeight + 15);
    const solutionText = pdf.splitTextToSize(op.solution, colWidth - 5);
    pdf.text(solutionText, margin + contentWidth / 2 + 5, yPos + titleHeight + 15);
    
    const bottomY = yPos + oppCardHeight - 8;
    pdf.setFontSize(9);
    pdf.setTextColor(74, 222, 128);
    pdf.text(`Est. Impact: $${op.estimatedImpact.toLocaleString()} / year`, margin + 10, bottomY);
    pdf.setTextColor(251, 146, 60);
    pdf.text(`ROI Timeline: ${op.roiTimeline}`, margin + contentWidth / 2 + 5, bottomY);
    
    yPos += oppCardHeight + 10;
  });
  
  const checkNewPage = (spaceNeeded: number) => {
    if (yPos > pageHeight - (spaceNeeded + 30)) {
        addFooter();
        pdf.addPage();
        pdf.setFillColor(15, 23, 42);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
        yPos = margin;
    }
  };

  checkNewPage(60);
  pdf.setFontSize(16);
  pdf.setTextColor(255, 255, 255);
  pdf.text('Next Steps', margin, yPos);
  yPos += 10;
  
  pdf.setFontSize(10);
  pdf.setTextColor(209, 213, 219);
  const nextStepsText = pdf.splitTextToSize(
    `We are confident that our proposed solutions will deliver significant value to ${lead.company.name}. We recommend scheduling a follow-up call to discuss these opportunities in greater detail, answer any questions, and outline a tailored implementation roadmap.`,
    contentWidth
  );
  pdf.text(nextStepsText, margin, yPos);
  yPos += nextStepsText.length * 4.5 + 15;
  
  if (lead.analysis.sources && lead.analysis.sources.length > 0) {
      const sourceSpace = lead.analysis.sources.length * 5 + 30;
      checkNewPage(sourceSpace);
      pdf.setFontSize(16);
      pdf.setTextColor(255, 255, 255);
      pdf.text('Analysis Sources', margin, yPos);
      yPos += 10;
      
      pdf.setFontSize(9);
      pdf.setTextColor(156, 163, 175);
      pdf.text('This analysis was grounded in real-time data from the following public web sources:', margin, yPos);
      yPos += 7;
      
      lead.analysis.sources.forEach((source) => {
        checkNewPage(25);
        pdf.setFontSize(8);
        pdf.setTextColor(34, 211, 238);
        const sourceLines = pdf.splitTextToSize(source.web.title || source.web.uri, contentWidth - 10);
        
        if (sourceLines.length > 0) {
            // jsPDF's textWithLink expects a string, not an array.
            // We'll make the first line a link and display subsequent lines as plain text.
            pdf.textWithLink(sourceLines[0], margin + 5, yPos, { url: source.web.uri });

            if (sourceLines.length > 1) {
                pdf.text(sourceLines.slice(1), margin + 5, yPos + 4);
            }
            yPos += sourceLines.length * 4;
        }
      });
  }
  
  addFooter();
  pdf.save(`GaenTech_Proposal_${lead.company.name.replace(/\s+/g, '_')}.pdf`);
};
