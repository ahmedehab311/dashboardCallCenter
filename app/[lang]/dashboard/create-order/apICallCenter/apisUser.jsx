import { BASE_URL } from "@/api/BaseUrl";
import axios from "axios";
import Cookies from "js-cookie";
import apiInstance from "@/api/axiosInstance";
import { toast } from "react-hot-toast";
import { Buffer } from "buffer";
// const token = Cookies.get("token");
//  const token =  localStorage.getItem("token") || Cookies.get("token")
//  const tokenStorge =
//     typeof window !== "undefined" ? localStorage.getItem("token") : null;
//     // const token =   tokenStorge || Cookies.get("token")  
    
//     console.log("token",token);
    



export const createUser = async (name, phone,phone2,token) => {
  try {
    const response = await apiInstance.post(
      `/callcenter/user/create?api_token=${token}`,
      null,
      {
        params: { name, phone,phone2 },
      }
    );

    // console.log("User ID response:", response?.data);
    // console.log("User ID response id:", response?.data?.user?.id);
    // console.log("User ID response messages:", response?.data?.messages);
    if (!response?.data?.response) {
      const errorMessage = response?.data?.messages?.[0];
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
    return response?.data?.user?.id;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateUserAddress = async (data) => {
  const params = new URLSearchParams({
    id: data.id,
    area: data.area,
    street: data.street,
    address_name: data.address_name,
    country: 1,
    city: 1,
    ...(data.building && { building: data.building }),
    ...(data.floor && { floor: data.floor }),
    ...(data.apt && { apt: data.apt }),
    ...(data.additional_info && { additional_info: data.additional_info }),
  });

  const url = `/api/callcenter/user/address/update?api_token=${data.token}&${params.toString()}`;

  try {
    const response = await axios.put(url);
    console.log("Address updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating address:", error);
    throw error;
  }
};

export const updateUserData = async (userData) => {
  const params = new URLSearchParams();

  if (userData.userId) params.append("user_id", userData.userId);
  if (userData.username) params.append("user_name", userData.username);
  if (userData.email) params.append("email", userData.email);
  if (userData.phone) params.append("phone", userData.phone);
  if (userData.phone2) params.append("phone2", userData.phone2);

  const url = `/api/callcenter/user/update?api_token=${userData.token}&${params.toString()}`;

  try {
    const response = await axios.put(url);
    // console.log("User updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const fetchAreas = async () => {
  try {
    const response = await axios.get(`/api/areas/?city=1`);
    // console.log("areas:", response.data.data.areas);
    return response.data.data.areas;
  } catch (error) {
    console.error("Error fetching areas:", error);

    throw error;
  }
};

export const deleteAddress = async (id,token) => {
  try {
    const response = await axios.delete(
      `/api/callcenter/user/address/delete?api_token=${token}&id=${id}`
    );
    const messages = response.data.messages || response.data.data;

    //   if (messages.length > 0) {
    //     toast.success(messages[0]);
    //   }
    // console.log(response.data);

    return response.data;
  } catch (error) {
    toast.error(`Failed to delete : ${error}`);
    throw error;
  }
};

export const createAddress = async (
  userId,
  area,
  street,
  building,
  floor,
  apt,
  additionalInfo,
  nameValue,
  token
) => {
  // console.log("userId",userId)
  // console.log("apt",apt)
  // console.log("additionalInfo",additionalInfo)
  try {
    const response = await apiInstance.post(
      `/callcenter/user/address/add?api_token=${token}`,
      null,
      {
        params: {
          user_id: userId,
          area,
          street,
          address_name: nameValue,
          country: 1,
          city: 1,
          ...(building && { building }),
          ...(floor && { floor }),
          ...(apt && { apt }),
          ...(additionalInfo && { additional_info: additionalInfo }),
        },
      }
    );

    // console.log("Address created successfully:", response.data);
    return response.data;
    // return response?.data?.messages[0];
  } catch (error) {
    console.error("Error creating address:", error);
    throw error;
  }
};

export const createOrder = async ({
  lookupId,
  address,
  area,
  notes,
  source,
  status,
  insertcoupon,
  insertpoints,
  payment,
  delivery_type,
  branch,
  items,
  lng,
  time,
  lat,
  restaurant,token
}) => {
  const formattedItems = {
    items: items.map((item) => ({
      id: item.selectedIdSize,
      choices: [],
      options: [],
      extras: [
        ...(item.selectedMainExtrasIds || []),
        ...(item.selectedExtrasIds || []),
      ],
      count: item.quantity,
      special: item.note || "",
    })),
  };
  console.log("formattedItems:", formattedItems); 
  console.log("📦 items being sent:", JSON.stringify(formattedItems, null, 2));

  const apiUrl = `/callcenter/order/create?api_token=${token}&lookup_id=${lookupId}&address=${address}&area=${area}&notes=${notes}&time=${time || ""}&source=${source}&status=${status}&payment=${payment}&coins=${insertpoints || "00.00"}&lat=${lat}&lng=${lng}&delivery_type=${delivery_type}&restaurant=${restaurant}&branch=${branch}`;

console.log("Final API URL:", apiUrl); 

  try {
    const response = await apiInstance.post(
      `/callcenter/order/create?api_token=${token}`,
      null,
      {
        params: {
          lookup_id: lookupId,
          address,
          area,
          items: JSON.stringify(formattedItems),
          notes,
          ...(time ? { time } : {}),
          source,
          branch,
          status,
          payment,
          lat,
          lng,
          delivery_type,
          restaurant
        },
      }
    );

    // console.log("Order created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};
