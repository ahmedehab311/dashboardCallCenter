import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const SECRET_KEY = "039e9def-f418-4a13-b414-0dfaa2d79b79";
// const SECRET_KEY = "039e9def-f418-4a13-b413-0dfaa2d79b77";

// const SECRET_KEY =
//   process.env.NODE_ENV === "production"
//     ? "039e9def-f418-4a13-b414-0dfaa2d79b79"
//     : "039e9def-f420-4a13-b414-0dfaa2d79b77";
// console.log("secret", SECRET_KEY);
export const fetchSettings = createAsyncThunk(
  "settings/fetchSettings",
  async (_, { rejectWithValue }) => {
    const apiUrl =
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_BASE_URL_PRODUCTION
        : process.env.NEXT_PUBLIC_BASE_URL_DEVELOPMENT;
    // const apiUrl = "http://ordrz.me/api";
    try {
      const response = await axios.get(
        "http://ordrz.me/api/settings/secret-key",
        // `${apiUrl}/settings/secret-key`,
        {
          headers: {
            Authorization: `Bearer ${SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      if (error.request) {
        return rejectWithValue(error.request);
      }
      return rejectWithValue(error.message);
    }
  }
);

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    domain: null,
    systemToken: null,
    defaultSystemLanguage: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.domain = action.payload.system.domain;
        state.systemToken = action.payload.systemToken;
        state.defaultSystemLanguage =
          action.payload.system.defaultSystemLanguage;
        const languageInCookies = Cookies.get("language");

        if (languageInCookies) {
          Cookies.remove("defaultLang");
        } else {
          Cookies.set(
            "defaultLang",
            action.payload.system.defaultSystemLanguage
          );
        }
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default settingsSlice.reducer;
