// store/slices/allLanguageSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/api/axiosInstance";

export const fetchAllLanguages = createAsyncThunk(
  "languages/fetchLanguages",
  async () => {
    const response = await axiosInstance.get("/panel/languages/locales");
    // console.log("/panel/languages/locales", response.data.response.data);
    // console.log("languages", response.data.response.data);

    return response.data.response.data;
  }
);

const allLanguageSlice = createSlice({
  name: "languages",
  initialState: {
    languages: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllLanguages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllLanguages.fulfilled, (state, action) => {
        state.languages = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllLanguages.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export default allLanguageSlice.reducer;
