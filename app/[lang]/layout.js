// "use client";
// import "@/assets/scss/globals.scss";
// import "@/assets/scss/theme.scss";
// import { Inter } from "next/font/google";
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { setLanguage } from "@/store/slices/languageSlice";
// import { metadata } from "./metadata";
// import { Toaster } from "react-hot-toast";
// import Cookies from "js-cookie";
// import { redirect } from "next/navigation";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import "./components/main.css";
// const inter = Inter({ subsets: ["latin"] });
// const queryClient = new QueryClient();
// export default function RootLayout({ children, params: { lang } }) {
//   return (
//     <ReduxProvider>
//       <QueryClientProvider client={queryClient}>
//         <LayoutContent lang={lang}>{children}</LayoutContent>
//       </QueryClientProvider>
//     </ReduxProvider>
//   );
// }

// function LayoutContent({ lang, children }) {

//   const dispatch = useDispatch();

//   useEffect(() => {
//     const savedLanguage = Cookies.get("lang") || "ar";

//     dispatch(setLanguage(savedLanguage));

//     if (lang !== savedLanguage) {
//       redirect(`/${savedLanguage}/dashboard`);
//     }
//   }, [dispatch, lang]);

//   return (
//     <html lang={lang}>
//       <head>
//         <title>{metadata.title.default}</title>
//         <meta name="description" content={metadata.description} />
//       </head>
//       <body className={`${inter.className} `}>
//         <AuthProvider>
//           <TanstackProvider>
//             <Providers>
//               <LanguageProvider>
//                 <DirectionProvider lang={lang}>
//                   {children}
//                   {/* <Toaster /> */}
//                 </DirectionProvider>
//               </LanguageProvider>
//             </Providers>
//           </TanstackProvider>
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }

"use client";
import "./components/main.css";
import "@/assets/scss/globals.scss";
import "@/assets/scss/theme.scss";
import "simplebar-react/dist/simplebar.min.css";
import "flatpickr/dist/themes/light.css";
import Cookies from "js-cookie";
import { Inter } from "next/font/google";
import { metadata } from "./metadata";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Providers from "@/provider/providers";
import AuthProvider from "@/provider/auth.provider";
import { LanguageProvider } from "@/provider/LanguageContext";
import DirectionProvider from "@/provider/direction.provider";
import { SubdominProvider } from "@/provider/SubdomainContext";
// import SubdomainDisplay from "@/hooks/SubdomainDisplay";
import { getDictionary } from "../dictionaries";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setLanguage } from "@/store/slices/languageSlice";
import "@fortawesome/fontawesome-free/css/all.min.css";

const inter = Inter({ subsets: ["latin"] });
const queryClient = new QueryClient();

export default function RootLayout({ children, params: { lang } }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SubdominProvider>
        {/* <SubdomainDisplay /> */}
        <LayoutContent lang={lang}>{children}</LayoutContent>
      </SubdominProvider>
    </QueryClientProvider>
  );
}

function LayoutContentComponent({ lang, children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedLanguage = lang || localStorage.getItem("language");
    const loadDictionary = async () => {
      try {
        const dictionary = await getDictionary(savedLanguage);
        localStorage.setItem("dictionary", JSON.stringify(dictionary));
        dispatch(setLanguage(savedLanguage));
      } catch (error) {
        console.error("Failed to load dictionary:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDictionary();

    const accessToken = Cookies.get("access_token");
    const token = Cookies.get("token");

    // if (!accessToken && router.pathname !== `/${savedLanguage}/login`) {
    //   router.push(`/${savedLanguage}/login`);
    // }

    if (
      accessToken ||
      (token && router.pathname === `/${savedLanguage}/login`)
    ) {
      router.push(`/${savedLanguage}/dashboard`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, dispatch]);

  // console.log("Current Language:", lang);
  return (
    <>
      <head>
        <title>{metadata.title.default}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body className={`${inter.className}`}>
        <AuthProvider>
          <Providers>
            <LanguageProvider>
              <DirectionProvider lang={lang}>
                {children}
                {/* <Toaster /> */}
              </DirectionProvider>
            </LanguageProvider>
          </Providers>
        </AuthProvider>
      </body>
    </>
  );
}
const LayoutContent = React.memo(LayoutContentComponent);
