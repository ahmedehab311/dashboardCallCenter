import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export default function MenuItemId({
  register,
  errors,
  labelEn,
  labelAr,
  isEditing,
}) {
  return (
    <div className="col-span-2 flex flex-col lg:flex-row lg:items-start gap-2 mb-2">
      <Label className="lg:min-w-[160px] capitalize">menu item id:</Label>
      <div className="flex flex-col w-full">
        <Input
          {...register("menuItemId")}
          className="w-[%]"
          disabled
        />
        {errors.menuItemId && (
          <span className="text-red-500 text-sm mt-1">
            {errors.menuItemId.message}
          </span>
        )}
      </div>
    </div>
  );
}
