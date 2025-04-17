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
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchOrders, fetchUserByPhoneAndId } from "./apisOrders";
import UserDeviceReport from "./UserDeviceReport";
import TableOrder from "./tableOrder/TableOrder";
function OrdersType() {
  const { apiBaseUrl, subdomain } = useSubdomin();
  const [selectedStatus, setSelectedStatus] = useState("Total");
  const [selectedDayNumber, setSelectedDayNumber] = useState(0);
  const [token, setToken] = useState(null);

  const {
    data: orders,
    isLoading: isLoadingorders,
    isError: errororders,
  } = useQuery({
    queryKey: ["ordersList", selectedDayNumber],
    queryFn: () => fetchOrders(token, apiBaseUrl, selectedDayNumber),
    enabled: !!token,
    onSuccess: (data) => {
      setAllOrders(data); 
      setDisplayOrders(data); 
    },
  });
  const [orderIdOrPhone, setOrderIdOrPhone] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(false); 

  const {
    data: searchUser,
    isLoading: isLoadingSearchUser,
    isError: errorUserSearchUser,
    refetch: refetchSearchUser,
  } = useQuery({
    queryKey: ["userSearch", orderIdOrPhone],
    queryFn: () => fetchUserByPhoneAndId(orderIdOrPhone, token, apiBaseUrl),
    enabled: false, 
   
  });
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
              errororders={errororders}
              isLoadingorders={isLoadingorders}
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
                errororders={errororders}
                isLoadingorders={isLoadingorders}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card className="col-span- h-full mt-0 p-3">
          <TableOrder
            orders={orders}
            selectedStatus={selectedStatus}
            selectedDayNumber={selectedDayNumber}
            setSelectedDayNumber={setSelectedDayNumber}
            errororders={errororders}
            isLoadingorders={isLoadingorders}
            isLoadingSearchUser={isLoadingSearchUser}
            errorUserSearchUser={errorUserSearchUser}
            orderIdOrPhone={orderIdOrPhone}
            setOrderIdOrPhone={setOrderIdOrPhone}
            searchTrigger={searchTrigger}
            setSearchTrigger={setSearchTrigger}
            searchUser={searchUser}
            refetchSearchUser={refetchSearchUser}
          />
        </Card>
      </div>
    </>
  );
}

export default OrdersType;
