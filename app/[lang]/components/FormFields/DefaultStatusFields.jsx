import React from "react";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
function DefaultStatusFields({ control,name }) {
  return (
    <div className="flex items-center gap-2">
      <div className="col-span-2 flex flex-col lg:items-center lg:flex-row lg:gap-0 gap-2 mb-2">
        <Label className="lg:min-w-[160px]">default:</Label>

        <div className="flex flex-col w-full">
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value === 1}
                onCheckedChange={(checked) => {
                  field.onChange(checked ? 1 : 2);
                }}
                className="mr-5"
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}

export default DefaultStatusFields;
