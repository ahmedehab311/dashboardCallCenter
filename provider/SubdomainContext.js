import { createContext, useContext, useState, useEffect } from "react";
import { BASE_URL, getSubdomain } from "@/api/BaseUrl";
const subdomainContext = createContext();
export const useSubdomin = () => useContext(subdomainContext);

export const SubdominProvider = ({ children }) => {
  const [subdomain, setSubdomin] = useState(null);
  const [apiBaseUrl, setApiBaseUrl] = useState("");
  useEffect(() => {
    const host = window.location.hostname;
    const subdomain = host?.split(".")[0];
    setSubdomin(subdomain);
  }, []);

  useEffect(() => {
    // get domin
    const detectedSubdomain = getSubdomain();
    setSubdomin(detectedSubdomain);
  }, []);

  // useEffect(() => {
  //   if (subdomain) {
  //     const baseUrl = BASE_URL();

  //     let cleanedBaseUrl = baseUrl?.replace(/\/api\/?$/, "");

  //     setApiBaseUrl(`${cleanedBaseUrl}/${subdomain}/api`);
  //   }
  // }, [subdomain]);
  useEffect(() => {
    if (subdomain) {
      if (process.env.NODE_ENV === "development") {
        setApiBaseUrl(`/api-proxy`);
        console.log("process.env.NODE_ENV from provider", process.env.NODE_ENV);
      } else {
        const baseUrl = BASE_URL();
        let cleanedBaseUrl = baseUrl?.replace(/\/api\/?$/, "");
        setApiBaseUrl(`${cleanedBaseUrl}/${subdomain}/api`);
      }
    }
  }, [subdomain]);

  return (
    <subdomainContext.Provider value={{ subdomain, apiBaseUrl }}>
      {children}
    </subdomainContext.Provider>
  );
};
