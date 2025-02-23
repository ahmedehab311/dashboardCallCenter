import axios from "axios";
import Cookies from "js-cookie"; // إذا كنت تستخدم التوكين من الكوكيز

const apiInstance = axios.create({
  baseURL: "https://myres.me/thmdev/api", // ضبط الـ API الرئيسي
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ إضافة `Interceptor` تلقائي لإضافة `token` في كل الطلبات
apiInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token"); // جلب التوكين من الكوكيز
    if (token) {
      config.params = config.params || {}; // التأكد من وجود `params`
      config.params.api_token = token; // إضافة `token` للـ URL
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiInstance;
