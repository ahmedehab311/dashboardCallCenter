import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
function DescriptionFields({
  register,
  errors,
  labelEn,
  labelAr,
  maxLength,
  isEditing,
}) {
  return (
    <>
      <div className="col-span-2 flex flex-col lg:items-center lg:flex-row lg:gap-0 gap-2 mb-2">
        <Label className="lg:min-w-[160px] capitalize">{labelEn}:</Label>
        <div className="flex flex-col w-full">
          <Textarea
            {...register("enDesc")}
            className="w-[50%]"
            disabled={isEditing}
          />
          {errors.enDesc && (
            <span className="text-red-500 text-sm mt-1">
              {errors.enDesc.message}
            </span>
          )}
        </div>
      </div>

      <div className="col-span-2 flex flex-col lg:items-center lg:flex-row lg:gap-0 gap-2 mb-2">
        <Label className="lg:min-w-[160px] capitalize">{labelAr}:</Label>
        <Textarea
          {...register("arDesc")}
          className="w-[50%]"
          disabled={isEditing}
        />
      </div>
    </>
  );
}

export default DescriptionFields;
