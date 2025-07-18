"use client";
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
import { BASE_URL } from "@/api/BaseUrl";
import { useSections } from "../../../sections/apisSection";
import { useToken } from "@/provider/TokenContext";
import { itemSchema } from "../../../create-item/itemSchema";
import PriceField from "@/app/[lang]/components/FormFields/priceField";

function ViewAndEditItem() {
  const { itemId } = useParams();
  const { apiBaseUrl, subdomain } = useSubdomin();
  const { token } = useToken();
  const {
    data: PriceLists,
    isLoadingPriceLists,
    errorPriceLists,
    refetchPriceLists,
  } = useSections(token, apiBaseUrl, "price-lists");
  console.log("PriceLists", PriceLists);
  const {
    data: AllSections,
    isLoadingAllSections,
    errorAllSections,
    refetchAllSections,
  } = useSections(token, apiBaseUrl, "sections");
  const {
    data: Item,
    isLoading,
    error,
    refetch,
  } = useSections(token, apiBaseUrl, "item", itemId);

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
  const { theme, color } = useThemeColor();
  const [formInitialized, setFormInitialized] = useState(false);
  const selectedMenu = menuOptions?.find(
    (menu) => menu.value === Item?.menu_id
  );
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
    resolver: zodResolver(itemSchema),
    defaultValues: {
      ...Item,
      Menu: selectedMenu || null,
    },
  });
  useEffect(() => {
    if (Item) {
      setValue("enName", Item.name_en);
      setValue("arName", Item.name_ar);
      setValue("enDesc", Item.description_en);
      setValue("arDesc", Item.description_ar);
      setValue("status", Item.status ? 1 : 2);
      if (Item.image) {
        setImagePreview(`${BASE_URL()}/${subdomain}/${Item.image}`);
      }
    }
  }, [setValue, Item, subdomain]);

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
    <>
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

          <div className="mb-3">
            <PriceField
              PriceLists={PriceLists}
              prices={Item?.sizes[0]?.prices}
            />
          </div>
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
    </>
  );
}

export default ViewAndEditItem;
