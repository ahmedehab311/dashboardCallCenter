"use client";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

import { useThemeStore } from "@/store";
import { useTheme } from "next-themes";
import { themes } from "@/config/thems";

const UserDeviceReport = ({
  height = 250,
  orders,
  isLoadingorders,
  errororders,
}) => {
  const { theme: config, setTheme: setConfig, isRtl } = useThemeStore();
  const { theme: mode } = useTheme();
  const theme = themes.find((theme) => theme.name === config);

  const allOrders = Array.isArray(orders?.sources)
    ? orders.sources.flat()
    : Object.values(orders?.sources || {}).flat();

  const deliveryCount = allOrders.filter(
    (order) => order.delivery_type === "1"
  ).length;
  console.log("deliveryCount", deliveryCount);

  const pickupCount = allOrders.filter(
    (order) => order.delivery_type === "2"
  ).length;
  console.log("pickupCount", pickupCount);

  const sourceLabels = ["Delivery", "Pickup"];
  const series = [deliveryCount, pickupCount];

  const options = {
    chart: { toolbar: { show: false } },
    labels: sourceLabels,
    dataLabels: { enabled: false },
    colors: [
      `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].primary})`,
      "#FF9E69",
      "#FFD1A7",
      "#6C5DD3",
      "#00C9A7",
      "#FFC700",
    ],
    tooltip: {
      theme: mode === "dark" ? "dark" : "light",
    },
    stroke: { width: 0 },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "24px",
              fontWeight: 500,
              color: `hsl(${
                theme?.cssVars[mode === "dark" ? "dark" : "light"].chartLabel
              })`,
            },
            value: {
              show: true,
              fontSize: "18px",
              fontWeight: 600,
              color: `hsl(${
                theme?.cssVars[mode === "dark" ? "dark" : "light"].chartLabel
              })`,
            },
            total: {
              show: true,
              label: "Total",
              fontSize: "16px",
              fontWeight: 600,
              color: `hsl(${
                theme?.cssVars[mode === "dark" ? "dark" : "light"].chartLabel
              })`,
            },
          },
        },
      },
    },
    legend: {
      position: "bottom",
      offsetY: -15,
      labels: {
        colors: `hsl(${
          theme?.cssVars[mode === "dark" ? "dark" : "light"].chartLabel
        })`,
      },
      itemMargin: { horizontal: 5, vertical: 5 },
      markers: {
        width: 10,
        height: 10,
        radius: 10,
        offsetX: isRtl ? 5 : -5,
      },
    },
  };
  if (isLoadingorders) {
    return (
      <div className="flex justify-center items-center h-[250px] animate-pulse text-[#fff] text-lg">
        Loading...
      </div>
    );
  }

  if (errororders) {
    return (
      <div className="flex justify-center items-center h-[250px] text-red-500 text-lg">
        Error loading chart
      </div>
    );
  }

  return (
    <Chart
      options={{
        ...options,
        labels: sourceLabels,
      }}
      series={series}
      type="donut"
      height={height}
      width={"100%"}
    />
  );
};

export default UserDeviceReport;
