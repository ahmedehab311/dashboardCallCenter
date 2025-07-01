import { getDictionary } from "@/app/dictionaries";
import { useEffect, useState } from "react";

function useTranslate(lang) {
  const [trans, setTrans] = useState(null);
  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const dictionary = await getDictionary(lang);
        setTrans(dictionary);
      } catch (error) {
        console.error("Error fetching dictionary:", error);
      }
    };

    fetchTranslations();
  }, [lang]);
  return { trans };
}

export default useTranslate;
