"use client";
import { useEffect, useRef, useState } from "react";
import { useSubdomin } from "@/provider/SubdomainContext";
import { useToken } from "@/provider/TokenContext";
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
import PriceField from "@/app/[lang]/components/FormFields/PriceField";

export default function SiseForItem({ params: { lang } }) {
  const { id } = useParams();
  const token = localStorage.getItem("token") || Cookies.get("token");
  const { menuId } = useParams();
  const { apiBaseUrl, subdomain } = useSubdomin();
  const {
    data: PriceLists,
    isLoadingPriceLists,
    errorPriceLists,
    refetchPriceLists,
  } = useSections(token, apiBaseUrl, "price-lists");
  console.log("PriceLists", PriceLists);
  const {
    data: Size,
    isLoading,
    error,
    refetch,
  } = useSections(token, apiBaseUrl, "size", id);
  console.log("Size", Size);

  const {
    data: Restaurant,
    isLoadingRestaurant,
    errorRestaurant,
    refetchRestaurant,
  } = useSections(token, apiBaseUrl, "restaurants");

  const { theme, color } = useThemeColor();
  // const { restaurantOptions } = useRestaurantFetch();
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(true);
  const [trans, setTrans] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const restaurantOptions =
    Array.isArray(Restaurant) && Restaurant.length > 0
      ? Restaurant.map((res) => ({
          value: res.id,
          label: res.name_en,
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
    resolver: zodResolver(menuSchema),
    defaultValues: {
      ...Size,
    },
  });
  useEffect(() => {
    if (restaurantOptions?.length === 1) {
      setValue("restaurant", restaurantOptions[0]);
    }
  }, [restaurantOptions, setValue]);
  useEffect(() => {
    if (Size) {
      setValue("enName", Size.name_en);
      setValue("arName", Size.name_ar);
      setValue("enDesc", Size.description_en);
      setValue("arDesc", Size.description_ar);
      setValue("restaurant", Size.restaurant_id);
      setValue("status", Size.status ? 1 : 2);
      setValue("default", Size.default ? 1 : 2);
      if (Size.image) {
        setImagePreview(`${BASE_URL()}/${subdomain}/${Size.image}`);
      }
    }
  }, [setValue, Size, subdomain]);

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
        <div className="mb-3">
          <PriceField PriceLists={PriceLists} prices={Size?.prices} />
        </div>
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
