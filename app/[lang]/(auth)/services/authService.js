import { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "@/api/BaseUrl";
import Cookies from "js-cookie";
// export const checkTokenValidity = () => {
//   const storedExpiration = localStorage.getItem("expiration");
//   const lang = localStorage.getItem("language");
//   if (storedExpiration && new Date(storedExpiration) <= new Date()) {
//     localStorage.removeItem("expiration");
//     localStorage.removeItem("hashValue");
//     Cookies.remove("access_token");
//     if (process.env.NODE_ENV === "development") {
//       console.log("Access token expired and removed.");
//     }
//     window.location.href = `${lang}/login`;
//   }
// };

// export const useTokenValidation = () => {
//   useEffect(() => {
//     checkTokenValidity();

//     const intervalId = setInterval(() => {
//       checkTokenValidity();
//     }, 60000);

//     return () => clearInterval(intervalId);
//   }, []);
// };

// export const loginUser = async (credentials, hashedString, language) => {
//   try {
//     // const response = await axios.post(
//     //   `${BASE_URL}/callcenter/login`,
//     //   credentials,
//     //   {
//     //     headers: {
//     //       "Content-Type": "application/json",
//     //       locale: `${language}`,
//     //     },
//     //   }
//     // );
//     const response = await axios.post(
//       `${BASE_URL}/callcenter/login`,
//       credentials, // ✅ هنا يرسل البريد الإلكتروني وكلمة المرور فقط
//       {
//         headers: {
//           "Content-Type": "application/json",
//           locale: language,
//         },
//       }
//     );

//     const {
//       code,
//       responseStatus,
//       messages,
//       response: responseData,
//     } = response.data;

//     if (responseStatus && responseData && responseData.data) {
//       const { admin, roles, permissions, token } = responseData.data;

//       if (token && token.accessToken) {
//         const expiresInMilliseconds = token.expiresIn * 1000;
//         Cookies.set("access_token", token.accessToken);
//         return {
//           admin,
//           roles,
//           permissions,
//           accessToken: token.accessToken,
//           messages: messages || [],
//         };
//       } else {
//         throw {
//           messages: ["Access token not found. Please check your credentials."],
//         };
//       }
//     } else {
//       throw {
//         messages:
//           messages.length > 0 ? messages : ["An unexpected error occurred"],
//       };
//     }
//   } catch (error) {
//     console.error("Error response:", error.messages || error.message);
//     throw { messages: error.messages || ["An unexpected error occurred"] };
//   }
// };
export const loginUser = async (credentials) => {
  try {
    const url = `http://myres.me/thmdev/api/callcenter/login?email=${credentials.login}&password=${credentials.password}`;
    const response = await axios.post(url);

    console.log("API Content:", response.data.data);
    console.log("API Content:", response);

    const { user } = response.data.data;
    const { messages } = response;

    if (response.data.data.token) {
      Cookies.set("token", response.data.data.token);
      Cookies.remove("domain");
      Cookies.remove("user");
      Cookies.remove("access_token");
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
      return {
        user: response.data.data.user,
        token: response.data.data.token,
        messages: messages || [],
      };
    }
  } catch (error) {
    // const errorMessages = error?.response?.data?.messages;
    console.error("API Error:", error);
  }
};
