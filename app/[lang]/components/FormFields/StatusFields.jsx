import React from "react";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
function StatusFields({ control, name, isEditing }) {
  return (
    <div className="col-span-2 flex flex-col lg:items-center lg:flex-row lg:gap-0 gap-2 mb-2">
      <Label className="lg:min-w-[160px] capitalize">{name}:</Label>

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
              disabled={isEditing}
            />
          )}
        />
      </div>
    </div>
  );
}

export default StatusFields;
