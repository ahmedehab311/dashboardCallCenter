// store/slices/themeSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { siteConfig } from "@/config/site";

const initialState = {
  theme: siteConfig.theme,
  radius: siteConfig.radius,
  layout: "semibox",
  navbarType: siteConfig.navbarType,
  footerType: siteConfig.footerType,
  isRtl: false,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setRadius: (state, action) => {
      state.radius = action.payload;
    },
    setLayout: (state, action) => {
      state.layout = "semibox"; 
      
    },
    setNavbarType: (state, action) => {
      state.navbarType = action.payload;
    },
    setFooterType: (state, action) => {
      state.footerType = action.payload;
    },
    setRtl: (state, action) => {
      state.isRtl = action.payload;
    },
  },
});

export const { setTheme, setRadius, setLayout, setNavbarType, setFooterType, setRtl } = themeSlice.actions;
export default themeSlice.reducer;
