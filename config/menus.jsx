import {
  DashBoard,
  Admin,
  Branch,
  CreateOrder
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
        // {
        //   title: "Orders",
        //   icon: CreateOrder,
        //   href: `/${language}/dashboard/orders`,
        //   isOpen: false,
        //   isHide: false,
        // },
        {
          title: "Create-order",
          icon: CreateOrder,
          href: `/${language}/dashboard/create-order`,
          isOpen: false,
          isHide: false,
        },
        // {
        //   title: "Menus",
        //   icon: Branch,
        //   href: `/${language}/dashboard/menu`,
        //   isOpen: false,
        //   isHide: false,
        // },
        // {
        //   title: "Sections",
        //   icon: Branch,
        //   href: `/${language}/dashboard/sections`,
        //   isOpen: false,
        //   isHide: false,
        // },
        // {
        //   title: "Items",
        //   icon: Branch,
        //   href: `/${language}/dashboard/items`,
        //   isOpen: false,
        //   isHide: false,
        // },
        // {
        //   title: "Condiments",
        //   icon: Branch,
        //   href: `/${language}/dashboard/condiments`,
        //   isOpen: false,
        //   isHide: false,
        // },
      ],
    },
  };
};

export const menusConfig = (language) => getLocalizedLinks(language);
