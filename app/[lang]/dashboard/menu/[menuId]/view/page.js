"use client";
import { useEffect, useRef, useState } from "react";
import { useSubdomin } from "@/provider/SubdomainContext";
import Card from "@/components/ui/card-snippet";
import makeAnimated from "react-select/animated";
import { selectStyles } from "@/lib/utils";
import { useTheme } from "next-themes";
import { menuSchema } from "../../../create-menu/menuSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useThemeColor } from "@/hooks/useThemeColor";
import useRestaurantFetch from "../../../[orderType]/apICallCenter/hooksFetch/useRestaurantFetch";
import {
  NameFields,
  DescriptionFields,
  RestaurantField,
  StatusFields,
  DefaultStatusFields,
  ImageUploadField,
  SubmitButton,
  EditAndViewButton,
} from "@/app/[lang]/components/FormFields";
import { useParams } from "next/navigation";
import img from "./1664289141.jpeg";
function ViewAndEditMenu() {
  const { menuId: id } = useParams();
  const { theme, color } = useThemeColor();
  const { restaurantOptions } = useRestaurantFetch();
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(true);
  const [trans, setTrans] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const staticMenuData = {
    enName: "Breakfast Menu",
    arName: "قائمة الإفطار",
    descriptionEn: "A variety of breakfast options.",
    descriptionAr: "مجموعة متنوعة من وجبات الإفطار.",
    restaurant: { value: 1, label: "Restaurant A" },
    status: 1,
    default: 1,
    image: img, // لو عايز تضيف صورة مبدئية لاحقًا
  };

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
      ...staticMenuData,
    },
  });
  useEffect(() => {
    if (restaurantOptions?.length === 1) {
      setValue("restaurant", restaurantOptions[0]);
    }
  }, [restaurantOptions, setValue]);
  useEffect(() => {
    if (staticMenuData) {
      setValue("enName", staticMenuData.enName);
      setValue("arName", staticMenuData.arName);
      setValue("enDesc", staticMenuData.descriptionEn);
      setValue("arDesc", staticMenuData.descriptionAr);
      setValue("restaurant", staticMenuData.restaurant);
      setValue("status", staticMenuData.status);
      setValue("default", staticMenuData.default);
    }
  }, [setValue]);
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
  const onEditChange = () => {
    setIsEditing((prev) => !prev);
  };
  return (
    <Card>
      <EditAndViewButton
        label="edit"
        isEditing={isEditing}
        onEditChange={onEditChange}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <NameFields
          register={register}
          errors={errors}
          labelEn="Name En"
          labelAr="Name AR"
          maxLength={20}
          isEditing={isEditing}
        />
        <DescriptionFields
          register={register}
          errors={errors}
          labelEn="description En"
          labelAr="description AR"
          // maxLength={20}
          isEditing={isEditing}
        />
        <RestaurantField
          restaurantOptions={restaurantOptions}
          selectStyles={selectStyles(theme, color)}
          control={control}
          register={register}
          errors={errors}
          isEditing={isEditing}
        />

        <div className="flex items-center gap-2">
          <StatusFields
            control={control}
            register={register}
            name="status"
            isEditing={isEditing}
          />
          <DefaultStatusFields
            control={control}
            register={register}
            name="default"
            isEditing={isEditing}
          />
        </div>
        <ImageUploadField
          errors={errors}
          control={control}
          fileInputRef={fileInputRef}
          handleRemoveImage={handleRemoveImage}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          isEditing={isEditing}
        />

        <SubmitButton label="Edit menu" isEditing={isEditing} />
      </form>
    </Card>
  );
}

export default ViewAndEditMenu;
