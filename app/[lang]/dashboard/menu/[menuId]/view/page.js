"use client";
import { useEffect, useRef, useState } from "react";
import { useSubdomin } from "@/provider/SubdomainContext";
import Card from "@/components/ui/card-snippet";
import { selectStyles } from "@/lib/utils";
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
import { BASE_URL } from "@/api/BaseUrl";
import { useSections } from "../../../sections/apisSection";

function ViewAndEditMenu() {
  const { menuId } = useParams();
  const { apiBaseUrl, subdomain } = useSubdomin();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const {
    data: Menus,
    isLoading,
    error,
    refetch,
  } = useSections(token, apiBaseUrl, "menu", menuId);


  const { theme, color } = useThemeColor();
  const { restaurantOptions } = useRestaurantFetch();
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(true);
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
      ...Menus,
    },
  });
  useEffect(() => {
    if (restaurantOptions?.length === 1) {
      setValue("restaurant", restaurantOptions[0]);
    }
  }, [restaurantOptions, setValue]);
  useEffect(() => {
    if (Menus) {
      setValue("enName", Menus.name_en);
      setValue("arName", Menus.name_ar);
      setValue("enDesc", Menus.description_en);
      setValue("arDesc", Menus.description_ar);
      setValue("restaurant", Menus.restaurant_id);
      setValue("status", Menus.status ? 1 : 2);
      setValue("default", Menus.default ? 1 : 2);
      if (Menus.image) {
        setImagePreview(`${BASE_URL()}/${subdomain}/${Menus.image}`);
      }
    }
  }, [setValue, Menus, subdomain]);

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
