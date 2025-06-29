"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menus } from "@/app/[lang]/dashboard/menus/apisMenu";
import sections from "@/app/[lang]/dashboard/sections/sectionArray";

const BreadcrumbContext = createContext();

export const BreadcrumbHistoryProvider = ({ children }) => {
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState([]);
 const formatLabelFromPath = (pathname) => {
  const parts = pathname.split("/").filter(Boolean);
  const last = parts[parts.length - 1];

  // لو الكلمة ثابتة (زي dashboard أو menus)
  if (["dashboard", "menus", "sections", "items", "view"].includes(last)) {
    return formatLabel(last);
  }

  const id = last;

  // ✅ الأول نحاول نجيبه من السكاشن
  if (Array.isArray(sections)) {
    for (let section of sections) {
      if (section.id === id) return section.name;

      // ✅ كمان لو الـ id جاي من items جوا السيكشن
      if (Array.isArray(section.items)) {
        for (let item of section.items) {
          if (item.id === id) return item.name;
        }
      }
    }
  }

  // ✅ بعد كده نروح للـ Menus
  if (Array.isArray(Menus)) {
    for (let menu of Menus) {
      if (menu.id === id) return menu.name;
    }
  }

  // fallback: تنسيق الاسم الأخير
  return formatLabel(last);
};

  useEffect(() => {
    if (!pathname) return;
    setBreadcrumbs((prev) => {
      const existingIndex = prev.findIndex((b) => b.path === pathname);
      if (existingIndex !== -1) {
        return prev.slice(0, existingIndex + 1);
      }
      const label = formatLabelFromPath(pathname);

      return [...prev, { path: pathname, label: formatLabel(label) }];
    });
  }, [pathname]);

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbs }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

export const useBreadcrumbHistory = () => useContext(BreadcrumbContext);

const formatLabel = (label) => {
  // أول حرف كابيتال
  if (label === "dashboard") return "Dashboard";
  if (label === "view") return "View";
  return label.charAt(0).toUpperCase() + label.slice(1);
};
