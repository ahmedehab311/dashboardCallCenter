"use client";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { FaCog } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
const ProfileInfo = () => {
  const router = useRouter();

  const [admin, setAdmin] = useState(null);
  

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setAdmin(userData);


    if (userData) {
      setAdmin(userData);
    }
  }, []);

  if (!admin) {
    return null;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className=" cursor-pointer">
        <div className=" flex items-center ">
          {/* {admin?.profilePic && (
            <Image
              src={admin?.profilePic}
              alt={admin?.name}
              width={36}
              height={36}
              className="rounded-full"
            />
          )} */}
          <FaCog className="text-xl" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-auto p-0" align="end">
        <DropdownMenuLabel className="flex gap-2 items-center mb-1 p-3">
          {admin?.profilePic && (
            <Image
              src={admin?.profilePic}
              alt={admin?.user_name}
              width={36}
              height={36}
              className="rounded-full"
            />
          )}
          <div>
            <div className="text-sm font-medium text-default-800 capitalize ">
              {admin?.user_name}
            </div>
            <div
              // href="/dashboard"
              className="text-xs text-default-600"
            >
              {admin?.email}
            </div>
          </div>
        </DropdownMenuLabel>
        {/* <DropdownMenuGroup>
          {[
            {
              name: "profile",
              icon: "heroicons:user",
              href:"/user-profile"
            },
            {
              name: "Billing",
              icon: "heroicons:megaphone",
              href:"/dashboard"
            },
            {
              name: "Settings",
              icon: "heroicons:paper-airplane",
              href:"/dashboard"
            },
            {
              name: "Keyboard shortcuts",
              icon: "heroicons:language",
              href:"/dashboard"
            },
          ].map((item, index) => (
            <Link
              href={item.href}
              key={`info-menu-${index}`}
              className="cursor-pointer"
            >
              <DropdownMenuItem className="flex items-center gap-2 text-sm font-medium text-default-600 capitalize px-3 py-1.5 dark:hover:bg-background cursor-pointer">
                <Icon icon={item.icon} className="w-4 h-4" />
                {item.name}
              </DropdownMenuItem>
            </Link>
          ))}
        </DropdownMenuGroup> */}
        <DropdownMenuSeparator />
        {/* <DropdownMenuGroup>
          <Link href="/dashboard" className="cursor-pointer">
            <DropdownMenuItem className="flex items-center gap-2 text-sm font-medium text-default-600 capitalize px-3 py-1.5 dark:hover:bg-background cursor-pointer">
              <Icon icon="heroicons:user-group" className="w-4 h-4" />
              team
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2 text-sm font-medium text-default-600 capitalize px-3 py-1.5 dark:hover:bg-background">
              <Icon icon="heroicons:user-plus" className="w-4 h-4" />
              Invite user
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
              
                  <Link
                    href="/dashboard"
                    key={`message-sub-${index}`}
                    className="cursor-pointer"
                  >
                    <DropdownMenuItem className="text-sm font-medium text-default-600 capitalize px-3 py-1.5 dark:hover:bg-background cursor-pointer">
                      {item.name}
                    </DropdownMenuItem>
                  </Link>
             
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <Link href="/dashboard">
            <DropdownMenuItem className="flex items-center gap-2 text-sm font-medium text-default-600 capitalize px-3 py-1.5 dark:hover:bg-background cursor-pointer">
              <Icon icon="heroicons:variable" className="w-4 h-4" />
              Github
            </DropdownMenuItem>
          </Link>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2 text-sm font-medium text-default-600 capitalize px-3 py-1.5 dark:hover:bg-background cursor-pointer">
              <Icon icon="heroicons:phone" className="w-4 h-4" />
              Support
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {[
                  {
                    name: "portal",
                  },
                  {
                    name: "slack",
                  },
                  {
                    name: "whatsapp",
                  },
                ].map((item, index) => (
                  <Link href="/dashboard" key={`message-sub-${index}`}>
                    <DropdownMenuItem className="text-sm font-medium text-default-600 capitalize px-3 py-1.5 dark:hover:bg-background cursor-pointer">
                      {item.name}
                    </DropdownMenuItem>
                  </Link>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup> */}
        <DropdownMenuSeparator className="mb-0 dark:bg-background" />
        <DropdownMenuItem
         onSelect={() => {
    console.log("🚀 Logging out... Removing tokens!");

    Cookies.remove("access_token");
    Cookies.remove("token");
    localStorage.removeItem("token");
    Cookies.remove("token", { domain: "myres.me", path: "/" });
Cookies.remove("access_token", { domain: "myres.me", path: "/" });
Cookies.remove("access_token", { domain: "ordrz.me", path: "/" });

    const currentLanguage =
      localStorage.getItem("language") || Cookies.get("language");

    console.log("🔍 Checking Cookies after removal:", Cookies.get("token"), Cookies.get("access_token"));
    console.log("🔍 Checking Local Storage after removal:", localStorage.getItem("token"));

    router.push(`/${currentLanguage}/login`);
  }}
          className="flex items-center gap-2 text-sm font-medium text-default-600 capitalize my-1 px-3 dark:hover:bg-background cursor-pointer"
        >
          <Icon icon="heroicons:power" className="w-4 h-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default ProfileInfo;
