import { BASE_URL } from "@/api/BaseUrl";
import axios from "axios";
import apiInstance from "@/api/axiosInstance";
import { toast } from "react-hot-toast";
import request from "superagent";
export const fetchUserByPhone = async (phone, token, apiBaseUrl) => {
  try {
    const response = await axios.get(
      `${apiBaseUrl}/callcenter/user/search?api_token=${token}&phone=${phone}`
    );
    const userData = response?.data?.users;

    // console.log(" response serach user ", response);
    // console.log("serach user ", userData);

    if (!userData || response.data === "" || userData === undefined) {
      return null;
    }
    return userData;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};
// export const fetchUserByPhone = async (phone, token, apiBaseUrl) => {
//   try {
//     const response = await axios.get(
//       `${apiBaseUrl}/callcenter/user/search?api_token=${token}&phone=${phone}`
//     );

//     console.log("response search user", response);

//     const responseData = response?.data;

//     if (
//       typeof responseData !== "object" ||
//       !responseData.users ||
//       Object.keys(responseData.users).length === 0
//     ) {
//       return null;
//     }

//     const userData = responseData.users;

//     console.log("search user", userData);
//     return userData;
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     throw error;
//   }
// };

export const createUser = async (name, phone, phone2, token, apiBaseUrl) => {
  try {
    const cleanedBaseUrl = apiBaseUrl.replace(/\/api$/, "");
    const response = await axios.post(
      `${cleanedBaseUrl}/api/callcenter/user/create?api_token=${token}`,
      null,
      {
        params: { name, phone, phone2 },
      }
    );

    // console.log(" apiBaseUrl FROM :", apiBaseUrl);
    // console.log("User ID response:", response);
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

export const createAddress = async (
  userId,
  area,
  street,
  building,
  floor,
  apt,
  additionalInfo,
  nameValue,
  token,
  apiBaseUrl
) => {
  // console.log("userId",userId)
  // console.log("apt",apt)
  // console.log("additionalInfo",additionalInfo)

  try {
    const cleanedBaseUrl = apiBaseUrl.replace(/\/api$/, "");
    const response = await axios.post(
      `${cleanedBaseUrl}/api/callcenter/user/address/add?api_token=${token}`,
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

    // console.log("Address created successfully:", response);
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
  restaurant,
  token,
  apiBaseUrl,
  isEditMode,
  orderId,
  orderCheck,
}) => {
  const formattedItems = {
    items: items.map((item) => ({
      id: item.selectedIdSize,
      choices: [],
      condiments: [
        ...(item.selectedoption || []).map((option) => ({
          id: option.id,
          price: parseFloat(option.price),
          count: option.quantity || 1,
        })),
        ...(item?.selectedMainExtras || []).map((extra) => ({
          id: extra.id,
          price: parseFloat(extra.price),
          count: extra.quantity || 1,
        })),
        ...(item?.selectedExtras || []).map((extra) => ({
          id: extra.id,
          price: parseFloat(extra.price),
          count: extra.quantity ||1,
        })),
      ],
      count: item.quantity,
      special: item.note || "",
    })),
  };
  if (process.env.NODE_ENV === "development") {
    console.log("formattedItems:", formattedItems);
    console.log(
      "📦 items being sent:",
      JSON.stringify(formattedItems, null, 2)
    );

    const apiUrl = `${apiBaseUrl}/callcenter/order/${
      isEditMode ? "update" : "create"
    }?api_token=${token}&orderId=${orderId}&orderCheck=${orderCheck}&lookup_id=${lookupId}&address=${address}&area=${area}&notes=${notes}&time=${
      time || ""
    }&source=${source}&status=${status}&payment=${payment}&coins=${
      insertpoints || "00.00"
    }&lat=${lat}&lng=${lng}&delivery_type=${delivery_type}&restaurant=${restaurant}&branch=${branch}`;

    console.log("Final API URL:", apiUrl);
  }

  try {
    // console.log("orderId:", orderId);
    // console.log("branch:", branch);
    const response = await axios.post(
      `${apiBaseUrl}/callcenter/order/${
        isEditMode ? "update" : "create"
      }?api_token=${token}`,
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
          restaurant,
          ...(isEditMode ? { order_code: orderId, check_id: orderCheck } : {}),
        },
      }
    );

    console.log(
      `Order ${isEditMode ? "updated" : "created"}  successfully:`,
      response.data
    );
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

// export const updateOrder = async ({
//   lookupId,
//   address,
//   area,
//   notes,
//   source,
//   status,
//   insertcoupon,
//   insertpoints,
//   payment,
//   delivery_type,
//   branch,
//   items,
//   lng,
//   time,
//   lat,
//   restaurant,
//   token,
//   apiBaseUrl,
// }) => {
//   const formattedItems = {
//     items: items.map((item) => ({
//       id: item.selectedIdSize,
//       choices: [],
//       options: [],
//       extras: [
//         ...(item.selectedMainExtrasIds || []),
//         ...(item.selectedExtrasIds || []),
//       ],
//       count: item.quantity,
//       special: item.note || "",
//     })),
//   };
//   // console.log("formattedItems:", formattedItems);
//   // console.log("📦 items being sent:", JSON.stringify(formattedItems, null, 2));

//   // const apiUrl = `/callcenter/order/create?api_token=${token}&lookup_id=${lookupId}&address=${address}&area=${area}&notes=${notes}&time=${time || ""}&source=${source}&status=${status}&payment=${payment}&coins=${insertpoints || "00.00"}&lat=${lat}&lng=${lng}&delivery_type=${delivery_type}&restaurant=${restaurant}&branch=${branch}`;

//   // console.log("Final API URL:", apiUrl);

//   try {
//     const response = await axios.post(
//       `${apiBaseUrl}/callcenter/order/create?api_token=${token}`,
//       null,
//       {
//         params: {
//           lookup_id: lookupId,
//           address,
//           area,
//           items: JSON.stringify(formattedItems),
//           notes,
//           ...(time ? { time } : {}),
//           source,
//           branch,
//           status,
//           payment,
//           lat,
//           lng,
//           delivery_type,
//           restaurant,
//         },
//       }
//     );

//     // console.log("Order created successfully:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("Error creating order:", error);
//     throw error;
//   }
// };

export const updateUserAddress = async ({
  id,
  area,
  street,
  building,
  floor,
  apt,
  additional,
  address_name,
  token,
  apiBaseUrl,
}) => {
  console.log("apiBaseUrl:", apiBaseUrl);
  console.log("token:", token);
  console.log("address_name:", address_name);
  const basePath =
    typeof window !== "undefined" &&
    window.location.origin.includes("localhost")
      ? "/api"
      : apiBaseUrl;

  // console.log("basePath:", basePath);
  try {
    const response = await axios.post(
      `${apiBaseUrl}/callcenter/user/address/update?api_token=${token}`,
      null,
      {
        params: {
          id: id,
          area,
          street,
          address_name: address_name,
          country: 1,
          city: 1,
          ...(building && { building }),
          ...(floor && { floor }),
          ...(apt && { apt }),
          ...(additional && { additional: additional }),
        },
      }
    );
    // console.log("response", response);
    return response.data;
  } catch (error) {
    console.error("Error updating address:", error);

    if (error.response) {
      console.error("Response Error Data:", error.response.data);
      console.error("Response Error Status:", error.response.status);
      console.error("Response Error Headers:", error.response.headers);
    } else if (error.request) {
      console.error("Request Error:", error.request);
    } else {
      console.error("Error Message:", error.message);
    }
    console.error("Error Config:", error.config);

    throw error;
  }
};

// export const updateUserAddress = async ({
//   id,
//   area,
//   street,
//   building,
//   floor,
//   apt,
//   additional_info,
//   address_name,
//   token,
//   apiBaseUrl,
// }) => {
//   const basePath =
//     typeof window !== "undefined" &&
//     window.location.origin.includes("localhost")
//       ? "/api"
//       : apiBaseUrl;

//   try {
//     const response = await request
//       .put(`${apiBaseUrl}/callcenter/user/address/update`)
//       .query({ api_token: token })
//       .query({
//         id,
//         area,
//         street,
//         address_name,
//         country: 1,
//         city: 1,
//         ...(building && { building }),
//         ...(floor && { floor }),
//         ...(apt && { apt }),
//         ...(additional_info && { additional_info }),
//       });

//     console.log("response", response.body);
//     return response.body;
//   } catch (error) {
//     console.error("Error updating address:", error);
//     throw error;
//   }
// };

export const updateUserData = async (userData) => {
  const params = new URLSearchParams();

  if (userData.userId) params.append("user_id", userData.userId);
  if (userData.username) params.append("user_name", userData.username);
  if (userData.email) params.append("email", userData.email);
  if (userData.phone) params.append("phone", userData.phone);
  if (userData.phone2) params.append("phone2", userData.phone2);
  const basePath =
    typeof window !== "undefined" &&
    window.location.origin.includes("localhost")
      ? userData.apiBaseUrl
      : userData.apiBaseUrl;
  const url = `${basePath}/callcenter/user/update?api_token=${
    userData.token
  }&${params.toString()}`;

  try {
    const response = await axios.post(url);
    console.log("apiBaseUrl updateUserData", `${basePath}/callcenter/user`);

    console.log("User updated:", response);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteAddress = async (id, token, apiBaseUrl) => {
  try {
    const basePath =
      typeof window !== "undefined" &&
      window.location.origin.includes("localhost")
        ? "/api"
        : apiBaseUrl;
    const response = await axios.post(
      `${apiBaseUrl}/callcenter/user/address/delete?api_token=${token}&id=${id}`
    );
    const messages = response.data.messages || response.data.data;

    //   if (messages.length > 0) {
    //     toast.success(messages[0]);
    //   }
    console.log("apiBaseUrl deleteAddress", apiBaseUrl);

    return response.data;
  } catch (error) {
    toast.error(`Failed to delete : ${error}`);
    throw error;
  }
};

export const fetchAreas = async (apiBaseUrl) => {
  try {
    // const response = await axios.get(`${apiBaseUrl}/api/areas/?city=1`);
    const response = await axios.get(`${apiBaseUrl}/areas?city=1`);
    // console.log("areas:", response.data.data.areas);
    return response.data.data.areas;
  } catch (error) {
    console.error("Error fetching areas:", error);

    throw error;
  }
};
