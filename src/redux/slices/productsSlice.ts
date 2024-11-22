import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Product {
  id: string;
  name: string;
  totalQuantity: number;
  unitPrice: number;
  discount: string;
  tax: number;
  priceWithTax: number;
  status: "complete" | "missing_fields";
}

const initialState: Product[] = [];

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProducts: (state, action: PayloadAction<Product[]>) => {
      return [...state, ...action.payload];
    },
    updateProduct: (
      state,
      action: PayloadAction<Partial<Product> & { id: string }>
    ) => {
      const index = state.findIndex(
        (product) => product.id === action.payload.id
      );
      if (index !== -1) {
        state[index] = { ...state[index], ...action.payload };
      }
    },
  },
});

export const { addProducts, updateProduct } = productsSlice.actions;
export default productsSlice.reducer;
