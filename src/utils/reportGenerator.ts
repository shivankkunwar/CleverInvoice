import { Invoice } from '@/redux/slices/invoicesSlice';

/**
 * Generates a CSV report from an array of invoices and triggers a download.
 * @param invoices Array of Invoice objects.
 * @param datasetName Name of the dataset for naming the file.
 */
export const generateCSVReport = (invoices: Invoice[], datasetName: string): void => {
  if (!invoices.length) {
    console.warn('No invoices provided for CSV report generation.');
    return;
  }

  const headers = [
    'ID',
    'Serial Number',
    'Customer Name',
    'Product Name',
    'Quantity',
    'Tax (%)',
    'Total Amount',
    'Date',
    'Status',
  ];

  const csvRows = [headers.join(',')]; // Header row

  invoices.forEach(invoice => {
    const row = [
      invoice.id,
      invoice.serialNumber,
      invoice.customerName,
      invoice.productName,
      invoice.quantity.toString(),
      invoice.tax.toString(),
      invoice.totalAmount.toFixed(2),
      invoice.date,
      invoice.status,
    ];
    // Escape commas in values by wrapping in double quotes
    const escapedRow = row.map(field => {
      const stringField = String(field);
      if (stringField.includes(',')) {
        return `"${stringField.replace(/"/g, '""')}"`; // Escape double quotes within the field
      }
      return stringField;
    });
    csvRows.push(escapedRow.join(','));
  });

  const csvString = csvRows.join('\r\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `report-${datasetName.replace(/\s+/g, '_')}.csv`); // Sanitize datasetName for filename
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import the autotable plugin
import { Chart, registerables } from 'chart.js'; // Import Chart.js
Chart.register(...registerables); // Register all necessary components for Chart.js

// Extend jsPDF with the autoTable method
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

/**
 * Generates a PDF report with summary statistics, an invoice table, and a chart.
 * @param invoices Array of Invoice objects.
 * @param datasetName Name of the dataset.
 */
export const generatePDFReport = async (invoices: Invoice[], datasetName: string): Promise<void> => {
  if (!invoices.length) {
    console.warn('No invoices provided for PDF report generation.');
    alert('No invoices available to generate PDF report.');
    return;
  }

  const doc = new jsPDF();

  // 1. Title
  doc.setFontSize(18);
  doc.text(`Invoice Report - ${datasetName}`, 14, 22);

  // 2. Summary Statistics
  doc.setFontSize(11);
  const totalInvoices = invoices.length;
  const totalAmountSum = invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);

  doc.text(`Total Invoices: ${totalInvoices}`, 14, 32);
  doc.text(`Total Amount: $${totalAmountSum.toFixed(2)}`, 14, 38);

  // 3. Invoice Table
  const tableColumn = ['ID', 'Serial #', 'Customer', 'Product', 'Qty', 'Tax (%)', 'Total ($)', 'Date', 'Status'];
  const tableRows: (string | number)[][] = [];

  invoices.forEach(invoice => {
    const invoiceData = [
      invoice.id,
      invoice.serialNumber,
      invoice.customerName,
      invoice.productName,
      invoice.quantity,
      invoice.tax,
      invoice.totalAmount.toFixed(2),
      invoice.date,
      invoice.status,
    ];
    tableRows.push(invoiceData);
  });

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 50, // Start table after title and stats
    theme: 'striped',
    headStyles: { fillColor: [22, 160, 133] }, // Example: Teal color for header
    margin: { top: 10 },
  });

  let finalY = (doc as any).lastAutoTable.finalY || 70; // Get Y pos after table

  // 4. Add a Simple Chart (Total Amount Per Customer)
  try {
    const customerTotals: Record<string, number> = {};
    invoices.forEach(invoice => {
      customerTotals[invoice.customerName] = (customerTotals[invoice.customerName] || 0) + invoice.totalAmount;
    });

    const chartLabels = Object.keys(customerTotals);
    const chartData = Object.values(customerTotals);

    if (chartLabels.length > 0) {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 200;

      // Ensure the canvas is not too wide for the PDF page
      const pdfPageWidth = doc.internal.pageSize.getWidth();
      const chartAspect = canvas.width / canvas.height;
      let imageWidth = pdfPageWidth * 0.8; // Use 80% of page width
      let imageHeight = imageWidth / chartAspect;
      const maxImageHeight = pdfPageWidth * 0.5 / chartAspect ; // Cap height
      if (imageHeight > maxImageHeight) {
        imageHeight = maxImageHeight;
        imageWidth = imageHeight * chartAspect;
      }


      new Chart(canvas, {
        type: 'bar',
        data: {
          labels: chartLabels,
          datasets: [{
            label: 'Total Amount by Customer',
            data: chartData,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          }],
        },
        options: {
          responsive: false, // Important for rendering on a fixed-size canvas for PDF
          animation: {
            duration: 0 // Disable animation for static image generation
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      // Add a small delay to ensure chart is rendered before converting to image
      await new Promise(resolve => setTimeout(resolve, 500));

      const chartImage = canvas.toDataURL('image/png');

      finalY += 10; // Add some margin before the chart
      if (finalY + imageHeight + 10 > doc.internal.pageSize.getHeight()) {
        doc.addPage();
        finalY = 20; // Reset Y for new page
      }

      doc.setFontSize(14);
      doc.text('Summary Chart: Total Amount by Customer', 14, finalY);
      finalY += 6;
      doc.addImage(chartImage, 'PNG', 14, finalY, imageWidth, imageHeight);
    }
  } catch (error) {
    console.error("Error generating chart for PDF:", error);
    doc.setTextColor(255,0,0); // Red text for error
    doc.text("Chart could not be generated.", 14, finalY + 10);
    doc.setTextColor(0,0,0); // Reset text color
  }

  // 5. Trigger Download
  doc.save(`report-${datasetName.replace(/\s+/g, '_')}.pdf`);
};
