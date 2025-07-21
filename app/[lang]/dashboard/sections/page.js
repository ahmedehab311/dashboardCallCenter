"use client";
import "@/app/[lang]/dashboard/items/main.css";
import useTranslate from "@/hooks/useTranslate";
import { useSubdomin } from "@/provider/SubdomainContext";
import { useToken } from "@/provider/TokenContext";
import { saveArrangement, useSections } from "./apisSection";
import SectionList from "../../components/SectionList";
const Sections = ({ params: { lang } }) => {
  const token = localStorage.getItem("token") 
  const { apiBaseUrl, subdomain } = useSubdomin();
  const { trans } = useTranslate(lang);
  const {
    data: sections,
    isLoading,
    error,
    refetch,
  } = useSections(token, apiBaseUrl, "sections");

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
 
      pageType="sections"
    />
  );
};

export default Sections;
