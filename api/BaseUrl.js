    export const BASE_URL = () => {
      return process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_API_BASE_PRODUCTION
        : process.env.NEXT_PUBLIC_API_BASE_DEVELOPMENT;
    };
    export const getSubdomain = () => {
      if (typeof window === "undefined") return "";
      const host = window.location.hostname;
      const parts = host.split(".");
      
      if (host === "localhost") return "thmdev"; 
      return parts.length > 2 ? parts[0] : "";
    };
    

// uSdaLNum