"use client";
import { useParams } from "next/navigation";
import "@/app/[lang]/dashboard/menus/index.css";
import "@/app/[lang]/dashboard/items/main.css";
import { useSections } from "../../sections/apisSection";
import { useSubdomin } from "@/provider/SubdomainContext";
import { useToken } from "@/provider/TokenContext";
import ItemsList from "@/app/[lang]/components/ItemsList";
const ItemsForSection = ({ params: { lang } }) => {
  const token = localStorage.getItem("token") 
  const { apiBaseUrl, subdomain } = useSubdomin();
  const { id } = useParams();
  const {
    data: Sections,
    isLoading,
    error,
    refetch,
  } = useSections(token && apiBaseUrl ? token : null, apiBaseUrl, "items", id);

  return (
    <>
      <ItemsList
        lang={lang}
        Sections={Sections}
        isLoading={isLoading}
        error={error}
        refetch={refetch}
        subdomain={subdomain}
        token={token}
        apiBaseUrl={apiBaseUrl}
        subSections={true}
        navigate="item"
        pageType="items"
      />
    </>
  );
};

export default ItemsForSection;
