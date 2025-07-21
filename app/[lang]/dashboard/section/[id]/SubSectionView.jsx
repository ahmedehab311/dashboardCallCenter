"use client";
import "@/app/[lang]/dashboard/items/main.css";
import { useParams } from "next/navigation";
import { useSubdomin } from "@/provider/SubdomainContext";
import useTranslate from "@/hooks/useTranslate";
import SectionList from "@/app/[lang]/components/SectionList";
import { useSections } from "../../sections/apisSection";

const SubSectionView = ({ lang, filteredSubSection }) => {
  const { id } = useParams();
  const token = localStorage.getItem("token") || Cookies.get("token");
  const { apiBaseUrl, subdomain } = useSubdomin();
  const { trans } = useTranslate(lang);
  const {
    data: sections,
    isLoading,
    error,
    refetch,
  } = useSections(token, apiBaseUrl, "section", id);
  console.log("sections", sections);

  return (
    <SectionList
      lang={lang}
      sections={sections?.children}
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

export default SubSectionView;
