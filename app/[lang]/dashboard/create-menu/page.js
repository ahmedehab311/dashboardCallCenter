"use client";
import { useEffect, useState } from "react";
import Card from "@/components/ui/card-snippet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import makeAnimated from "react-select/animated";
import { selectStyles } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { menuSchema } from "./menuSchema";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function CreateMenu() {
  const restOptions = [
    { value: "123", label: "Happyjoes" }, // مثال
  ];
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    ...rest
  } = useForm({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      restaurant: restOptions.length === 1 ? restOptions[0] : null,
    },
  });
  const animatedComponents = makeAnimated();
  const { theme } = useTheme();
  const [color, setColor] = useState("");

  useEffect(() => {
    if (restOptions.length === 1) {
      setValue("restaurant", restOptions[0]);
    }
  }, [restOptions]);

  useEffect(() => {
    if (theme === "dark") {
      setColor("#fff");
    } else {
      setColor("#000");
    }
  }, [theme]);
  return (
    <Card>
      <form onSubmit={handleSubmit((data) => console.log(data))}>
        <div className="flex items-center gap-2 w-full">
          <div className="col-span-2 flex flex-col lg:flex-row lg:items-start gap-2 mb-2">
            <Label className="lg:min-w-[160px]">English Name:</Label>
            <div className="flex flex-col w-full">
              <Input {...register("enName")} className="w-[%]" />
              {errors.enName && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.enName.message}
                </span>
              )}
            </div>
          </div>
          <div className="col-span-2 flex flex-col lg:flex-row lg:items-start gap-2 mb-2">
            <Label className="lg:min-w-[160px] pt-2">Arabic Name:</Label>
            <div className="flex flex-col w-full">
              <Input {...register("arName")} className="w-full" />
              {errors.arName && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.arName.message}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="col-span-2 flex flex-col lg:items-center lg:flex-row lg:gap-0 gap-2 mb-2">
          <Label className="lg:min-w-[160px]">English Description:</Label>
          <Textarea {...register("enDesc")} className="w-[50%]" />
        </div>
        <div className="col-span-2 flex flex-col lg:items-center lg:flex-row lg:gap-0 gap-2 mb-2">
          <Label className="lg:min-w-[160px]">Arabic Description:</Label>
          <Textarea {...register("arDesc")} className="w-[50%]" />
        </div>

        <div className="col-span-2 flex flex-col lg:items-center lg:flex-row lg:gap-0 gap-2 mb-2">
          <Label className="lg:min-w-[160px]">Restaurant:</Label>
          <Controller
            control={control}
            name="restaurant"
            render={({ field }) => (
              <Select
                className="w-[70%]"
                styles={selectStyles(theme, color)}
                components={animatedComponents}
                options={restOptions}
                // value={selectedRestaurant}
                // onChange={handleRestaurantChange}
                placeholder="Select Restaurant"
                // className="react-select w-full"
                classNamePrefix="select"
              />
            )}
          />
          {errors.restaurant && (
            <span className="text-red-500 text-sm">
              {errors.restaurant.message}
            </span>
          )}
        </div>
        <Button type="submit">Add Menu</Button>
      </form>
    </Card>
  );
}

export default CreateMenu;
