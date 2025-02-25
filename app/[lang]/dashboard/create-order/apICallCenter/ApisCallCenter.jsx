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

export const fetchViewItem = async (restaurantId, addressId, itemId) => {
  console.log("restaurantId from fetch basic", restaurantId);
  console.log("addressId from fetch basic", addressId);
  console.log("itemId from fetch basic", itemId);
  try {
    const response = await axios.get(
      `${BASE_URL}/callcenter/get/menu/item?api_token=${token}&restaurant_id=${restaurantId}&address=${addressId}&item_id=${itemId}`
    );
    console.log("fetch View Item:", response.data.item);
    return response.data.item;
  } catch (error) {
    console.error("Error fetching view item:", error);

    throw error;
  }
};
