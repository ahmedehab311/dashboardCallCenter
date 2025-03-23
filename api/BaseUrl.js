// // const BASE_URL = "http://tenant1.ordrz.test/api";
// const BASE_URL = "http://nisantasi.ordrz.me/api";
// // const BASE_URL = "http:/ordrz.test.ordrz.me/api";

// export const BASE_URL =
//   process.env.NODE_ENV === "production"
//     ? process.env.NEXT_PUBLIC_BASE_URL_PRODUCTION
//     : process.env.NEXT_PUBLIC_BASE_URL_DEVELOPMENT;
// export const BASE_URL2 =
//   process.env.NODE_ENV === "production"


    // export const BASE_URL = () => {
    //   return process.env.NODE_ENV === "production"
    //   ? process.env.NEXT_PUBLIC_API_BASE_PRODUCTION
    //   : process.env.NEXT_PUBLIC_API_BASE_DEVELOPMENT;
    // };
 
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
      if (host.includes(".test") || host.includes(".dev")) return "thmdev";
      return parts.length > 2 ? parts[0] : "";
    };
    

