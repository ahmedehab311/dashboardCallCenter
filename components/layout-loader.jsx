// "use client";
// import React, { useState, useEffect } from "react";
// // import { SiteLogo } from "@/components/svg";
// import { Loader2 } from "lucide-react";
// import { useTheme } from "next-themes";
// const LayoutLoader = () => {
//   const { theme } = useTheme();
//   console.log("theme", theme);
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) return null;
//   return (
//     <div
//       // className={`fixed top-0 left-0 w-full h-full flex items-center justify-center z-[9999]  flex-col space-y-2
//       //   ${theme === "dark" ? "bg-[#0f172a]" : "bg-white"}`}
//       className={`fixed top-0 left-0 w-full h-full flex items-center justify-center z-[9999] flex-col space-y-2
//         ${theme === "dark" ? "bg-[#0f172a]" : "bg-white"}`}
//     >
//       <span className="inline-flex gap-1">
//         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//         Loading...
//       </span>
//     </div>
//   );
// };

// export default LayoutLoader;
"use client";
import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";

const LayoutLoader = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full flex items-center justify-center z-[9999] flex-col space-y-2
        ${theme === "dark" ? "bg-[#0f172a]" : "bg-white"}`}
    >
      <span className="inline-flex gap-1 text-white">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </span>
    </div>
  );
};

export default LayoutLoader;
