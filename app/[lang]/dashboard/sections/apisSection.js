export const sections = [
  {
    id: "1",
    name_en: "Pizza",
    description_en: "Pizza",
    image: "",
    subSection: [
      {
        id: "1",
        name_en: "Chicken Ranch sub",
        description_en: "Chicken Ranch sub",
        image: "",
      },
      {
        id: "2",
        name_en: "Chicken Combo sub",
        description_en: "Chicken Combo sub",
        image: "",
      },
    ],
    items: [
      {
        id: "1",
        name_en: "Margarita",
        description_en: "Margarita",
        image: "",
        Condiments: [],
      },
      {
        id: "2",
        name_en: "Vegetarian",
        description_en: "Vegetarian",
        image: "",
      },
      {
        id: "3",
        name_en: "Cheese",
        description_en: "Cheese",
        image: "",
      },
      {
        id: "4",
        name_en: "Chicken",
        description_en: "Chicken",
        image: "",
      },
    ],
  },
  {
    id: "2",
    name_en: "Pasta",
    description_en: "Pasta",
    image: "",
    subSection: [
      {
        id: "1",
        name_en: "Beef Pasta sub",
        description_en: "Margarita sub",
        image: "",
      },

      {
        id: "2",
        name_en: "Chicken Pasta sub",
        description_en: "Margarita sub",
        image: "",
      },
    ],
    items: [
      {
        id: "1",
        name_en: "Beef Pasta",
        description_en: "Margarita",
        image: "",
      },

      {
        id: "2",
        name_en: "Chicken Pasta",
        description_en: "Margarita",
        image: "",
      },

      {
        id: "3",
        name_en: "Ranch Pasta",
        description_en: "Margarita",
        image: "",
      },
    ],
  },
  {
    id: "3",
    name_en: "Sandwiches",
    description_en: "Sandwiches",
    image: "",
  },
  {
    id: "4",
    name_en: "Salad",
    description_en: "Salad",
    image: "",
  },
  {
    id: "5",
    name_en: "Water",
    description_en: "Water",
    image: "",
  },
  {
    id: "6",
    name_en: "Appetizers",
    description_en: "Appetizers",
    image: "",
  },
];
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
// import { apiBaseUrl } from "next-auth/client/_utils";
export const fetchAllSections = async (token, apiBaseUrl, name) => {
  try {
    const response = await axios.get(
      `${apiBaseUrl}/v1/call-center/${name}?api_token=${token}`
    );

    // console.log("response", response);
    return response.data.response.data;
  } catch (error) {
    console.error("Error fetching menu:", error);
    throw error;
  }
};

export const useSections = (token, apiBaseUrl, name) =>
  useQuery({
    queryKey: ["SectionList", name],
    queryFn: () => fetchAllSections(token, apiBaseUrl, name),

    enabled: !!token,
  });
