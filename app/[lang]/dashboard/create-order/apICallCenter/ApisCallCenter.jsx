import { BASE_URL } from "@/api/BaseUrl";
import axios from "axios";
import Cookies from "js-cookie";

// axiosInstance
// const token = Cookies.get("token");
//  const token =  localStorage.getItem("token") || Cookies.get("token") 
//  const tokenStorge =
//     typeof window !== "undefined" ? localStorage.getItem("token") : null;
//     const token =   tokenStorge || Cookies.get("token")  
export const fetchUserByPhone = async (phone,token) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/callcenter/user/search?api_token=${token}&phone=${phone}`
    );
    // console.log("serach user ", response.data.users);
    return response.data.users;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};


export const fetchRestaurantsList = async (token) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/callcenter/get/restaurants?api_token=${token}`
    );
    // console.log("API Response:", response);
    // console.log("API response?.data?.data?.restaurants:", response?.data?.data?.restaurants);
    return response?.data?.data?.restaurants;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const fetchBranches = async (restaurantId,area,token) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/callcenter/get/branches?api_token=${token}&restaurantId=${restaurantId}&areaId=${area}`
    );
    
    // console.log("API Response branches:", response);
    // console.log("API Response.data branches:", response.data.data);
    // // console.log("API Response branches:", response.data.messages.branches);
    // console.log("API Response branches restaurantId:", restaurantId);
    // console.log("API Response branches area:", area);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching branches:", error);
    throw error;
  }
};

export const fetchMenu = async (restaurantId, priceList,token) => {
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
    // console.log("priceList fetchMenu", priceList);
    return response.data.data.menus[0];
  } catch (error) {
    console.error("Error fetching menu:", error);
    throw error;
  }
};

export const fetchViewItem = async (BranchId,  itemId,token) => {
  // console.log("selectedBranch from fetch basic", BranchId);
  // console.log("addressId from fetch basic", addressId);
  // console.log("itemId from fetch basic", itemId);
  try {
    const response = await axios.get(
      `${BASE_URL}/callcenter/get/menu/item?api_token=${token}&branch_id=${BranchId}&item_id=${itemId}`
    );
    // console.log("fetch View Item:", response);
    // console.log("fetch View Item:", response.data.item);
    return response.data.item;
  } catch (error) {
    console.error("Error fetching view item:", error);

    throw error;
  }
};

export const fetchTax = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/settings`);
    // console.log("API Response branches:", response.data.data.settings.tax);
    // console.log("API Response branches restaurantId:", restaurantId);
    return response.data.data.settings.tax;
  } catch (error) {
    console.error("Error fetching Tax:", error);
    throw error;
  }
};
export const fetchorderSource = async (restaurantId,token) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/callcenter/get/sources?api_token=${token}&restaurantId=${restaurantId}`
    );

    return response.data.messages.sources;
  } catch (error) {
    console.error("Error fetching fetch Order Type:", error);
    throw error;
  }
};
