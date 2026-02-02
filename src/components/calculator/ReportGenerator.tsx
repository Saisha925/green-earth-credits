import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Download, Share2, CheckCircle } from "lucide-react";
import { CalculationResult, ProjectRecommendation } from "@/lib/carbonCalculations";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ReportGeneratorProps {
  result: CalculationResult;
  mode: 'individual' | 'organization';
  recommendations: ProjectRecommendation[];
}

export const ReportGenerator = ({ result, mode, recommendations }: ReportGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);

    const doc = new jsPDF();
    const reportId = `P2Z-${Date.now().toString(36).toUpperCase()}`;
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Header
    doc.setFillColor(11, 93, 59); // Primary green
    doc.rect(0, 0, 220, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Path2Zero', 20, 25);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Carbon Footprint Report', 20, 33);

    // Report Info
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.text(`Report ID: ${reportId}`, 140, 20);
    doc.text(`Date: ${currentDate}`, 140, 26);
    doc.text(`Type: ${mode === 'individual' ? 'Individual' : 'Organization'}`, 140, 32);

    // Main Results Section
    let yPos = 55;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Carbon Footprint Summary', 20, yPos);

    yPos += 15;

    // Total Emissions Box
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(20, yPos, 170, 35, 3, 3, 'F');
    doc.setDrawColor(11, 93, 59);
    doc.roundedRect(20, yPos, 170, 35, 3, 3, 'S');

    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(11, 93, 59);
    doc.text(`${result.totalEmissions}`, 105, yPos + 22, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('tonnes CO₂e / year', 105, yPos + 30, { align: 'center' });

    yPos += 50;

    // Emission Breakdown
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Emission Breakdown', 20, yPos);

    yPos += 5;

    const breakdownData = result.breakdown.map(item => [
      item.name,
      `${item.value.toFixed(2)} t`,
      `${item.percentage.toFixed(1)}%`
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Category', 'Emissions', 'Share']],
      body: breakdownData,
      theme: 'striped',
      headStyles: {
        fillColor: [11, 93, 59],
        textColor: 255,
      },
      styles: {
        fontSize: 11,
      },
      margin: { left: 20, right: 20 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;

    // Key Insights
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Key Insights', 20, yPos);

    yPos += 8;

    const sortedBreakdown = [...result.breakdown].sort((a, b) => b.value - a.value);
    const topDrivers = sortedBreakdown.slice(0, 2);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    
    doc.text(`• Primary emission driver: ${topDrivers[0]?.name} (${topDrivers[0]?.percentage.toFixed(0)}%)`, 25, yPos);
    yPos += 7;
    doc.text(`• Secondary emission driver: ${topDrivers[1]?.name} (${topDrivers[1]?.percentage.toFixed(0)}%)`, 25, yPos);
    yPos += 7;
    doc.text(`• Equivalent to planting ${result.treeEquivalent} trees`, 25, yPos);
    yPos += 7;
    doc.text(`• Recommended offset: ${result.suggestedCredits} carbon credits`, 25, yPos);

    yPos += 15;

    // Recommendations
    if (recommendations.length > 0) {
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Recommended Offset Projects', 20, yPos);

      yPos += 5;

      const recData = recommendations.map(rec => [
        rec.title.substring(0, 35) + (rec.title.length > 35 ? '...' : ''),
        rec.category,
        rec.country,
        `$${rec.pricePerTonne.toFixed(2)}/t`,
        `${rec.suggestedTonnes} t`
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [['Project', 'Category', 'Location', 'Price', 'Suggested']],
        body: recData,
        theme: 'striped',
        headStyles: {
          fillColor: [11, 93, 59],
          textColor: 255,
        },
        styles: {
          fontSize: 9,
        },
        columnStyles: {
          0: { cellWidth: 55 },
        },
        margin: { left: 20, right: 20 },
      });
    }

    // Footer
    doc.setFillColor(245, 245, 245);
    doc.rect(0, 275, 220, 25, 'F');
    
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.text('Generated by Path2Zero • Your journey to carbon neutrality', 105, 285, { align: 'center' });
    doc.text('www.path2zero.com', 105, 291, { align: 'center' });

    // Save
    doc.save(`path2zero-carbon-report-${reportId}.pdf`);
    setIsGenerating(false);
  };

  const handleShare = async () => {
    const shareText = `My carbon footprint is ${result.totalEmissions} tonnes CO₂e/year. Calculate yours at Path2Zero!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Carbon Footprint Report',
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 mt-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">Carbon Footprint Report</h3>
          <p className="text-sm text-muted-foreground">Download or share your detailed report</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          onClick={generatePDF}
          disabled={isGenerating}
          className="gradient-primary text-primary-foreground btn-glow"
        >
          {isGenerating ? (
            <>
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
              Generating...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Download PDF Report
            </>
          )}
        </Button>

        <Button variant="outline" onClick={handleShare}>
          {showCopied ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2 text-primary" />
              Copied!
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 mr-2" />
              Share Results
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
