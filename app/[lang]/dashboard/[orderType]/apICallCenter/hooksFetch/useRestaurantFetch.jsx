import { useQuery } from "@tanstack/react-query";
import React from "react";
import { fetchRestaurantsList } from "../ApisCallCenter";
import { useSubdomin } from "@/provider/SubdomainContext";

function useRestaurantFetch() {
  const { apiBaseUrl } = useSubdomin();
  const token = localStorage.getItem("token") 
  const {
    data: dataRestaurants,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["RestaurantsList"],
    queryFn: () => fetchRestaurantsList(token, apiBaseUrl),
    enabled: !!token,
  });

  const restaurantOptions =
    dataRestaurants?.map(({ id, res_name_en }) => ({
      value: id,
      label: res_name_en,
    })) || [];

  return { restaurantOptions };
}

export default useRestaurantFetch;
