// axiosInstance.js
"use client";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "./BaseUrl";
import Cookies from "js-cookie";
//  const domin = localStorage.setItem("domain", domain);
// const language = useSelector((state) => state.language.language);
const apiInstance = axios.create({
  // baseURL: "http://tenant1.ordrz.test/api",
  baseURL: BASE_URL,
});

apiInstance.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem("access_token");
    localStorage.removeItem("access_token");
    const token = Cookies.get("access_token");
    const language = Cookies.get("language");
    // const language = localStorage.getItem("language");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers.locale = language;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiInstance;
