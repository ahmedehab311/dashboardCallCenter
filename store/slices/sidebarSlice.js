// // store/slices/sidebarSlice.js
// import { createSlice } from "@reduxjs/toolkit";
// import { siteConfig } from "@/config/site";

// const initialState = {
//   collapsed: false,
//   sidebarType: siteConfig.layout === "semibox" ? "popover" : siteConfig.sidebarType,
//   subMenu: false,
//   sidebarBg: siteConfig.sidebarBg,
//   mobileMenu: false,
// };

// const sidebarSlice = createSlice({
//   name: "sidebar",
//   initialState,
//   reducers: {
//     setCollapsed: (state, action) => {
//       state.collapsed = action.payload;
//     },
//     setSidebarType: (state, action) => {
//       state.sidebarType = action.payload;
//     },
//     setSubmenu: (state, action) => {
//       state.subMenu = action.payload;
//     },
//     setSidebarBg: (state, action) => {
//       state.sidebarBg = action.payload;
//     },
//     setMobileMenu: (state, action) => {
//       state.mobileMenu = action.payload;
//     },
//   },
// });

// export const { setCollapsed, setSidebarType, setSubmenu, setSidebarBg, setMobileMenu } = sidebarSlice.actions;
// export default sidebarSlice.reducer;
