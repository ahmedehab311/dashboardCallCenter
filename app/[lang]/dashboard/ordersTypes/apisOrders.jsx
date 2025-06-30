import axios from "axios";

// export const fetchOrders = async (token, apiBaseUrl, dayNumber) => {
//   try {
//     const response = await axios.get(
//       `${apiBaseUrl}/callcenter/orders?api_token=${token}&from=${dayNumber}`
//     );
// console.log("response",response.data.message);

//     return response.data.data;
//   } catch (error) {
//     console.error("Error fetching Orders:", error);
//     throw error;
//   }
// };

// export const fetchOrders = async (token, apiBaseUrl, dayNumber) => {
//   try {
//     const response = await axios.get(
//       `${apiBaseUrl}/callcenter/orders?api_token=${token}&from=${dayNumber}`
//     );

//     return response;
//   } catch (error) {
//     console.error("Error fetching Orders:", error);

//     // لو فيه message من السيرفر
//     const message = error.response?.data?.message;
//     console.error("Error fetching Orders:", error);
//     console.log("Server message:", error.response?.data?.message);
//     // ارجع الخطأ برسالة واضحة
//     throw new Error(message || "Failed to fetch orders");
//   }
// };

export const fetchOrders = async (token, apiBaseUrl, dayNumber) => {
  const response = await axios.get(
    `${apiBaseUrl}/callcenter/orders?api_token=${token}&from=${dayNumber}`
  );

  const message = response?.data?.message;

  if (
    typeof message === "string" &&
    message.toLowerCase().includes("invalid token")
  ) {
    // نرمي error عشان نوصله في onError
    throw new Error("Invalid token");
  }

  return response.data.data;
};

// export async function getServerSideProps(context) {
//   const token = context.req.cookies.token; // جلب التوكن من الـ Cookies

//   // استخراج النطاق الفرعي (subdomain) من الـ request headers
//   const host = context.req.headers.host; // استخراج النطاق الفرعي من الـ host
//   const subdomain = host.split('.')[0]; // النطاق الفرعي هو أول جزء من الـ host

//   // تحديد الـ apiBaseUrl بناءً على النطاق الفرعي
//   const apiBaseUrl = `https://myres.me/${subdomain}/api`;

//   // جلب `selectedDayNumber` من query أو params في URL
//   const { selectedDayNumber = 1} = context.query; // افتراضياً 7 إذا لم يكن موجودًا في الـ query

//   // جلب البيانات باستخدام fetch أو axios
//   const res = await fetch(`${apiBaseUrl}/callcenter/orders?api_token=${token}&from=${selectedDayNumber}`);
//   const orders = await res.json();

//   // إرجاع البيانات كـ props
//   return {
//     props: {
//       initialOrders: orders.data, // البيانات التي سيتم إرسالها للـ Client
//       selectedDayNumber, // تمرير selectedDayNumber كـ prop
//     },
//   };
// }

export async function getServerSideProps(context) {
  const token = context.req.cookies.token; // جلب التوكن من الـ Cookies
  console.log("Token: ", token); // للتحقق من التوكن

  // استخراج النطاق الفرعي (subdomain) من الـ request headers
  const host = context.req.headers.host; // استخراج النطاق الفرعي من الـ host
  const subdomain = host.split(".")[0]; // النطاق الفرعي هو أول جزء من الـ host
  console.log("Subdomain: ", subdomain); // للتحقق من النطاق الفرعي

  // تحديد الـ apiBaseUrl بناءً على النطاق الفرعي
  const apiBaseUrl = `https://myres.me/${subdomain}/api`;
  console.log("API Base URL: ", apiBaseUrl); // للتحقق من عنوان الـ API

  // جلب `selectedDayNumber` من query أو params في URL
  const { selectedDayNumber = 1 } = context.query; // افتراضياً 1 إذا لم يكن موجودًا في الـ query
  console.log("Selected Day Number: ", selectedDayNumber); // للتحقق من رقم اليوم المحدد

  // جلب البيانات باستخدام fetch أو axios
  const res = await fetch(
    `${apiBaseUrl}/callcenter/orders?api_token=${token}&from=${selectedDayNumber}`
  );
  const orders = await res.json();
  // console.log("Orders Data: ", orders); // للتحقق من البيانات المسترجعة من الـ API

  // إرجاع البيانات كـ props
  return {
    props: {
      initialOrders: orders.data, // البيانات التي سيتم إرسالها للـ Client
      selectedDayNumber, // تمرير selectedDayNumber كـ prop
    },
  };
}

export const fetchViewOrder = async (token, apiBaseUrl, orderId) => {
  try {
    const response = await axios.get(
      `${apiBaseUrl}/callcenter/order/${orderId}?api_token=${token}`
    );

    return response.data.data;
    // console.log("response.data.data ", response.data.data);
  } catch (error) {
    console.error("Error fetching Orders:", error);
    throw error;
  }
};

export const fetchUserByPhoneAndId = async (
  orderIdOrPhone,
  token,
  apiBaseUrl
) => {
  try {
    const response = await axios.get(
      `${apiBaseUrl}/callcenter/search/order?q=${orderIdOrPhone}&api_token=${token}`
    );
    // console.log("serach user ", response.data.data.orders);
    return response.data.data.orders;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};
