// // store/slices/languageSlice.js
// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   language: "en",
// };

// const languageSlice = createSlice({
//   name: "language",
//   initialState,
//   reducers: {
//     setLanguage: (state, action) => {
//       state.language = action.payload;
//       console.log("Language set to:", state.language);
//     },
//   },
//   extraReducers: (builder) => {
//     builder.addCase("settings/fetchSettings/fulfilled", (state, action) => {
//       if (action.payload.system.defaultSystemLanguage) {
//         state.language = action.payload.system.defaultSystemLanguage;
//         console.log("Default system language:", state.language);
//       }
//     });
//   },
// });

// export const { setLanguage } = languageSlice.actions;

// export default languageSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  language: "en",
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
      // console.log("Language set to:", state.language);
    },
  },
  extraReducers: (builder) => {
    builder.addCase("settings/fetchSettings/fulfilled", (state, action) => {
      const storedLanguage = localStorage.getItem("language");

      if (storedLanguage) {
        state.language = storedLanguage;
        // console.log("Language from localStorage:", state.language);
      } else if (action.payload.system.defaultSystemLanguage) {
        state.language = action.payload.system.defaultSystemLanguage;
        // console.log("Default system language:", state.language);
      }
    });
  },
});

export const { setLanguage } = languageSlice.actions;

export default languageSlice.reducer;
