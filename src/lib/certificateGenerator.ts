import jsPDF from "jspdf";

interface CertificateData {
  certificateId: string;
  buyerName: string;
  buyerId: string;
  sellerName: string;
  projectName: string;
  tonnes: number;
  pricePerTonne: number;
  totalAmount: number;
  platformFee: number;
  beneficiaryName: string;
  date: string;
  status: string;
}

export const generateCertificatePDF = (data: CertificateData) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Background
  doc.setFillColor(15, 23, 42); // dark background
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Border frame
  doc.setDrawColor(34, 197, 94); // green border
  doc.setLineWidth(2);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  // Inner border
  doc.setDrawColor(34, 197, 94, 0.3);
  doc.setLineWidth(0.5);
  doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

  // Header
  doc.setTextColor(34, 197, 94);
  doc.setFontSize(12);
  doc.text("🌿 Path2Zero", 20, 28);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.text("CARBON CREDIT RETIREMENT CERTIFICATE", pageWidth / 2, 45, { align: "center" });

  // Certificate ID
  doc.setTextColor(34, 197, 94);
  doc.setFontSize(11);
  doc.text(`Certificate ID: ${data.certificateId}`, pageWidth / 2, 55, { align: "center" });

  // Divider
  doc.setDrawColor(34, 197, 94);
  doc.setLineWidth(0.5);
  doc.line(30, 60, pageWidth - 30, 60);

  // Main content - two columns
  const leftCol = 30;
  const rightCol = pageWidth / 2 + 15;
  let y = 72;

  const addField = (label: string, value: string, x: number, currentY: number) => {
    doc.setTextColor(148, 163, 184); // muted color
    doc.setFontSize(9);
    doc.text(label, x, currentY);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text(value, x, currentY + 6);
  };

  // Left column
  addField("BENEFICIARY", data.beneficiaryName, leftCol, y);
  addField("BUYER NAME", data.buyerName, leftCol, y + 18);
  addField("BUYER ID", data.buyerId.substring(0, 8) + "...", leftCol, y + 36);
  addField("PROJECT", data.projectName.length > 35 ? data.projectName.substring(0, 35) + "..." : data.projectName, leftCol, y + 54);

  // Right column
  addField("SELLER", data.sellerName || "Marketplace Seller", rightCol, y);
  addField("TONNES RETIRED", `${data.tonnes} tCO₂e`, rightCol, y + 18);
  addField("PRICE PER TONNE", `$${data.pricePerTonne.toFixed(2)}`, rightCol, y + 36);
  addField("DATE OF ISSUE", data.date, rightCol, y + 54);

  // Financial summary box
  const boxY = y + 72;
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(leftCol, boxY, pageWidth - 60, 30, 3, 3, "F");

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(9);
  doc.text("CREDIT SUBTOTAL", leftCol + 10, boxY + 10);
  doc.text("PLATFORM FEE", leftCol + 80, boxY + 10);
  doc.text("TOTAL PAID", leftCol + 150, boxY + 10);
  doc.text("STATUS", leftCol + 210, boxY + 10);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  const subtotal = data.totalAmount - data.platformFee;
  doc.text(`$${subtotal.toFixed(2)}`, leftCol + 10, boxY + 20);
  doc.text(`$${data.platformFee.toFixed(2)}`, leftCol + 80, boxY + 20);
  doc.setTextColor(34, 197, 94);
  doc.setFontSize(13);
  doc.text(`$${data.totalAmount.toFixed(2)}`, leftCol + 150, boxY + 20);

  // Status badge
  doc.setFontSize(10);
  doc.setTextColor(34, 197, 94);
  doc.text(data.status.toUpperCase(), leftCol + 210, boxY + 20);

  // Footer
  doc.setDrawColor(34, 197, 94);
  doc.setLineWidth(0.5);
  doc.line(30, pageHeight - 30, pageWidth - 30, pageHeight - 30);

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.text(
    "This certificate confirms the permanent retirement of carbon credits. Credits have been removed from circulation and cannot be traded again.",
    pageWidth / 2,
    pageHeight - 22,
    { align: "center" }
  );
  doc.text(
    "Verified by Path2Zero Carbon Credit Marketplace • Powered by Blockchain Technology",
    pageWidth / 2,
    pageHeight - 16,
    { align: "center" }
  );

  // Download
  doc.save(`certificate-${data.certificateId}.pdf`);
};
