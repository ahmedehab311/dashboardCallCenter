"use client";

import "@/app/[lang]/dashboard/menus/index.css";
import "@/app/[lang]/dashboard/items/main.css";
import { useSections } from "@/app/[lang]/dashboard/sections/apisSection";
import { useSubdomin } from "@/provider/SubdomainContext";
import { useToken } from "@/provider/TokenContext";
import ItemsList from "@/app/[lang]/components/ItemsList";
const Items = ({ params: { lang } }) => {
  const { token } = useToken();
  const { apiBaseUrl, subdomain } = useSubdomin();
  const {
    data: Sections,
    isLoading,
    error,
    refetch,
  } = useSections(token && apiBaseUrl ? token : null, apiBaseUrl, "items");
  return (
    <ItemsList
      lang={lang}
      Sections={Sections}
      isLoading={isLoading}
      error={error}
      refetch={refetch}
      subdomain={subdomain}
      token={token}
      apiBaseUrl={apiBaseUrl}
      subSections={false}
    />
  );
};

export default Items;
