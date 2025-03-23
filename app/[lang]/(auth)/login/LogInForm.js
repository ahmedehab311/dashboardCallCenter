/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useMediaQuery } from "@/hooks/use-media-query";
import crypto from "crypto";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/store/slices/authSlice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { fetchSettings } from "@/store/slices/systemSlice";
import { FaSpinner } from "react-icons/fa";
import { getDictionary } from "@/app/dictionaries.js";
import { useLanguage } from "@/provider/LanguageContext";
import img from "/public/logo.png"
import Image from "next/image";
import { useSubdomin } from "@/provider/SubdomainContext";

const schema = z.object({
  email: z.string().email({ message: "Your email is invalid." }),
  password: z.string().min(6),
});

const LogInForm = ({ children }) => {
    const { apiBaseUrl,subdomain } = useSubdomin()
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentLang } = useLanguage();
  const [trans, setTrans] = useState(null);
  const [isPending, startTransition] = React.useTransition();
  const [passwordType, setPasswordType] = React.useState("password");
  const [isVisible, setIsVisible] = React.useState(false);
  const [isLoadings, setIsLoadings] = useState(false);
  const isDesktop2xl = useMediaQuery("(max-width: 1530px)");
  const language = useSelector(
    (state) => state.language.language,
    (prev, next) => prev === next
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "all",
  });

  useEffect(() => {
    const loadDictionary = async () => {
      const dictionary = await getDictionary(currentLang);
      setTrans(dictionary);
    };
    loadDictionary();
  }, [currentLang]);
  // console.log("trans from login", trans);

  // useEffect(() => {
  //   localStorage.setItem("language", language);
  //   Cookies.set("language", language);
  // }, [language]);

  // //  hash code
  // useEffect(() => {
  //   const loadDictionary = async () => {
  //     const dictionary = await getDictionary(currentLang);
  //     setTrans(dictionary);
  //   };
  //   loadDictionary();
  // }, [currentLang]);
  // // console.log("trans from login", trans);

  // useEffect(() => {
  //   localStorage.setItem("language", language);
  //   Cookies.set("language", language);
  // }, [language]);

  // //  hash code
  // const SECRET_KEY = "039e9def-f418-4a13-b414-0dfaa2d79b79";
  // // const SECRET_KEY = "039e9def-f418-4a13-b413-0dfaa2d79b77";
  // // const SECRET_KEY =
  // //   process.env.NODE_ENV === "production"
  // //     ? "039e9def-f418-4a13-b414-0dfaa2d79b79"
  // //     : "039e9def-f420-4a13-b414-0dfaa2d79b77";
  // const { domain, systemToken, loading, error } = useSelector(
  //   (state) => state.settings
  // );

  // useEffect(() => {
  //   const fetchAndLogData = async () => {
  //     const resultAction = await dispatch(fetchSettings());
  //     if (fetchSettings.fulfilled.match(resultAction)) {
  //       if (process.env.NODE_ENV === "development") {
  //         console.log("Fetched Settings Data:", resultAction.payload);
  //       }
  //     } else {
  //       console.error("Error fetching settings:", resultAction.error);
  //     }
  //   };

  //   fetchAndLogData();
  // }, [dispatch]);

  // // console.log("domain", domain);
  // // console.log("systemToken", systemToken);

  // const handleGenerateHash = async () => {
  //   if (!domain || !systemToken || !SECRET_KEY) {
  //     console.log("Loading...");
  //     return "Loading...";
  //   }
  //   // const ip = "192.168.8.137";
  //   const ip = "192.168.1.13";
  //   try {
  //     // const response = await fetch("https://api.ipify.org?format=json");
  //     // const data = await response.json();
  //     // const dynamicIP = data.ip;

  //     // const stringToHash = `${SECRET_KEY}&${domain}&${ip}&${systemToken}`;
  //     const stringToHash = `${SECRET_KEY}&${domain}&${systemToken}`;
  //     // console.log("IP Address:", dynamicIP);
  //     if (process.env.NODE_ENV === "development") {
  //       console.log("SECRET_KEY:", SECRET_KEY);
  //       console.log("systemToken:", systemToken);
  //       console.log("domain:", domain);
  //     }
  //     const hashed = crypto
  //       .createHash("sha512")
  //       .update(stringToHash)
  //       .digest("hex");
  //     localStorage.setItem("hashValue", hashed);
  //     // localStorage.setItem("domain", domain);
  //     localStorage.removeItem("domain");
  //     // Cookies.set("domain", domain);

  //     console.log("Hashed String:", hashed);

  //     return hashed;
  //   } catch (error) {
  //     console.error("Failed to retrieve IP address:", error);
  //     return "Failed to retrieve IP address";
  //   }
  // };
  // useEffect(() => {
  //   if (domain && systemToken) {
  //     handleGenerateHash();
  //   }
  // }, [domain, systemToken]);

  const togglePasswordType = () => {
    if (passwordType === "text") {
      setPasswordType("password");
    } else if (passwordType === "password") {
      setPasswordType("text");
    }
  };

  // useEffect(() => {
  //   Cookies.remove("token");
  //   Cookies.remove("look_up");
  //   Cookies.remove("language");
  //   Cookies.remove("domain");
  //   Cookies.remove("access_token");
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("user");
  
  //   console.log("🚀 Removed all stored tokens and data!");
  //   console.log("🔍 Token after remove:", Cookies.get("token"), localStorage.getItem("token"));
  // }, []);
  
  // const onSubmit = async (data) => {
  //   setIsLoadings(true);

  //   const requestData = {
  //     login: data.email,
  //     password: data.password,
  //   };
  //   // console.log("requestData", requestData);

  //   const resultAction = await dispatch(
  //     loginUser({
  //       credentials: requestData,
  //       language,
  //     })
  //   );

  //   if (loginUser.fulfilled.match(resultAction)) {
  //     toast.success("Login successful");
  //     router.push(`/${language}/dashboard`);
  //     const messages = resultAction.payload.messages || [];
  //     messages.forEach((message) => toast.success(message));
  //   } else {
  //     const messages = resultAction.payload?.messages ||
  //       resultAction.error?.messages || ["An unexpected error occurred"];
  //     messages.forEach((message) => toast.error(message));
  //   }
  //   setIsLoadings(false);
  //   reset();
  // };
  // const onSubmit = async (data) => {
  //   setIsLoadings(true);

  //   const requestData = {
  //     login: data.email,
  //     password: data.password,
  //   };

  //   try {
  //     const result = await loginUser(requestData, language);
  //     toast.success("Login successful");

  //     router.push(`/${language}/dashboard`);

  //     if (result?.messages) {
  //       result.messages.forEach((message) => toast.success(message));
  //     }
  //   } catch (error) {
  //     const messages = error.messages || ["An unexpected error occurred"];
  //     messages.forEach((message) => toast.error(message));
  //     setIsLoadings(false);
  //   }

  //   setIsLoadings(false);
  //   reset();
  // };
    const onSubmit = async (data) => {
      setIsLoadings(true);

      const requestData = {
        login: data.email,
        password: data.password,
      };

      console.log("🔹 Submitting login form with:", requestData);

      try {
        const resultAction = await dispatch(
          loginUser({ credentials: requestData,apiBaseUrl,subdomain })
        );

        if (loginUser.fulfilled.match(resultAction)) {
          console.log("🎉 Login successful:", resultAction.payload);

          toast.success("Login successful");
          router.push(`/${language}/dashboard/create-order`);

          const messages = resultAction.payload?.messages || [];
          // messages.forEach((message) => toast.success(message));
        } else {
          console.error("Login failed:", resultAction);

          const messages = resultAction.payload?.messages ||
            resultAction.error?.messages || ["An unexpected error occurred"];
            // .forEach((message) => toast.error(message));
        }
      } catch (error) {
        console.error(" Unexpected error:", error);
        toast.error("An unexpected error occurred");
      }

      setIsLoadings(false);
      reset();
    };

  return (
    <>
      <div className="w-full py-5 lg:py-8">
        <Link href="/dashboard" className="inline-block">
          {/* <SiteLogo className="h-10 w-10 2xl:w-14 2xl:h-14 text-primary" /> */}
        </Link>
        {/* <Button onClick={handleClick}>create-section</Button> */}
        {/* <div className="p-4">
        <button
          className="bg-primary text-primary-foreground py-2 px-4 rounded"
          onClick={handleGenerateHash}
        >
          Generate Hashed String
        </button>

        {inputString && (
          <div className="mt-4">
            <p className="text-red-700 text-[1.3rem]">
              Original : {inputString}
            </p>
            <p>Hashed: {hashedString}</p>
          </div>
        )}
      </div> */}
 <Image src={img}   width={100} height={100}  alt="logo"   />
        <div className="2xl:mt-5 mt-6 2xl:text-3xl text-2xl font-bold text-default-900">
          Hey, Hello 👋
        </div>
        <div className="2xl:text-lg text-base text-default-600 mt-2 leading-6">
          Enter the information you entered while registering.
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 xl:mt-7">
          <div className="relative">
            <Label
              htmlFor="email"
              className="mb-2 font-medium text-default-600"
            >
              Email
            </Label>

            <Input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email address",
                },
              })}
              type="email"
              id="email"
              className={cn("peer", {
                "border-destructive": errors.email,
              })}
              size={!isDesktop2xl ? "xl" : "lg"}
              placeholder=""
            />
          </div>
          {errors.email && (
            <div className=" text-destructive mt-2">{errors.email.message}</div>
          )}

          <div className="mt-3.5">
            <Label
              htmlFor="password"
              className="mb-2 font-medium text-default-600"
            >
              Password{" "}
            </Label>
            <div className="relative">
              {/* <Input
              // disabled={isPending}
              // {...register("password")}
              type={passwordType}
              id="password"
              className="peer "
              size={!isDesktop2xl ? "xl" : "lg"}
              placeholder=" "
            /> */}
              <Input
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                type={passwordType}
                id="password"
                className="peer "
                size={!isDesktop2xl ? "xl" : "lg"}
                placeholder=" "
              />

              <div
                className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 cursor-pointer"
                onClick={togglePasswordType}
              >
                {passwordType === "password" ? (
                  <Icon
                    icon="heroicons:eye"
                    className="w-5 h-5 text-default-400"
                  />
                ) : (
                  <Icon
                    icon="heroicons:eye-slash"
                    className="w-5 h-5 text-default-400"
                  />
                )}
              </div>
            </div>
          </div>
          {errors.password && (
            <div className=" text-destructive mt-2">
              {errors.password.message}
            </div>
          )}

          <div className="mt-5  mb-8 flex flex-wrap gap-2">
            {/* <div className="flex-1 flex  items-center gap-1.5 ">
              <Checkbox
                size="sm"
                className="border-default-300 mt-[1px]"
                id="isRemebered"
              />
              <Label
                htmlFor="isRemebered"
                className="text-sm text-default-600 cursor-pointer whitespace-nowrap"
              >
                Remember me
              </Label>
            </div> */}
            <Link
              href={`/${language}/forget`}
              className="flex-none text-sm text-primary"
            >
              Forget Password?
            </Link>
          </div>
          <Button
            className="w-full"
            disabled={isLoadings}
            size={!isDesktop2xl ? "lg" : "md"}
          >
            {isLoadings ? (
              <FaSpinner className="animate-spin" />
            ) : (
              `${trans?.SignIn}`
            )}
          </Button>
        </form>
      </div>
    </>
  );
};

export default LogInForm;
