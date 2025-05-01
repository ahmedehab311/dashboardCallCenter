"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { getDictionary } from "@/app/dictionaries";

const TranslationContext = createContext();

export const TranslationProvider = ({ children, locale }) => {
  const [translations, setTranslations] = useState(null);

  useEffect(() => {
    const loadTranslations = async () => {
      const dictionary = await getDictionary(locale);
      setTranslations(dictionary);
    };
    loadTranslations();
  }, [locale]);

  return (
    <TranslationContext.Provider value={translations}>
      {translations ? children : <div>Loading...</div>}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => useContext(TranslationContext);
