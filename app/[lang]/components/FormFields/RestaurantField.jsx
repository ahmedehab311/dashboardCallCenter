import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";

function RestaurantField({
  register,
  errors,
  label,
  restaurantOptions,
  control,
  selectStyles,isEditing
}) {
  return (
    <div className="col-span-2 flex flex-col lg:items-center lg:flex-row lg:gap-0 gap-2 mb-2">
      <Label className="lg:min-w-[160px]">Restaurant:</Label>
      <div className="flex flex-col w-full">
        <Controller
          name="restaurant"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={restaurantOptions}
              placeholder="Select Restaurant"
              className="w-[50%]"
              isDisabled={restaurantOptions?.length === 1}
              styles={selectStyles}
               disabled={isEditing}
            />
          )}
        />

        {errors.restaurant && (
          <span className="text-red-500 text-sm mt-1">
            {errors.restaurant.message}
          </span>
        )}
      </div>
    </div>
  );
}

export default RestaurantField;
