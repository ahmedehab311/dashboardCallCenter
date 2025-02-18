import { createContext, useContext, useState, useEffect } from "react";

const subdomainContext = createContext();
export const useSubdomin = () => useContext(subdomainContext);

export const SubdominProvider = ({ children }) => {
  const [subdomain, setSubdomin] = useState(null);

  useEffect(() => {
    const host = window.location.hostname; 
    const subdomain = host?.split(".")[0]; 
    setSubdomin(subdomain);
  }, []);

  return (
    <subdomainContext.Provider value={subdomain}>
      {children}
    </subdomainContext.Provider>
  );
};
