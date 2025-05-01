"use client";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useTranslation } from "/provider/TranslationProvider";
import Image from "next/image";
import ReactPaginate from "react-paginate";
import { useState } from "react";
import OrdersType from "./ordersTypes/OrdersType";
// import "@/app/[lang]/sections/index.css";
function DashboardPageView() {
  return (
    <>
      <OrdersType />
    </>
  );
}

export default DashboardPageView;
