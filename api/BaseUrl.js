// // const BASE_URL = "http://tenant1.ordrz.test/api";
// const BASE_URL = "http://nisantasi.ordrz.me/api";
// // const BASE_URL = "http:/ordrz.test.ordrz.me/api";

export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_BASE_URL_PRODUCTION
    : process.env.NEXT_PUBLIC_BASE_URL_DEVELOPMENT;


// import Cookies from "js-cookie";
// const domain = Cookies.get("domain");

// const BASE_URL = `http://${domain}/api`;

// export { BASE_URL };
