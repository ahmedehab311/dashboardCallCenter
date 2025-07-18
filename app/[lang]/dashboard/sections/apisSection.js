import { useQuery } from "@tanstack/react-query";
import axios from "axios";
export const fetchAllSections = async (token, apiBaseUrl, name, id) => {
  try {
    const url = id
      ? `${apiBaseUrl}/v1/call-center/${name}/${id}?api_token=${token}`
      : `${apiBaseUrl}/v1/call-center/${name}?api_token=${token}`;
    const response = await axios.get(url);

    // console.log("response", response);
    return response.data.response.data;
  } catch (error) {
    console.error("Error fetching menu:", error);
    throw error;
  }
};



export const useSections = (token, apiBaseUrl, name, id) =>
  useQuery({
    queryKey: ["SectionList", name],
    queryFn: () => fetchAllSections(token, apiBaseUrl, name, id),
    enabled: !!token && !!name,
  });

export const deleteItem = async (token, apiBaseUrl, id, name) => {
  try {
    // for problem cross origin
    const isDev = process.env.NODE_ENV === "development";

    const baseUrl = isDev ? `/api-proxy` : `${apiBaseUrl}`;

    const response = await axios.delete(
      `${baseUrl}/v1/call-center/${name}/${id}?api_token=${token}`
    );

    // console.log("response", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching menu:", error);
    throw error;
  }
};

export const restoreItem = async (token, apiBaseUrl, id, name) => {
  try {
    // for problem cross origin
    const isDev = process.env.NODE_ENV === "development";

    const baseUrl = isDev ? `/api-proxy` : `${apiBaseUrl}`;
    const response = await axios.patch(
      `${baseUrl}/v1//call-center/${name}/${id}/restore?api_token=${token}`
    );

    // console.log("response", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching menu:", error);
    throw error;
  }
};
export const changeItemStatus = async (token, apiBaseUrl, id, name) => {
  try {
    // for problem cross origin
    const isDev = process.env.NODE_ENV === "development";

    const baseUrl = isDev ? `/api-proxy` : `${apiBaseUrl}`;
    const response = await axios.patch(
      `${baseUrl}/v1//call-center/${name}/${id}/status?api_token=${token}`
    );

    console.log("response", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching menu:", error);
    throw error;
  }
};
