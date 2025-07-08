"use client";
import { useEffect, useRef, useState } from "react";
import { useSubdomin } from "@/provider/SubdomainContext";
import Card from "@/components/ui/card-snippet";
import makeAnimated from "react-select/animated";
import { selectStyles } from "@/lib/utils";
import { useTheme } from "next-themes";
import { menuSchema } from "./menuSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  NameFields,
  DescriptionFields,
  RestaurantField,
  StatusFields,
  DefaultStatusFields,
  ImageUploadField,
  SubmitButton,
} from "../../components/FormFields";
import { useThemeColor } from "@/hooks/useThemeColor";
import useRestaurantFetch from "../[orderType]/apICallCenter/hooksFetch/userestaurantFetch";
function CreateMenu() {
  const { theme, color } = useThemeColor();
  const { restaurantOptions } = useRestaurantFetch();
  const fileInputRef = useRef(null);
  const [trans, setTrans] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);


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
      restaurant: restaurantOptions?.length === 1 ? restaurantOptions[0] : null,
      status: 1,
      default: 1,
    },
  });
  useEffect(() => {
    if (restaurantOptions?.length === 1) {
      setValue("restaurant", restaurantOptions[0]);
    }
  }, [restaurantOptions, setValue]);

  const handleRemoveImage = () => {
    setImagePreview(null);
    setValue("image", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const onSubmit = (data) => {
    console.log(data);
  };
  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <NameFields
          register={register}
          errors={errors}
          labelEn="Menu Name En"
          labelAr="Manu Name AR"
          maxLength={20}
        />
        <DescriptionFields
          register={register}
          errors={errors}
          labelEn="Menu description En"
          labelAr="Manu description AR"
          // maxLength={20}
        />
        <RestaurantField
          restaurantOptions={restaurantOptions}
          selectStyles={selectStyles(theme, color)}
          control={control}
          register={register}
          errors={errors}
        />

        <div className="flex items-center gap-2">
          <StatusFields control={control} register={register} name="status" />
          <DefaultStatusFields
            control={control}
            register={register}
            name="default"
          />
        </div>
        <ImageUploadField
          errors={errors}
          control={control}
          fileInputRef={fileInputRef}
          handleRemoveImage={handleRemoveImage}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
        />

        <SubmitButton label="Add menu" />
      </form>
    </Card>
  );
}

export default CreateMenu;
