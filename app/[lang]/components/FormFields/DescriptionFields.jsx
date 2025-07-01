import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
function DescriptionFields({ register, errors, labelEn, labelAr, maxLength }) {
  return (
    <>
      <div className="col-span-2 flex flex-col lg:items-center lg:flex-row lg:gap-0 gap-2 mb-2">
        <Label className="lg:min-w-[160px]">{labelEn}:</Label>
        <div className="flex flex-col w-full">
          <Textarea {...register("enDesc")} className="w-[50%]" />
          {errors.enDesc && (
            <span className="text-red-500 text-sm mt-1">
              {errors.enDesc.message}
            </span>
          )}
        </div>
      </div>

      <div className="col-span-2 flex flex-col lg:items-center lg:flex-row lg:gap-0 gap-2 mb-2">
        <Label className="lg:min-w-[160px]">{labelAr}:</Label>
        <Textarea {...register("arDesc")} className="w-[50%]" />
      </div>
    </>
  );
}

export default DescriptionFields;
