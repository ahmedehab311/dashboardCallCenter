import axios from "axios";

export const updateStatusOrder = async (apiBaseUrl, token, orderId, status) => {
  try {
    const response = await axios.post(
      `${apiBaseUrl}/callcenter/orders/update/status?api_token=${token}&orderId=${orderId}&status=${status}`
    );
    return response;
  } catch {
    console.error("Error fetching Status:", error);
    throw error;
  }
};
export const updatebranchOrder = async (
  apiBaseUrl,
  token,
  orderId,
  branchId
) => {
  try {
    const response = await axios.post(
      `${apiBaseUrl}/callcenter/orders/update/branch?api_token=${token}&orderId=${orderId}&branchId=${branchId}`
    );
    return response;
  } catch {
    console.error("Error fetching Status:", error);
    throw error;
  }
};
export const updateDelivery = async (
  apiBaseUrl,
  token,
  orderId,
  deliveryId
) => {
  try {
    const response = await axios.post(
      `${apiBaseUrl}/callcenter/orders/update/delivery?api_token=${token}&orderId=${orderId}&deliveryId=${deliveryId}`
    );
    return response;
  } catch {
    console.error("Error fetching Status:", error);
    throw error;
  }
};
export const getDeliveries = async (apiBaseUrl, token) => {
  try {
    const response = await axios.get(
      `${apiBaseUrl}/callcenter/get/delivery?api_token=${token}`
    );
    // console.log("Delivery:", response.data);

    return response.data.data.delivery_mans;
  } catch {
    console.error("Error fetching Status:", error);
    throw error;
  }
};
