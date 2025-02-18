import {
  DashBoard,
  Admin,
  Branch,
} from "../components/icons/index";
const getLocalizedLinks = (language) => {
  return {
    sidebarNav: {
      classic: [
        {
          isHeader: true,
          title: "menu",
        },
        {
          title: "Dashboard",
          icon: DashBoard,
          href: `/${language}/dashboard`,
          isOpen: true,
        },
        {
          title: "Create-order",
          icon: Admin,
          href: `/${language}/dashboard/create-order`,
          isOpen: false,
          isHide: false,
        },
      ],
    },
  };
};

export const menusConfig = (language) => getLocalizedLinks(language);
