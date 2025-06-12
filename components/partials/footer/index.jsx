import React from "react";
import { useSidebar, useThemeStore } from "@/store";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
// import MobileFooter from "./mobile-footer";
import FooterLayout from "./footer-layout";
import { useMounted } from "@/hooks/use-mounted";

const Footer = ({ handleOpenSearch }) => {
  const { collapsed, sidebarType } = useSidebar();
  const { layout, footerType } = useThemeStore();
  const mounted = useMounted();
  const isMobile = useMediaQuery("(min-width: 768px)");



  if (footerType === "hidden") {
    return null;
  }

  if (layout === "semibox") {
    return (
      <div className="xl:mx-20 mx-6 mt-2">
        <FooterLayout
          className={cn(" rounded-md border", {
            "ltr:xl:ml-[72px] rtl:xl:mr-[72px]": collapsed,
            "ltr:xl:ml-[272px] rtl:xl:mr-[272px]": !collapsed,
            "sticky bottom-0": footerType === "sticky",
          })}
        >
          <FooterContent />
        </FooterLayout>
      </div>
    );
  }


  return (
    <FooterLayout
      className={cn("", {
        "ltr:xl:ml-[300px] rtl:xl:mr-[300px]": !collapsed,
        "ltr:xl:ml-[72px] rtl:xl:mr-[72px]": collapsed,
        "sticky bottom-0": footerType === "sticky",
      })}
    >
      <FooterContent />
    </FooterLayout>
  );
};

export default Footer;

const FooterContent = () => {
  return (
    <div className="block md:flex md:justify-between text-muted-foreground">
      <p className="sm:mb-0 text-xs md:text-sm">
        COPYRIGHT © {new Date().getFullYear()} 
      </p>
 {/* <p className="sm:mb-0 text-xs md:text-sm">
        COPYRIGHT © {new Date().getFullYear()} DashTail All rights Reserved
      </p> */}
    </div>
  );
};
