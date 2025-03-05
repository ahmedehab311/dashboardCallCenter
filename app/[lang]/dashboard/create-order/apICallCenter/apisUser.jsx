import { BASE_URL } from "@/api/BaseUrl";
import axios from "axios";
import Cookies from "js-cookie";
import apiInstance from "@/api/axiosInstance";
import { toast } from "react-hot-toast";
import { Buffer } from "buffer";
const token = Cookies.get("token");

export const fetchUserByPhone = async (phone) => {
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

export const createUser = async (name, phone) => {
  try {
    const response = await apiInstance.post(
      `/callcenter/user/create?api_token=${token}`,
      null,
      {
        params: { name, phone },
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

  const url = `/api/callcenter/user/address/update?api_token=${token}&${params.toString()}`;

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

  const url = `/api/callcenter/user/update?api_token=${token}&${params.toString()}`;

  try {
    const response = await axios.put(url);
    console.log("User updated:", response.data);
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

export const deleteAddress = async (id) => {
  try {
    const response = await axios.delete(
      `/api/callcenter/user/address/delete?api_token=${token}&id=${id}`
    );
    const messages = response.data.messages || response.data.data;

    //   if (messages.length > 0) {
    //     toast.success(messages[0]);
    //   }
    console.log(response.data);

    return response.data;
  } catch (error) {
    toast.error(`Failed to delete : ${error}`);
    throw error;
  }
};

// export const createOrder = async ({ apiToken, lookupId, address, area, items, notes, source }) => {
//   try {
//     const url = `/callcenter/order/create`;

//     const params = {
//       api_token: apiToken,
//       lookup_id: lookupId,
//       address,
//       area,
//       notes: notes || "",
//       items:items,
//       source: source || "call center",
//     };

//     const response = await apiInstance.post(url, null, { params });

//     console.log("✅ الطلب تم إنشاؤه بنجاح:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("❌ خطأ في إنشاء الطلب:", error);
//     throw error;
//   }
// };

// export const createOrder = async ({
//   apiToken,
//   lookupId,
//   address,
//   area,
//   items,
//   notes,
//   source,
//   status,
//   insertcoupon,
//   payment,
//   delivery_type,
//   branch
// }) => {
//   try {
//     const url = `/api/callcenter/order/create?api_token=${token}`;

//     let params = {

//       api_token: apiToken,
//       lookup_id: lookupId,
//       delivery_type,
//       payment,
//       lat: 0,
//       lng: 0,
//       address,
//       area,
//       items: JSON.stringify({ items }), // ✅ تحويل `items` إلى JSON
//       notes,
//       time: "",
//       status:status,
//       coins: insertcoupon || "00.00",
//       source: source ,
//       branch:branch
//     };

//     // ✅ حذف القيم الفارغة أو undefined
//     Object.keys(params).forEach((key) => {
//       if (params[key] === "" || params[key] === undefined) {
//         delete params[key];
//       }
//     });

//     const fullUrl = `${url}?${new URLSearchParams(params).toString()}`;
//     console.log("🔗 رابط الـ API:", fullUrl); // ✅ عرض الرابط النهائي

//     const response = await axios.post(url, null, { params });

//     console.log("✅ الطلب تم إنشاؤه بنجاح:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("❌ خطأ في إنشاء الطلب:", error);
//     throw error;
//   }
// };
export const createAddress = async (
  userId,
  area,
  street,
  building,
  floor,
  apt,

  additionalInfo,
  name
) => {
  try {
    const response = await apiInstance.post(
      `/callcenter/user/address/add?api_token=${token}`,
      null,
      {
        params: {
          user_id: userId,
          area,
          street,
          address_name: name,

          country: 1,
          city: 1,
          ...(building && { building }),
          ...(floor && { floor }),
          ...(apt && { apt }),
          ...(additionalInfo && { additional_info: additionalInfo }),
        },
      }
    );

    console.log("Address created successfully:", response.data);
    return response.data;
    // return response?.data?.messages[0];
  } catch (error) {
    console.error("Error creating address:", error);
    throw error;
  }
};
// export const createOrder = async ({
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
// }) => {
//   try {
//     const response = await apiInstance.post(
//       `/callcenter/order/create?api_token=${token}`,
//       null, // لا يوجد body، نرسل البيانات عبر params
//       {
//         params: {
//           ...(lookupId && { lookup_id: lookupId }),
//           ...(address && { address }),
//           ...(area && { area }),
//           notes: notes !== undefined ? notes : "",
//           ...(status && { status }),
//           ...(source && { source }),
//           ...(branch && { branch }),
//           ...(delivery_type && { delivery_type }),
//           ...(payment && { payment }),
//           coins: insertpoints || "00.00", // ✅ قيمة افتراضية
//           lat: "0",
//           lng: "0",
//           time: "",
//         },
//       }
//     );

//     console.log("✅ الطلب تم إنشاؤه بنجاح:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("❌ خطأ في إنشاء الطلب:", error);
//     throw error;
//   }
// };

// export const createOrder = async ({
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
//   items, // ✅ استقبال `items`
// }) => {
//   try {

//     const response = await apiInstance.post(
//       `/callcenter/order/create?api_token=${token}`,
//       {
//         params: {
//           lookup_id: lookupId,
//           address: address,
//           area: area,
//           notes: notes || "",
//           status: status,
//           source: source,
//           branch: branch,
//           delivery_type: delivery_type,
//           payment: payment,
//           coins: insertpoints || "00.00", // ✅ قيمة افتراضية
//           lat: "0",
//           lng: "0",
//           time: "",
//         items: items,
//         },
//       }
//     );

//     console.log("✅ الطلب تم إنشاؤه بنجاح:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("❌ خطأ في إنشاء الطلب:", error);
//     throw error;
//   }
// };

// export const createOrder = async ({
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
//   finalItems,
// }) => {

//   // تحويل البيانات إلى JSON وترميزها بشكل صحيح
//   const finalURL = `/callcenter/order/create?api_token=${token}&items=${encodedItems}&lookup_id=${lookupId}&address=${address}&area=${area}&notes=${notes || ""}&source=${source}&delivery_type=${delivery_type}&payment=${payment}&branch=${branch}&status=${status}&coins=${insertpoints || "00.00"}&lat=0&lng=0&time=`;

//   console.log("🔍 Final URL:", decodeURIComponent(finalURL));

//   try {
//     const response = await apiInstance.post(finalURL, null);
//     console.log("✅ الطلب تم إنشاؤه بنجاح:", response?.data);
//     console.log("🛒 finalItems:", finalItems);
//     console.log("🛒 Request Params:", response?.config?.params);
//     console.log("✅ الطلب تم إنشاؤه بنجاح:", response?.data);
//     return response.data;
//   } catch (error) {
//     console.error("❌ خطأ في إنشاء الطلب:", error);
//     throw error;
//   }
// };
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
  const apiUrl = `/callcenter/order/create?api_token=${token}&lookup_id=${lookupId}&address=${address}&area=${area}&notes=${notes}&time=${time}&source=${source}&branch=${branch}&status=${status}&payment=${payment}&coins=${insertpoints || "00.00"}&lat=${lat}&lng=${lng}&delivery_type=${delivery_type}`;

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
        },
      }
    );

    console.log("Order created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};
