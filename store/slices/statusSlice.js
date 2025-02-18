// statusSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const statusSlice = createSlice({
  name: 'statuses',
  initialState,
  reducers: {
    updateStatusInStore: (state, action) => {
      const { id, status } = action.payload;
      state[id] = status;  
    },
  },
});

export const { updateStatusInStore } = statusSlice.actions;
export default statusSlice.reducer;
