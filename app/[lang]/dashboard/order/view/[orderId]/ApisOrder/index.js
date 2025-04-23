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
