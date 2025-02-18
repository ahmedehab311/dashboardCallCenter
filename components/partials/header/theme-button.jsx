"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "@/components/svg";

const ThemeButton = () => {
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative md:h-9 md:w-9 h-8 w-8 hover:bg-transparent dark:hover:bg-transparent dark:hover:text-[#fff]
    hover:text-primary text-default-500 dark:text-default-800 rounded-full"
      onClick={toggleTheme}
    >
      <Sun
        className={`h-5 w-5 transition-all ${
          theme === "dark" ? "rotate-90 scale-0" : "rotate-0 scale-100"
        }`}
      />
      <Moon
        className={`absolute h-5 w-5 transition-all ${
          theme === "light" ? "rotate-0 scale-0" : "rotate-90 scale-100"
        }`}
      />
    </Button>
  );
};

export default ThemeButton;
