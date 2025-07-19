"use client";
import SectionList from "@/app/[lang]/components/SectionList";
import { useParams } from "next/navigation";
import { useSections } from "../../sections/apisSection";
import { useSubdomin } from "@/provider/SubdomainContext";
import useTranslate from "@/hooks/useTranslate";
import { useToken } from "@/provider/TokenContext";
export default function SizeForItem({ params: { lang } }) {
  const { id } = useParams();
  const { token } = useToken();
  const { apiBaseUrl, subdomain } = useSubdomin();
  const { trans } = useTranslate(lang);
  const {
    data: Sizes,
    isLoading,
    error,
    refetch,
  } = useSections(token, apiBaseUrl, "sizes", id);
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
    />
  );
}
