import Select from "react-select";
import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
export default function ParentSectionSelect({
  errors,
  sectionsOptions,
  control,
  selectStyles,
  onChangeSection,
}) {
  return (
    <div className="col-span-2 flex flex-col lg:items-center lg:flex-row lg:gap-0 gap-2 mb-2">
      <Label className="lg:min-w-[160px]">Parent section:</Label>
      <div className="flex flex-col w-full">
        <Controller
          name="section"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={sectionsOptions}
              placeholder="Select section"
              className="w-[50%] z-40"
              isDisabled={sectionsOptions?.length === 1}
              styles={selectStyles}
              onChange={(selected) =>
                onChangeSection?.(selected, field.onChange)
              }
            />
          )}
        />

        {errors.ParentSectionSelect && (
          <span className="text-red-500 text-sm mt-1">
            {errors.ParentSectionSelect.message}
          </span>
        )}
      </div>
    </div>
  );
}
