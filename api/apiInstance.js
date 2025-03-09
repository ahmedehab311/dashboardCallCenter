import axios from "axios";
import Cookies from "js-cookie";

const apiInstance = axios.create({
  // baseURL: "https://myres.me/thmdev/api",
  baseURL: "https://myres.me/thmdev/api",
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

apiInstance.interceptors.request.use(
  (config) => {
    // const token = Cookies.get("token");
     const token =  localStorage.getItem("token") || Cookies.get("token")  
    if (token) {
      config.params = config.params || {};
      config.params.api_token = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiInstance;
