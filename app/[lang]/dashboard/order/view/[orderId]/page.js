"use client";
import { useEffect, useState } from "react";
import { fetchViewOrder } from "../../../ordersTypes/apisOrders";
import { useSubdomin } from "@/provider/SubdomainContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BasicTable from "./components/BasicTable";
import Select from "react-select";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { selectStyles } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { fetchBranches } from "@/app/[lang]/dashboard/create-order/apICallCenter/ApisCallCenter";
import { useQuery } from "@tanstack/react-query";
export default function OrderViewPage({ params }) {
  const { orderId } = params;
  const { theme } = useTheme();
  const [color, setColor] = useState("");
  const { apiBaseUrl, subdomain } = useSubdomin();
  const [OrderDetails, setOrderDetails] = useState([]);
  const [OrderDetailsItem, setOrderDetailsItem] = useState([]);
  const language =
    typeof window !== "undefined" ? localStorage.getItem("language") : null;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  useEffect(() => {
    const fetchdata = async () => {
      const response = await fetchViewOrder(token, apiBaseUrl, orderId);
      console.log("response", response);
      if (response) {
        setOrderDetails(response.details);
        setOrderDetailsItem(response.items);
      }
    };
    fetchdata();
  }, [apiBaseUrl, orderId, token]);

  const {
    data: branches,
    isLoadingBranches,
    errorBranches,
    refetch: refetchBranches,
  } = useQuery({
    queryKey: [
      "BranchesList",
      OrderDetails?.restaurant_id,
      OrderDetails?.address_info?.area,
    ],
    queryFn: () =>
      fetchBranches(
        OrderDetails?.restaurant_id,
        OrderDetails?.address_info?.area,
        token,
        apiBaseUrl
      ),
    enabled:
      !!OrderDetails?.restaurant_id &&
      !!OrderDetails?.address_info?.area &&
      !!token,
  });
  // console.log("Branches", branches);
  const [branchOptions, setBranchOptions] = useState([]);
  const [statusOptions, setstatusOptions] = useState([
    { value: "New", label: "New" },
    { value: "Pending", label: "Pending" },
    { value: "Processing", label: "Processing" },
    { value: "In-way", label: "In way" },
    { value: "Delivered", label: "Delivered" },
    { value: "Canceled", label: "Canceled" },
    { value: "Rejected", label: "Rejected" },
  ]);

  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  useEffect(() => {
    if (branches?.length > 0) {
      setBranchOptions(
        branches.map((branch) => ({
          value: branch.id,
          label: branch.name_en,
          priceList: branch.price_list,
          deliveryFees: branch.delivery_fees,
        }))
      );
    }
  }, [branches]);
  useEffect(() => {
    if (branchOptions.length > 0 && OrderDetails?.branch_id) {
      const foundBranch = branchOptions.find(
        (option) => option.value === OrderDetails.branch_id
      );
      setSelectedBranch(foundBranch || null);
    }
  }, [branchOptions, OrderDetails?.branch_id]);
  useEffect(() => {
    if (statusOptions.length > 0 && OrderDetails?.status) {
      const foundStatus = statusOptions.find(
        (option) => option.value === OrderDetails.status
      );
      setSelectedStatus(foundStatus || null);
    }
  }, [statusOptions, OrderDetails?.status]);
  useEffect(() => {
    if (theme === "dark") {
      setColor("#fff");
    } else {
      setColor("#000");
    }
  }, [theme]);
  const handlePrint = () => {
    window.print();
  };
  if (!OrderDetails) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* <div className="flex">
 <div>
   <div className="flex justify-between items-center w-[60%]">
        <h3>Order id: {OrderDetails?.check_id}</h3>

        <p>Status: {OrderDetails?.status}</p>
      </div>
      <Card title="Basic Table " className="w-[60%]">
        <BasicTable
          OrderDetailsItem={OrderDetailsItem}
          OrderDetails={OrderDetails}
        />
      </Card>
   </div>
      <Card title="Basic Table" className="w-[60%] p-4">
      <div className="flex gap-3">
       <p>Order date: {OrderDetails?.created_at}</p>
        <p>Order id: {OrderDetails?.order_id}</p>

       </div>
        <Select
          placeholder="Select branch" 
          className="react-select w-[40%] my-2"
          classNamePrefix="select"
          // options={daysNumberOptions}
          // onChange={handledaysNumberChange}
          isClearable={true}
          styles={selectStyles(theme, color)}
          // value={daysNumberOptions.find(
          //   (option) => option.value === selectedDayNumber
          // )}
        />
     
      </Card>
 </div> */}
      <div className="flex justify-between">
        <div className="flex justify-between items-center w-1/2">
          <div className="flex gap-2">
            <h3>Check: {OrderDetails?.check_id}</h3>
            <p>Source: {OrderDetails?.source}</p>
          </div>
          <p>Status: {OrderDetails?.status}</p>
        </div>
      </div>

      <div className="flex gap-4">
        <Card title="Order Info" className="w-1/2">
          <BasicTable
            OrderDetailsItem={OrderDetailsItem}
            OrderDetails={OrderDetails}
          />
        </Card>

        <Card title="Order Details" className="w-1/2 p-4">
          <div className="flex gap- justify-between my-2">
            <p>Name: {OrderDetails?.user_data?.user_name}</p>
            <p>Phone: {OrderDetails?.user_data?.phone}</p>
          </div>
          <div className="flex gap- justify-between">
            <p>Order date: {OrderDetails?.created_at}</p>
            <p>Order id: {OrderDetails?.order_id}</p>
          </div>

          <div className="flex gap- justify-between my-2">
            <div className="w-[40%]">
              <p className="mb-1 text-sm ">Change branch:</p>
              <Select
                options={branchOptions}
                placeholder="Select branch"
                className="react-select"
                classNamePrefix="select"
                styles={selectStyles(theme, color)}
                value={selectedBranch}
                onChange={(selected) => setSelectedBranch(selected)}
              />
            </div>
            <div className="w-[40%]">
              <p className="mb-1 text-sm ">Change status:</p>
              <Select
                placeholder="Change Status"
                className="react-select "
                classNamePrefix="select"
                styles={selectStyles(theme, color)}
                options={statusOptions}
                onChange={(selected) => setSelectedStatus(selected)}
                value={selectedStatus}
              />
            </div>
          </div>
          <div className="flex justify-end ">
            <div className="flex justify-end w-1/2">
              <div className="flex gap-2 items-end">
                <Button className="py-[6px]">
                  <FiEdit />
                </Button>
                <Button className="py-[6px]" onClick={() => handlePrint()}>
                  Print
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className="flex gap-4">
        <Card title="Order Details" className="w-1/2 p-4">
          <p>Address: {OrderDetails?.address_info?.address1}</p>
          <div className=" justify-between mt-4 my-2">
            <div className="flex gap-3">
              <p>
                Area: {OrderDetails?.address_info?.area_details?.area_name_en}
              </p>
              <p>Floor: {OrderDetails?.address_info?.floor || "-"}</p>
            </div>
            <div className="flex gap-5 my-2">
              <p>Street: {OrderDetails?.address_info?.street || "-"}</p>
              <p>Building: {OrderDetails?.address_info?.building || "-"}</p>
            </div>

            <div className="flex gap-5 my-2">
              <p>Apartment: {OrderDetails?.address_info?.apartment || "-"} </p>
              <p>
                Additional Info: {OrderDetails?.address_info?.additional || "-"}
              </p>
            </div>
          </div>
        </Card>
        <Card title="Order Details" className="w-1/2 p-4">
          <h2>Delivery details:</h2>
          <div className="flex justify-between mt-4 my-2">
            <p>Name : {OrderDetails?.delivery?.delivery_details?.user_name}</p>
            <p>
              Phone: {OrderDetails?.delivery?.delivery_details?.phone || "-"}
            </p>
            <p>
              phone2: {OrderDetails?.delivery?.delivery_details?.phone2 || "-"}
            </p>
          </div>
          <Button>Change driver</Button>
        </Card>
      </div>

      {/* <Card className="col-span- h-full mt-0 w-[60%] p-5">
        <p>Customer Name: {OrderDetails?.user?.name}</p>
      </Card> */}

      {/* <Card className="col-span- h-full mt-0 w-[60%] p-5">
        <p>Status: {OrderDetails?.status}</p>
        <p>Customer Name: {OrderDetails?.user?.name}</p>
      </Card> */}
    </>
  );
}
