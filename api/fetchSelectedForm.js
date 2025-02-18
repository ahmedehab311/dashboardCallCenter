// fetchSelectOptions.js
import { BASE_URL } from "@/api/BaseUrl";

export const fetchSelectOptions = async (api) => {
  const hashValue = localStorage.getItem("hashValue");
  const response = await fetch(`${BASE_URL}${api}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${hashValue}`,
      locale: `en`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch data");

  const data = await response.json();

  if (process.env.NODE_ENV === "development") {
    console.log("Fetched Data:", data);
  }

  return data.response.data;
};
