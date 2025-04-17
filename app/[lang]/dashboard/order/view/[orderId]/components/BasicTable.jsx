"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
const BasicTable = ({ OrderDetails, OrderDetailsItem }) => {
  if (!OrderDetailsItem) return null;
  console.log("OrderDetailsItem", OrderDetailsItem);

  return (
    <>
      <Table>
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
          <TableRow>
            <TableCell className="text-[#000] dark:text-[#fff]">
              {OrderDetailsItem?.info?.size_en}
            </TableCell>
            <TableCell className="text-[#000] dark:text-[#fff]">
              {OrderDetailsItem?.count}
            </TableCell>
            <TableCell className="text-[#000] dark:text-[#fff]">
              {OrderDetailsItem?.special || "—"}
            </TableCell>
            <TableCell className="text-[#000] dark:text-[#fff]">
              {parseFloat(OrderDetailsItem?.info?.price?.price || 0).toFixed(2)}
            </TableCell>
            <TableCell className="text-[#000] dark:text-[#fff]">
              {parseFloat(OrderDetailsItem?.total_price || 0).toFixed(2)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div className="flex gap-6  my-4 mx-2 justify-between">
        <p>Delivery fees: {OrderDetails?.delivery_fees}</p>
        <p>Tax fees: {OrderDetails?.tax_fees}</p>
        <p>Tax fees: {OrderDetails?.payment_method === 1 ? "Cash" : "Visa"}</p>
      </div>
      <div className="flex gap-6 justi my-2  mx-2 justify-between">
        <p>
          Sub Total (Before Discount and Taxes):{" "}
          {parseFloat(OrderDetailsItem?.sub_total || 0).toFixed(2)}
        </p>
        <p>Notes: {OrderDetails?.notes || "-"}</p>
      </div>
    </>
  );
};

export default BasicTable;
