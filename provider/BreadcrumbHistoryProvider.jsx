// "use client";
// import { createContext, useContext, useState, useEffect } from "react";
// import { usePathname } from "next/navigation";
// import { Menus } from "@/app/[lang]/dashboard/menus/apisMenu";
// import {sections} from "@/app/[lang]/dashboard/sections/sectionArray";
// import { formatLabelFromPath } from "@/lib/utils";
// const BreadcrumbContext = createContext();

// export const BreadcrumbHistoryProvider = ({ children }) => {
//   const pathname = usePathname();
//   const [breadcrumbs, setBreadcrumbs] = useState([]);
// const formatLabelFromPath = (pathname) => {
//   const parts = pathname.split("/").filter(Boolean);
//   const result = [];

//   for (let i = 0; i < parts.length; i++) {
//     const part = parts[i];

//     // --- الحالة الخاصة بـ "view"
//     if (part === "view") {
//       const id = parts[i - 1];
//       const type = parts[i - 2];

//       let name = null;

//       if (type === "menu") {
//         const menu = Menus.find((m) => m.id === id);
//         if (menu) name = menu.name;
//       }

//       if (type === "section") {
//         const section = sections.find((s) => s.id === id);
//         if (section) name = section.name;
//       }

//       if (type === "item") {
//         for (const section of sections) {
//           const item = section.items?.find((i) => i.id === id);
//           if (item) {
//             name = item.name;
//             break;
//           }
//         }
//       }

//       if (name) result.push(name);
//       result.push("View");
//       continue;
//     }

//     // --- أسماء ثابتة
//     if (
//       [
//         "dashboard",
//         "menus",
//         "menu",
//         "sections",
//         "section",
//         "items",
//         "item",
//         "create-menu",
//         "create-section",
//       ].includes(part)
//     ) {
//       result.push(formatLabel(part));
//       continue;
//     }

//     // --- menu/:id
//     if (parts[i - 1] === "menu") {
//       const menu = Menus.find((m) => m.id === part);
//       result.push(menu?.name || part);
//       continue;
//     }

//     // --- section/:id
//     if (parts[i - 1] === "section") {
//       const section = sections.find((s) => s.id === part);
//       result.push(section?.name || part);
//       continue;
//     }

//     // --- item/:id
//     if (parts[i - 1] === "item") {
//       let foundItem = null;
//       for (const section of sections) {
//         const item = section.items?.find((i) => i.id === part);
//         if (item) {
//           foundItem = item;
//           break;
//         }
//       }
//       result.push(foundItem?.name || part);
//       continue;
//     }

//     // fallback
//     result.push(formatLabel(part));
//   }

//   return result;
// };

// useEffect(() => {
//   if (!pathname) return;

//   const labelParts = formatLabelFromPath(pathname); // Array زي ["Dashboard", "Sections", "Pizza", "View"]
//   const pathParts = pathname.split("/").filter(Boolean); // نفس عدد العناصر

//   const builtBreadcrumbs = [];

//   for (let i = 0; i < labelParts.length; i++) {
//     const path = "/" + pathParts.slice(0, i + 1).join("/");

//     builtBreadcrumbs.push({
//       path,
//       label: labelParts[i],
//     });
//   }

//   setBreadcrumbs(builtBreadcrumbs);
// }, [pathname]);

//   return (
//     <BreadcrumbContext.Provider value={{ breadcrumbs }}>
//       {children}
//     </BreadcrumbContext.Provider>
//   );
// };

// export const useBreadcrumbHistory = () => useContext(BreadcrumbContext);

// const formatLabel = (label) => {
//   // أول حرف كابيتال
//   if (label === "dashboard") return "Dashboard";
//   if (label === "view") return "View";
//   return label.charAt(0).toUpperCase() + label.slice(1);
// };
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { sections } from "@/app/[lang]/dashboard/sections/apisSection";
import { useSubdomin } from "./SubdomainContext";
import { useMenus } from "@/app/[lang]/dashboard/menus/apisMenu";

const BreadcrumbContext = createContext();

export const BreadcrumbHistoryProvider = ({ children }) => {
  const { apiBaseUrl, token } = useSubdomin(); // بتجيب التوكن واللينك
  const {
    data: Menus,
    isLoading,
    error,
    refetch,
  } = useMenus(token, apiBaseUrl);
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  // useEffect(() => {
  //   if (!pathname) return;

  //   setBreadcrumbs((prev) => {
  //     const existingIndex = prev.findIndex((b) => b.path === pathname);
  //     if (existingIndex !== -1) {
  //       // رجعت لواحد قديم → امسح اللي بعده
  //       return prev.slice(0, existingIndex + 1);
  //     }

  //     const label = getSmartLabel(pathname, Menus);
  //     return [...prev, { path: pathname, label }];
  //   });
  // }, [pathname]);
  useEffect(() => {
  if (!pathname || isLoading || !Menus?.length) return;

  setBreadcrumbs((prev) => {
    const existingIndex = prev.findIndex((b) => b.path === pathname);
    if (existingIndex !== -1) {
      return prev.slice(0, existingIndex + 1);
    }

    const label = getSmartLabel(pathname, Menus);
    return [...prev, { path: pathname, label }];
  });
}, [pathname, Menus, isLoading]);


  return (
    <BreadcrumbContext.Provider value={{ breadcrumbs }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

export const useBreadcrumbHistory = () => useContext(BreadcrumbContext);

const getSmartLabel = (pathname, Menus) => {
  const parts = pathname.split("/").filter(Boolean);

  //  تجاهل اللغة مثل "en" أو "ar"
  const langCodes = ["en", "ar", "fr"]; // لو عندك لغات تانية ضيفها هنا
  const cleanedParts = langCodes.includes(parts[0]) ? parts.slice(1) : parts;

  const last = cleanedParts[cleanedParts.length - 1];
  const prev = cleanedParts[cleanedParts.length - 2];
  const beforePrev = cleanedParts[cleanedParts.length - 3];

  //  باقي الكود بنفس الطريقة لكن استبدل `parts` بـ `cleanedParts`
  if (last === "view") {
    const id = prev;
    const type = beforePrev;

    if (type === "menu") {
      const found = Menus?.find((m) => m.id === Number(id));
      return found ? `${found.name_en} View` : `Menu ${id} View`;
    }
    if (type === "section") {
      const found = sections?.find((m) => m.id === Number(id));
      return found ? `${found.name} View` : `Section ${id} View`;
    }

    if (type === "item") {
      for (const section of sections) {
        const item = section.items?.find((i) => i.id === id);
        if (item) return `${item.name} View`;
      }
      return `Item ${id} View`;
    }
  }

  if (prev === "menu") {
    const found = Menus?.find((m) => m.id === Number(last));
    return found?.name_en || `Menu ${last}`;
  }

  if (prev === "section") {
    const found = sections.find((s) => s.id === last);
    return found?.name || `Section ${last}`;
  }

  if (prev === "item") {
    for (const section of sections) {
      const item = section.items?.find((i) => i.id === last);
      if (item) return item.name;
    }
    return `Item ${last}`;
  }

  return formatLabel(last);
};

const formatLabel = (label) => {
  if (label === "dashboard") return "Dashboard";
  return label.charAt(0).toUpperCase() + label.slice(1);
};
