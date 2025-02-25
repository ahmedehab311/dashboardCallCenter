"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { useTheme } from "next-themes";
import Select from "react-select";
import { Label } from "@radix-ui/react-label";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Search } from "lucide-react";
import Image from "next/image";
import { selectStyles } from "@/lib/utils";
import Test from "./test";
import BorderedTables from "./bordered-tables";
import { Icon } from "@iconify/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchRestaurantsList,
  fetchBranches,
  fetchMenu,
  fetchViewItem,
} from "./apICallCenter/ApisCallCenter";
import { toast } from "react-hot-toast";
import {
  fetchUserByPhone,
  updateUserData,
  fetchAreas,
  createUser,
  createAddress,
  updateUserAddress,
  deleteAddress,
} from "./apICallCenter/apisUser";
import { BASE_URL_iamge } from "@/api/BaseUrl";
import { z } from "zod";
import { useForm, Controller, set } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiEdit, FiTrash2 } from "react-icons/fi";
const editUserDataSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  phone: z.string().regex(/^\d{10,15}$/, "Invalid phone number"),
  phone2: z
    .string()
    .optional()
    .refine((val) => val === "" || /^\d{10,15}$/.test(val), {
      message: "Invalid phone number",
    }),

  email: z
    .string()
    .optional()
    .refine((val) => val === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Invalid email address",
    }),
});
const addUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  phone: z.string().regex(/^\d{10,15}$/, "Invalid phone number"),
  area: z.object(
    { value: z.number(), label: z.string() },
    { required_error: "Area is required" }
  ),
  street: z.string().min(1, "Street name is required"),
  name: z.string().min(1, " name is required"),

  building: z.string().min(1, "Building number is required").or(z.literal("")),
  floor: z.string().optional(),
  apt: z.string().optional(),
  additionalInfo: z.string().optional(),
});
const addAddressSchema = z.object({
  area: z.object(
    { value: z.number(), label: z.string() },
    { required_error: "Area is required" }
  ),
  street: z.string().min(1, "Street name is required"),
  name: z.string().min(1, " name is required"),

  building: z.string().min(1, "Building number is required").or(z.literal("")),
  floor: z.string().optional(),
  apt: z.string().optional(),
  additionalInfo: z.string().optional(),
});
const editUserAddressSchema = z.object({
  area: z.object(
    { value: z.number(), label: z.string() },
    { required_error: "Area is required" }
  ),
  street: z.string().min(1, "Street name is required"),
  name: z.string().min(1, " name is required"),
  building: z.string().min(1, "Building number is required").or(z.literal("")),
  floor: z.string().optional(),
  apt: z.string().optional(),
  additionalInfo: z.string().optional(),
});
// const userSchemaEdit = z.object({
//   username: z.string().min(3, "Username must be at least 3 characters long"),
//   phone: z.string().regex(/^\d{10,15}$/, "Invalid phone number"),
//   address: z.string().min(1, "Address is required"),
//   street: z.string().min(1, "Street name is required"),
//   building: z.string().min(1, "Building number is required"),
//   floor: z.string().optional(),
//   apt: z.string().optional(),
//   name: z.string().min(1, "Name is required"),
//   additionalInfo: z.string().optional(),
// });
function CreateOrder() {
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    setValue: setValueEdit,
    formState: { errors: errorsEdit },
  } = useForm({ resolver: zodResolver(editUserDataSchema), mode: "onSubmit" });

  const {
    control,
    register: registerAddNewUser,
    handleSubmit: handleSubmitAddNewUser,
    setValue: setValueAddNewUser,
    trigger,
    formState: { errors: errorsAddNewUser },
  } = useForm({ resolver: zodResolver(addUserSchema), mode: "onSubmit" });
  const {
    control: controlAddress,
    register: registerAddNewAddress,
    handleSubmit: handleSubmitAddNewAddress,
    setValue: setValueAddNewAddress,
    formState: { errors: errorsAddNewAddress },
  } = useForm({ resolver: zodResolver(addAddressSchema), mode: "onSubmit" });
  const {
    control: controlEditAddress,
    register: registerEditAddressUser,
    handleSubmit: handleEditAddressUser,
    setValue: setValueEditAddressUser,
    formState: { errors: errorsEditAddressUser },
  } = useForm({
    resolver: zodResolver(editUserAddressSchema),
    mode: "onSubmit",
  });

  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const [color, setColor] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(1);
  const [SelectedBranchId, setSelectedBranchId] = useState(null);
  const [SelectedBranchPriceist, setSelectedBranchPriceList] = useState(1);
  // apis
  // api restaurants select
  const {
    data: dataRestaurants,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["RestaurantsList"],
    queryFn: fetchRestaurantsList,
  });
  const {
    data: branches,
    isLoadingBranchs,
    errorBranchs,
    refetch: refetchBranches,
  } = useQuery({
    queryKey: ["BranchesList", selectedRestaurantId],
    queryFn: () => fetchBranches(selectedRestaurantId),
    enabled: !!selectedRestaurantId,
  });
  const {
    data: areas,
    isLoadingAreas,
    errorAreas,
  } = useQuery({
    queryKey: ["AreasList"],
    queryFn: fetchAreas,
  });
  // console.log("areas in basic", areas) ;

  const {
    data: menu,
    isLoading: isLoadingMenu,
    error: errorMenu,
    refetch: refetchMenu,
  } = useQuery({
    queryKey: ["menuList", selectedRestaurantId, SelectedBranchPriceist],
    queryFn: () => fetchMenu(selectedRestaurantId, SelectedBranchPriceist),
    enabled: !!selectedRestaurantId && !!SelectedBranchPriceist,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  // console.log("menu from basic", menu);
  const sections = menu?.sections
    ? [{ id: "all", name_en: "All", name_ar: "الكل" }, ...menu.sections]
    : [{ id: "all", name_en: "All", name_ar: "الكل" }];

  const items =
    menu?.sections?.flatMap((section) =>
      section.items_and_offer.map((item) => ({
        id: item.id,
        name: item.name_en, // يمكنك استبدالها بـ item.name_ar إذا كنت تريد العربية
        price: item.sizes?.[0]?.prices?.[0]?.price,
        // image: item.image, // تأكد أن الصورة تأتي من API
        section: section.id, // كل عنصر مرتبط بالقسم الخاص به
        image: item.image?.startsWith("http")
          ? item.image
          : `${BASE_URL_iamge}/${item.image}`,
      }))
    ) || [];
  // console.log("imageUrl", items.imageUrl);
  // console.log("First item imageUrl:", items[0]?.image);
  // console.log("First item price:", items[0]?.price);

  // api User Data For serach

  const {
    data: selectedUser,
    isLoadingUserDataForSerach,
    errorUserDataForSearch,
  } = useQuery({
    queryKey: ["userSearch", phone],
    queryFn: () => fetchUserByPhone(phone),
    enabled: !!phone, // تفعيل الاستعلام فقط إذا كان هناك رقم هاتف
    onSuccess: (data) => {
      if (data) {
        // تخزين بيانات المستخدم مباشرة
        setAllUserData(data);
      }
    },
    onError: (error) => {
      // في حالة حدوث خطأ
      setErrorSearchUser("Error fetching user data");
      console.error("Error fetching user:", error);
    },
  });
  // api branches

  // if (process.env.NODE_ENV === "development") {
  //   console.log("selectedUser", selectedUser);
  // }

  const [activeSection, setActiveSection] = useState("all");
  const [counter, setCounter] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openEditAddressDialog, setOpenEditAddressDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [restaurantsSelect, setRestaurantsSelect] = useState([]);

  const [isNewUserDialogOpen, setIsNewUserDialogOpen] = useState(false);
  const [isNewAddressDialogOpen, setIsNewAddressDialogOpen] = useState(false);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [isOpenMainExtra, setIsOpenMainExtra] = useState(true);
  // const handleItemClick = async (item) => {
  //   setSelectedItem(item);
  //   setIsItemDialogOpen(true);
  //   //  console.log(
  //   //   "restaurantId from fetch handleItemClick",
  //   //   selectedRestaurantId
  //   // );
  //   // console.log("addressId from fetch handleItemClick", selectedAddress?.id);
  //   // console.log("itemId from fetch handleItemClick", item.id);
  //   setIsOpen(!isOpen);
  //   try {
  //     const response = await fetchViewItem(
  //       selectedRestaurantId,
  //       selectedAddress?.id,
  //       item.id
  //     );
  //     if (response) {
  //       setSelectedItem({
  //         id: response.id,
  //         name: response.name_en, // أو response.name_ar لو بالعربي
  //         description: response.description_en, // أو response.description_ar
  //         image: response.image,
  //         availability: response.info?.[0]?.availability.availability,
  //         info: response.info || [],
  //         selectedInfo: response.info?.[0]?.size_en || "", // أول عنصر تلقائيًا
  //         itemExtras: response.item_extras?.[0] || null, // أول مجموعة Extra
  //         extrasData: response.item_extras?.[0]?.data || [],
  //         selectedExtras: [], // مصفوفة لتخزين الإضافات المختارة
  //         selectedExtrasIds: [],
  //         price: response.info?.[0]?.price.price,
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error fetching item details:", error);
  //   }
  // };
  const handleItemClick = async (item) => {
    setSelectedItem(item);
    setIsItemDialogOpen(true);
    setIsOpen(!isOpen);

    try {
      const response = await fetchViewItem(
        selectedRestaurantId,
        selectedAddress?.id,
        item.id
      );

      if (response) {
        const firstInfo = response?.info?.[0] || null;

        setSelectedItem({
          id: response.id,
          name: response.name_en,
          description: response.description_en,
          image: response.image,
          availability: firstInfo?.availability?.availability,
          info: response?.info || [],
          selectedInfo: firstInfo?.size_en || "",
          selectedMainExtras: [],
          selectedMainExtrasIds: [],
          mainExtras: response?.item_extras?.[0]?.data || [],
          itemExtras: firstInfo?.item_extras || [],
          extrasData: firstInfo?.item_extras[0]?.data || [],
          selectedExtras: [],
          selectedExtrasIds: [],
          price: firstInfo?.price?.price,
        });
      }
    } catch (error) {
      console.error("Error fetching item details:", error);
    }
  };
  console.log("mainExtras", selectedItem?.mainExtras);
  console.log("itemExtras", selectedItem?.itemExtras);
  console.log("info", selectedItem?.info);
  console.log("extrasData", selectedItem?.extrasData);
  console.log("selectedExtras", selectedItem?.selectedExtras);
  console.log("selectedExtrasIds", selectedItem?.selectedExtrasIds);
  console.log("selectedMainExtras", selectedItem?.selectedMainExtras);
  console.log("selectedMainExtrasIds", selectedItem?.selectedMainExtrasIds);

  // useEffect(() => {
  //   if (
  //     selectedItem?.selectedExtras?.length ===
  //       selectedItem?.extrasData?.length ||
  //     selectedItem?.selectedExtras?.length === 0
  //   ) {
  //     setIsOpen(false);
  //   }
  // }, [selectedItem?.selectedExtras, selectedItem?.extrasData]);

  // const toggleExtras = () => {
  //   setIsOpen(!isOpen); // تبديل حالة الفتح/الإغلاق
  // };
  // useEffect(() => {
  //   if (
  //     selectedItem?.selectedMainExtras?.length ===
  //       selectedItem?.mainExtras?.length ||
  //     selectedItem?.selectedMainExtras?.length === 0
  //   ) {
  //     setIsOpen(false);
  //   }
  // }, [selectedItem?.selectedMainExtras, selectedItem?.mainExtras]);
  // إغلاق القائمة فقط عند تحميل الصفحة إذا كانت فارغة
  // useEffect(() => {
  //   if (!selectedItem) return;

  //   if (selectedItem?.extrasData?.length === 0) {
  //     setIsOpen(false);
  //   } else {
  //     setIsOpen(true);
  //   }
  // }, [selectedItem]);

  // useEffect(() => {
  //   if (!selectedItem) return;

  //   if (
  //     selectedItem?.selectedExtras?.length === selectedItem?.extrasData?.length
  //   ) {
  //     setIsOpen(false);
  //   }
  // }, [selectedItem?.selectedExtras]);
  useEffect(() => {
    if (!selectedItem) return;

    if (selectedItem?.extrasData?.length === 0) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [selectedItem]);

  useEffect(() => {
    if (!selectedItem) return;

    if (
      selectedItem?.selectedExtras?.length === selectedItem?.extrasData?.length
    ) {
      setIsOpen(false);
    }
  }, [selectedItem?.selectedExtras]);

  const toggleExtras = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (!selectedItem) return;

    if (selectedItem?.mainExtras?.length === 0) {
      setIsOpenMainExtra(false);
    } else {
      setIsOpenMainExtra(true);
    }
  }, [selectedItem]);

  useEffect(() => {
    if (!selectedItem) return;

    if (
      selectedItem?.selectedMainExtras?.length ===
      selectedItem?.mainExtras?.length
    ) {
      setIsOpenMainExtra(false);
    }
  }, [selectedItem?.selectedMainExtras]);

  const toggleExtrasMainExtra = () => {
    setIsOpenMainExtra(!isOpenMainExtra);
  };

  const handleNewUserClick = () => {
    setSelectedItem(null);
    setIsNewUserDialogOpen(true);
    setOpenDialog(true);
  };
  const handleIncrease = () => setCounter((prev) => prev + 1);
  const handleDecrease = () => setCounter((prev) => (prev > 1 ? prev - 1 : 1));

  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = searchQuery
    ? items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items;

  // استخراج الأقسام التي تحتوي فقط على العناصر المفلترة
  const filteredSections = sections.filter(
    (section) =>
      section.id === "all" || items.some((item) => item.section === section.id)
  );

  const displayedItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesSection =
        activeSection === "all" || item.section === activeSection;
      return matchesSearch && matchesSection;
    });
  }, [items, searchQuery, activeSection]);

  const [search, setSearch] = useState("");
  const [allUserData, setAllUserData] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [errorSearchUser, setErrorSearchUser] = useState(null);
  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     if (search) {
  //       // إذا كان هناك شيء مكتوب في حقل البحث
  //       const message =
  //         "Are you sure you want to leave? Your search data will be lost.";
  //       event.returnValue = message; // هذا سيعرض رسالة التحذير في بعض المتصفحات
  //       return message; // بعض المتصفحات الأخرى تتطلب هذه السطر لعرض الرسالة
  //     }
  //   };

  //   // إضافة مستمع لحدث beforeunload
  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   // تنظيف المستمع عند الخروج من الصفحة أو عند تغيير الكومبوننت
  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, [search]);
  const handleSearch = () => {
    if (search) {
      setPhone(search);
      setErrorSearchUser("");
    }
    setErrorSearchUser("");
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(); // استدعاء دالة البحث عند الضغط على إنتر
    }
  };

  const handleClear = () => {
    setSearch("");
    setPhone("");
    setAllUserData(null);
    setSelectedAddress(null);
    setSearch("");
  };

  useEffect(() => {
    if (theme === "dark") {
      setColor("#fff");
    } else {
      setColor("#000");
    }
  }, [theme]);

  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [selectedAddressArray, setSelectedAddressArray] = useState([]);
  const [selectedEditAddress, setSelectedEditAddress] = useState(null);

  useEffect(() => {
    if (selectedUser?.address?.length > 0) {
      setSelectedAddress(selectedUser.address[0]);
    }
  }, [selectedUser]);
  useEffect(() => {
    if (selectedUser?.address?.length > 0) {
      setSelectedAddressArray(selectedUser.address);
    }
  }, [selectedUser]);

  // console.log("SelectedAddressArray", selectedAddressArray);
  // console.log("SelectedAddress", selectedAddress);
  // console.log("selectedEditAddress", selectedEditAddress);
  // console.log("selectedAddress", selectedAddress?.id);
  const columns = [
    { key: "Items", label: "Items" },
    { key: "Edit", label: "Edit" },
    { key: "Delete", label: "Delete" },
    { key: "quantity", label: "quantity" },
    { key: "Unit Price", label: "Unit Price" },
    { key: "Total Price", label: "Total Price" },
  ];

  const usersTable = [
    {
      id: 1,
      Items: "Taco Joe Beef Pasta Taco Joe Pasta",
      Edit: "",
      Delete: "",
      quantity: 25,
      UnitPrice: 120,
      TotalPrice: 120,
    },
  ];
  const [countersTable, setCountersTable] = useState(
    usersTable.reduce((acc, item) => ({ ...acc, [item.id]: 1 }), {})
  );

  const handleIncreaseTable = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
              total: (item.quantity + 1) * item.price,
            }
          : item
      )
    );
  };

  const handleDecreaseTable = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1
          ? {
              ...item,
              quantity: item.quantity - 1,
              total: (item.quantity - 1) * item.price,
            }
          : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const [cartItems, setCartItems] = useState([]);
  const handleAddToCart = () => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === selectedItem.id
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === selectedItem.id
            ? {
                ...item,
                quantity: item.quantity + counter,
                total: (item.quantity + counter) * item.price,
              }
            : item
        );
      }

      return [
        ...prevItems,
        {
          ...selectedItem,
          quantity: counter,
          total: counter * selectedItem?.price,
        },
      ];
    });
    setOpenDialog(false);
  };

  useEffect(() => {
    if (dataRestaurants) {
      const formattedRestaurants = dataRestaurants.map((restaurant) => ({
        value: restaurant.id,
        label: restaurant.res_name_en,
      }));
      setRestaurantsSelect(formattedRestaurants);

      // تعيين الـ id للمطعم الأول بشكل افتراضي
      if (formattedRestaurants.length > 0) {
        setSelectedRestaurantId(formattedRestaurants[0].value);
      }
    }
  }, [dataRestaurants]);
  useEffect(() => {
    if (selectedRestaurantId && SelectedBranchPriceist) {
      queryClient.prefetchQuery(
        ["menuList", selectedRestaurantId, SelectedBranchPriceist],
        () => fetchMenu(selectedRestaurantId, SelectedBranchPriceist)
      );
    }
  }, [selectedRestaurantId, SelectedBranchPriceist]);

  const handleRestaurantChange = (selectedOption) => {
    setSelectedRestaurantId(selectedOption.value);
    refetchBranches();
  };

  const handleSelectChangeBranches = (selectedOption) => {
    setSelectedBranchId(selectedOption?.value);
    setSelectedBranchPriceList(selectedOption?.priceList);
    // refetchMenu();
  };

  // if (process.env.NODE_ENV === "development") {
  //   console.log("SelectedBranchId", SelectedBranchId);
  //   console.log("SelectedBranchPriceist", SelectedBranchPriceist);
  // }
  const branchOptions = branches?.map((branch) => ({
    value: branch.id,
    label: branch.name_en,
    priceList: branch.price_list,
  }));
  const [areaIdSelect, setAreaIdSelect] = useState(null);
  const areasOptions = areas?.map((area) => ({
    value: area?.id,
    label: area?.area_name_en,
  }));
  // console.log("areaIdSelect", areaIdSelect);
  const handleChangeArea = (selectValue) => {
    setAreaIdSelect(selectValue.value);
    // console.log("selected area", selectedArea);
  };
  useEffect(() => {
    if (selectedUser) {
      setValueEdit("username", selectedUser.user_name);
      setValueEdit("phone", selectedUser.phone);
      setValueEdit("phone2", selectedUser.phone2 || "");
      setValueEdit("email", selectedUser.email || "");
    }
  }, [selectedUser, selectedAddress, setValueEdit]);
  useEffect(() => {
    if (selectedEditAddress) {
      const selectedAreaOption = areasOptions?.find(
        (option) => option.value === selectedEditAddress.area
      );

      setValueEditAddressUser("area", selectedAreaOption);
      setValueEditAddressUser("name", selectedEditAddress.address_name);
      setValueEditAddressUser("street", selectedEditAddress.street);
      setValueEditAddressUser("building", selectedEditAddress.building || "");
      setValueEditAddressUser("floor", selectedEditAddress.floor || "");
      setValueEditAddressUser("apt", selectedEditAddress.apt || "");
      setValueEditAddressUser(
        "additionalInfo",
        selectedEditAddress.additionalInfo || ""
      );
    }
  }, [selectedEditAddress, setValueEditAddressUser]);

  const [lodaingEditUserData, setLodaingEditUserData] = useState(false);
  const onSubmitEditUserData = async (data) => {
    const formattedData = Object.entries({
      username: data.username,
      email: data.email,
      phone: data.phone,
      phone2: data.phone2,
      userId: selectedUser?.id,
    }).reduce((acc, [key, value]) => {
      if (value) acc[key] = value;
      return acc;
    }, {});

    // console.log("Formatted Data to Send:", formattedData);

    try {
      const response = await updateUserData(formattedData);
      // console.log("response onsubmit", response);
      if (response?.response) {
        toast.success(response.message);
        queryClient.setQueryData(["userSearch", phone], (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            user_name: data.username || oldData.user_name,
            email: data.email || oldData.email,
            phone: data.phone || oldData.phone,
            phone2: data.phone2 || oldData.phone2,
          };
        });
        setOpenEditDialog(false);
      } else {
        toast.error("something error");
      }
    } catch {
      console.error("Error updating user data:", error);
    }
  };

  const [loading, setLoading] = useState(false);
  const [selectedAddressType, setSelectedAddressType] = useState("home");

  const handleAddressTypeChange = (type) => {
    setSelectedAddressType(type);
    if (type !== "other") {
      setValueAddNewUser("name", type); // تعيين القيمة تلقائيًا
      trigger("name");
    } else {
      setValueAddNewUser("name", ""); // إعادة تعيين إذا كان "Other"
    }
  };
  const onSubmitAddUserData = async (data) => {
    console.log("data", data);
    setLoading(true);
    // try {
    //   const userId = await createUser(data.username, data.phone);

    //   // if (!userId) throw new Error("User ID not received");
    //   console.log("userId from onSubmitAddUserData ", userId);
    //   await createAddress(
    //     userId,
    //     data.area.value,
    //     data.street,
    //     data.building,
    //     data.floor,
    //     data.apt,
    //     data.additionalInfo,
    //     data.name
    //   );

    //   toast.success("user added");
    // } catch (error) {
    //   const errorMessage = error.message || "Unexpected error";
    //   console.error(error);
    //   // toast.error(errorMessage);
    // } finally {
    //   setLoading(false);
    // }
  };
  const onSubmitAddAddress = async (data) => {
    console.log("data", data);
    setLoading(true);
    const userId = selectedUser?.id;
    try {
      // if (!userId) throw new Error("User ID not received");
      console.log("userId from onSubmitAddUserData ", userId);
      await createAddress(
        userId,
        data.area.value,
        data.street,
        data.building,
        data.floor,
        data.apt,
        data.additionalInfo,
        data.name
      );

      toast.success("address added successfully");
      setIsNewAddressDialogOpen(false);
    } catch (error) {
      const errorMessage = error.message || "Unexpected error";
      console.error(error);
      // toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitEditUserAddress = async (data) => {
    if (!selectedEditAddress?.id) {
      toast.error("No address selected for editing.");
      return;
    }

    if (!data?.area?.value) {
      toast.error("Area is required.");
      return;
    }

    const formattedData = {
      id: selectedEditAddress.id, // تأكيد إرسال ID صحيح
      area: data.area.value,
      street: data.street || "", // تأكيد إرسال قيمة فارغة بدل `undefined`
      building: data.building || "",
      floor: data.floor || "",
      apt: data.apt || "",
      additional_info: data.additionalInfo || "",
      address_name: data.name || "",
    };

    console.log("Formatted Data to Send:", formattedData); // تحقق من البيانات

    try {
      const response = await updateUserAddress(formattedData);

      if (response) {
        toast.success("Address updated successfully");

        queryClient.setQueryData(["userAddresses"], (oldData) => {
          if (!oldData) return oldData;
          return oldData.map((address) =>
            address.id === selectedEditAddress.id
              ? { ...address, ...formattedData }
              : address
          );
        });

        setOpenEditAddressDialog(false);
      } else {
        toast.error("Something went wrong");
      }

      console.log("Response onSubmit:", response);
    } catch (error) {
      console.error("Error updating user address:", error);
      toast.error("Failed to update address. Please try again.");
    }
  };

  const handleEditAddress = (address) => {
    setSelectedEditAddress(address);
    setOpenEditAddressDialog(true);
  };

  const handleDeleteAddress = async (id) => {
    // console.log("id remove", id);
    try {
      const response = await deleteAddress(id);

      console.log("Response onSubmit delete:", response);
    } catch (error) {
      console.error("Error updating user address:", error);
      toast.error("Failed to update address. Please try again.");
    }
    const updatedAddresses = selectedAddressArray.filter(
      (addr) => addr.id !== id
    );
    setSelectedAddressArray(updatedAddresses);

    if (selectedAddress?.id === id) {
      setSelectedAddress(
        updatedAddresses.length > 0 ? updatedAddresses[0] : null
      );
    }
  };

  if (isLoadingBranchs) return <p>Loading branches...</p>;
  if (errorBranchs) return <p>Error loading branches: {error.message}</p>;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-2 ml-4">
        <Label className="lg:min-w-[160px]">Restaurant:</Label>
        <Select
          placeholder="Select Restaurant"
          className="react-select w-[30%]"
          classNamePrefix="select"
          options={restaurantsSelect}
          value={restaurantsSelect.find(
            (option) => option.value === selectedRestaurantId
          )}
          onChange={handleRestaurantChange}
          styles={selectStyles(theme, color)}
        />
      </div>

      {/* الكارتات */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* الكارت الكبير (على الشمال) */}

        <div className="lg:col-span-2 p-4 shadow-md rounded-lg">
          {/*  مربع البحث */}
          <div className="space-y-4">
            {/*  مربع البحث */}
            <Card className="p-4 shadow-md rounded-lg">
              <div className="relative min-w-[240px] mb-2">
                <span className="absolute top-1/2 -translate-y-1/2 left-2">
                  <Search className="w-4 h-4 text-gray-500" />
                </span>

                <Input
                  type="text"
                  placeholder="Search"
                  className="pl-7 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} // لا تغير القسم عند البحث
                />
              </div>

              {/*  التابات */}
              <div className="flex gap-4 flex-wrap border-b pb-2 mt-3">
                {filteredSections.map((section) => (
                  <button
                    key={section.id}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300
        ${
          activeSection === section.id
            ? "bg-black text-white"
            : "bg-gray-200 text-gray-600"
        }
      `}
                    onClick={() => setActiveSection(section.id)}
                  >
                    {section.name_en}
                  </button>
                ))}
              </div>

              {/*  عرض العناصر مع التعديلات */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {displayedItems.map((item) => (
                  <Card
                    onClick={() => handleItemClick(item)}
                    key={item.id}
                    className="p-0 shadow-md rounded-lg overflow-hidden mt-7 text-white cursor-pointer"
                  >
                    <div className="w-full h-40">
                      <img
                        src={item?.image}
                        alt={item?.name_en}
                        width={150}
                        height={150}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex justify-between items-center gap-3 p-3">
                      <h3 className="text-sm text-muted-foreground mt-2">
                        {item.name}
                      </h3>
                      <p className="text-gray-300 text-sm">
                        {item?.price?.toFixed(2)} EGP
                      </p>
                    </div>
                  </Card>
                ))}

                {isItemDialogOpen && (
                  <Dialog
                    open={isItemDialogOpen}
                    onOpenChange={setIsItemDialogOpen}
                  >
                    <DialogContent size="3xl">
                      <DialogHeader>
                        <DialogTitle className="text-base font-medium text-default-700">
                          Add Item Choices
                        </DialogTitle>
                      </DialogHeader>
                      <div className="text-sm flex justify-between items-center text-default-500 space-y-4">
                        <div className="items-center">
                          <h3 className="font-medium">{selectedItem?.name}</h3>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <p className="text-sm mr-5">
                            {(selectedItem?.price * counter).toFixed(2)} Egp
                          </p>
                          <Button onClick={handleDecrease} className="text-lg">
                            -
                          </Button>
                          <span className="text-xl mx-4">{counter}</span>
                          <Button onClick={handleIncrease} className="text-lg">
                            +
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4">
                        {/* <h3 className="font-medium text-lg">
                          Select Size ({selectedItem?.availability})
                        </h3> */}
                        <div className="flex flex-c gap-5">
                          {selectedItem?.info?.map((size, index) => (
                            <label
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="radio"
                                name="size"
                                value={size?.size_en}
                                checked={
                                  selectedItem?.selectedInfo === size?.size_en
                                }
                                onChange={() =>
                                  setSelectedItem((prev) => {
                                    const newItemExtras =
                                      size?.item_extras || []; // الإضافات الخاصة بالحجم
                                    const newExtrasData =
                                      size?.item_extras?.[0]?.data || []; // البيانات الخاصة بالإضافات

                                    return {
                                      ...prev,
                                      selectedInfo: size?.size_en,
                                      itemExtras: newItemExtras, // تحديث الإضافات الخاصة بالحجم
                                      extrasData: newExtrasData, // تحديث الاختيارات الخاصة بالحجم الجديد
                                      selectedItemExtras: [], // مسح اختيارات الإضافات الخاصة بالحجم
                                      price: size?.price?.price,
                                    };
                                  })
                                }
                              />
                              <span>
                                {size?.size_en} ({selectedItem?.availability})
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      {/* {selectedItem?.itemExtras?.length > 0 && (
  <div className="mt-3 p-3 bg--200 rounded-md">
    <p className="font-semibold text-gray-800">الإضافات:</p>
    <div className="flex flex-wrap gap-2 mt-2">
      {selectedItem.itemExtras.map((extra, index) => (
        <label
          key={index}
          className="flex items-center space-x-2 bg- p-2 rounded-md shadow"
        >
          <input
            type="checkbox"
            value={extra.id}
            checked={selectedItem.selectedExtras.some(
              (ex) => ex.id === extra.id
            )}
            onChange={(e) => {
              const checked = e.target.checked;
              setSelectedItem((prev) => {
                let updatedExtras = checked
                  ? [...prev.selectedExtras, extra] // إضافة الاختيار
                  : prev.selectedExtras.filter((ex) => ex.id !== extra.id); // إزالة الاختيار

                return {
                  ...prev,
                  selectedExtras: updatedExtras,
                };
              });
            }}
          />
          <span>{extra.name_ar} - {extra.name_en}</span>
        </label>
      ))}
    </div>
  </div>
)} */}

                      {/* {selectedItem?.itemExtras && (
                        <div className="mt-4">
                          <h3 className="font-medium text-lg">
                            {selectedItem?.itemExtras.category_ar}
                          </h3>
                          <div className="flex flex- gap-3">
                            {selectedItem?.itemExtras.data.map(
                              (extra, index) => (
                                <label
                                  key={index}
                                  className="flex items-center space-x-2"
                                >
                                  <input
                                    type="checkbox"
                                    value={extra.name_en}
                                    onChange={(e) => {
                                      const checked = e.target.checked;
                                      setSelectedItem((prev) => {
                                        const updatedExtras = checked
                                          ? [...prev.selectedExtras, extra]
                                          : prev.selectedExtras.filter(
                                              (ex) => ex.id !== extra.id
                                            );
                                        return {
                                          ...prev,
                                          selectedExtras: updatedExtras,
                                        };
                                      });
                                    }}
                                  />
                                  <span>
                                    {extra.name_en} 
                                  </span>
                                </label>
                              )
                            )}
                          </div>
                        </div>
                      )} */}
                      {/* اختيار الحجم */}
                      {/* <div className="mt-3">
                        {selectedItem?.info?.map((size, index) => (
                          <label
                            key={index}
                            className="flex items-center space-x-2 cursor-pointer p-2 border border-gray-400 dark:border-gray-600 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                          >
                            <input
                              type="radio"
                              name="size"
                              value={size?.size_en}
                              checked={
                                selectedItem?.selectedInfo === size?.size_en
                              }
                              onChange={() =>
                                setSelectedItem((prev) => ({
                                  ...prev,
                                  selectedInfo: size?.size_en,
                                  itemExtras: size?.item_extras || [], // تحديث الإضافات الخاصة بالحجم فقط
                                  extrasData: size?.item_extras?.data || [],
                                  price: size?.price?.price,
                                }))
                              }
                            />
                            <span className="text-gray-900 dark:text-gray-100">
                              {size?.size_en} (
                              {size?.availability?.availability})
                            </span>
                          </label>
                        ))}
                      </div> */}

                      <div className="border rounded-lg overflow-hidden shadow-md">
                        <div
                          className="p-3 bg-gray- cursor-pointer flex justify-between items-center"
                          onClick={toggleExtras}
                        >
                          <h3 className="font-bold text-xl">
                            {selectedItem?.itemExtras?.category_ar} (Choose up
                            to {selectedItem?.extrasData?.length} Items)
                          </h3>
                          <span className="text-gray-600">
                            {isOpen ? "▲" : "▼"}
                          </span>
                        </div>

                        {/* العناصر المختارة */}
                        {selectedItem?.selectedExtras?.length > 0 && (
                          <div className="p-3 bg-gray- border-t">
                            <span className="text-gray-700 font-medium">
                              {selectedItem.selectedExtras
                                .map((extra) => extra.name_en)
                                .join(", ")}
                            </span>
                          </div>
                        )}

                        {/* الاختيارات */}
                        <div
                          className={`transition-all duration-300 ease-in-out overflow-hidden ${
                            isOpen ? "max-h-96" : "max-h-0"
                          }`}
                        >
                          <div className="p-3 flex flex- flex-wrap gap-2">
                            {selectedItem?.extrasData?.map((extra, index) => (
                              <label
                                key={index}
                                className="flex items-center space-x-2"
                              >
                                <input
                                  type="radio"
                                  value={extra.name_en}
                           
                                  checked={
                                    selectedItem.selectedExtras.length > 0 &&
                                    selectedItem.selectedExtras[0].id ===
                                      extra.id
                                  }
                                  onChange={() => {
                                    setSelectedItem((prev) => ({
                                      ...prev,
                                      selectedExtras: [extra], // السماح باختيار واحد فقط
                                      selectedExtrasIds: [extra.id], // تحديث قائمة الـ IDs
                                    }));
                                    setIsOpen(false); // إغلاق القائمة بعد الاختيار
                                  }}
                                />
                                <span>{extra.name_en}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg overflow-hidden shadow-md">
                        <div
                          className="p-3 bg-gray- cursor-pointer flex justify-between items-center"
                          onClick={toggleExtrasMainExtra}
                        >
                          <h3 className="font-bold text-xl">
                            {selectedItem?.mainExtras?.category_ar} (Choose up
                            to {selectedItem?.mainExtras?.length} Items)
                          </h3>
                          <span className="text-gray-600">
                            {isOpenMainExtra ? "▲" : "▼"}
                          </span>
                        </div>

                        {/* العناصر المختارة */}
                        {selectedItem?.selectedMainExtras?.length > 0 && (
                          <div className="p-3 bg-gray- border-t">
                            <span className="text-gray-300 font-medium">
                              {selectedItem.selectedMainExtras
                                .map((extra) => extra.name_en)
                                .join(", ")}
                            </span>
                          </div>
                        )}

                        {/* الاختيارات */}
                        <div
                          className={`transition-all duration-300 ease-in-out overflow-hidden ${
                            isOpenMainExtra ? "max-h-96" : "max-h-0"
                          }`}
                        >
                          <div className="p-3 flex flex- flex-wrap gap-2">
                            {selectedItem?.mainExtras?.map((extra, index) => (
                              <label
                                key={index}
                                className="flex items-center space-x-2"
                              >
                                <input
                                  type="checkbox"
                                  value={extra.name_en}
                                  checked={selectedItem.selectedMainExtras.some(
                                    (ex) => ex.id === extra.id
                                  )}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    setSelectedItem((prev) => {
                                      let updatedExtras = checked
                                        ? [...prev.selectedMainExtras, extra]
                                        : prev.selectedMainExtras.filter(
                                            (ex) => ex.id !== extra.id
                                          );

                                      let updatedExtrasIds = updatedExtras.map(
                                        (ex) => ex.id
                                      ); // تخزين الـ ID فقط

                                      return {
                                        ...prev,
                                        selectedMainExtras: updatedExtras,
                                        selectedMainExtrasIds: updatedExtrasIds, // تحديث قائمة الـ IDs
                                      };
                                    });
                                  }}
                                />
                                <span>{extra.name_en}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      <DialogFooter className="mt-8">
                        <DialogClose asChild>
                          {/* <Button
                            variant="outline"
                            onClick={() => setIsItemDialogOpen(false)}
                          >
                            Close
                          </Button> */}
                        </DialogClose>
                        <Button type="submit" onClick={handleAddToCart}>
                          Add to Cart
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
                <>
                  {isNewUserDialogOpen && (
                    <Dialog
                      open={isNewUserDialogOpen}
                      onOpenChange={setIsNewUserDialogOpen}
                    >
                      <DialogContent size="3xl">
                        <DialogHeader>
                          <DialogTitle className="text-base font-medium text-default-700">
                            Create New User
                          </DialogTitle>
                        </DialogHeader>
                        <div className="text-sm text-default-500 space-y-4">
                          <form
                            onSubmit={handleSubmitAddNewUser(
                              onSubmitAddUserData
                            )}
                          >
                            <div className="flex gap-2 items-start">
                              {/* Username Input */}
                              <div className="flex-1 flex flex-col">
                                <Input
                                  type="text"
                                  placeholder="Username"
                                  {...registerAddNewUser("username")}
                                  className="w-full"
                                />
                                {errorsAddNewUser.username && (
                                  <p className="text-red-500 text-sm h-[20px] mt-2">
                                    {errorsAddNewUser.username.message}
                                  </p>
                                )}
                              </div>

                              {/* Phone Input */}
                              <div className="flex-1 flex flex-col">
                                <Input
                                  type="number"
                                  placeholder="Phone"
                                  {...registerAddNewUser("phone")}
                                  className="w-full"
                                />
                                {errorsAddNewUser.phone && (
                                  <p className="text-red-500 text-sm h-[20px] mt-2">
                                    {errorsAddNewUser.phone.message}
                                  </p>
                                )}
                              </div>
                            </div>

                            <Controller
                              name="area"
                              control={control}
                              rules={{ required: "Area is required" }}
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  options={areasOptions || []}
                                  placeholder="Area"
                                  className="react-select w-full my-3"
                                  classNamePrefix="select"
                                  // onChange={handleChangeArea}
                                  onChange={(selectedOption) => {
                                    field.onChange(selectedOption);
                                    handleChangeArea(selectedOption);
                                  }}
                                  styles={selectStyles(theme, color)}
                                />
                              )}
                            />
                            {errorsAddNewUser.area && (
                              <p className="text-red-500 text-sm">
                                {errorsAddNewUser.area.message}
                              </p>
                            )}
                            <div className="flex gap-2 items-center my-3">
                              {/* Street Input */}
                              <div className="flex-1">
                                <Input
                                  type="text"
                                  placeholder="Street"
                                  {...registerAddNewUser("street")}
                                  className="w-full"
                                />
                                <p
                                  className={`text-red-500 text-sm mt-1 transition-all duration-200 ${
                                    errorsAddNewUser.street
                                      ? "h-auto opacity-100"
                                      : "h-0 opacity-0"
                                  }`}
                                >
                                  {errorsAddNewUser.street?.message}
                                </p>
                              </div>

                              {/* Building Input */}
                              <div className="flex-1">
                                <Input
                                  type="text"
                                  placeholder="Building"
                                  {...registerAddNewUser("building")}
                                  className="w-full"
                                />
                                {errorsAddNewUser.street && (
                                  <div className="h-[20px]"></div>
                                )}
                              </div>
                            </div>

                            <div className="flex gap-2 items- my-3">
                              <Input
                                type="text"
                                placeholder="Floor"
                                {...registerAddNewUser("floor")}
                                // className="mb-4"
                                // className={`${
                                //   errorsAddNewUser.floor ? "mb-1" : "mb-4"
                                // }`}
                              />

                              <Input
                                type="text"
                                placeholder="Apt"
                                {...registerAddNewUser("apt")}
                                className="mb-1"
                              />
                            </div>
                            <Input
                              type="text"
                              placeholder="Land mark"
                              {...registerAddNewUser("additionalInfo")}
                              className="mb-4"
                            />
                            {/* <Input
                              type="text"
                              placeholder="Address name"
                              {...registerAddNewUser("name")}
                              // className="mb-4"
                              className={`${
                                errorsAddNewUser.name ? "mb-1" : "mb-4"
                              }`}
                            />
                            {errorsAddNewUser.name && (
                              <p className="text-red-500 text-sm">
                                {errorsAddNewUser.name.message}
                              </p>
                            )} */}
                            <div className="space-y-1">
                              {/* Checkboxes */}
                              <div className="flex gap-4 items-center">
                                {["home", "work", "other"].map((type) => (
                                  <label
                                    key={type}
                                    className="flex items-center gap-2"
                                  >
                                    <Input
                                      type="checkbox"
                                      name="addressType"
                                      value={type}
                                      checked={selectedAddressType === type}
                                      onChange={() =>
                                        handleAddressTypeChange(type)
                                      }
                                    />
                                    {type.charAt(0).toUpperCase() +
                                      type.slice(1)}{" "}
                                  </label>
                                ))}
                              </div>

                              {selectedAddressType === "other" && (
                                <Input
                                  type="text"
                                  placeholder="Enter address name"
                                  {...registerAddNewUser("name")}
                                  className={`${
                                    errorsAddNewUser.name ? "mb-1" : "mb-"
                                  }`}
                                />
                              )}

                              {errorsAddNewUser.name && (
                                <p className="text-red-500 text-sm">
                                  {errorsAddNewUser.name.message}
                                </p>
                              )}
                            </div>
                            <DialogFooter className="mt-8">
                              <DialogClose asChild>
                                <Button
                                  variant="outline"
                                  onClick={() => setIsNewUserDialogOpen(false)}
                                >
                                  Close
                                </Button>
                              </DialogClose>
                              <Button type="submit">Create User</Button>
                            </DialogFooter>
                          </form>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                  {isNewAddressDialogOpen && (
                    <Dialog
                      open={isNewAddressDialogOpen}
                      onOpenChange={setIsNewAddressDialogOpen}
                    >
                      <DialogContent size="3xl">
                        <DialogHeader>
                          <DialogTitle className="text-base font-medium text-default-700">
                            Create New Address
                          </DialogTitle>
                        </DialogHeader>
                        <div className="text-sm text-default-500 space-y-4">
                          <form
                            onSubmit={handleSubmitAddNewAddress(
                              onSubmitAddAddress
                            )}
                          >
                            <Controller
                              name="area"
                              control={controlAddress}
                              rules={{ required: "Area is required" }}
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  options={areasOptions || []}
                                  placeholder="Area"
                                  className="react-select w-full my-3"
                                  classNamePrefix="select"
                                  // onChange={handleChangeArea}
                                  onChange={(selectedOption) => {
                                    field.onChange(selectedOption);
                                    handleChangeArea(selectedOption); // تشغيل دالة التحديث الخاصة بك
                                  }}
                                  styles={selectStyles(theme, color)}
                                />
                              )}
                            />
                            {errorsAddNewAddress.area && (
                              <p className="text-red-500 text-sm">
                                {errorsAddNewAddress.area.message}
                              </p>
                            )}
                            <div className="flex gap-2 items- my-3">
                              <div>
                                <Input
                                  type="text"
                                  placeholder="Street"
                                  {...registerAddNewAddress("street")}
                                  className={`${
                                    registerAddNewAddress.street
                                      ? "mb-1"
                                      : "mb-4"
                                  }`}
                                />
                                {errorsAddNewAddress.street && (
                                  <p className="text-red-500 text-sm">
                                    {errorsAddNewAddress.street.message}
                                  </p>
                                )}
                              </div>

                              <Input
                                type="text"
                                placeholder="Building"
                                {...registerAddNewAddress("building")}
                              />
                            </div>
                            <div className="flex gap-2 items- my-3">
                              <Input
                                type="text"
                                placeholder="Floor"
                                {...registerAddNewAddress("floor")}
                                // className="mb-4"
                                // className={`${
                                //   registerAddNewAddress.floor ? "mb-1" : "mb-4"
                                // }`}
                              />

                              <Input
                                type="text"
                                placeholder="Apt"
                                {...registerAddNewAddress("apt")}
                                className="mb-4"
                              />
                            </div>
                            <Input
                              type="text"
                              placeholder="Land mark"
                              {...registerAddNewAddress("additionalInfo")}
                              className="mb-4"
                            />
                            <Input
                              type="text"
                              placeholder="Address name"
                              {...registerAddNewAddress("name")}
                              // className="mb-4"
                              className={`${
                                errorsAddNewAddress.name ? "mb-1" : "mb-4"
                              }`}
                            />
                            {errorsAddNewAddress.name && (
                              <p className="text-red-500 text-sm">
                                {errorsAddNewAddress.name.message}
                              </p>
                            )}
                            <DialogFooter className="mt-8">
                              <DialogClose asChild>
                                <Button
                                  variant="outline"
                                  onClick={() => setIsNewUserDialogOpen(false)}
                                >
                                  Close
                                </Button>
                              </DialogClose>
                              <Button type="submit">Add address</Button>
                            </DialogFooter>
                          </form>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </>
              </div>
            </Card>
          </div>
        </div>

        <Card className="p-4 shadow-md rounded-lg">
          <div className="flex gap-1 items-center justify-between mb-3">
            <div className="relative flex-grow">
              <span className="absolute top-1/2 left-2 -translate-y-1/2">
                <Search className="w-4 h-4 text-gray-500" />
              </span>

              <Input
                type="text"
                placeholder="Enter phone number"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyPress}
                className="pl-7 pr-8 w-full"
              />
              {search && (
                <button
                  onClick={handleClear}
                  className="absolute top-1/2 right-2 -translate-y-1/2 text-red-500 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSearch}>Search</Button>
              <Button onClick={handleNewUserClick}>New user</Button>
            </div>
          </div>

          {selectedUser && (
            <div className="mt-4 p-4 border rounded-md">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {selectedUser.user_name}
                </h3>
                <Button className="my3" onClick={() => setOpenEditDialog(true)}>
                  Edit user data
                </Button>
              </div>
              <p>Phone: {selectedUser.phone}</p>
              <p>Orders Count: {selectedUser.orders_count}</p>
              <p>Points: {selectedUser.user.points}</p>

              {openEditDialog && selectedUser && (
                <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
                  <DialogContent size="3xl">
                    <DialogHeader>
                      <DialogTitle>Edit User</DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={handleSubmitEdit(onSubmitEditUserData)}
                      className="space-y-1"
                    >
                      <Input
                        type="text"
                        placeholder="Username"
                        {...registerEdit("username")}
                        className={` ${errorsEdit.username ? "mb-1" : "mb-4"}`}
                      />
                      {errorsEdit.username && (
                        <p className="text-red-500 text-sm my-1">
                          {errorsEdit.username.message}
                        </p>
                      )}

                      <Input
                        type="number"
                        placeholder="Phone"
                        {...registerEdit("phone")}
                        className={`${errorsEdit.phone ? "mb-1" : "mb-4"}`}
                      />
                      {errorsEdit.phone && (
                        <p className="text-red-500 text-sm  ">
                          {errorsEdit.phone.message}
                        </p>
                      )}

                      <Input
                        type="number"
                        placeholder="Phone 2"
                        {...registerEdit("phone2", { required: false })}
                        className={` ${errorsEdit.phone2 ? "mb-1" : "mb-4"}`}
                      />
                      {errorsEdit.phone2 && (
                        <p className="text-red-500 text-sm mt-1">
                          {errorsEdit.phone2.message}
                        </p>
                      )}
                      <Input
                        type="text"
                        placeholder="Email"
                        {...registerEdit("email", { required: false })}
                        className={` ${errorsEdit.email ? "mb-1" : "mb-4"}`}
                      />
                      {errorsEdit.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errorsEdit.email.message}
                        </p>
                      )}
                      <div className="mt-3">
                        <DialogFooter className="flex justify-between items-center mt-4">
                          <DialogClose asChild>
                            <Button
                              variant="outline"
                              onClick={() => setOpenEditDialog(false)}
                            >
                              Close
                            </Button>
                          </DialogClose>
                          <Button type="submit">Save Changes</Button>
                        </DialogFooter>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
              {openEditAddressDialog && selectedEditAddress && (
                <Dialog
                  open={openEditAddressDialog}
                  onOpenChange={setOpenEditAddressDialog}
                >
                  <DialogContent size="3xl">
                    <DialogHeader>
                      <DialogTitle>Edit user address</DialogTitle>
                    </DialogHeader>

                    {/* <form
                      onSubmit={handleEditAddressUser(onSubmitEditUserAddress)}
                    >
                      <Controller
                        name="area"
                        control={controlEditAddress}
                        rules={{ required: "Area is required" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={areasOptions || []}
                            placeholder="Area"
                            className="react-select w-full my-3"
                            classNamePrefix="select"
                            value={
                              areasOptions?.find(
                                (option) => option.value === field.value?.value
                              ) || null
                            } // 👈 هنا الحل!
                            onChange={(selectedOption) => {
                              field.onChange(selectedOption);
                              handleChangeArea(selectedOption);
                            }}
                            styles={selectStyles(theme, color)}
                          />
                        )}
                      />

                      {errorsEditAddressUser.area && (
                        <p className="text-red-500 text-sm">
                          {errorsEditAddressUser.area.message}
                        </p>
                      )}

                      <Input
                        type="text"
                        {...registerEditAddressUser("street")}
                        placeholder="Street"
                      />

                      <Input
                        type="text"
                        {...registerEditAddressUser("building")}
                        placeholder="Building"
                      />
                       
                      <Input
                        type="text"
                        {...registerEditAddressUser("floor")}
                        placeholder="Floor"
                      />
                      <Input
                        type="text"
                        {...registerEditAddressUser("apt")}
                        placeholder="Apt"
                      />
                      <Input
                        type="text"
                        {...registerEditAddressUser("additionalInfo")}
                        placeholder="Additional Info"
                      />
                      <Input
                        type="text"
                        {...registerEditAddressUser("name")}
                        placeholder="Address Name"
                      />
                      {errorsEditAddressUser.name && (
                        <p className="text-red-500 text-sm">
                          {errorsEditAddressUser.name.message}
                        </p>
                      )}
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button
                            variant="outline"
                            onClick={() => setOpenEditAddressDialog(false)}
                          >
                            Close
                          </Button>
                        </DialogClose>
                        <Button type="submit">Save Changes</Button>
                      </DialogFooter>
                    </form> */}
                    <form
                      onSubmit={handleEditAddressUser(onSubmitEditUserAddress)}
                      className="space-y-4" // يضيف مسافات بين العناصر
                    >
                      {/* Select Field */}
                      <Controller
                        name="area"
                        control={controlEditAddress}
                        rules={{ required: "Area is required" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={areasOptions || []}
                            placeholder="Area"
                            className="react-select w-full"
                            classNamePrefix="select"
                            value={
                              areasOptions?.find(
                                (option) => option.value === field.value?.value
                              ) || null
                            }
                            onChange={(selectedOption) => {
                              field.onChange(selectedOption);
                              handleChangeArea(selectedOption);
                            }}
                            styles={selectStyles(theme, color)}
                          />
                        )}
                      />
                      {errorsEditAddressUser.area && (
                        <p className="text-red-500 text-sm">
                          {errorsEditAddressUser.area.message}
                        </p>
                      )}

                      {/* Input Fields */}

                      <div className="flex gap-2 items-center my-3">
                        <Input
                          type="text"
                          {...registerEditAddressUser("street")}
                          placeholder="Street"
                          className="w-full"
                        />

                        <Input
                          type="text"
                          {...registerEditAddressUser("building")}
                          placeholder="Building"
                          className="w-full"
                        />
                      </div>
                      <div className="flex gap-2 items-center my-3">
                        <Input
                          type="text"
                          {...registerEditAddressUser("floor")}
                          placeholder="Floor"
                          className="w-full"
                        />

                        <Input
                          type="text"
                          {...registerEditAddressUser("apt")}
                          placeholder="Apt"
                          className="w-full"
                        />
                      </div>

                      <Input
                        type="text"
                        {...registerEditAddressUser("additionalInfo")}
                        placeholder="Land mark"
                        className="w-full"
                      />

                      <Input
                        type="text"
                        {...registerEditAddressUser("name")}
                        placeholder="Address Name"
                        className="w-full"
                      />
                      {errorsEditAddressUser.name && (
                        <p className="text-red-500 text-sm">
                          {errorsEditAddressUser.name.message}
                        </p>
                      )}

                      {/* Buttons */}
                      <DialogFooter className="flex justify-end gap-4">
                        <DialogClose asChild>
                          <Button
                            variant="outline"
                            onClick={() => setOpenEditAddressDialog(false)}
                          >
                            Close
                          </Button>
                        </DialogClose>
                        <Button type="submit">Save Changes</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          )}
          {selectedUser && (
            <div className="mt-4 p-4 border rounded-md">
              <div className="flex item-center justify-between gap-4 mb-4 ">
                <div className="flex items-center gap-2">
                  <div className="flex item-center gap-1">
                    <input
                      type="checkbox"
                      id="delivery"
                      checked={deliveryMethod === "delivery"}
                      onChange={() => setDeliveryMethod("delivery")}
                    />
                    <label htmlFor="delivery">Delivery</label>
                  </div>
                  <div className="flex item-center gap-1 ">
                    <input
                      type="checkbox"
                      id="pickup"
                      checked={deliveryMethod === "pickup"}
                      onChange={() => setDeliveryMethod("pickup")}
                    />
                    <label htmlFor="pickup">Pickup</label>
                  </div>
                </div>

                <Button
                  className="my3"
                  onClick={() => setIsNewAddressDialogOpen(true)}
                >
                  Add address
                </Button>
              </div>
              {/* {deliveryMethod === "delivery" && (
                <div className="mt-3">
                  <h4 className="font-medium">Address:</h4>
                  {selectedUser?.address?.map((address, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={address.id}
                        checked={selectedAddress === address?.address1}
                        onChange={() => setSelectedAddress(address?.address1)}
                      />
                      <label htmlFor={address.address_name}>
                        {address.address_name}
                      </label>
                    </div>
                  ))}
                </div>
              )} */}
              {deliveryMethod === "delivery" && (
                <div className="my-3 ">
                  <h4 className="font-medium my-3 ">Address:</h4>
                  {selectedAddressArray.map((address) => (
                    <div
                      key={address.id}
                      className="flex items-center justify-between gap-2"
                    >
                      {/* ✅ Checkbox واسم العنوان على الشمال */}
                      <div className="flex items-center gap-2 mb-3">
                        <input
                          type="checkbox"
                          id={address.id}
                          checked={selectedAddress?.id === address.id}
                          onChange={() => setSelectedAddress(address)}
                        />
                        <label htmlFor={address.id}>
                          {address.address_name}
                        </label>
                      </div>

                      <div className="flex gap-3 ml-auto mb-3">
                        <button
                          size="icon"
                          onClick={() => handleEditAddress(address)}
                        >
                          <FiEdit className="mr-1 text-xs" />
                        </button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="flex items-center text-red-500 gap-[2px]">
                              <FiTrash2 className="text-xs" />
                            </button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete this address from your saved
                                addresses.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                type="button"
                                variant="outline"
                                color="info"
                              >
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive hover:bg-destructive/80"
                                onClick={() => handleDeleteAddress(address.id)}
                              >
                                Ok
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {deliveryMethod === "delivery" && selectedAddress && (
                <>
                  <div className="mt-3 p-3 ">
                    <p className="text-sm"> {selectedAddress?.address1}</p>
                  </div>
                </>
              )}

              {deliveryMethod === "pickup" && (
                <div className="flex flex-col lg:flex-row lg:items-center gap-2">
                  <Select
                    className="react-select w-full"
                    classNamePrefix="select"
                    options={branchOptions}
                    onChange={handleSelectChangeBranches}
                    placeholder="Branches"
                    styles={selectStyles(theme, color)}
                  />
                </div>
              )}
            </div>
          )}
          <Card title="Bordered Tables">
            {/* <Table className="border border-default-300">
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead
                      key={column.key}
                      className="border border-default-300 "
                    >
                      {column.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersTable.slice(0, 5).map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="border border-default-300">
                      {item.Items}
                    </TableCell>
                    <TableCell className="border border-default-300">
                      {item.Edit}
                    </TableCell>
                
                    <TableCell className="border border-default-300">
                      <div className="flex justify-center items-center">
                        <Button
                          size="icon"
                          variant="outline"
                          color="destructive"
                          className="h-6 w-6"
                        >
                          <Icon icon="heroicons:trash" className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="border border-default-300">
                      <div className="flex justify-between flex-col items-center">
                        <p className="text-sm mr-5">$10.99</p>
                        <div className="flex">
                          <Button
                            onClick={() => handleDecreaseTable(item.id)}
                            className="text-sm"
                          >
                            -
                          </Button>
                          <span className="text-xl mx-4">
                            {countersTable[item.id]}
                          </span>
                          <Button
                            onClick={() => handleIncreaseTable(item.id)}
                            className="text-sm"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="border border-default-300">
                      {item.UnitPrice}
                    </TableCell>
                    <TableCell className="border border-default-300">
                      {item.TotalPrice}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table> */}
            {cartItems.length > 0 && (
              <>
                <h3 className="text-2xl my-5">Products</h3>
                <Table className="border border-default-300">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cartItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>
                          <div className="flex">
                            <Button
                              onClick={() => handleDecreaseTable(item.id)}
                            >
                              -
                            </Button>
                            <span className="mx-4">{item.quantity}</span>
                            <Button
                              onClick={() => handleIncreaseTable(item.id)}
                            >
                              +
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>${item.price.toFixed(2)}</TableCell>
                        <TableCell>${item.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleRemoveItem(item.id)}
                            color="destructive"
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
          </Card>
          {/* <Card title="Bordered Tables">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Subtotal</TableCell>
                  <TableCell>4 items</TableCell>
                  <TableCell>455</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>VAT</TableCell>
                  <TableCell>14%</TableCell>
                  <TableCell>81.788</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Delivery</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>20</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Discount</TableCell>
                  <TableCell>0%</TableCell>
                  <TableCell>0</TableCell>
                </TableRow>
              </TableBody>
              <TableFooter className="bg-default-100 border-t border-default-300">
                <TableRow>
                  <TableCell
                    colSpan="2"
                    className="text-sm text-default-600 font-semibold"
                  >
                    Total
                  </TableCell>
                  <TableCell className="text-sm text-default-600 font-semibold text-right">
                    556.79
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </Card> */}
          <div className="flex justify-between items-center"></div>
        </Card>

        {/* <Test /> */}
      </div>
    </div>
  );
}

export default CreateOrder;
