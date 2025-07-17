import { useQuery } from "@tanstack/react-query";
import axios from "axios";
// import { apiBaseUrl } from "next-auth/client/_utils";
// export const fetchAllMenu = async (token, apiBaseUrl) => {
//   try {
//     const response = await axios.get(
//       `${apiBaseUrl}/v1/call-center/menu/all?api_token=${token}`
//     );

//     // console.log("response", response);
//     return response.data.response.data;
//   } catch (error) {
//     console.error("Error fetching menu:", error);
//     throw error;
//   }
// };

// export const useMenus = (token, apiBaseUrl) =>
//   useQuery({
//     queryKey: ["MenusList"],
//     queryFn: () => fetchAllMenu(token, apiBaseUrl),
//     enabled: !!token,
//   });

export const setAsDefaultMenu = async (token, apiBaseUrl, id) => {
  try {
    // for problem cross origin
    const isDev = process.env.NODE_ENV === "development";

    const baseUrl = isDev ? `/api-proxy` : `${apiBaseUrl}`;
    const response = await axios.put(
      `${baseUrl}/v1/call-center/menu/${id}?api_token=${token}`
    );

    // console.log("response", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching menu:", error);
    throw error;
  }
};
