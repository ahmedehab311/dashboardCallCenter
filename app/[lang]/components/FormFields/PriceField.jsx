import { Input } from "@/components/ui/input";

export default function PriceField({ PriceLists, prices }) {
  return (
    <div className="flex flex-col gap-2 max-w-md">
      {PriceLists?.map((list) => {
        const priceObj = prices.find((p) => p.price_list === list.id);
        const price = priceObj?.price ?? "0.00";

        return (
          <div key={list.id} className="flex flex-row gap-2 w-full">
          
            <Input
              type="text"
              value={list.name_en}
              readOnly
              className="border p-2 text-sm rounded w-full"
            />
            <Input
              type="number"
              value={parseFloat(price).toFixed(2)}
              className="border p-2 text-sm rounded w-32 text-right"
            />
          </div>
        );
      })}
    </div>
  );
}
