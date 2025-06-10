import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  activeDatasetName: string | null;
}

const initialState: UIState = {
  activeDatasetName: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveDatasetName: (state, action: PayloadAction<string | null>) => {
      state.activeDatasetName = action.payload;
    },
  },
});

export const { setActiveDatasetName } = uiSlice.actions;
export default uiSlice.reducer;
