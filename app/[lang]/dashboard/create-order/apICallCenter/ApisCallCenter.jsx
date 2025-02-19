import { BASE_URL } from "@/api/BaseUrl";
import axios from "axios";
import Cookies from "js-cookie";

// axiosInstance
const token = Cookies.get("token");

export const fetchRestaurantsList = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/callcenter/get/restaurants?api_token=${token}`
    );
    // console.log("API Response:", response.data.data.restaurants);
    return response.data.data.restaurants;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const fetchUserByPhone = async (phone) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/callcenter/user/search?api_token=${token}&phone=${phone}`
    );

    return response.data.users;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};
// http://myres.me/thmdev/api/callcenter/get/branches?api_token=5x3oazMQdR6Eo7JeIBb7OGtCGNrP8lUBLgKExJLnFHKqIHlLL8M8LjPTNdZE1bCW&restaurantId=1
export const fetchBranches = async (restaurantId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/callcenter/get/branches?api_token=${token}&restaurantId=${restaurantId}`
    );
    // console.log("API Response branches:", response.data.messages.branches);
    // console.log("API Response branches restaurantId:", restaurantId);
    return response.data.messages.branches;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};
// export const fetchMenu = async (restaurantId, priceList) => {
//   try {
//     const response = await axios.get(
//       `${BASE_URL}/callcenter/get/restaurant/menus?api_token=${token}&restaurantId=${restaurantId}&priceList=${priceList}`
//     );
//     console.log("API Response branches:", response.data.data.menus[0]);
//     console.log("API Response branches restaurantId:", restaurantId);
//     console.log("API Response branches priceList:", priceList);
//     return response.data.data.menus[0];
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     throw error;
//   }
// };

export const fetchMenu = async (restaurantId, priceList) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/callcenter/get/restaurant/menus?api_token=${token}&restaurantId=${restaurantId}&priceList=${priceList}`,
      {
        params: {
          api_token: token,
          restaurantId,
          priceList,
          fields: "id,name,price,category",
        },
      }
    );

    return response.data.data.menus[0];
  } catch (error) {
    console.error("Error fetching menu:", error);
    throw error;
  }
};
