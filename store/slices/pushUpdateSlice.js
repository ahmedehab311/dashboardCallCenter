import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const pushUpdateSlice = createSlice({
  name: "PushUpdatestatuses",
  initialState,
  reducers: {
    pushUpdateStatusInStore: (state, action) => {
      const { id, UpdateStatus } = action.payload;
      state[id] = UpdateStatus;
    },
  },
});

export const {pushUpdateStatusInStore } = pushUpdateSlice.actions;
export default pushUpdateSlice.reducer;
