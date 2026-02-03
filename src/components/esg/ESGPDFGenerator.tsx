import { useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ReportContext, ESGNarratives } from "@/pages/ESGReport";
import { EnvironmentalInputs, SocialInputs, GovernanceInputs, ESGScores } from "@/lib/esgScoring";
import { useToast } from "@/hooks/use-toast";

interface ESGPDFGeneratorProps {
  context: ReportContext;
  environmental: EnvironmentalInputs;
  social: SocialInputs;
  governance: GovernanceInputs;
  scores: ESGScores;
  narratives: ESGNarratives | null;
  onClose: () => void;
}

export const ESGPDFGenerator = ({
  context,
  environmental,
  social,
  governance,
  scores,
  narratives,
  onClose
}: ESGPDFGeneratorProps) => {
  const { toast } = useToast();
  const totalEmissions = environmental.scope1Emissions + environmental.scope2Emissions + environmental.scope3Emissions;

  useEffect(() => {
    generatePDF();
  }, []);

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPos = 20;

      // Helper function for adding sections
      const addSection = (title: string, yOffset: number = 10) => {
        if (yPos + yOffset > 270) {
          doc.addPage();
          yPos = 20;
        }
        yPos += yOffset;
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(11, 93, 59); // Primary green
        doc.text(title, 14, yPos);
        yPos += 8;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        doc.setFontSize(10);
      };

      const addText = (text: string, maxWidth: number = 180) => {
        if (!text) return;
        const lines = doc.splitTextToSize(text, maxWidth);
        lines.forEach((line: string) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(line, 14, yPos);
          yPos += 5;
        });
      };

      // ===== COVER PAGE =====
      // Header bar
      doc.setFillColor(11, 93, 59);
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text('ESG SUSTAINABILITY REPORT', 14, 25);
      
      // Company info
      yPos = 60;
      doc.setFontSize(28);
      doc.setTextColor(30, 30, 30);
      doc.text(context.organizationName, 14, yPos);
      
      yPos += 15;
      doc.setFontSize(14);
      doc.setTextColor(100, 100, 100);
      doc.text(`Fiscal Year ${context.reportingYear}`, 14, yPos);
      
      yPos += 8;
      doc.text(`${context.industry} | ${context.country}`, 14, yPos);
      
      yPos += 8;
      doc.text(`Framework: ${context.reportingFramework}`, 14, yPos);

      // Overall Score Box
      yPos += 30;
      doc.setFillColor(240, 253, 244);
      doc.roundedRect(14, yPos, 80, 50, 5, 5, 'F');
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text('Overall ESG Score', 24, yPos + 15);
      
      doc.setFontSize(36);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(11, 93, 59);
      doc.text(`${scores.overallScore}/10`, 24, yPos + 38);
      
      // Risk Category
      doc.setFillColor(scores.riskCategory === 'Low Risk' ? 34 : scores.riskCategory === 'Medium Risk' ? 234 : 239, 
                       scores.riskCategory === 'Low Risk' ? 197 : scores.riskCategory === 'Medium Risk' ? 179 : 68,
                       scores.riskCategory === 'Low Risk' ? 94 : scores.riskCategory === 'Medium Risk' ? 8 : 68);
      doc.roundedRect(110, yPos, 80, 50, 5, 5, 'F');
      
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'normal');
      doc.text('Risk Category', 120, yPos + 15);
      
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(scores.riskCategory, 120, yPos + 35);

      // Pillar Scores Table
      yPos += 70;
      autoTable(doc, {
        startY: yPos,
        head: [['Pillar', 'Score', 'Rating']],
        body: [
          ['Environmental', `${scores.environmentalScore}/10`, scores.environmentalScore >= 7 ? 'Strong' : scores.environmentalScore >= 4 ? 'Moderate' : 'Weak'],
          ['Social', `${scores.socialScore}/10`, scores.socialScore >= 7 ? 'Strong' : scores.socialScore >= 4 ? 'Moderate' : 'Weak'],
          ['Governance', `${scores.governanceScore}/10`, scores.governanceScore >= 7 ? 'Strong' : scores.governanceScore >= 4 ? 'Moderate' : 'Weak'],
        ],
        theme: 'striped',
        headStyles: { fillColor: [11, 93, 59] },
        styles: { fontSize: 11 },
      });

      // ===== PAGE 2: EXECUTIVE SUMMARY =====
      doc.addPage();
      yPos = 20;

      if (narratives?.executive_summary) {
        addSection('Executive Summary', 0);
        addText(narratives.executive_summary);
      }

      // ===== ENVIRONMENTAL SECTION =====
      addSection('Environmental Performance', 15);
      
      // Emissions table
      autoTable(doc, {
        startY: yPos,
        head: [['Emission Type', 'Value (t CO₂e)']],
        body: [
          ['Scope 1 (Direct)', environmental.scope1Emissions.toLocaleString()],
          ['Scope 2 (Energy)', environmental.scope2Emissions.toLocaleString()],
          ['Scope 3 (Value Chain)', environmental.scope3Emissions.toLocaleString()],
          ['Total Emissions', totalEmissions.toLocaleString()],
        ],
        theme: 'striped',
        headStyles: { fillColor: [16, 185, 129] },
        styles: { fontSize: 10 },
      });

      yPos = (doc as any).lastAutoTable.finalY + 10;

      // Other environmental metrics
      autoTable(doc, {
        startY: yPos,
        head: [['Metric', 'Value']],
        body: [
          ['Renewable Energy', `${environmental.renewableEnergyPercentage}%`],
          ['Water Consumption', `${environmental.waterConsumption.toLocaleString()} m³`],
          ['Water Stress Area', environmental.waterStressArea ? 'Yes' : 'No'],
          ['Hazardous Waste', `${environmental.hazardousWaste} tonnes`],
          ['Electronic Waste', `${environmental.electronicWaste} tonnes`],
          ['Climate Risk Level', environmental.climateRiskLevel.charAt(0).toUpperCase() + environmental.climateRiskLevel.slice(1)],
        ],
        theme: 'striped',
        headStyles: { fillColor: [16, 185, 129] },
        styles: { fontSize: 10 },
      });

      yPos = (doc as any).lastAutoTable.finalY + 5;

      if (narratives?.environmental_narrative) {
        addText(narratives.environmental_narrative);
      }

      // ===== SOCIAL SECTION =====
      addSection('Social Performance', 15);

      autoTable(doc, {
        startY: yPos,
        head: [['Metric', 'Value']],
        body: [
          ['Total Employees', social.totalEmployees.toLocaleString()],
          ['Gender Diversity', `${social.genderDiversityPercentage}%`],
          ['Training Hours/Employee', `${social.trainingHoursPerEmployee} hours`],
          ['H&S Incidents', social.healthSafetyIncidents.toString()],
          ['Supply Chain Policy', social.supplyChainLabourPolicy ? 'Yes' : 'No'],
          ['Data Privacy Incidents', social.dataPrivacyIncidents.toString()],
        ],
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] },
        styles: { fontSize: 10 },
      });

      yPos = (doc as any).lastAutoTable.finalY + 5;

      if (narratives?.social_narrative) {
        addText(narratives.social_narrative);
      }

      // ===== GOVERNANCE SECTION =====
      addSection('Governance Performance', 15);

      autoTable(doc, {
        startY: yPos,
        head: [['Metric', 'Value']],
        body: [
          ['Board Size', governance.boardSize.toString()],
          ['Independent Directors', `${governance.independentDirectorsPercentage}%`],
          ['Board Diversity', `${governance.boardDiversityPercentage}%`],
          ['Anti-Corruption Policy', governance.antiCorruptionPolicy ? 'Yes' : 'No'],
          ['Whistleblower Policy', governance.whistleblowerPolicy ? 'Yes' : 'No'],
          ['Tax Transparency', governance.taxTransparency ? 'Yes' : 'No'],
          ['Compliance Violations', governance.complianceViolations.toString()],
        ],
        theme: 'striped',
        headStyles: { fillColor: [139, 92, 246] },
        styles: { fontSize: 10 },
      });

      yPos = (doc as any).lastAutoTable.finalY + 5;

      if (narratives?.governance_narrative) {
        addText(narratives.governance_narrative);
      }

      // ===== RISKS & RECOMMENDATIONS =====
      if (narratives?.key_risks) {
        addSection('Key ESG Risks', 15);
        addText(narratives.key_risks);
      }

      if (narratives?.recommendations) {
        addSection('Recommendations', 15);
        addText(narratives.recommendations);
      }

      // ===== DISCLAIMER =====
      doc.addPage();
      yPos = 20;
      addSection('Disclaimer', 0);
      doc.setFontSize(9);
      addText('This ESG report is generated using user-provided data and automated analysis. It does not constitute official certification or regulatory filing. The information contained herein should be used for informational purposes only. Organizations should consult with qualified ESG professionals for official reporting requirements.');

      // Footer on last page
      yPos += 20;
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Generated by Path2Zero | ${new Date().toLocaleDateString()}`, 14, yPos);

      // Save the PDF
      const fileName = `ESG_Report_${context.organizationName.replace(/\s+/g, '_')}_${context.reportingYear}.pdf`;
      doc.save(fileName);

      toast({
        title: "PDF Downloaded",
        description: `${fileName} has been saved to your downloads.`
      });

      onClose();
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "PDF Generation Failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive"
      });
      onClose();
    }
  };

  return null;
};
