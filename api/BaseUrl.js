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
    // export const getSubdomain = () => {
    //   if (typeof window === "undefined") return "";
    //   const host = window.location.hostname;
    //   const parts = host.split(".");
      
    //   if (host === "localhost") return "localhost"; // دعم localhost
    //   return parts.length > 2 ? parts[0] : "";
    // };
    
    export const getSubdomain = () => {
      if (typeof window === "undefined") return "";
    
      // ✅ غير `chilss.myres.me` أو أي اسم تاني للتجربة
      const fakeHost = "thmdev.myres.me"; 
      const parts = fakeHost.split(".");
      
      return parts.length > 2 ? parts[0] : "";
    };
    
    

    // export const API_BASE_URL = `${BASE_URL2}/${getSubdomain()}/api`;
    // console.log("API_BASE_URL",API_BASE_URL)
export const BASE_URL_iamge = "http://myres.me/thmdev";
// import Cookies from "js-cookie";
// const domain = Cookies.get("domain");

// const BASE_URL = `http://${domain}/api`;

// export { BASE_URL };
