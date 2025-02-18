// index.js
import { create } from "zustand";
import { siteConfig } from "@/config/site";
import { persist, createJSONStorage } from "zustand/middleware";

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: siteConfig.theme,
      setTheme: (theme) => set({ theme }),

      radius: siteConfig.radius,
      setRadius: (value) => set({ radius: value }),

      layout: "semibox",
      setLayout: () => {
        set({ layout: "semibox" });


        useSidebar.setState({ sidebarType: "popover" });
      },

      navbarType: siteConfig.navbarType,
      setNavbarType: (value) => set({ navbarType: value }),

      footerType: siteConfig.footerType,
      setFooterType: (value) => set({ footerType: value }),

      isRtl: false,
      setRtl: (value) => set({ isRtl: value }),
    }),
    {
      name: "theme-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useSidebar = create(
  persist(
    (set) => ({
      collapsed: false,
      setCollapsed: (value) => set({ collapsed: value }),
      sidebarType:
        siteConfig.layout === "semibox" ? "popover" : siteConfig.sidebarType,
      setSidebarType: (value) => {
        set({ sidebarType: value });
      },
      subMenu: false,
      setSubmenu: (value) => set({ subMenu: value }),
      // background image
      sidebarBg: siteConfig.sidebarBg,
      setSidebarBg: (value) => set({ sidebarBg: value }),
      mobileMenu: false,
      setMobileMenu: (value) => set({ mobileMenu: value }),
    }),
    {
      name: "sidebar-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
// console.log(siteConfig.layout);
