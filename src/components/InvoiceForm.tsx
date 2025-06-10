import React, { useState, useEffect } from 'react';
import { Invoice } from '../redux/slices/invoicesSlice';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface InvoiceFormProps {
  initialData?: Invoice | null;
  onSubmit: (invoiceData: Omit<Invoice, 'id'> | Invoice) => void;
  onCancel: () => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Invoice, 'id'>>({
    serialNumber: '',
    customerName: '',
    productName: '',
    quantity: 0,
    tax: 0,
    totalAmount: 0,
    date: new Date().toISOString().split('T')[0], // Default to today
    status: 'missing_fields',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // Reset form for new invoice
      setFormData({
        serialNumber: '',
        customerName: '',
        productName: '',
        quantity: 0,
        tax: 0,
        totalAmount: 0,
        date: new Date().toISOString().split('T')[0],
        status: 'missing_fields',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const completeFormData: Omit<Invoice, 'id'> | Invoice = initialData
    ? { ...initialData, ...formData } // Preserve ID if editing
    : formData;
    onSubmit(completeFormData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Invoice' : 'Add New Invoice'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700">Serial Number</label>
            <Input type="text" name="serialNumber" id="serialNumber" value={formData.serialNumber} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">Customer Name</label>
            <Input type="text" name="customerName" id="customerName" value={formData.customerName} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700">Product Name</label>
            <Input type="text" name="productName" id="productName" value={formData.productName} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
            <Input type="number" name="quantity" id="quantity" value={formData.quantity} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="tax" className="block text-sm font-medium text-gray-700">Tax (%)</label>
            <Input type="number" name="tax" id="tax" value={formData.tax} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700">Total Amount</label>
            <Input type="number" name="totalAmount" id="totalAmount" value={formData.totalAmount} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
            <Input type="date" name="date" id="date" value={formData.date} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              <option value="complete">Complete</option>
              <option value="missing_fields">Missing Fields</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">{initialData ? 'Update Invoice' : 'Add Invoice'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default InvoiceForm;
