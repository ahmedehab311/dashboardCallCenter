"use client";
import React, { useMemo, useState, useCallback } from "react";

import { cn, isLocationMatch, getDynamicPath } from "@/lib/utils";
import SidebarLogo from "../logo";
import { menusConfig } from "@/config/menus";
// import MenuLabel from "../common/menu-label";
import SingleMenuItem from "./single-menu-item";
import SubMenuHandler from "./sub-menu-handler";
import NestedSubMenu from "../common/nested-menus";
import { useSidebar, useThemeStore } from "@/store";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import Link from "next/link";
import LayoutLoader from "/components/layout-loader.jsx";

const PopoverSidebar = ({ trans, lang }) => {
  const { collapsed, sidebarBg } = useSidebar();
  const { layout, isRtl } = useThemeStore();
  const currentLang = useSelector((state) => state.language.language);
  const menus = useMemo(
    () => menusConfig(currentLang).sidebarNav.classic || [],
    [currentLang]
  );
  const [activeMultiMenu, setMultiMenu] = useState(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  // console.log("Trans object:", trans);
  const pathname = usePathname();
  const locationName = getDynamicPath(pathname);

  const toggleSubmenu = (i) => {
    if (activeSubmenu === i) {
      setActiveSubmenu(null);
    } else {
      setActiveSubmenu(i);
    }
  };

  const toggleMultiMenu = (subIndex) => {
    if (activeMultiMenu === subIndex) {
      setMultiMenu(null);
    } else {
      setMultiMenu(subIndex);
    }
  };
  const initializeMenuState = useCallback(() => {
    let subMenuIndex = null;
    let multiMenuIndex = null;
    menus.forEach((item, i) => {
      if (item?.child) {
        item.child.forEach((childItem, j) => {
          if (isLocationMatch(childItem.href, locationName)) {
            subMenuIndex = i;
            multiMenuIndex = j;
          }
        });
      }
    });
    setActiveSubmenu(subMenuIndex);
    setMultiMenu(multiMenuIndex);
  }, [locationName, menus]);

  React.useEffect(() => {
    initializeMenuState();
  }, [initializeMenuState]);

  // menu laoding

  return (
    <div
      className={cn("fixed  top-0  border-r  ", {
        "w-[248px]": !collapsed,
        "w-[72px]": collapsed,
        "m-6 bottom-0   bg-card rounded-md": layout === "semibox",
        "h-full   bg-card ": layout !== "semibox",
      })}
    >
      {sidebarBg !== "none" && (
        <div
          className=" absolute left-0 top-0   z-[-1] w-full h-full bg-cover bg-center opacity-[0.07]"
          style={{ backgroundImage: `url(${sidebarBg})` }}
        ></div>
      )}
      <SidebarLogo collapsed={collapsed} />
      <Separator />
      <ScrollArea
        className={cn("sidebar-menu  h-[calc(100%-80px)] ", {
          "px-4": !collapsed,
        })}
      >
        <ul
          dir={isRtl ? "rtl" : "ltr"}
          className={cn(" space-y-1", {
            " space-y-2 text-center": collapsed,
          })}
        >
          {menus.map((item, i) => (
            <li key={`menu_key_${i}`}>
              {!item.child && !item.isHeader && (
                <Link href={item.href}>
                  <SingleMenuItem
                    item={item}
                    collapsed={collapsed}
                    trans={trans}
                    lang={currentLang}
                  />
                </Link>
              )}

              {/* {item.isHeader && !item.child && !collapsed && (
                <MenuLabel item={item} trans={trans} lang={currentLang} />
              )} */}

              {item.child && (
                <>
                  <SubMenuHandler
                    item={item}
                    toggleSubmenu={toggleSubmenu}
                    index={i}
                    activeSubmenu={activeSubmenu}
                    collapsed={collapsed}
                    menuTitle={item.title}
                    trans={trans}
                    lang={currentLang}
                  />
                  {!collapsed && (
                    <NestedSubMenu
                      toggleMultiMenu={toggleMultiMenu}
                      activeMultiMenu={activeMultiMenu}
                      activeSubmenu={activeSubmenu}
                      item={item}
                      index={i}
                      collapsed={collapsed}
                      trans={trans}
                      lang={currentLang}
                    />
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
};

export default PopoverSidebar;
// "use client";
// import React, { useMemo, useState, useEffect, useCallback } from "react";
// import { cn, isLocationMatch, getDynamicPath } from "@/lib/utils";
// import SidebarLogo from "../logo";
// import { menusConfig } from "@/config/menus";
// // import MenuLabel from "../common/menu-label";
// import SingleMenuItem from "./single-menu-item";
// import SubMenuHandler from "./sub-menu-handler";
// import NestedSubMenu from "../common/nested-menus";
// import { useSidebar, useThemeStore } from "@/store";
// import { Separator } from "@/components/ui/separator";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { usePathname } from "next/navigation";
// import { useSelector } from "react-redux";
// import Link from "next/link";
// import LayoutLoader from "@/components/layout-loader";
// import { useRouter } from "next/navigation";
// import { useTheme } from "next-themes";
// const PopoverSidebar = ({ trans, lang }) => {
//   const { collapsed, sidebarBg } = useSidebar();
//   const { layout, isRtl } = useThemeStore();
//   const { theme } = useTheme();
//   // const [mounted, setMounted] = useState(false);
//   const currentLang = useSelector((state) => state.language.language);
//   const menus = useMemo(
//     () => menusConfig(currentLang).sidebarNav.classic || [],
//     [currentLang]
//   );

//   const [activeMultiMenu, setMultiMenu] = useState(null);
//   const [activeSubmenu, setActiveSubmenu] = useState(null);
//   const [loading, setLoading] = useState(false); // إضافة حالة لعرض المكون LayoutLoader
//   const pathname = usePathname();
//   const router = useRouter(); // إضافة هذا للمتابعة مع التغيير في المسار
//   const toggleSubmenu = (i) => {
//     if (activeSubmenu === i) {
//       setActiveSubmenu(null);
//     } else {
//       setActiveSubmenu(i);
//     }
//   };

//   const toggleMultiMenu = (subIndex) => {
//     if (activeMultiMenu === subIndex) {
//       setMultiMenu(null);
//     } else {
//       setMultiMenu(subIndex);
//     }
//   };
//   const initializeMenuState = useCallback(() => {
//     let subMenuIndex = null;
//     let multiMenuIndex = null;
//     menus.forEach((item, i) => {
//       if (item?.child) {
//         item.child.forEach((childItem, j) => {
//           if (isLocationMatch(childItem.href, pathname)) {
//             subMenuIndex = i;
//             multiMenuIndex = j;
//           }
//         });
//       }
//     });
//     setActiveSubmenu(subMenuIndex);
//     setMultiMenu(multiMenuIndex);
//   }, [pathname, menus]);

//   useEffect(() => {
//     initializeMenuState();
//   }, [initializeMenuState]);

//   useEffect(() => {
//     initializeMenuState();
//   }, [pathname]);

//   useEffect(() => {
//     setLoading(false); // إخفاء الـ loading بعد أن يتم التوجيه إلى صفحة جديدة
//   }, [pathname]); // س

//   const handleLinkClick = (href) => {
//     setLoading(true);
//     router.push(href);
//   };

//   return (
//     <div
//       className={cn("fixed top-0 border-r", {
//         "w-[248px]": !collapsed,
//         "w-[72px]": collapsed,
//         "m-6 bottom-0 bg-card rounded-md": layout === "semibox",
//         "h-full bg-card": layout !== "semibox",
//       })}
//     >
//       {sidebarBg !== "none" && (
//         <div
//           className="absolute left-0 top-0 z-[-1] w-full h-full bg-cover bg-center opacity-[0.07]"
//           style={{ backgroundImage: `url(${sidebarBg})` }}
//         ></div>
//       )}
//       <SidebarLogo collapsed={collapsed} />
//       <Separator />
//       <ScrollArea
//         className={cn("sidebar-menu h-[calc(100%-80px)]", {
//           "px-4": !collapsed,
//         })}
//       >
//         <ul
//           dir={isRtl ? "rtl" : "ltr"}
//           className={cn("space-y-1", { "space-y-2 text-center": collapsed })}
//         >
//           {menus.map((item, i) => (
//             <li key={`menu_key_${i}`}>
//               {!item.child && !item.isHeader && (
//                 <Link
//                   href={item.href}
//                   onClick={() => handleLinkClick(item.href)}
//                 >
//                   <SingleMenuItem
//                     item={item}
//                     collapsed={collapsed}
//                     trans={trans}
//                     lang={currentLang}
//                   />
//                 </Link>
//               )}

//               {item.child && (
//                 <>
//                   <SubMenuHandler
//                     item={item}
//                     toggleSubmenu={toggleSubmenu}
//                     index={i}
//                     activeSubmenu={activeSubmenu}
//                     collapsed={collapsed}
//                     menuTitle={item.title}
//                     trans={trans}
//                     lang={currentLang}
//                   />
//                   {!collapsed && (
//                     <NestedSubMenu
//                       toggleMultiMenu={toggleMultiMenu}
//                       activeMultiMenu={activeMultiMenu}
//                       activeSubmenu={activeSubmenu}
//                       item={item}
//                       index={i}
//                       collapsed={collapsed}
//                       trans={trans}
//                       lang={currentLang}
//                     />
//                   )}
//                 </>
//               )}
//             </li>
//           ))}
//         </ul>
//       </ScrollArea>
//       {loading && (
//         <div
//           className={`fixed top-0 left-0 w-full h-full flex items-center justify-center z-[9999] flex-col space-y-2
//     ${theme === "dark" ? "bg-[#0f172a]" : "bg-white"}`}
//           style={{
//             backgroundColor: theme === "dark" ? "#0f172a" : "#ffffff",
//             zIndex: 9999, // تأكد من أن الخلفية فوق جميع العناصر
//             position: "fixed", // يجعل الخلفية ثابتة في المكان
//           }}
//         >
//           <LayoutLoader />
//         </div>
//       )}
//     </div>
//   );
// };

// export default PopoverSidebar;
