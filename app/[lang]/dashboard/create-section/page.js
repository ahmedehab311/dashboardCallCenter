"use client";
import { useEffect, useRef, useState } from "react";
import { useSidebar } from "@/store/index";
import { useSubdomin } from "@/provider/SubdomainContext";
import Card from "@/components/ui/card-snippet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import makeAnimated from "react-select/animated";
import { selectStyles } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { sectionSchema } from "./sectionSchema";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { getDictionary } from "@/app/dictionaries";
import { Upload } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { fetchRestaurantsList } from "../[orderType]/apICallCenter/ApisCallCenter";
import { useQuery } from "@tanstack/react-query";
function CreateSection() {
  const animatedComponents = makeAnimated();
  const { apiBaseUrl } = useSubdomin();
  const { theme } = useTheme();
  const fileInputRef = useRef(null);
  const [color, setColor] = useState("");
  const [trans, setTrans] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [restaurantsSelect, setRestaurantsSelect] = useState(null);
  const token = localStorage.getItem("token") || Cookies.get("token");
  const {
    data: dataRestaurants,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["RestaurantsList"],
    queryFn: () => fetchRestaurantsList(token, apiBaseUrl),
    enabled: !!token,
  });

  const restaurantOptions =
    Array.isArray(dataRestaurants) && dataRestaurants.length > 0
      ? dataRestaurants.map((restaurant) => ({
          value: restaurant.id,
          label: restaurant.res_name_en,
        }))
      : [];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    ...rest
  } = useForm({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      restaurant: restaurantOptions?.length === 1 ? restaurantOptions[0] : null,
      status: 1,
      default: 1,
    },
  });
  useEffect(() => {
    console.log("Errors:", errors);
  }, [errors]);
  useEffect(() => {
    if (restaurantOptions?.length === 1) {
      setValue("restaurant", restaurantOptions[0]);
    }
  }, [restaurantOptions, setValue]);

  useEffect(() => {
    if (theme === "dark") {
      setColor("#fff");
    } else {
      setColor("#000");
    }
  }, [theme]);

  const handleRemoveImage = () => {
    setImagePreview(null);
    setValue("image", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const onSubmit = (data) => {
    console.log("Form submitted!");
    console.log(data);
  };
  return (
   <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center gap-2 w-full">
            <div className="col-span-2 flex flex-col lg:flex-row lg:items-start gap-2 mb-2">
              <Label className="lg:min-w-[160px]">English Name:</Label>
              <div className="flex flex-col w-full">
                <Input {...register("enName")} className="w-[%]" maxLength={20} />
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
                <Input
                  {...register("arName")}
                  className="w-full"
                  maxLength={20}
                />
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
            <Label className="lg:min-w-[160px]">Arabic Description:</Label>
            <Textarea {...register("arDesc")} className="w-[50%]" />
          </div>
  
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
                    styles={selectStyles(theme, color)}
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
          <div className="flex items-center gap-2">
            <div className="col-span-2 flex flex-col lg:items-center lg:flex-row lg:gap-0 gap-2 mb-2">
              <Label className="lg:min-w-[160px]">status:</Label>
  
              <div className="flex flex-col w-full">
                <Controller
                  name="status"
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
            <div className="col-span-2 flex flex-col lg:items-center lg:flex-row lg:gap-0 gap-2 mb-2">
              <Label className="lg:min-w-[160px]">default:</Label>
  
              <div className="flex flex-col w-full">
                <Controller
                  name="default"
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
          <div className="col-span-2 flex flex-col lg:items-center lg:flex-row lg:gap-0 gap-2 mb-4">
            <Label className="lg:min-w-[160px]">Image:</Label>
            <div className="flex flex-col w-full">
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <>
                    <Label>
                      <Button asChild>
                        <div>
                          <Upload className="mr-2 h-4 w-4" /> Choose File
                        </div>
                      </Button>
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className=" hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            field.onChange(file);
                            setImagePreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </Label>
                  </>
                )}
              />
              {errors.image && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.image.message}
                </span>
              )}
  
              {imagePreview && (
                <div className="mt-2 relative w-fit">
                  <Image
                    width={150}
                    height={150}
                    src={imagePreview}
                    alt="Preview"
                    className="w-40 h-40 object-cover rounded-md border"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-1 right-1 font-bold text-red-700 cursor-pointer text-[22px] px-2 py-1 rounded shadow "
                  >
                    X
                  </button>
                </div>
              )}
            </div>
          </div>
  
          <Button type="submit">Add Menu</Button>
        </form>
      </Card>)
}

export default CreateSection;
