"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import Select from "react-select";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { selectStyles } from "@/lib/utils";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Icon } from "@iconify/react";
export function BasicDataTable({
  orders,
  searchUser,
  selectedStatus,
  selectedDayNumber,
  setSelectedDayNumber,
  isLoadingorders,
  errororders,
  orderIdOrPhone,
  setOrderIdOrPhone,
  isLoadingSearchUser,
  refetchSearchUser,
}) {
  const language =
    typeof window !== "undefined" ? localStorage.getItem("language") : null;
  const router = useRouter();
  const { theme } = useTheme();
  const [color, setColor] = useState("");
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });
  const daysNumberOptions = [
    { value: 1, label: "1 Day" },
    { value: 7, label: "7 Days" },
    { value: 30, label: "30 Days" },
  ];
  const [deliveryType, setDeliveryType] = useState({});
// console.log("orders",orders)
// console.log("searchUser",searchUser)

  const isSearching = !!orderIdOrPhone;
  const isEmptySearchResult =
    isSearching && Array.isArray(searchUser) && searchUser.length === 0;
  const formattedOrders = useMemo(() => {
    const baseOrders =
      searchUser?.length > 0
        ? searchUser
        : Object.values(orders?.sources || {}).flat();
    const filteredOrders =
      selectedStatus === "Total"
        ? baseOrders
        : baseOrders.filter((order) => order?.status === selectedStatus);

    return filteredOrders.map((order) => {
      return {
        "Invoice Id": order?.order_id,
        status: order?.status,
        Restaurant: order.restaurant_name,
        Date: order?.created_at || "-",
        Branch: order?.branch?.[0]?.name_en || "-",
        Customer: order?.user?.user_name || order?.user_name || "-",
        Phone: order?.user?.phone || order?.phone || "-",
        // Address: order?.address?.[0]?.address1 ||  order?.address_info?.[0]?.address1 || "Pickup",
        Address:  order?.delivery_type === "1" ? (order?.address?.[0]?.address1 || order?.address_info?.address1) : "Pickup",
        Total: order?.total,
        source: order?.source,
        
        // TotalAmount: isNaN(parseFloat(order?.total?.replace(/,/g, "")))
        //   ? 0
        //   : parseFloat(order?.total.replace(/,/g, "")).toFixed(2),
        TotalAmount: isNaN(
          parseFloat(order?.total?.toString().replace(/,/g, ""))
        )
          ? 0
          : parseFloat(order?.total.toString().replace(/,/g, "")).toFixed(2),
        paymentMethod: order?.payment_method,
      };
    });
  }, [orders, searchUser, selectedStatus]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "Invoice Id",
        header: "Invoice Id",

        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="flex flex-col">
              <span>{row["Invoice Id"]}</span>
              <span className="text-sm text-muted-foreground">
                {row["status"]}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "Restaurant",
        header: "Restaurant",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "Date",
        header: "Date",
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="flex flex-col">
              <span>{row["Date"]}</span>
              <span className="text-sm text-muted-foreground">
                {row["source"]}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "Branch",
        header: "Branch",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "Customer",
        header: "Customer",
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="flex flex-col">
              <span>{row["Customer"]}</span>
              <span className="text-sm text-muted-foreground">
                {row["Phone"]}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "Address",
        header: "Address",
        cell: (info) => info.getValue(),
      },

      {
        accessorKey: "TotalAmount",
        header: "Total amount",
        // cell: (info) => info.getValue(),
        cell: (info) => {
          const row = info.row.original;
          const paymentMethodText =
            row["paymentMethod"] === 1
              ? "Cash"
              : row["paymentMethod"] === 2
              ? "Visa"
              : "Other";
          return (
            <div className="flex flex-col">
              <span className="whitespace-nowrap">{row["TotalAmount"]}</span>
              <span className="text-sm text-muted-foreground">
                {paymentMethodText}
              </span>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: formattedOrders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
  });
  // Pagination
  const maxPageButtons = 5;
  const currentPage = table.getState().pagination.pageIndex;
  const totalPages = table.getPageCount();

  const startPage = Math.max(
    0,
    Math.min(
      currentPage - Math.floor(maxPageButtons / 2),
      totalPages - maxPageButtons
    )
  );
  const endPage = Math.min(startPage + maxPageButtons, totalPages);

  const visiblePages = Array.from(
    { length: endPage - startPage },
    (_, i) => startPage + i
  );

  useEffect(() => {
    if (theme === "dark") {
      setColor("#fff");
    } else {
      setColor("#000");
    }
  }, [theme]);

  // day number selected

  const handledaysNumberChange = (selectedOption) => {
    if (selectedOption) {
      setSelectedDayNumber(selectedOption.value);
    } else {
      setSelectedDayNumber(0);
    }
  };

  const handleInputChange = (event) => {
    setOrderIdOrPhone(event.target.value);
  };
  const handleClearSearch = () => setOrderIdOrPhone("");

  const handleEditOrderClick = (orderId) => {
    const url = `/${language}/dashboard/order/view/${orderId}`;
    router.push(url);
  };
  return (
    <>
      <div className="flex items-center flex-wrap gap-2 px-4 justify-between">
        <div className="relative max-w-sm min-w-[200px]">
          <Input
            placeholder="Search by order id or phone"
            value={orderIdOrPhone}
            onChange={handleInputChange}
            className="h-10 pr-8 text-[#000] dark:text-[#fff]"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                refetchSearchUser();
              }
            }}
          />
          {orderIdOrPhone && (
            <button
              onClick={handleClearSearch}
              className="absolute top-1/2 right-2 -translate-y-1/2 text-[#000] dark:text-[#fff] text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          <Select
            placeholder="Select day"
            className="react-select w-[3] mb-0"
            classNamePrefix="select"
            options={daysNumberOptions}
            onChange={handledaysNumberChange}
            isClearable={true}
            styles={selectStyles(theme, color)}
            value={daysNumberOptions.find(
              (option) => option.value === selectedDayNumber
            )}
            isDisabled={searchUser}
          />
        </div>
      </div>

      <div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoadingorders || isLoadingSearchUser ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <span className="animate-pulse text-[#fff] flex justify-center items-center">
                    Loading...
                  </span>
                </TableCell>
              </TableRow>
            ) : errororders ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <span className=" text-[#fff] flex justify-center items-center">
                    Error loading data.
                  </span>
                </TableCell>
              </TableRow>
            ) : isEmptySearchResult ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <span className=" text-[#000] dark:text-[#fff] flex justify-center items-center">
                    No search results found.
                  </span>
                </TableCell>
              </TableRow>
            ) : table.getPaginationRowModel().rows.length > 0 ? (
              table.getPaginationRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer"
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() =>
                    handleEditOrderClick(row.original["Invoice Id"])
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <span className="animate-pulse text-[#fff] flex justify-center items-center">
                    No results.
                  </span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center flex-wrap  justify-center gap-4 px-4 py-4">
        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 w-8"
          >
            <Icon
              icon="heroicons:chevron-left"
              className="w-5 h-5 rtl:rotate-180"
            />
          </Button>

          {visiblePages.map((pageIdx) => (
            <Button
              key={`page-${pageIdx}`}
              onClick={() => table.setPageIndex(pageIdx)}
              variant={pageIdx === currentPage ? "" : "outline"}
              className="w-8 h-8"
            >
              {pageIdx + 1}
            </Button>
          ))}
          {endPage < totalPages && (
            <>
              <span className="text-gray-500">...</span>
              <Button
                onClick={() => table.setPageIndex(totalPages - 1)}
                variant={currentPage === totalPages - 1 ? "" : "outline"}
                className="w-8 h-8"
              >
                {totalPages}
              </Button>
            </>
          )}

          <Button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            variant="outline"
            size="icon"
            className="h-8 w-8"
          >
            <Icon
              icon="heroicons:chevron-right"
              className="w-5 h-5 rtl:rotate-180"
            />
          </Button>
        </div>
      </div>
    </>
  );
}

export default BasicDataTable;
