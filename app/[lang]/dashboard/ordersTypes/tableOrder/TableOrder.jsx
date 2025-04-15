"use client";
import * as React from "react";
import { ChevronDown, MoreHorizontal } from "lucide-react";
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
import { cn } from "@/lib/utils";

export function BasicDataTable({ orders,selectedStatus }) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({
    Address: false,
  });
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const sources = orders?.sources || {};
  const mergedOrders = Object.values(sources).flat();


const formattedOrders = React.useMemo(() => {
    const sources = orders?.sources || {};
    const mergedOrders = Object.values(sources).flat();
    const filteredOrders =
    selectedStatus === "Total"
      ? mergedOrders
      : mergedOrders.filter((order) => order?.status === selectedStatus);


    return filteredOrders.map((order) => {
      return {
        "Invoice Id": order?.order_id,
        status: order?.status,
        Restaurant: order.restaurant_name,
        Date: order?.created_at || "-",
        Branch: order?.branch[0]?.name_en || "-",
        Customer: order?.user?.user_name || "-",
        Phone: order.user?.phone || "-",
        Address: order.address?.[0]?.address1 || "-",
        Total: order.total,
        source: order?.source,
        TotalAmount: order.sub_total,
        paymentMethod: order.payment_method,
      };
    });
  }, [orders,selectedStatus]);




  const columns = React.useMemo(
    () => [
      {
        accessorKey: "Invoice Id",
        header: "Invoice Id",
        // cell: (info) => info.getValue(),
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
        header: "TotalAmount",
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
              <span>{row["TotalAmount"]}</span>
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
      pagination 
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination, 
  });
  
  return (
    <>
      <div className="flex items-center flex-wrap gap-2  px-4">
        <Input
          placeholder="Filter emails..."
          value={table.getColumn("email")?.getFilterValue() || ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm min-w-[200px] h-10"
        />
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
            {table.getPaginationRowModel().rows?.length ? (
              table.getPaginationRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center flex-wrap gap-4 px-4 py-4">
        <div className="flex-1 text-sm text-muted-foreground whitespace-nowrap">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        {/* <div className="flex-1 text-sm text-muted-foreground whitespace-nowrap">
          {table.getSelectedRowModel().rows.length} of
          {table.getPaginationRowModel().rows.length} row(s) selected.
        </div> */}
        <div className="flex gap-2  items-center">
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

          {table.getPageOptions().map((page, pageIdx) => (
            <Button
              key={`basic-data-table-${pageIdx}`}
              onClick={() => table.setPageIndex(pageIdx)}
              variant={`${
                pageIdx === table.getState().pagination.pageIndex
                  ? ""
                  : "outline"
              }`}
              className={cn("w-8 h-8")}
            >
              {page + 1}
            </Button>
          ))}

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
