import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Customer {
  id: string;
  name: string;
  phoneNumber: string;
  companyName: string | null;
  totalPurchaseAmount: number;
  status: 'complete' | 'missing_fields';
}

const initialState: Customer[] = [];

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    addCustomers: (state, action: PayloadAction<Customer[]>) => {
      return [...state, ...action.payload];
    },
    updateCustomer: (state, action: PayloadAction<Partial<Customer> & { id: string }>) => {
      const index = state.findIndex(customer => customer.id === action.payload.id);
      if (index !== -1) {
        state[index] = { ...state[index], ...action.payload };
      }
    },
  },
});

export const { addCustomers, updateCustomer } = customersSlice.actions;
export default customersSlice.reducer;