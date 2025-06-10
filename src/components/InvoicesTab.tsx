import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHeader,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ChevronDown, ChevronUp, Edit, Trash2, ArrowUpDown } from "lucide-react"; // Added ArrowUpDown
import { selectInvoices } from "@/redux/selectors";
import { Invoice, addInvoice, updateInvoice, deleteInvoice } from "@/redux/slices/invoicesSlice";
import InvoiceForm from "./InvoiceForm";
import { RootState } from "@/redux/store"; // Import RootState for activeDatasetName
import { generateCSVReport, generatePDFReport } from "@/utils/reportGenerator"; // Import CSV and PDF generators
import { useToast } from "@/hooks/use-toast"; // For user feedback

const InvoicesTab: React.FC = () => {
  const dispatch = useDispatch();
  const { toast } = useToast(); // Initialize toast
  const activeDatasetName = useSelector((state: RootState) => state.ui.activeDatasetName);
  // Use selectInvoices with activeDatasetName
  const invoices = useSelector((state: RootState) =>
    activeDatasetName ? selectInvoices(state, activeDatasetName) : []
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // State for sorting
  type SortableColumn = keyof Pick<Invoice, 'serialNumber' | 'customerName' | 'productName' | 'quantity' | 'tax' | 'totalAmount' | 'date' | 'status'>;
  const [sortColumn, setSortColumn] = useState<SortableColumn | null>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleOpenModal = (invoice?: Invoice) => {
    setEditingInvoice(invoice || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingInvoice(null);
    setIsModalOpen(false);
  };

  const handleFormSubmit = (invoiceData: Omit<Invoice, 'id'> | Invoice) => {
    if (!activeDatasetName) {
      // This should ideally be prevented by disabling UI elements
      console.error("No active dataset selected for form submission.");
      toast({ title: "Error", description: "No active dataset selected.", variant: "destructive" });
      return;
    }
    if (editingInvoice) {
      dispatch(updateInvoice({ datasetName: activeDatasetName, id: editingInvoice.id, updates: invoiceData as Partial<Invoice> }));
      toast({ title: "Invoice Updated", description: `Invoice ${editingInvoice.serialNumber} has been updated.` });
    } else {
      const newInvoiceData: Invoice = {
        id: Date.now().toString(), // Simple ID generation
        ...(invoiceData as Omit<Invoice, 'id'>),
        serialNumber: (invoiceData as Invoice).serialNumber || '',
        customerName: (invoiceData as Invoice).customerName || '',
        productName: (invoiceData as Invoice).productName || '',
        quantity: (invoiceData as Invoice).quantity || 0,
        tax: (invoiceData as Invoice).tax || 0,
        totalAmount: (invoiceData as Invoice).totalAmount || 0,
        date: (invoiceData as Invoice).date || new Date().toISOString().split('T')[0],
        status: (invoiceData as Invoice).status || 'missing_fields',
      };
      dispatch(addInvoice({ datasetName: activeDatasetName, invoice: newInvoiceData }));
      toast({ title: "Invoice Added", description: `Invoice ${newInvoiceData.serialNumber} has been added.` });
    }
    handleCloseModal();
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    if (!activeDatasetName) {
      console.error("No active dataset selected for deleting invoice.");
      toast({ title: "Error", description: "No active dataset selected.", variant: "destructive" });
      return;
    }
    // In a real app, you might want to get the invoice details to show its serial in the toast
    dispatch(deleteInvoice({ datasetName: activeDatasetName, id: invoiceId }));
    toast({ title: "Invoice Deleted", description: `Invoice (ID: ${invoiceId}) has been deleted.` });
  };

  const sortedInvoices = React.useMemo(() => {
    if (!sortColumn) return invoices;
    return [...invoices].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (sortColumn === 'date') {
        return (new Date(aValue as string).getTime() - new Date(bValue as string).getTime()) * (sortDirection === 'asc' ? 1 : -1);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return (aValue - bValue) * (sortDirection === 'asc' ? 1 : -1);
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * (sortDirection === 'asc' ? 1 : -1);
      }

      return 0;
    });
  }, [invoices, sortColumn, sortDirection]);

  const handleSort = (column: SortableColumn) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const renderSortArrow = (column: SortableColumn) => {
    if (sortColumn !== column) return <ArrowUpDown size={14} className="ml-1 opacity-30" />;
    return sortDirection === 'asc' ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />;
  };

  const handleDownloadCSV = () => {
    if (activeDatasetName && sortedInvoices.length > 0) { // Use sortedInvoices
      generateCSVReport(sortedInvoices, activeDatasetName);
    } else {
      // This case should be prevented by disabling the button
      console.warn("CSV download attempted without active dataset or invoices.");
    }
  };

  const handleDownloadPDF = async () => {
    if (activeDatasetName && sortedInvoices.length > 0) { // Use sortedInvoices
      setIsGeneratingPDF(true);
      try {
        await generatePDFReport(sortedInvoices, activeDatasetName);
        toast({
          title: "PDF Report Generated",
          description: `Report for ${activeDatasetName} has been downloaded.`,
        });
      } catch (error) {
        console.error("Error generating PDF report:", error);
        toast({
          title: "PDF Generation Failed",
          description: "An error occurred while generating the PDF report.",
          variant: "destructive",
        });
      } finally {
        setIsGeneratingPDF(false);
      }
    } else {
      // This case should be prevented by disabling the button
      console.warn("PDF download attempted without active dataset or invoices.");
      toast({
        title: "Cannot Generate PDF",
        description: "No active dataset or no invoices to generate a report.",
        variant: "destructive",
      });
    }
  };

  if (!activeDatasetName) {
    return (
      <motion.div
        className="p-4 md:p-6 flex justify-center items-center h-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">No Dataset Selected</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              Please select or create a dataset from the sidebar to view and manage invoices.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="p-4 md:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
          <div className="bg-background rounded-lg shadow-xl z-50 w-full max-w-md">
            <InvoiceForm
              initialData={editingInvoice}
              onSubmit={handleFormSubmit}
              onCancel={handleCloseModal}
            />
          </div>
        </div>
      )}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center gap-2"> {/* Added gap for spacing */}
            <CardTitle>Invoices ({activeDatasetName})</CardTitle>
            <div className="flex items-center gap-2"> {/* Group for buttons */}
              <Button
                onClick={handleDownloadCSV}
                disabled={!activeDatasetName || invoices.length === 0 || isGeneratingPDF}
                variant="outline"
              >
                Download CSV
              </Button>
              <Button
                onClick={handleDownloadPDF}
                disabled={!activeDatasetName || invoices.length === 0 || isGeneratingPDF}
                variant="outline"
              >
                {isGeneratingPDF ? "Generating PDF..." : "Download PDF"}
              </Button>
              <Button
                onClick={() => handleOpenModal()}
                disabled={!activeDatasetName || isGeneratingPDF}
              >
                Add New Invoice
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hidden md:table-row">
                  {/* Making headers clickable */}
                  <TableCell className="font-medium cursor-pointer hover:bg-muted/50" onClick={() => handleSort('serialNumber')}>
                    <div className="flex items-center">Serial Number {renderSortArrow('serialNumber')}</div>
                  </TableCell>
                  <TableCell className="font-medium cursor-pointer hover:bg-muted/50" onClick={() => handleSort('customerName')}>
                    <div className="flex items-center">Customer Name {renderSortArrow('customerName')}</div>
                  </TableCell>
                  <TableCell className="font-medium cursor-pointer hover:bg-muted/50" onClick={() => handleSort('productName')}>
                    <div className="flex items-center">Product Name {renderSortArrow('productName')}</div>
                  </TableCell>
                  <TableCell className="font-medium text-center cursor-pointer hover:bg-muted/50" onClick={() => handleSort('quantity')}>
                    <div className="flex items-center justify-center">Quantity {renderSortArrow('quantity')}</div>
                  </TableCell>
                  <TableCell className="font-medium text-center cursor-pointer hover:bg-muted/50" onClick={() => handleSort('tax')}>
                    <div className="flex items-center justify-center">Tax {renderSortArrow('tax')}</div>
                  </TableCell>
                  <TableCell className="font-medium text-right cursor-pointer hover:bg-muted/50" onClick={() => handleSort('totalAmount')}>
                    <div className="flex items-center justify-end">Total Amount {renderSortArrow('totalAmount')}</div>
                  </TableCell>
                  <TableCell className="font-medium cursor-pointer hover:bg-muted/50" onClick={() => handleSort('date')}>
                    <div className="flex items-center">Date {renderSortArrow('date')}</div>
                  </TableCell>
                  <TableCell className="font-medium cursor-pointer hover:bg-muted/50" onClick={() => handleSort('status')}>
                    <div className="flex items-center">Status {renderSortArrow('status')}</div>
                  </TableCell>
                  <TableCell className="font-medium text-center">Actions</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {sortedInvoices.length === 0 && ( // Use sortedInvoices for length check
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-10">
                      No invoices in dataset "{activeDatasetName}". <br />
                      Click "Add New Invoice" to create one, or upload a file.
                    </TableCell>
                  </TableRow>
                )}
                {sortedInvoices.map((invoice) => ( // Use sortedInvoices for mapping
                  <React.Fragment key={invoice.id}>
                    {/* Mobile View Row - Click to expand - Mobile view does not get sorting headers for simplicity */}
                    <TableRow
                      className="md:hidden cursor-pointer"
                      onClick={() => toggleExpand(invoice.id)}
                    >
                      <TableCell colSpan={2}> {/* Increased colspan for actions */}
                        <div className="flex justify-between items-center">
                          <span>{invoice.serialNumber} - {invoice.customerName}</span>
                          {expandedId === invoice.id ? (
                            <ChevronUp size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Mobile View - Expanded Details */}
                    {expandedId === invoice.id && (
                      <>
                        <TableRow className="md:hidden">
                          <TableCell colSpan={2}>Product: {invoice.productName}</TableCell>
                        </TableRow>
                        <TableRow className="md:hidden">
                          <TableCell colSpan={2}>Quantity: {invoice.quantity}</TableCell>
                        </TableRow>
                        <TableRow className="md:hidden">
                          <TableCell colSpan={2}>Tax: {invoice.tax}%</TableCell>
                        </TableRow>
                        <TableRow className="md:hidden">
                          <TableCell colSpan={2}>Total: ${invoice.totalAmount.toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow className="md:hidden">
                          <TableCell colSpan={2}>Date: {invoice.date}</TableCell>
                        </TableRow>
                        <TableRow className="md:hidden">
                          <TableCell colSpan={2}>Status: {invoice.status}</TableCell>
                        </TableRow>
                        <TableRow className="md:hidden">
                          <TableCell colSpan={2}>
                            <div className="flex space-x-2 justify-end">
                              <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleOpenModal(invoice); }}>
                                <Edit size={16} className="mr-1" /> Edit
                              </Button>
                              <Button variant="destructive" size="sm" onClick={(e) => { e.stopPropagation(); handleDeleteInvoice(invoice.id); }}>
                                <Trash2 size={16} className="mr-1" /> Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      </>
                    )}

                    {/* Desktop View Row */}
                    <TableRow className="hidden md:table-row">
                      <TableCell>{invoice.serialNumber}</TableCell>
                      <TableCell>{invoice.customerName}</TableCell>
                      <TableCell>{invoice.productName}</TableCell>
                      <TableCell className="text-center">{invoice.quantity}</TableCell>
                      <TableCell className="text-center">{invoice.tax}%</TableCell>
                      <TableCell className="text-right">${invoice.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>{invoice.status}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex space-x-2 justify-center">
                          <Button variant="outline" size="icon" onClick={() => handleOpenModal(invoice)}>
                            <Edit size={16} />
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => handleDeleteInvoice(invoice.id)}>
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InvoicesTab;
// Ensure there's a newline at the end of the file if there wasn't one.
