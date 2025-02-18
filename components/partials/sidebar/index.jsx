"use client";
import React, { useEffect, useState } from "react";
import { useSidebar } from "@/store";
import { useMediaQuery } from "@/hooks/use-media-query";
import PopoverSidebar from "./popover";
import MobileSidebar from "./mobile-sidebar";
import { getDictionary } from "@/app/dictionaries";
const Sidebar = ({ lang, trans }) => {
  const [translations, setTranslations] = useState({});
  const { sidebarType, collapsed } = useSidebar();
  const isDesktop = useMediaQuery("(min-width: 1280px)");
  // console.log("lang from sidbar", lang);
  // console.log("trans from sidbar", trans);
  useEffect(() => {
    const loadTranslations = async () => {
      const trans = await getDictionary(lang);
      setTranslations(trans);
    };

    loadTranslations();
  }, [lang]);

  let selectedSidebar = null;

  if (!isDesktop && (sidebarType === "popover" || sidebarType === "classic")) {
    selectedSidebar = <MobileSidebar />;
  } else {
    const sidebarComponents = {
      popover: (
        <PopoverSidebar
          collapsed={collapsed}
          trans={translations}
          lang={lang}
        />
      ),
    };

    selectedSidebar = sidebarComponents[sidebarType];
  }

  return <div>{selectedSidebar}</div>;
};

export default React.memo(Sidebar);
