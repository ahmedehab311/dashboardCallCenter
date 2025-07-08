"use client";
import { useParams } from "next/navigation";
import React from "react";

function ViewAndEditSection() {
  const { id: id } = useParams();
  return (
    <>
      <div>ViewAndEditMenu </div>
      <div>id Section:{id} </div>
    </>
  );
}

export default ViewAndEditSection;
