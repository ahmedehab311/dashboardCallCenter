import Select from "react-select";
import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
export default function MenuField({ errors, menuOptions, control, selectStyles }) {
  return (
    <div className="col-span-2 flex flex-col lg:items-center lg:flex-row lg:gap-0 gap-2 mb-2">
      <Label className="lg:min-w-[160px]">Menu:</Label>
      <div className="flex flex-col w-full">
        <Controller
          name="Menu"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={menuOptions}
              placeholder="Select Menu"
              className="w-[50%]"
              isDisabled={menuOptions?.length === 1}
              styles={selectStyles}
            />
          )}
        />

        {errors.menu && (
          <span className="text-red-500 text-sm mt-1">
            {errors.menu.message}
          </span>
        )}
      </div>
    </div>
  );
}
// export default MenuField;
