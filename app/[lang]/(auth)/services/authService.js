import { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "@/api/BaseUrl";
import Cookies from "js-cookie";

export const loginUser = async (credentials,apiBaseUrl,subdomain) => {
  try {
    console.log("apiBaseUrl from login ",apiBaseUrl)
    const url = `${apiBaseUrl}/callcenter/login?email=${credentials.login}&password=${credentials.password}`;
    const response = await axios.post(url);
    if (process.env.NODE_ENV === "development") {
      console.log("API Content:", response);
    }

    const { messages } = response;

    if (response?.data?.data?.token) {
      localStorage.setItem("token",response?.data?.data?.token)
     
      Cookies.set("token", response?.data?.data?.token);
      // Cookies.set("token", response?.data?.data?.token, {
      //   path: "/",
      //   domain: "myres.me", // استخدم الدومين الرئيسي فقط
      // });  
      
 
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
      return {
        user: response.data.data.user,
        token: response.data.data.token,
        messages: messages || [],
      };
    }else {
      return {
        error: true,
        messages: response.data.messages || "An unexpected error occurred",
      };
    }
  } catch (error) {
    // const errorMessages = error?.response?.data?.messages;
    console.error("API Error:", error);
  }
};
