"use client";
import { useEffect, useState } from "react";
import { fetchViewOrder } from "../../../ordersTypes/apisOrders";
import { useSubdomin } from "@/provider/SubdomainContext";
export default function OrderViewPage({ params }) {
  const { orderId } = params;
  const { apiBaseUrl, subdomain } = useSubdomin();
  const language =
    typeof window !== "undefined" ? localStorage.getItem("language") : null;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const [OrderDetails, setOrderDetails] = useState([]);
  useEffect(() => {
    const fetchdata = async () => {
      const response = await fetchViewOrder(token, apiBaseUrl, orderId);
      if (response) {
        setOrderDetails(response.details);
      }
    };
    fetchdata();
  }, [apiBaseUrl, orderId, token]);
  if (!OrderDetails) {
    return <div>Loading...</div>;
  }

  console.log("Order", OrderDetails.details);

  return (
    <div className="text-white">
      <h1>Order Details</h1>
      <p>Order ID: {orderId}</p>
      <div>
        <h1>Order Details</h1>
        <p>Order ID: {OrderDetails?.id}</p>
        <p>Status: {OrderDetails?.status}</p>
        <p>Customer Name: {OrderDetails?.user?.name}</p>
      </div>
    </div>
  );
}
