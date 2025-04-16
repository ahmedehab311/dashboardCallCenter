// components/StatCard.js
"use client";
import { useEffect, useState } from "react";

import CountUp from "react-countup";
export default function StatCard({ icon: Icon, number, label,onClick,bg,isLoadingorders,errororders }) {
  const [displayNumber, setDisplayNumber] = useState(0);
  const [isReal, setIsReal] = useState(false);

  useEffect(() => {
    if (number !== "—" && number !== undefined) {
      setIsReal(true);
    }
  }, [number]);
  useEffect(() => {
    if (
      !isLoadingorders &&
      !errororders &&
      number !== undefined &&
      number !== null
    ) {
      setIsReal(true);
    } else {
      setIsReal(false);
    }
  }, [number, isLoadingorders, errororders]);
  useEffect(() => {
    if (!isReal && isLoadingorders) {
      const interval = setInterval(() => {
        const random = Math.floor(Math.random() * 500) + 1; 
        setDisplayNumber(random);
      }, 100); 

      return () => clearInterval(interval); 
    }
  }, [isReal , isLoadingorders]);
  

  const renderContent = () => {
    if (isLoadingorders) {
      return displayNumber;
    }

    if (errororders) {
      return "Error";
    }

    return <CountUp end={number} duration={1.5} />;
  };

  return (

    <div
    onClick={onClick}
    className={`flex items-center justify-between p-4 rounded-xl shadow hover:opacity-90 transition w-full ${bg} cursor-pointer`}
  >
    <div className="flex flex-col text-left">
      {/* <span className="text-xl font-bold text-[#000]">
        {isReal ? <CountUp end={number} duration={1.5} /> : displayNumber}
      </span> */}
      <span className="text-xl font-bold text-[#000]">
          {renderContent()}
        </span>
      <span className="text-sm text-[#000]">{label}</span>
    </div>
    <div className="text-blue-500">
      <Icon size={32} />
    </div>
  </div>
  );
}
