import axios from "axios";

export const fetchOrders = async (token, apiBaseUrl) => {
  try {
    const response = await axios.get(
      `${apiBaseUrl}/callcenter/orders?api_token=${token}&from=1`
    );

    return response.data.data;
  } catch (error) {
    console.error("Error fetching Orders:", error);
    throw error;
  }
};
