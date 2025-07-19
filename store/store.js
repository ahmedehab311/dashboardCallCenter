// store/store.js
"use client";
import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/themeSlice";
import sidebarReducer from "./slices/sidebarSlice";
import languageReducer from "./slices/languageSlice";
import authReducer from "./slices/authSlice";
import sectionsReducer from "./slices/sectionsSlice";
// import itemsReducer from "./slices/itemsSlice";
import settingsReducer from "./slices/systemSlice";
import allLanguageReducer from "./slices/allLanguageSlice";
import statusReducer from "./slices/statusSlice";
import pushUpdateReducer from "./slices/pushUpdateSlice";
import deviceReducer from "./slices/devicesStatus";

const store = configureStore({
  reducer: {
    settings: settingsReducer,
    theme: themeReducer,
    // sidebar: sidebarReducer,
    language: languageReducer,
    auth: authReducer,
    sections: sectionsReducer,
    // items: itemsReducer,
    languages: allLanguageReducer,
    statuses: statusReducer,
    statuses: statusReducer,
    PushUpdatestatuses: pushUpdateReducer,
    DevicesStatuses: deviceReducer,
  },
});

export default store;
