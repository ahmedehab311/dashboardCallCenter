/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { Suspense, useEffect, useState, useMemo } from "react";
import { useLanguage } from "@/provider/LanguageContext";
import DashBoardLayoutProvider from "@/provider/dashboard.layout.provider";
import Loader from "@/components/layout-loader";
import { getDictionary } from "@/app/dictionaries";
import Cookies from "js-cookie";
const Layout = ({ children }) => {
  const { currentLang } = useLanguage();
  const [trans, setTrans] = useState(null);

  useEffect(() => {
    const loadDictionary = async () => {
      const dictionary = await getDictionary(currentLang);
      setTrans(dictionary);
    };
    loadDictionary();
  }, [currentLang]);

  if (!trans) {
    return <Loader />;
  }

  return (
    <DashBoardLayoutProvider trans={trans}>{children}</DashBoardLayoutProvider>
  );
};

export default Layout;
