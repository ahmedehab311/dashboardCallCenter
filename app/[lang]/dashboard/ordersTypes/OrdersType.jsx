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
import UserDeviceReport from "./SourceReport";
import PickupReport from "./pickupReport";
import BranchesReport from "./BranchesReport";
import TableOrder from "./tableOrder/TableOrder";
import "./index.css";
import { useSession } from "@/provider/SessionContext";
function OrdersType() {
  const { apiBaseUrl } = useSubdomin();
  const [selectedStatus, setSelectedStatus] = useState("Total");
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);
  const [token, setToken] = useState(null);

  // const {
  //   data: orders,
  //   isLoading: isLoadingorders,
  //   isError: errororders,
  //   error,
  // } = useQuery({
  //   queryKey: ["ordersList", selectedDayNumber],
  //   queryFn: () => fetchOrders(token, apiBaseUrl, selectedDayNumber),
  //   enabled: !!token,
  //   onSuccess: (data) => {
  //     setAllOrders(data);
  //     setDisplayOrders(data);
  //   },
  // });
  
//   const {
//   data: orders,
//   isLoading: isLoadingorders,
//   isError: errororders,
//   error,
// } = useQuery({
//   queryKey: ["ordersList", selectedDayNumber],
//   queryFn: () => fetchOrders(token, apiBaseUrl, selectedDayNumber),
//   enabled: !!token,
//   select: (response) => response.data.data, // 👈 كده orders فيها فقط response.data.data
//   onSuccess: (response) => {
//     const message = response?.data?.message;

//     if (typeof message === "string" && message.toLowerCase().includes("invalid token")) {
//       toast.error("Session expired. Please login again.");
//       localStorage.removeItem("token");
//       window.location.href = "/login";
//       return;
//     }

//     // عادي نكمل التعامل مع الداتا
//     setAllOrders(response.data.data);
//     setDisplayOrders(response.data.data);
//   },
// });

const {
  data: orders,
  isLoading: isLoadingorders,
  isError: errororders,
  error,
} = useQuery({
  queryKey: ["ordersList", selectedDayNumber],
  queryFn: () => fetchOrders(token, apiBaseUrl, selectedDayNumber),
  enabled: !!token,
  onSuccess: (orders) => {
    const message = orders?.data?.message;

    if (
      typeof message === "string" &&
      message.toLowerCase().includes("invalid token")
    ) {
      toast.error("Session expired. Please login again.");
      localStorage.removeItem("token");
      window.location.href = "/login";
      return;
    }

    // ✅ بيانات سليمة
    setAllOrders(orders.data.data);
    setDisplayOrders(orders.data.data);
  },
});
  console.log("orders",orders);


  const [orderIdOrPhone, setOrderIdOrPhone] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(false);
  // const [searchQuery, setSearchQuery] = useState("");
  const {
    data: searchUser,
    isLoading: isLoadingSearchUser,
    isError: errorUserSearchUser,
    refetch: refetchSearchUser,
  } = useQuery({
    queryKey: ["userSearch"],
    queryFn: () => fetchUserByPhoneAndId(orderIdOrPhone, token, apiBaseUrl),
    enabled: false,
    // cacheTime: 0,
    // staleTime: 0,
  });
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);
const { handleInvalidToken } = useSession();

// في onError مثلاً:
if (error?.message === "Invalid token") {
  handleInvalidToken(); // 👈 هيظهر الديالوج
}
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
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 w-full p-2 custom-grid ">
        {/* <div
  className="grid gap-4 w-full p-2 mb-"
  style={{ gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))" }}
> */}
        {selectedStatus === "Total" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 col-span-3 ">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                icon={stat.icon}
                number={stat.number}
                label={stat.label}
                onClick={() => {
                  setSelectedStatus(stat.statusKey);
                }}
                bg={stat.bg}
                language={language}
                errororders={errororders}
                isLoadingorders={isLoadingorders}
                selectedStatus={selectedStatus}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-w gap-4 col-span-6">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                icon={stat.icon}
                number={stat.number}
                label={stat.label}
                onClick={() => setSelectedStatus(stat.statusKey)}
                bg={stat.bg}
                language={language}
                errororders={errororders}
                isLoadingorders={isLoadingorders}
                selectedStatus={selectedStatus}
              />
            ))}
          </div>
        )}

        {selectedStatus === "Total" && (
          <Card className="col-span- h-full mt-0">
            <CardHeader className="border-none p-6 pt-5 "></CardHeader>
            <CardContent>
              <div className="dashtail-legend">
                <UserDeviceReport
                  orders={orders}
                  errororders={errororders}
                  isLoadingorders={isLoadingorders}
                />
              </div>
            </CardContent>
          </Card>
        )}
        {selectedStatus === "Total" && (
          <Card className="col-span- h-ful mt-1">
            <CardHeader className="border-none p-6 pt-5 ">
              {/* <CardTitle className="text-lg font-semibold text-default-900 p-0">
        Device Breakdown
      </CardTitle> */}
            </CardHeader>
            <CardContent>
              <div className="dashtail-legend">
                <PickupReport
                  orders={orders}
                  selectedStatus={selectedStatus}
                  errororders={errororders}
                  isLoadingorders={isLoadingorders} 
                  error={error}
                />
              </div>
            </CardContent>
          </Card>
        )}
        {selectedStatus === "Total" && (
          <Card className="col-span- h-ful mt-1">
            <CardHeader className="border-none p-6 pt-5 "></CardHeader>
            <CardContent>
              <div className="dashtail-legend">
                <BranchesReport
                  orders={orders}
                  selectedStatus={selectedStatus}
                  errororders={errororders}
                  isLoadingorders={isLoadingorders}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <div>
        <Card className="col-span- h-full mt- p-3">
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
