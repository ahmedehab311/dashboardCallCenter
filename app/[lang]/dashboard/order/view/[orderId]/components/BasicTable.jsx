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
  // console.log("OrderDetailsItem", OrderDetailsItem);
  // console.log("OrderDetails", OrderDetails);

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
                {parseFloat(item?.info?.price?.price || 0).toFixed(2)}
              </TableCell>
              <TableCell className="text-[#000] dark:text-[#fff]">
                {parseFloat(item?.total_price || 0).toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex gap-6 my-4 mx-2 justify-between">
        <p>Delivery fees: {OrderDetails?.delivery_fees}</p>
        <p>Tax fees: {OrderDetails?.tax_fees}</p>
        <p>
          Payment type: {OrderDetails?.payment_method === 1 ? "Cash" : "Visa"}
        </p>
      </div>

      <div className="flex gap-6 my-2 mx-2 justify-between">
        <p>
          Sub Total (Before Discount and Taxes):{" "}
          {OrderDetailsItem.reduce(
            (acc, item) => acc + parseFloat(item?.sub_total || 0),
            0
          ).toFixed(2)}
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
