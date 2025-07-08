"use client";
import { useParams } from "next/navigation";
import React from "react";

function ViewAndEditItem() {
  const { itemId: id } = useParams();
  return (
    <>
      <div>ViewAndEditItem </div>
      <div>id Item:{id} </div>
    </>
  );
}

export default ViewAndEditItem;
