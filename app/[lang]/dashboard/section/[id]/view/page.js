"use client";
import { useEffect, useRef, useState } from "react";
import { useSubdomin } from "@/provider/SubdomainContext";
import Card from "@/components/ui/card-snippet";
import { selectStyles } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useThemeColor } from "@/hooks/useThemeColor";
import useRestaurantFetch from "../../../[orderType]/apICallCenter/hooksFetch/useRestaurantFetch";
import {
  NameFields,
  DescriptionFields,
  StatusFields,
  ImageUploadField,
  SubmitButton,
  EditAndViewButton,
  MenuField,
  ParentSectionSelect,
} from "@/app/[lang]/components/FormFields";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "@/api/BaseUrl";
import { useSections } from "../../../sections/apisSection";
import { sectionSchema } from "../../../create-section/sectionSchema";
import { useToken } from "@/provider/TokenContext";
import PriceField from "@/app/[lang]/components/FormFields/priceField";
function ViewAndEditSection() {
  const { id: id } = useParams();
  const { apiBaseUrl, subdomain } = useSubdomin();
   const token = localStorage.getItem("token") || Cookies.get("token");
 

  const {
    data: AllSections,
    isLoadingAllSections,
    errorAllSections,
    refetchAllSections,
  } = useSections(token, apiBaseUrl, "sections");
  const {
    data: Section,
    isLoading,
    error,
    refetch,
  } = useSections(token, apiBaseUrl, "section", id);

  const {
    data: Menus,
    isLoadingMenus,
    errorMenus,
    refetchMenus,
  } = useSections(token && apiBaseUrl ? token : null, apiBaseUrl, "menus");
  const menuOptions =
    Array.isArray(Menus) && Menus.length > 0
      ? Menus.map((menu) => ({
          value: menu.id,
          label: menu.name_en,
        }))
      : [];
  const sectionsOptions =
    Array.isArray(AllSections) && AllSections.length > 0
      ? AllSections.map((section) => ({
          value: section.id,
          label: section.name_en,
        }))
      : [];
  // const Sections = Sections?.find((section) => section.id === Number(id));

  const selectedMenu = menuOptions?.find(
    (menu) => menu.value === Section?.menu_id
  );

  const { theme, color } = useThemeColor();
  const [formInitialized, setFormInitialized] = useState(false);
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
    reset,
    ...rest
  } = useForm({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      ...Section,
      Menu: selectedMenu || null,
    },
  });
  useEffect(() => {
    if (Section && menuOptions.length > 0 && !formInitialized) {
      const selectedMenu = menuOptions.find(
        (menu) => menu.value === Section.menu_id
      );
      reset({
        ...Section,
        Menu: selectedMenu || null,
      });
      setFormInitialized(true);
    }
  }, [Section, menuOptions, reset, formInitialized]);
  useEffect(() => {
    if (restaurantOptions?.length === 1) {
      setValue("restaurant", restaurantOptions[0]);
    }
  }, [restaurantOptions, setValue]);
  useEffect(() => {
    if (Section) {
      setValue("enName", Section.name_en);
      setValue("arName", Section.name_ar);
      setValue("enDesc", Section.description_en);
      setValue("arDesc", Section.description_ar);
      setValue("restaurant", Section.restaurant_id);
      setValue("status", Section.status ? 1 : 2);
      if (Section.image) {
        setImagePreview(`${BASE_URL()}/${subdomain}/${Section.image}`);
      }
    }
  }, [setValue, Section, subdomain]);

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
          selectedMenu={selectedMenu}
        />

        <ParentSectionSelect
          sectionsOptions={sectionsOptions}
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

export default ViewAndEditSection;
