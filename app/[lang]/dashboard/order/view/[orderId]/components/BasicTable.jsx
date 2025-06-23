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
  console.log("OrderDetailsItem", OrderDetailsItem);
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
                 {item?.count} × {item?.info?.size_en || item?.name?.item_name}
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
                        {count}  × {condiment.condiment_info?.name_en ||
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

      <div className="flex gap-6 my-4 mx-2 justify-between">
        <p>
          Payment type: {OrderDetails?.payment_method === 1 ? "Cash" : "Visa"}
        </p>
        <p>
          Delivery fees: {OrderDetails?.delivery_fees?.match(/\.\d+$/)
            ? OrderDetails.delivery_fees
            : OrderDetails?.delivery_fees?.replace(/\.$/, "")}
        </p>

        <p>Tax fees: {OrderDetails?.tax_fees}</p>
      </div>

      <div className="flex gap-6 my-2 mx-2 justify-between">
        {/* <p>
          Sub Total (Before Discount and Taxes):{" "}
          {OrderDetailsItem.reduce(
            (acc, item) => acc + parseFloat(item?.sub_total || 0),
            0
          ).toFixed(2)}
        </p> */}
        <p>
          Sub Total (Before Discount and Taxes):{" "}
          {OrderDetails?.sub_total?.toFixed(2)}
        </p>

        <p>Notes: {OrderDetails?.notes || "-"}</p>
      </div>
      <div className="flex gap-6 my-2 mx-2 justify-between">
        <p>
          Total Amount:{" "}
          {OrderDetails?.total
            ? parseFloat(
                OrderDetails.total.replace(/\s/g, "").replace(",", ".")
              ).toFixed(2)
            : "0.00"}
        </p>
      </div>
    </>
  );
};

export default BasicTable;
