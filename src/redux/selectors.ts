import { RootState } from './store';
import { Invoice } from './slices/invoicesSlice'; // Import Invoice if needed for type hints, though RootState should suffice

// Updated selectInvoices to accept datasetName
export const selectInvoices = (state: RootState, datasetName: string): Invoice[] => {
  return state.invoices[datasetName] || [];
};

// New selector for all invoices grouped by dataset
export const selectAllInvoicesByDataset = (state: RootState): Record<string, Invoice[]> => {
  return state.invoices;
};

// New selector for dataset names
export const selectDatasetNames = (state: RootState): string[] => {
  return Object.keys(state.invoices);
};

export const selectProducts = (state: RootState) => state.products;
export const selectCustomers = (state: RootState) => state.customers;