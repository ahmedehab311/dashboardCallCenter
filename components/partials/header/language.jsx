"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import flag1 from "@/public/images/all-img/flag-1.png";
import flag2 from "@/public/images/all-img/flag-2.png";
import flag3 from "@/public/images/all-img/flag-3.png";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import { useThemeStore } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "@/store/slices/languageSlice";
import { fetchSettings } from "@/store/slices/systemSlice";
import { BASE_URL } from "@/api/BaseUrl";
import Cookies from "js-cookie";
const Language = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { setRtl } = useThemeStore();
  const dispatch = useDispatch();
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const hashedValue =
    typeof window !== "undefined" ? localStorage.getItem("hashValue") : null;

  const { defaultSystemLanguage, loading, error } = useSelector(
    (state) => state.settings
  );

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch(`http://nisantasi.ordrz.me/api/languages`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${hashedValue}`,
            "Content-Type": "application/json",
            locale: selectedLanguage?.code,
          },
        });
        const data = await response.json();
        setLanguages(data.response.data);
        // if (process.env.NODE_ENV === "development") {
        //   console.log("languages", data.response.data);
        // }
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };

    fetchLanguages();
  }, [selectedLanguage, hashedValue]);

  useEffect(() => {
    if (languages?.length > 0) {
      const storedLanguage =
        Cookies.get("language") ||
        localStorage.getItem("language") ||
        defaultSystemLanguage;
      const langObj = languages.find((l) => l.code === storedLanguage);
      if (langObj) {
        setSelectedLanguage(langObj);
        dispatch(setLanguage(langObj.code));
        setRtl(langObj.dir === "rtl");
      }
    }
  }, [languages, defaultSystemLanguage, dispatch, setRtl]);


  const handleSelected = (langName) => {
    const langObj = languages.find((l) => l.name === langName); // البحث باستخدام الاسم
    if (langObj) {
      // التعامل بالكود في التخزين وتحديث المسار
      dispatch(setLanguage(langObj.code));
      localStorage.setItem("language", langObj.code); // تخزين الكود
      Cookies.set("language", langObj.code); // تخزين الكود
      setRtl(langObj.dir === "rtl");

      // تحديث المسار باستخدام الكود
      const newPathname = `/${langObj.code}${pathname.substring(3)}`;
      router.push(newPathname);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" className="bg-transparent hover:bg-transparent">
          <span className="w-6 h-6 rounded-full me-1.5">
            <Image
              src={selectedLanguage?.flag}
              alt={selectedLanguage?.name}
              className="w-full h-full object-cover rounded-full"
              height={30}
              width={30}
            />
          </span>
          {/* <span className="text-sm text-default-600 capitalize">
            {selectedLanguage?.name}
          </span> */}
          <span className="text-sm text-default-600 capitalize">
            {selectedLanguage?.name.length > 12
              ? `${selectedLanguage?.name.substring(0, 12)}...`
              : selectedLanguage?.name}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="p-2">
        {languages?.map((item, index) => (
          <DropdownMenuItem
            key={`lang-${index}`}
            className="py-1.5 px-2 cursor-pointer mb-[2px]"
            onClick={() => handleSelected(item.name)}
          >
            <span className="w-6 h-6 rounded-full me-1.5">
              <Image
                src={item?.flag}
                alt="EN"
                className="w-full h-full object-cover rounded-full"
                height={30}
                width={30}
              />
            </span>
            {/* <span className="text-sm text-default-600 capitalize">
              {item.name}
            </span> */}
            <span className="text-sm text-default-600 capitalize">
              {item.name.length > 12
                ? `${item.name.substring(0, 12)}...`
                : item.name}
            </span>
            {selectedLanguage?.name === item.name && (
              <Check className="w-4 h-4 flex-none ltr:ml-2 rtl:mr-2 text-default-700" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default Language;
