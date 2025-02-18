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
    throw error; // إذا حدث خطأ
  }
};
