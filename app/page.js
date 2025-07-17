"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { fetchSettings } from "@/store/slices/systemSlice";
import LayoutLoader from "@/components/layout-loader";
import Cookies from "js-cookie";

export default function HomePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { defaultSystemLanguage, domin } = useSelector(
    (state) => state.settings
  );

  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  

    const token = Cookies.get("token");
    const currentLanguage = Cookies.get("language") 

    if (token) {
      setAccessToken(token);
      // console.log("Redirecting to dashboard:", currentLanguage);
      router.replace(`/${currentLanguage}/dashboard`);
    } else {
      setAccessToken(null);
    }

    setIsLoading(false);
  }, [dispatch, router]);

  // Show loading component while fetching settings and checking the token
  if (isLoading) {
    return <LayoutLoader />;
  }

  // If no access token, show the customer portal button
  if (!accessToken) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <div>
          <h1>Coming Soon</h1>
          <button
            onClick={() => {
              const currentLanguage =
                "en";
              router.push(`/${currentLanguage}/login`);
            }}
            style={{
              marginLeft:"20px",
              padding: "10px 20px",
              backgroundColor: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Customer Portal
          </button>
        </div>
      </div>
    );
  }

  // If access token exists, return nothing as the user is already redirected
  return null;
}
