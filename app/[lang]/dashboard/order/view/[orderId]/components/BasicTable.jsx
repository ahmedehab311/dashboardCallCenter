"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
const BasicTable = ({ OrderDetails, OrderDetailsItem }) => {
  if (!OrderDetailsItem) return null;
  // console.log("OrderDetailsItem", OrderDetailsItem);
  // console.log("OrderDetails", OrderDetails);

  return (
    <>
      {/* <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Count</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {OrderDetailsItem.map((item, index) => (
            <TableRow key={item.id || index}>
              <TableCell className="text-[#000] dark:text-[#fff]">
                {item?.info?.size_en || item?.name?.item_name}
              </TableCell>
              <TableCell className="text-[#000] dark:text-[#fff]">
                {item?.count}
              </TableCell>
              <TableCell className="text-[#000] dark:text-[#fff]">
                {item?.special || "—"}
              </TableCell>
             
              <TableCell className="text-[#000] dark:text-[#fff]">
                {parseFloat(item?.sub_total || 0).toFixed(2)}
              </TableCell>
              <TableCell className="text-[#000] dark:text-[#fff]">
                {parseFloat(item?.total_price || 0).toFixed(2)}
              </TableCell>
            </TableRow>
            
          ))}
        </TableBody>
      </Table> */}
      <div className="max-h-[px] overflow-auto  border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/">Item</TableHead>
              <TableHead className="w-2/5">Notes</TableHead>
              <TableHead className="w-1/8">Price</TableHead>
              <TableHead className="w-1/8">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {OrderDetailsItem.map((item, index) => (
              <React.Fragment key={item.id || index}>
                {/* الصف الرئيسي للعنصر */}
                <TableRow>
                  <TableCell className="text-[#000] dark:text-[#fff]">
                    {item?.count} ×{" "}
                    {item?.info?.size_en || item?.name?.item_name}
                  </TableCell>

                  <TableCell className="text-[#000] dark:text-[#fff]">
                    {item?.special || "—"}
                  </TableCell>
                  <TableCell className="text-[#000] dark:text-[#fff]">
                    {parseFloat(item?.sub_total || 0).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-[#000] dark:text-[#fff]">
                    {parseFloat(item?.total_price || 0).toFixed(2)}
                  </TableCell>
                </TableRow>

                {/* الصفوف الفرعية للإضافات */}
                {item.size_condiments?.map((condiment, i) => {
                  const count = condiment.count || 0;
                  const price = parseFloat(condiment.price || 0);
                  const total = (count * price).toFixed(2);

                  return (
                    <TableRow
                      key={`condiment-${index}-${i}`}
                      className="bg-gray-100 dark:bg-gray-800"
                    >
                      <TableCell className="pl-6 text-sm text-[#444] dark:text-[#ccc]">
                        {count} ×{" "}
                        {condiment.condiment_info?.name_en ||
                          condiment.condiment_info?.name_en}
                      </TableCell>

                      <TableCell />
                      <TableCell className="text-sm text-[#444] dark:text-[#ccc]">
                        {price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-sm text-[#444] dark:text-[#ccc]">
                        {total}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* الصف الأول */}
      <div className="grid grid-cols-3 gap-6 my-4 mx-2 text-sm p-2">
        <div className="flex gap-1">
          <span className="font-semibold">Payment type :</span>
          <span> {OrderDetails?.payment_method === 1 ? "Cash" : "Visa"}</span>
        </div>
        <div className="flex gap-1">
          <span className="font-semibold">Delivery fees :</span>
          <span>
            {OrderDetails?.delivery_fees?.match(/\.\d+$/)
              ? OrderDetails.delivery_fees
              : OrderDetails?.delivery_fees?.replace(/\.$/, "")}
          </span>
        </div>
        <div className="flex gap-1">
          <span className="font-semibold">Tax fees:</span>
          <span>{OrderDetails?.tax_fees}</span> 
        </div>
      </div>

      {/* الصف الثاني */}
      <div className="grid grid-cols-3 gap-6 my-2 mx-2 text-sm p-2">
        <div className="flex gap-1">
          <span className="font-semibold">Notes :</span>
          <span>{OrderDetails?.notes || "-"}</span>
        </div>
        <div className="flex gap-1">
          <span className="font-semibold">
            Sub Total :
            {/* (Before Discount and Taxes) */}
            
          </span>
          <span>{OrderDetails?.sub_total?.toFixed(2)}</span>
        </div>
      
        <div className="flex gap-1">
          <span className="font-semibold">Total Amount :</span>
          <span>
            {OrderDetails?.total
              ? parseFloat(
                  OrderDetails.total.replace(/\s/g, "").replace(",", ".")
                ).toFixed(2)
              : "0.00"}
          </span>
        </div>
      </div>
    </>
  );
};

export default BasicTable;
