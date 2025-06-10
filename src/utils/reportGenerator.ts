import { Invoice } from '@/redux/slices/invoicesSlice';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateCSVReport = (invoices: Invoice[], datasetName: string): void => {
  if (!invoices.length) {
    alert('No invoices available to generate CSV report.');
    return;
  }

  const headers = ['Invoice ID', 'Serial Number', 'Customer Name', 'Product Name', 'Quantity', 'Tax Rate (%)', 'Total Amount ($)', 'Date', 'Status'];
  const csvRows = [headers.join(',')];

  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);
  const totalQuantity = invoices.reduce((sum, invoice) => sum + invoice.quantity, 0);
  const avgTax = invoices.reduce((sum, invoice) => sum + invoice.tax, 0) / invoices.length;
  
  csvRows.push('');
  csvRows.push('SUMMARY,,,,,,,,');
  csvRows.push(`Total Invoices: ${invoices.length},,,,,,,,`);
  csvRows.push(`Total Amount: $${totalAmount.toFixed(2)},,,,,,,,`);
  csvRows.push(`Total Quantity: ${totalQuantity},,,,,,,,`);
  csvRows.push(`Average Tax Rate: ${avgTax.toFixed(2)}%,,,,,,,,`);
  csvRows.push('');
  csvRows.push('INVOICE DETAILS,,,,,,,,');

  invoices.forEach((invoice, index) => {
    const row = [
      invoice.id || `INV-${index + 1}`,
      invoice.serialNumber || 'N/A',
      invoice.customerName || 'Unknown Customer',
      invoice.productName || 'Unknown Product',
      invoice.quantity?.toString() || '0',
      invoice.tax?.toString() || '0',
      invoice.totalAmount?.toFixed(2) || '0.00',
      invoice.date || 'N/A',
      invoice.status || 'Unknown'
    ];
    
    const escapedRow = row.map(field => {
      const stringField = String(field);
      if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
        return `"${stringField.replace(/"/g, '""')}"`;
      }
      return stringField;
    });
    csvRows.push(escapedRow.join(','));
  });

  const csvString = csvRows.join('\r\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  const fileName = `invoice-report-${datasetName.replace(/\s+/g, '_')}-${new Date().toISOString().split('T')[0]}.csv`;
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const generatePDFReport = async (invoices: Invoice[], datasetName: string): Promise<void> => {
  if (!invoices.length) {
    alert('No invoices available to generate PDF report.');
    return;
  }

  const doc = new jsPDF();
  let currentY = 20;

  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text('INVOICE REPORT', 14, currentY);
  
  doc.setFontSize(14);
  doc.setTextColor(80, 80, 80);
  currentY += 8;
  doc.text(`Dataset: ${datasetName}`, 14, currentY);
  
  currentY += 6;
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, currentY);
  
  currentY += 6;
  doc.text(`Total Invoices: ${invoices.length}`, 14, currentY);

  currentY += 15;
  doc.setFontSize(16);
  doc.setTextColor(40, 40, 40);
  doc.text('SUMMARY STATISTICS', 14, currentY);
  
  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);
  const totalQuantity = invoices.reduce((sum, invoice) => sum + invoice.quantity, 0);
  const avgTax = invoices.reduce((sum, invoice) => sum + invoice.tax, 0) / invoices.length;
  const uniqueCustomers = new Set(invoices.map(inv => inv.customerName)).size;
  const uniqueProducts = new Set(invoices.map(inv => inv.productName)).size;
  const completedInvoices = invoices.filter(inv => inv.status === 'complete').length;

  currentY += 10;
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  
  const stats = [
    `Total Revenue: $${totalAmount.toFixed(2)}`,
    `Total Items Sold: ${totalQuantity}`,
    `Average Tax Rate: ${avgTax.toFixed(2)}%`,
    `Unique Customers: ${uniqueCustomers}`,
    `Unique Products: ${uniqueProducts}`,
    `Completed Invoices: ${completedInvoices} (${((completedInvoices/invoices.length)*100).toFixed(1)}%)`
  ];

  stats.forEach(stat => {
    doc.text(stat, 14, currentY);
    currentY += 6;
  });

  currentY += 10;
  doc.setFontSize(16);
  doc.setTextColor(40, 40, 40);
  doc.text('INVOICE DETAILS', 14, currentY);

  const tableColumns = ['ID', 'Serial #', 'Customer', 'Product', 'Qty', 'Tax%', 'Amount($)', 'Date', 'Status'];
  
  const tableRows = invoices.map(invoice => [
    invoice.id?.substring(0, 8) || 'N/A',
    invoice.serialNumber || 'N/A',
    invoice.customerName?.substring(0, 15) || 'Unknown',
    invoice.productName?.substring(0, 15) || 'Unknown',
    invoice.quantity?.toString() || '0',
    invoice.tax?.toString() || '0',
    invoice.totalAmount?.toFixed(2) || '0.00',
    invoice.date || 'N/A',
    invoice.status || 'Unknown'
  ]);

  autoTable(doc, {
    head: [tableColumns],
    body: tableRows,
    startY: currentY + 5,
    theme: 'striped',
    headStyles: { 
      fillColor: [41, 128, 185], 
      textColor: 255,
      fontSize: 9,
      fontStyle: 'bold'
    },
    bodyStyles: { 
      fontSize: 8,
      textColor: 50
    },
    alternateRowStyles: { 
      fillColor: [245, 245, 245] 
    },
    margin: { top: 10, left: 14, right: 14 }
  });

  const finalY = (doc as any).lastAutoTable?.finalY || currentY + 50;
  
  if (finalY < doc.internal.pageSize.getHeight() - 40) {
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('CUSTOMER ANALYSIS', 14, finalY + 15);
    
    const customerTotals: Record<string, number> = {};
    invoices.forEach(invoice => {
      const customer = invoice.customerName || 'Unknown';
      customerTotals[customer] = (customerTotals[customer] || 0) + invoice.totalAmount;
    });
    
    const topCustomers = Object.entries(customerTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    let analysisY = finalY + 25;
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text('Top 5 Customers by Revenue:', 14, analysisY);
    
    topCustomers.forEach(([customer, total], index) => {
      analysisY += 6;
      doc.text(`${index + 1}. ${customer}: $${total.toFixed(2)}`, 20, analysisY);
    });
  }

  const fileName = `invoice-report-${datasetName.replace(/\s+/g, '_')}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
