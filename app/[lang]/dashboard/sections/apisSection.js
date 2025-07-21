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
    queryKey: ["SectionList", name, id],
    queryFn: () => fetchAllSections(token, apiBaseUrl, name, id),
    enabled: !!token && !!name,
    cacheTime: 0,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
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
export const AssignItemToSection = async (token, apiBaseUrl, Itemid, body) => {
  try {
    // for problem cross origin
    const isDev = process.env.NODE_ENV === "development";

    const baseUrl = isDev ? `/api-proxy` : `${apiBaseUrl}`;
    const response = await axios.patch(
      `${baseUrl}/v1//call-center/item/${Itemid}/section?api_token=${token}`,
      body
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching menu:", error);
    throw error;
  }
};
export const saveArrangement = async (token, apiBaseUrl, name, body) => {
  try {
    // for problem cross origin
    const isDev = process.env.NODE_ENV === "development";

    const baseUrl = isDev ? `/api-proxy` : `${apiBaseUrl}`;
    const response = await axios.patch(
      `${baseUrl}/v1//call-center/${name}/rearrange?api_token=${token}`,
      body
    );

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
