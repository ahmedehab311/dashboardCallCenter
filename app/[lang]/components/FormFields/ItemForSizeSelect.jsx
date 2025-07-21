import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import Select from "react-select";
function ItemForSizeSelect({
  control,
  AllItemOptions,
  selectStyles,
  isEditing,
  errors,
  register,
}) {
  return (
    <div className="col-span-2 flex flex-col lg:items-center lg:flex-row lg:gap-0 gap-2 mb-2">
      <Label className="lg:min-w-[160px] capitalize">Item:</Label>
      <div className="flex flex-col w-full">
        <Controller
          name="item"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={AllItemOptions}
              placeholder="Select Restaurant"
              className="w-[50%]"
              isDisabled={AllItemOptions?.length === 1}
              styles={selectStyles}
              disabled={isEditing}
            />
          )}
        />

        {errors.item && (
          <span className="text-red-500 text-sm mt-1">
            {errors.item.message}
          </span>
        )}
      </div>
    </div>
  );
}

export default ItemForSizeSelect;
