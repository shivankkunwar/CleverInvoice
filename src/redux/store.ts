import { configureStore } from '@reduxjs/toolkit';
import invoicesReducer from './slices/invoicesSlice.ts';
import productsReducer from './slices/productsSlice.ts';
import customersReducer from './slices/customersSlice.ts';
import uiReducer from './slices/uiSlice.ts'; // Import uiReducer

const store = configureStore({
  reducer: {
    invoices: invoicesReducer,
    products: productsReducer,
    customers: customersReducer,
    ui: uiReducer, // Add uiReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;