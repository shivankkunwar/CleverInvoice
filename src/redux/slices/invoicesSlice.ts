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

// Changed initialState structure
const initialState: Record<string, Invoice[]> = {};

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    // Modified addInvoices
    addInvoices: (state, action: PayloadAction<{ datasetName: string; invoices: Invoice[] }>) => {
      const { datasetName, invoices } = action.payload;
      if (!state[datasetName]) {
        state[datasetName] = [];
      }
      state[datasetName].push(...invoices);
    },
    // Modified addInvoice
    addInvoice: (state, action: PayloadAction<{ datasetName: string; invoice: Invoice }>) => {
      const { datasetName, invoice } = action.payload;
      if (!state[datasetName]) {
        state[datasetName] = [];
      }
      state[datasetName].push(invoice);
    },
    // Modified updateInvoice
    updateInvoice: (state, action: PayloadAction<{ datasetName: string; id: string; updates: Partial<Invoice> }>) => {
      const { datasetName, id, updates } = action.payload;
      const dataset = state[datasetName];
      if (dataset) {
        const index = dataset.findIndex(invoice => invoice.id === id);
        if (index !== -1) {
          dataset[index] = { ...dataset[index], ...updates };
        }
      }
    },
    // Modified deleteInvoice
    deleteInvoice: (state, action: PayloadAction<{ datasetName: string; id: string }>) => {
      const { datasetName, id } = action.payload;
      const dataset = state[datasetName];
      if (dataset) {
        state[datasetName] = dataset.filter(invoice => invoice.id !== id);
      }
    },
    // New action: createDataset
    createDataset: (state, action: PayloadAction<string>) => {
      const datasetName = action.payload;
      if (!state[datasetName]) {
        state[datasetName] = [];
      }
    },
    // New action: deleteDataset
    deleteDataset: (state, action: PayloadAction<string>) => {
      const datasetName = action.payload;
      delete state[datasetName];
    },
    // New action: renameDataset
    renameDataset: (state, action: PayloadAction<{ oldName: string; newName: string }>) => {
      const { oldName, newName } = action.payload;
      if (state[oldName] && !state[newName]) {
        state[newName] = state[oldName];
        delete state[oldName];
      }
    },
    // Removed updateInvoicesForCustomer and updateInvoicesForProduct
  },
});

export const {
  addInvoices,
  addInvoice,
  updateInvoice,
  deleteInvoice,
  createDataset,
  deleteDataset,
  renameDataset,
} = invoicesSlice.actions;
export default invoicesSlice.reducer;