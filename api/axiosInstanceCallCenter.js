"use client";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "./BaseUrl";
import Cookies from "js-cookie";
const apiInstance = axios.create({
  baseURL: BASE_URL,
});

apiInstance.interceptors.request.use(
  (config) => {
    // const token = Cookies.get("token");
    const token =  localStorage.getItem("token") || Cookies.get("token") 

    const language = Cookies.get("language");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers.locale = language;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiInstance;
