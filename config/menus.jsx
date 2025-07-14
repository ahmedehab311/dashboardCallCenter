import {
  DashBoard,
  Admin,
  Branch,
  CreateOrder , Mendeley,
  Cube,
  Restaurant,
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
          icon: CreateOrder,
          href: `/${language}/dashboard/create-order`,
          isOpen: false,
          isHide: false,
        },
        {
          title: "Menus",
          icon: Restaurant,
          href: `/${language}/dashboard/menus`,
          isOpen: false,
          isHide: false,
        },
        {
          title: "Sections",
          icon: Mendeley,
          href: `/${language}/dashboard/sections`,
          isOpen: false,
          isHide: false,
        },
        {
          title: "Items",
          icon: Cube,
          href: `/${language}/dashboard/items`,
          isOpen: false,
          isHide: false,
        },
        {
          title: "Condiments",
          icon: Branch,
          href: `/${language}/dashboard/condiments`,
          isOpen: false,
          isHide: false,
        },
      ],
    },
  };
};

export const menusConfig = (language) => getLocalizedLinks(language);
