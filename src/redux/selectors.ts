import { RootState } from './store';

export const selectInvoices = (state: RootState) => state.invoices;
export const selectProducts = (state: RootState) => state.products;
export const selectCustomers = (state: RootState) => state.customers;