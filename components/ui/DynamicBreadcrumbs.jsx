// // "use client";

// // import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
// // import { useParams, usePathname } from "next/navigation";

// // import Link from "next/link";
// // import { useMemo } from "react";

// // const DynamicBreadcrumbs = () => {
// //   const pathname = usePathname();
// //  const { lang } = useParams();
// //   // تحديد كل المسارات
// //   const ordersMenu = [
// //     "/dashboard/menus",
// //     "/dashboard/create-menu",
// //     "/dashboard/menu/:id/view",
// //     "/dashboard/menus/:id",
// //     "/dashboard/menu/:id",
// //   ];

// //   const sectionPaths = [
// //     "/dashboard/sections",
// //     "/dashboard/create-section",
// //     "/dashboard/section/:id/view",
// //     "/dashboard/section/:id",
// //   ];

// //   const itemsPaths = [
// //     "/dashboard/items",
// //     "/dashboard/create-item",
// //     "/dashboard/item/:id/view",
// //     "/dashboard/item/:id",
// //   ];

// //   // 🧠 استخدم useMemo لحساب الـ breadcrumbs مرة واحدة

// //   const breadcrumbs = useMemo(() => {
// //     const parts = pathname.split("/").filter(Boolean);
// //     const crumbs = [];

// //     if (parts.includes("dashboard")) {
// //       crumbs.push({
// //         label: "Dashboard",
// //         href: `/${lang}/dashboard`, // 🟢 استخدام اللغة
// //       });
// //     }

// //     parts.forEach((part, index) => {
// //       const isLang = part === lang;
// //       const isId = /^\d+$/.test(part) || part.includes(":");

// //       if (!isLang && !isId && part !== "dashboard") {
// //         const label = decodeURIComponent(part).replace(/-/g, " ");
// //         const href = "/" + parts.slice(0, index + 1).join("/");
// //         crumbs.push({
// //           label: label.charAt(0).toUpperCase() + label.slice(1),
// //           href: `/${lang}${href.startsWith(`/${lang}`) ? "" : href}`, // 🟢 تأكد أن href فيه lang
// //         });
// //       }
// //     });

// //     return crumbs;
// //   }, [pathname, lang]);

// //   if (breadcrumbs.length <= 1) return null;

// //   return (
// //     <div className="mb-4">
// //       <Breadcrumbs>
// //         {breadcrumbs.map((crumb, idx) => (
// //           <BreadcrumbItem key={idx}>
// //             <Link href={crumb.href}>{crumb.label}</Link>
// //           </BreadcrumbItem>
// //         ))}
// //       </Breadcrumbs>
// //     </div>
// //   );
// // };

// // export default DynamicBreadcrumbs;

// "use client";
// import { usePathname, useParams } from "next/navigation";
// import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import {sections} from "@/app/[lang]/dashboard/sections/sectionArray";
// import { Menus } from "@/app/[lang]/dashboard/menus/apisMenu";

// const DynamicBreadcrumbs = () => {
//   const pathname = usePathname();
//   const { lang } = useParams();
//   const [breadcrumbList, setBreadcrumbList] = useState([]);

//   useEffect(() => {
//     const parts = pathname.split("/").filter(Boolean);
//     const crumbs = [];
//     let currentPath = "";

//     for (let i = 0; i < parts.length; i++) {
//       const part = parts[i];
//       currentPath += `/${part}`;

//       // Dashboard ثابت
//       if (part === "dashboard") {
//         crumbs.push({ label: "Dashboard", href: `/${lang}${currentPath}` });
//       }

//       // Menus
//       else if (part === "menu" && parts[i + 1]) {
//         const menuId = parts[i + 1];
//         const menu = Menus.find((m) => m.id === menuId);
//         if (menu) {
//           crumbs.push({
//             label: menu.name,
//             href: `/${lang}/dashboard/menu/${menu.id}`,
//           });
//         }
//       }

//       // Sections
//       else if (part === "section" && parts[i + 1]) {
//         const sectionId = parts[i + 1];
//         const section = sections.find((s) => s.id === sectionId);
//         if (section) {
//           crumbs.push({
//             label: section.name,
//             href: `/${lang}/dashboard/section/${section.id}`,
//           });
//         }
//       }

//       // Items داخل section
//       else if (part === "item" && parts[i + 1]) {
//         const itemId = parts[i + 1];
//         const allItems = sections.flatMap((s) => s.items || []);
//         const item = allItems.find((it) => it.id === itemId);
//         if (item) {
//           crumbs.push({
//             label: item.name,
//             href: `/${lang}/dashboard/item/${item.id}`,
//           });
//         }
//       }

//       // كلمات إضافية زي "view"
//       else if (
//         part !== "en" &&
//         part !== "menu" &&
//         part !== "section" &&
//         part !== "item" &&
//         !/^\d+$/.test(part)
//       ) {
//         crumbs.push({
//           label: capitalize(part),
//           href: `/${lang}${currentPath}`,
//         });
//       }
//     }

//     setBreadcrumbList(crumbs);
//   }, [pathname]);

//   if (!breadcrumbList.length) return null;

//   return (
//     <div className="px-4 py-2">
//       <Breadcrumbs>
//         {breadcrumbList.map((crumb, i) => (
//           <BreadcrumbItem key={i}>
//             <Link href={crumb.href}>{crumb.label}</Link>
//           </BreadcrumbItem>
//         ))}
//       </Breadcrumbs>
//     </div>
//   );
// };

// const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// export default DynamicBreadcrumbs;

// "use client";
// import Link from "next/link";
// import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
// import { useBreadcrumbHistory } from "@/provider/BreadcrumbHistoryProvider";
// import { usePathname } from "next/navigation";

// const DynamicBreadcrumbs = () => {
//   const { breadcrumbs } = useBreadcrumbHistory();
//  const pathname = usePathname();
//   if (!breadcrumbs.length) return null;

//   return (
//     <div className="py-1">
//        <Breadcrumbs>
//         {breadcrumbs.map((crumb, i) => {
//           const isActive = pathname === crumb.path;
//           return (
//             <BreadcrumbItem
//               key={i}
//               className={isActive ? "text-primary font-semibold" : ""}
//               isCurrent={isActive}
//             >
//               <Link href={crumb.path}>{crumb.label}</Link>

//             </BreadcrumbItem>
//           );
//         })}
//       </Breadcrumbs>
//     </div>
//   );
// };

// export default DynamicBreadcrumbs;
"use client";
import Link from "next/link";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { useBreadcrumbHistory } from "@/provider/BreadcrumbHistoryProvider";
import { usePathname } from "next/navigation";

const DynamicBreadcrumbs = () => {
  const { breadcrumbs } = useBreadcrumbHistory();
  const pathname = usePathname();

  if (!breadcrumbs.length) return null;

  return (
    <div className="py-1">
      <Breadcrumbs>
        {breadcrumbs.map((crumb, i) => {
          const isActive = pathname === crumb.path;
          return (
            <BreadcrumbItem
              key={i}
              isCurrent={isActive}
              className={isActive ? "text-primary font-semibold" : ""}
            >
              <Link href={crumb.path}>{crumb.label}</Link>
            </BreadcrumbItem>
          );
        })}
      </Breadcrumbs>
    </div>
  );
};

export default DynamicBreadcrumbs;
