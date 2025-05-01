    export const BASE_URL = () => {
      return process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_API_BASE_PRODUCTION
        : process.env.NEXT_PUBLIC_API_BASE_DEVELOPMENT;
    };
    export const getSubdomain = () => {
      if (typeof window === "undefined") return "";
      const host = window.location.hostname;
      const parts = host.split(".");
      
<<<<<<< HEAD
      if (host === "localhost") return "thm"; 
=======
      if (host === "localhost") return "thmdev"; 
>>>>>>> 83401e29e08d65b30f526aec4c8e54f467ae03a4
      return parts.length > 2 ? parts[0] : "";
    };
    

