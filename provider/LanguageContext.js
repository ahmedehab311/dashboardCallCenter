"use client"
import React, { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const lang = localStorage.getItem("lang") ;
      setCurrentLang(lang);
      // console.log("Initialized language from localStorage:", lang);
    }
  }, []); 

  return (
    <LanguageContext.Provider value={{ currentLang, setCurrentLang }}>
      {children}
    </LanguageContext.Provider>
  );
};


export const useLanguage = () => useContext(LanguageContext);
