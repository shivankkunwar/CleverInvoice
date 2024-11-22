import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Invoice {
  id: string;
  serialNumber: string;
  customerName: string;
  productName: string;
  quantity: number;
  tax: number;
  totalAmount: number;
  date: string;
  status: 'complete' | 'missing_fields';
}

const initialState: Invoice[] = [];

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    addInvoices: (state, action: PayloadAction<Invoice[]>) => {
      return [...state, ...action.payload];
    },
    updateInvoicesForCustomer: (state, action: PayloadAction<{ name: string, updates: Partial<Invoice> }>) => {
      return state.map(invoice => 
        invoice.customerName === action.payload.name 
          ? { ...invoice, ...action.payload.updates }
          : invoice
      );
    },
    updateInvoicesForProduct: (state, action: PayloadAction<{ name: string, updates: Partial<Invoice> }>) => {
      return state.map(invoice => 
        invoice.productName === action.payload.name 
          ? { ...invoice, ...action.payload.updates }
          : invoice
      );
    },
  },
});

export const { addInvoices, updateInvoicesForCustomer, updateInvoicesForProduct } = invoicesSlice.actions;
export default invoicesSlice.reducer;