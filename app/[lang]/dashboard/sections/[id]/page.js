"use client";
import { useParams } from "next/navigation";
import "@/app/[lang]/dashboard/items/main.css";
import useTranslate from "@/hooks/useTranslate";
import { useSubdomin } from "@/provider/SubdomainContext";
import { useToken } from "@/provider/TokenContext";
import { useSections } from "../apisSection";
import SectionList from "@/app/[lang]/components/SectionList";
export default function SectionsForMenu({ params: { lang } }) {
  const { id } = useParams();
  // const { token } = useToken();
  const token = localStorage.getItem("token") || Cookies.get("token");
  const { apiBaseUrl, subdomain } = useSubdomin();
  const { trans } = useTranslate(lang);
  const {
    data: sections,
    isLoading,
    error,
    refetch,
  } = useSections(token, apiBaseUrl, "sections", id);
  return (
    <SectionList
      lang={lang}
      sections={sections}
      isLoading={isLoading}
      error={error}
      refetch={refetch}
      trans={trans}
      subdomain={subdomain}
      token={token}
      apiBaseUrl={apiBaseUrl}
      navigate="section"
    />
  );
}
