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
  RestaurantField,
  StatusFields,
  DefaultStatusFields,
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
import { useMenus } from "../../../menus/apisMenu";
import { useToken } from "@/provider/TokenContext";
function ViewAndEditSection() {
  const { id: id } = useParams();
  const { apiBaseUrl, subdomain } = useSubdomin();
  const { token } = useToken();
  const {
    data: Sections,
    isLoading,
    error,
    refetch,
  } = useSections(token && apiBaseUrl ? token : null, apiBaseUrl, "sections");
  console.log("Sections", Sections);

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
    Array.isArray(Sections) && Sections.length > 0
      ? Sections.map((section) => ({
          value: section.id,
          label: section.name_en,
        }))
      : [];
      const currentSection = Sections?.find((section) => section.id === Number(id));
      
        const selectedMenu = menuOptions?.find(
          (menu) => menu.value === currentSection?.menu_id
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
      ...currentSection,
      Menu: selectedMenu || null,
    },
  });
  useEffect(() => {
    if (currentSection && menuOptions.length > 0 && !formInitialized) {
      const selectedMenu = menuOptions.find(
        (menu) => menu.value === currentSection.menu_id
      );
      reset({
        ...currentSection,
        Menu: selectedMenu || null,
      });
      setFormInitialized(true);
    }
  }, [currentSection, menuOptions, reset, formInitialized]);
  useEffect(() => {
    if (restaurantOptions?.length === 1) {
      setValue("restaurant", restaurantOptions[0]);
    }
  }, [restaurantOptions, setValue]);
  useEffect(() => {
    if (currentSection) {
      setValue("enName", currentSection.name_en);
      setValue("arName", currentSection.name_ar);
      setValue("enDesc", currentSection.description_en);
      setValue("arDesc", currentSection.description_ar);
      setValue("restaurant", currentSection.restaurant_id);
      setValue("status", currentSection.status ? 1 : 2);
      setValue("default", currentSection.default ? 1 : 2);
      if (currentSection.image) {
        setImagePreview(`${BASE_URL()}/${subdomain}/${currentSection.image}`);
      }
    }
  }, [setValue, currentSection, subdomain]);

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
