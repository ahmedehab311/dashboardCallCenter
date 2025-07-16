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
import { useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "@/api/BaseUrl";
import { useMenus } from "../../../menus/apisMenu";

function ViewAndEditMenu() {
  const { menuId: id } = useParams();
  const { apiBaseUrl, subdomain } = useSubdomin();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const {
    data: Menus,
    isLoading,
    error,
    refetch,
  } = useMenus(token, apiBaseUrl);
  const queryClient = useQueryClient();
  const currentMenu = Menus?.find((menu) => menu.id === Number(id));

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
      ...currentMenu,
    },
  });
  useEffect(() => {
    if (restaurantOptions?.length === 1) {
      setValue("restaurant", restaurantOptions[0]);
    }
  }, [restaurantOptions, setValue]);
  useEffect(() => {
    if (currentMenu) {
      setValue("enName", currentMenu.name_en);
      setValue("arName", currentMenu.name_ar);
      setValue("enDesc", currentMenu.description_en);
      setValue("arDesc", currentMenu.description_ar);
      setValue("restaurant", currentMenu.restaurant_id);
      setValue("status", currentMenu.status ? 1 : 2);
      setValue("default", currentMenu.default ? 1 : 2);
      if (currentMenu.image) {
        setImagePreview(`${BASE_URL()}/${subdomain}/${currentMenu.image}`);
      }
    }
  }, [setValue, currentMenu, subdomain]);

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
