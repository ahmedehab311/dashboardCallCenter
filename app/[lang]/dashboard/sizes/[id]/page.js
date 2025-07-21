"use client";
import SectionList from "@/app/[lang]/components/SectionList";
import { useParams } from "next/navigation";
import { useSubdomin } from "@/provider/SubdomainContext";
import useTranslate from "@/hooks/useTranslate";
import { useToken } from "@/provider/TokenContext";
import { useSections } from "../../sections/apisSection";
export default function SizeForItem({ params: { lang } }) {
  const { id } = useParams();
  // const { token } = useToken();
  const token = localStorage.getItem("token") || Cookies.get("token");
  const { apiBaseUrl, subdomain } = useSubdomin();
  const { trans } = useTranslate(lang);
  const {
    data: Sizes,
    isLoading,
    error,
    refetch,
  } = useSections(token, apiBaseUrl, "sizes", id);
  console.log("Sizes", Sizes);

  return (
    <SectionList
      lang={lang}
      sections={Sizes}
      isLoading={isLoading}
      error={error}
      refetch={refetch}
      trans={trans}
      subdomain={subdomain}
      token={token}
      apiBaseUrl={apiBaseUrl}
      navigate="size"
      pageType="sizes"
         
    />
  );
}
