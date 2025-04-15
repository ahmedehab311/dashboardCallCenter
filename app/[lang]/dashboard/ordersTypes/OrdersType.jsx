import { useEffect, useState } from "react";
import StatCard from "./StatCard";
import {
  Package,
  PlusSquare,
  Hourglass,
  Settings,
  Truck,
  CheckCheck,
} from "lucide-react";
import { useSubdomin } from "@/provider/SubdomainContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchOrders } from "./apisOrders";
import UserDeviceReport from "./UserDeviceReport";
import TableOrder from "./tableOrder/TableOrder";
function OrdersType() {
  const { apiBaseUrl, subdomain } = useSubdomin();
  const [selectedStatus, setSelectedStatus] = useState("Total");

  const [token, setToken] = useState(null);
  // useEffect(() => {
  //   console.log("Status changed:", selectedStatus);
  // }, [selectedStatus]);
  const {
    data: orders,
    isLoadingorders,
    errororders,
    refetch: refetchorders,
  } = useQuery({
    queryKey: ["ordersList"],
    queryFn: () => fetchOrders(token, apiBaseUrl),
    enabled: !!token,
  });
  // console.log("orders", orders);
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const language =
    typeof window !== "undefined" ? localStorage.getItem("language") : null;

  const stats = [
    {
      icon: Package,
      // number: `${orders?.total?.count}`,
      number: orders?.total?.count ?? "—",
      label: "Total Orders",
      statusKey: "Total",
      bg: "bg-blue-100",
    },
    {
      icon: PlusSquare,
      number: orders?.countByStatus?.new?.count ?? "—",
      label: "New Orders",
      statusKey: "New",
      bg: "bg-green-100",
    },
    {
      icon: Hourglass,
      number: orders?.countByStatus?.pending?.count ?? "—",
      label: "Pending Orders",
      statusKey: "Pending",
      bg: "bg-yellow-100",
    },
    {
      icon: Settings,
      number: orders?.countByStatus?.processing?.count ?? "—",
      // number: 45,
      label: "Processing Orders",
      statusKey: "Processing",
      bg: "bg-purple-100",
    },
    {
      icon: Truck,
      // number: 23,
      number: orders?.countByStatus?.inWay?.count ?? "—",
      label: "In way Orders",
      statusKey: "Processing",
      statusKey: "In-way",
      bg: "bg-orange-100",
    },
    {
      icon: CheckCheck,
      // number: 13,
      number: orders?.countByStatus?.delivered?.count ?? "—",
      label: "Delivered Orders",
      statusKey: "Delivered",
      href: "/orders/delivered",
      bg: "bg-emerald-100",
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 w-full p-2 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 col-span-3">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              number={stat.number}
              label={stat.label}
              onClick={() => {
                // console.log("StatusKey:", stat.statusKey);
                setSelectedStatus(stat.statusKey);
                // console.log("Selected status:", stat.statusKey);
              }}
              bg={stat.bg}
              language={language}
            />
          ))}
        </div>

        <Card className="col-span- h-full mt-0">
          <CardHeader className="border-none p-6 pt-5 ">
            {/* <CardTitle className="text-lg font-semibold text-default-900 p-0">
        Device Breakdown
      </CardTitle> */}
          </CardHeader>
          <CardContent>
            <div className="dashtail-legend">
              <UserDeviceReport
                orders={orders}
                selectedStatus={selectedStatus}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <TableOrder orders={orders} selectedStatus={selectedStatus} />
      </div>
    </>
  );
}

export default OrdersType;
