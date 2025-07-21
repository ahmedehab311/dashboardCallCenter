"use client";
import { useEffect, useRef, useState } from "react";
import { useSubdomin } from "@/provider/SubdomainContext";
import Card from "@/components/ui/card-snippet";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import makeAnimated from "react-select/animated";
import { selectStyles } from "@/lib/utils";
import { useTheme } from "next-themes";
import { sectionSchema } from "./sectionSchema";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchRestaurantsList } from "../[orderType]/apICallCenter/ApisCallCenter";
import { useQuery } from "@tanstack/react-query";
import {
  NameFields,
  DescriptionFields,
  StatusFields,
  ImageUploadField,
  SubmitButton,
  MenuField,
  ParentSectionSelect,
} from "../../components/FormFields";
import { useSections } from "../sections/apisSection";
function CreateSection() {
  const animatedComponents = makeAnimated();
  const { apiBaseUrl } = useSubdomin();
  const { theme } = useTheme();
  const fileInputRef = useRef(null);
  const [color, setColor] = useState("");
  const [trans, setTrans] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [restaurantsSelect, setRestaurantsSelect] = useState(null);
  const token = localStorage.getItem("token") 
  const {
    data: dataRestaurants,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["RestaurantsList"],
    queryFn: () => fetchRestaurantsList(token, apiBaseUrl),
    enabled: !!token,
  });
  //  const { apiBaseUrl, subdomain } = useSubdomin();

  const {
    data: dataMenus,
    isLoadingMenus,
    errorMenus,
    refetch,
  } = useSections(token, apiBaseUrl);
  const restaurantOptions =
    Array.isArray(dataRestaurants) && dataRestaurants.length > 0
      ? dataRestaurants.map((restaurant) => ({
          value: restaurant.id,
          label: restaurant.res_name_en,
        }))
      : [];
  const menuOptions =
    Array.isArray(dataMenus) && dataMenus.length > 0
      ? dataMenus.map((menu) => ({
          value: menu.id,
          label: menu.name_en,
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
      menu: dataMenus?.length === 1 ? dataMenus[0] : null,
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
          <NameFields
            register={register}
            errors={errors}
            labelEn="Name En"
            labelAr="Name AR"
            maxLength={20}
          />
        </div>
        <DescriptionFields
          register={register}
          errors={errors}
          labelEn="description En"
          labelAr="description AR"
          // maxLength={20}
        />

        <MenuField
          menuOptions={menuOptions}
          selectStyles={selectStyles(theme, color)}
          control={control}
          errors={errors}
        />

        <ParentSectionSelect
          menuOptions={menuOptions}
          selectStyles={selectStyles(theme, color)}
          control={control}
          errors={errors}
        />
        <div className="flex items-center gap-2">
          <StatusFields control={control} register={register} name="status" />
        </div>
        <ImageUploadField
          errors={errors}
          control={control}
          fileInputRef={fileInputRef}
          handleRemoveImage={handleRemoveImage}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
        />

        <SubmitButton label="Add section" />
      </form>
    </Card>
  );
}

export default CreateSection;
