"use client";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useTranslation } from "/provider/TranslationProvider";
import Image from "next/image";
import ReactPaginate from "react-paginate";
import { useEffect, useState } from "react";
import OrdersType from "./ordersTypes/OrdersType";
// import "@/app/[lang]/sections/index.css";
function DashboardPageView() {
  const token = localStorage.getItem("token");

useEffect(() => {
  if (!token) {
    window.location.replace("/login");
  }
}, []);
  // const [isEditMode, setIsEditMode] = useState(false);
  return (
    <>
      <OrdersType />
    </>
  );
}

export default DashboardPageView;
