"use client"
// apiStore.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
export const useApiStore = create(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),

      roles: [],
      setRoles: (roles) => set({ roles }),

      permissions: [],
      setPermissions: (permissions) => set({ permissions }),

      setLanguage: (lang) => {
        set({ language: lang });
        // تعيين اللغة في localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("lang", lang);
        }
      },

      logout: () => set({ token: null, roles: [], permissions: [] }),
    }),
    {
      name: "api-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
