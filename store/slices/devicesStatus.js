import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const DeviceSlice = createSlice({
  name: "DevicesStatuses",
  initialState,
  reducers: {
    devicesStatusInStore: (state, action) => {
      const { id, UpdateStatus } = action.payload;
      state[id] = UpdateStatus;
    },
  },
});

export const { devicesStatusInStore } = DeviceSlice.actions;
export default DeviceSlice.reducer;
