"use client";
import { useParams } from "next/navigation";
import React from "react";

function ViewAndEditMenu() {
  const { itemId: id } = useParams();
  return (
    <>
      <div>ViewAndEditMenu </div>
      <div>id menu:{id} </div>
    </>
  );
}

export default ViewAndEditMenu;
