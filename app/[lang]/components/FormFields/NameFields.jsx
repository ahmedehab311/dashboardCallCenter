// components/FormFields/NameFields.jsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NameFields({
  register,
  errors,
  labelEn,
  labelAr,
  maxLength,
  isEditing,
}) {
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="col-span-2 flex flex-col lg:flex-row lg:items-start gap-2 mb-2">
        <Label className="lg:min-w-[160px]">{labelEn}:</Label>
        <div className="flex flex-col w-full">
          <Input
            {...register("enName")}
            className="w-[%]"
            maxLength={maxLength}
            disabled={isEditing}
          />
          {errors.enName && (
            <span className="text-red-500 text-sm mt-1">
              {errors.enName.message}
            </span>
          )}
        </div>
      </div>
      <div className="col-span-2 flex flex-col lg:flex-row lg:items-start gap-2 mb-2">
        <Label className="lg:min-w-[160px] pt-2">{labelAr}:</Label>
        <div className="flex flex-col w-full">
          <Input
            {...register("arName")}
            className="w-full"
            maxLength={maxLength}
                    disabled={isEditing}
          />
          {errors.arName && (
            <span className="text-red-500 text-sm mt-1">
              {errors.arName.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
