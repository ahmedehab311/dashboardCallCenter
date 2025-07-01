import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export const useThemeColor = () => {
  const { theme } = useTheme();
  const [color, setColor] = useState("#000");

  useEffect(() => {
    setColor(theme === "dark" ? "#fff" : "#000");
  }, [theme]);

  return { theme, color ,setColor};
};
