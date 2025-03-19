"use client";
import React from "react";
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
import { selectStyles } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchRestaurantsList,
  fetchBranches,
  fetchMenu,
  fetchViewItem,
  fetchTax,
  fetchorderSource,
  fetchUserByPhone,
} from "./apICallCenter/ApisCallCenter";
import { toast } from "react-hot-toast";
import {
  updateUserData,
  fetchAreas,
  createUser,
  createAddress,
  updateUserAddress,
  deleteAddress,
  createOrder,
} from "./apICallCenter/apisUser";
import { BASE_URL_iamge } from "@/api/BaseUrl";
import { z } from "zod";
import { useForm, Controller, set } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { FaMinus, FaPlus } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { Admin } from "@/components/icons/index";
import { Textarea } from "@/components/ui/textarea";
import { useSidebar } from "@/store/index";
const editUserDataSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  phone: z.string().regex(/^\d{3,15}$/, "Invalid phone number"),
  phone2: z
    .string()
    .optional()
    .refine((val) => val === "" || /^\d{3,15}$/.test(val), {
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
  phone: z.string().regex(/^\d{3,15}$/, "Invalid phone number"),
  phone2: z.string().regex(/^\d{3,15}$/, "Invalid phone number"),
  area: z.object(
    { value: z.number(), label: z.string() },
    { required_error: "Area is required" }
  ),
  street: z.string().min(1, "Street is required"),
  name: z.string().optional(),

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
  name: z.string().optional(),

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
  name: z.string().optional(),
  building: z.string().min(1, "Building number is required").or(z.literal("")),
  // floor: z.string().optional(),
  // apt: z.string().optional(),
  // floor: z.string().default(""),  // ✅ الحل هنا
  // apt: z.string().default(""),
  building: z.string().min(1, "Building number is required").or(z.literal("")),
  floor: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => val || ""), // ✅ يقبل كل القيم
  apt: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => val || ""),
  additionalInfo: z.string().optional(),
});
const createOrderSchema = z.object({
  ordertype: z.number({ required_error: "Order type is required" }),
  ordersource: z.string().optional(),
  orderpayment: z.number().optional(),
  orderstatus: z.number({ required_error: "Order Status is required" }),
  branches: z.number().optional(),
  startDate: z.string().optional(),
  startTime: z.string().optional(),
  insertcoupon: z.string().optional(),
  insertpoints: z.number().optional(),
  discountValue: z.number().optional(),
  discountPercentage: z.number().optional(),
  notes: z.string().optional(),
});

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
    reset: resetAddNewUser,
    trigger,
    formState: { errors: errorsAddNewUser },
  } = useForm({ resolver: zodResolver(addUserSchema), mode: "onSubmit" });
  const {
    control: controlAddress,
    register: registerAddNewAddress,
    handleSubmit: handleSubmitAddNewAddress,
    setValue: setValueAddNewAddress,
    reset: resetAddNewAddress,
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
  // console.log("errorsEditAddressUser",errorsEditAddressUser)
  const {
    control: controlCreateOrder,
    register: registerCreateOrder,
    handleSubmit: handleCreateOrder,
    setValue: setValueCreateOrder,
    getValues: getValueCreateOrder,
    reset: resetCreateOrder,
    formState: { errors: errorsCreateOrder },
  } = useForm({
    resolver: zodResolver(createOrderSchema),
    mode: "onSubmit",
    defaultValues: {
      orderpayment: 1,
      ordersource: "",
    },
  });
  // console.log("errorsCreateOrder", errorsCreateOrder);

  const { theme } = useTheme();
  const setCollapsed = useSidebar((state) => state.setCollapsed);

  const queryClient = useQueryClient();
  const [color, setColor] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(1);
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [selectedBranchIdCreateOrder, setSelectedBranchIdCreateOrder] =
    useState(null);
  const [SelectedBranchPriceist, setSelectedBranchPriceList] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [token, setToken] = useState(null);
  // console.log("selectedRestaurantId",selectedRestaurantId);
  // console.log("area :", selectedAddress?.area);

  // apis
  // api restaurants select
  const {
    data: dataRestaurants,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["RestaurantsList"],
    // queryFn: fetchRestaurantsList(token),
    queryFn: () => fetchRestaurantsList(token),
    enabled: !!token,
  });
  const {
    data: branches,
    isLoadingBranchs,
    errorBranchs,
    refetch: refetchBranches,
  } = useQuery({
    queryKey: ["BranchesList", selectedRestaurantId, selectedAddress?.area],
    queryFn: () =>
      fetchBranches(selectedRestaurantId, selectedAddress?.area, token),
    enabled: !!selectedRestaurantId && !!selectedAddress?.area && !!token,
  });

  const {
    data: areas,
    isLoadingAreas,
    errorAreas,
  } = useQuery({
    queryKey: ["AreasList"],
    queryFn: fetchAreas,
  });

  const {
    data: orderSource,
    isLoadingorderSource,
    errororderSource,
  } = useQuery({
    queryKey: ["OrderSourceeList", selectedRestaurantId],
    queryFn: () => fetchorderSource(selectedRestaurantId, token),
    enabled: !!token,
  });
  const {
    data: Tax,
    isLoadingTax,
    errosTax,
  } = useQuery({
    queryKey: ["TaxList"],
    queryFn: fetchTax,
  });
  // console.log("Tax in basic", Tax);
  // console.log("orderType in basic", orderType);

  const {
    data: menu,
    isLoading: isLoadingMenu,
    error: errorMenu,
    refetch: refetchMenu,
  } = useQuery({
    queryKey: ["menuList", selectedRestaurantId, SelectedBranchPriceist],
    queryFn: () =>
      fetchMenu(selectedRestaurantId, SelectedBranchPriceist, token),
    enabled: !!selectedRestaurantId && !!SelectedBranchPriceist && !!token,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  // console.log("menu from create", menu);
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

  const {
    data: selectedUser,
    isLoadingUserDataForSerach,
    errorUserDataForSearch,
  } = useQuery({
    queryKey: ["userSearch", phone],
    queryFn: () => fetchUserByPhone(phone, token),
    enabled: !!phone,
    onSuccess: (data) => {
      if (data) {
        setAllUserData(data);
      }
    },
    onError: (error) => {
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
  const [createOrderDialogOpen, setCreateOrderDialogOpen] = useState(false);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [isOpenMainExtra, setIsOpenMainExtra] = useState(true);
  const [massegeNotSerachPhone, setMassegeNotSerachPhone] = useState(null);
  const [massegeNotSelectedBranch, setMassegeNotSelectedBranch] =
    useState(null);
  const [isBranchManuallySelected, setIsBranchManuallySelected] =
    useState(false);

  useEffect(() => {
    const tokenStorage =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const newToken = tokenStorage || Cookies.get("token");

    if (newToken) {
      setToken(newToken);
      // console.log("🔹 Token loaded:", newToken); // مراقبة وجود التوك
    } else {
      console.error("🔸 No token found, redirecting to login...");
      router.push("/login");
    }
  }, []);

  const handleItemClick = async (item) => {
    setSelectedItem(item);
    setIsItemDialogOpen(true);
    setIsOpen(!isOpen);
    setNote("");
    setCounter(1);
    setTotalExtrasPrice(0);
    if (!selectedUser) {
      setMassegeNotSerachPhone("Select user first");
      return;
    }

    //     const branchId = selectedBranchNew?.id || selectedBranchInSelected?.value;
    // console.log(" savedBranch?.value", savedBranch?.value)
    // console.log(" isBranchManuallySelected", isBranchManuallySelected)
    if (
      (deliveryMethod === "pickup" && !isBranchManuallySelected) ||
      savedBranch?.value === null
    ) {
      setMassegeNotSelectedBranch("Select branch first");
      return;
    }

    try {
      const response = await fetchViewItem(
        savedBranch?.value || selectedBranchInSelected.value,
        item.id,
        token
      );
      // console.log("response",response)

      if (response) {
        const firstInfo = response?.info?.[0] || null;

        setSelectedItem({
          id: response.id,
          name: response.name_en,
          description: response.description_en,
          image: response.image,
          price: firstInfo?.price?.price,
          availability: firstInfo?.availability?.availability,
          info: response?.info || [],
          selectedInfo: firstInfo?.size_en || "",
          selectedIdSize: firstInfo?.id || "",
          selectedMainExtras: [],
          selectedMainExtrasIds: [],
          mainExtras: response?.item_extras?.[0]?.data || [],
          itemExtras: firstInfo?.item_extras || [],
          extrasData: firstInfo?.item_extras[0]?.data || [],
          selectedExtras: [],
          selectedExtrasIds: [],
        });
      }
    } catch (error) {
      console.error("Error fetching item details:", error);
    }
  };

  // console.log("selectedItem ", selectedItem);
  // console.log("info", selectedItem?.info);
  // console.log("selectedIdSize", selectedItem?.selectedIdSize);
  // console.log("mainExtras", selectedItem?.mainExtras);
  // console.log("itemExtras", selectedItem?.itemExtras);
  // console.log("info", selectedItem?.info);
  // console.log("extrasData", selectedItem?.extrasData);
  // console.log("selectedExtras", selectedItem?.selectedExtras);
  // // console.log("selectedExtrasIds", selectedItem?.selectedExtrasIds);
  // console.log("selectedMainExtras", selectedItem?.selectedMainExtras);
  // console.log("selectedMainExtrasIds", selectedItem?.selectedMainExtrasIds);

  const handleEditItem = (item) => {
    setSelectedItem({
      ...item,
      selectedMainExtras: [...item.selectedMainExtras],
    });
    setNote(item.note || "");
    setCounter(item.quantity);
    setIsItemDialogOpen(true);
  };
  useEffect(() => {
    setCollapsed(true);
  }, []);
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
  const handleClearSearch = () => setSearchQuery("");

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

  // استخراج الأقسام التي تحتوي فقط على العناصر المفلترة
  // const filteredSections = sections.filter(
  //   (section) =>
  //     section.id === "all" || displayedItems.some((item) => item.section === section.id)
  // );

  const filteredSections = useMemo(() => {
    if (!searchQuery) {
      return sections; // إذا لم يكن هناك بحث، عرض كل الأقسام
    }

    return sections.filter(
      (section) =>
        section.id === "all" ||
        displayedItems.some((item) => item.section === section.id)
    );
  }, [searchQuery, displayedItems]);

  const [search, setSearch] = useState("");
  const [allUserData, setAllUserData] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [errorSearchUser, setErrorSearchUser] = useState(null);
  const [selectedAddressArray, setSelectedAddressArray] = useState([]);

  const [selectedBranchName, setSelectedBranchName] = useState("");
  const [selectedBranchInSelected, setSelectedBranchInSelected] =
    useState(null);
  // useEffect(() => {
  //   if (selectedUser?.address?.length > 0 && !selectedAddress) {
  //     setSelectedAddress(selectedUser.address[0]);
  //   }
  // }, [selectedUser]);
  // useEffect(() => {
  //   if (selectedUser?.address?.length > 0) {
  //     setSelectedAddress(selectedUser.address[0]);
  //     setSelectedAddressArray(selectedUser.address);
  //   } else {
  //     setSelectedAddress(null);
  //     setSelectedAddressArray([]);
  //   }
  // }, [selectedUser]);

  // useEffect(() => {
  //   if (selectedAddress?.branch?.length > 0) {
  //     const firstBranch = selectedAddress.branch[0];
  //     console.log("firstBranch", firstBranch);
  //     setSelectedBranch(firstBranch);
  //   }
  // }, [selectedAddress]);

  // useEffect(() => {
  //   if (selectedUser?.address?.length > 0) {
  //     setSelectedAddressArray(selectedUser.address);

  //     if (!selectedAddress) {
  //       const firstAddress = selectedUser.address[0];
  //       setSelectedAddress(firstAddress);

  //       console.log("firstAddress", firstAddress);
  //       setSelectedBranch(firstAddress.branch?.[0]);

  //       // سيتم تسجيل null هنا لأن `setSelectedBranch` لم يطبق بعد
  //       console.log("SelectedBranch (قبل التحديث)", firstAddress.branch?.[0]);
  //     }
  //   } else {
  //     setSelectedAddress(null);
  //     setSelectedAddressArray([]);
  //     setSelectedBranch(null);
  //   }
  // }, [selectedUser]);

  // useEffect(() => {
  //   if (selectedAddress?.branch?.length > 0) {
  //     setSelectedBranch(selectedAddress.branch[0]);
  //   }
  // }, [selectedAddress]);

  // useEffect(() => {
  //   if (selectedBranch) {
  //     console.log("SelectedBranch (بعد التحديث):", selectedBranch);
  //   }
  // }, [selectedBranch]);

  const [branchId, setBranchId] = useState(null);
  const [selectedBranchNew, setSelectedBranchNew] = useState(null);
  // const [selectedBranchNew, setSelectedBranch] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");

  // const branchOptions = branches?.map((branch) => ({
  //   value: branch.id,
  //   label: branch.name_en,
  //   priceList: branch.price_list,
  // }));
  const [branchOptions, setBranchOptions] = useState([]);
  const [savedBranch, setSavedBranch] = useState(null);

  useEffect(() => {
    if (branches?.length > 0) {
      const firstBranch = branches[0];
      // تخزين أول فرع تلقائيًا
      setSelectedBranchId(firstBranch.id);
      // setSelectedBranchName(firstBranch.name_en);
      setSavedBranch({
        value: firstBranch.id,
        label: firstBranch.name_en,
        priceList: firstBranch.price_list,
        deliveryFees: firstBranch.delivery_fees,
      });
      setBranchOptions(
        branches.map((branch) => ({
          value: branch.id,
          label: branch.name_en,
          priceList: branch.price_list,
          deliveryFees: branch.delivery_fees,
        }))
      );
      setSelectedBranchPriceList(firstBranch.price_list);
    }
  }, [branches]);

  // console.log("branchOptions",branchOptions);
  // console.log("selectedBranchId",selectedBranchId);
  // console.log("savedBranch",savedBranch);

  useEffect(() => {
    if (selectedUser?.address?.length > 0) {
      setSelectedAddressArray(selectedUser.address);

      if (!selectedAddress) {
        const firstAddress = selectedUser.address[0];
        setSelectedAddress(firstAddress);

        // console.log("firstAddress", firstAddress);
        setSelectedBranch(firstAddress.branch?.[0]);

        // console.log("SelectedBranch (قبل التحديث)", firstAddress.branch?.[0]);
      }
    } else {
      setSelectedAddress(null);
      setSelectedAddressArray([]);
      setSelectedBranch(null);
      setBranchId(null);
    }
  }, [selectedUser, selectedAddress]);

  // useEffect(() => {
  //   if (branchOptions?.length > 0) {
  //     const firstBranch = branchOptions[0]
  // console.log(" branchId Branch ID:",firstBranch);

  //     setSelectedBranchNew(firstBranch);
  //   }
  // }, [selectedAddress,selectedUser]);
  // useEffect(() => {
  //   if (branchOptions?.length > 0 && !selectedBranchNew) {
  //     const firstBranch = branchOptions[0];
  //     console.log(" أول فرع: ", firstBranch);

  //     setSelectedBranchNew(firstBranch);
  //     setBranchId(selectedBranchInSelected?.value);
  //   }
  // }, [branchOptions]);

  // const isBranchSet = useRef(false); // للتحكم في التحديثات ومنع الـ infinite loop
  // const prevBranchOptions = useRef([]); // تخزين الفروع السابقة للمقارنة

  // useEffect(() => {
  //   if (branchOptions?.length > 0) {
  //     const firstBranch = branchOptions[0];

  //     // التحقق مما إذا كانت البرانشات قد تغيّرت فعليًا
  //     const isBranchListChanged = JSON.stringify(prevBranchOptions.current) !== JSON.stringify(branchOptions);

  //     if (isBranchListChanged) {
  //       console.log("🔄 تحديث الفروع الجديدة:", branchOptions);
  //       prevBranchOptions.current = branchOptions; // تحديث القيم السابقة

  //       // ضبط الفرع فقط إذا لم يكن محددًا أو إذا تغيّرت القائمة
  //       if (!selectedBranchNew || !branchOptions.some(branch => branch.id === selectedBranchNew.id)) {
  //         console.log("✅ تحديد أول فرع تلقائيًا:", firstBranch);

  //         setSelectedBranchNew(firstBranch);
  //         setBranchId(firstBranch.id);
  //         isBranchSet.current = true;
  //       }
  //     }
  //   }
  // }, [branchOptions, selectedAddress]);
  //   useEffect(() => {
  //     if (selectedBranchNew) {
  //       setBranchId(selectedBranchNew.id ||selectedBranchInSelected?.value);
  //       console.log("selectedBranchNew (بعد التحديث):", selectedBranchNew);
  //     }
  //   }, [selectedBranchNew,selectedAddress,selectedBranchInSelected,deliveryMethod]);

  //   useEffect(() => {
  //     setBranchId(selectedBranchInSelected?.value ?? selectedBranchNew?.value ?? null);
  //   }, [selectedBranchInSelected, selectedBranchNew]);

  //   // const finalBranchId = branchId || selectedBranchInSelected?.value;

  //   console.log(" branchId Branch ID:", branchId);
  //   console.log("setSelectedBranchNew ID:", selectedBranchNew);

  // useEffect(() => {
  //   if (selectedAddress?.branch?.length > 0) {
  //     setSelectedBranch(selectedAddress.branch[0]);
  //   }
  // }, [selectedAddress]);
  // console.log("SelectedBranch", selectedBranch);

  // console.log("selectedBranch", selectedBranch);
  // console.log("price_list", selectedBranch?.price_list);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (search) {
        // إذا كان هناك شيء مكتوب في حقل البحث
        const message =
          "Are you sure you want to leave? Your search data will be lost.";
        event.returnValue = message; // هذا سيعرض رسالة التحذير في بعض المتصفحات
        return message; // بعض المتصفحات الأخرى تتطلب هذه السطر لعرض الرسالة
      }
    };

    // إضافة مستمع لحدث beforeunload
    window.addEventListener("beforeunload", handleBeforeUnload);

    // تنظيف المستمع عند الخروج من الصفحة أو عند تغيير الكومبوننت
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [search]);

  const handleSearch = () => {
    if (search) {
      setPhone(search);
      if (selectedUser?.address?.length > 0 && !selectedAddress) {
        setSelectedAddress(selectedUser.address[0]);
      }
      setErrorSearchUser("");
      if (selectedBranch) {
        setSelectedBranchPriceList(selectedBranch.price_list);
      }
    } else {
      setErrorSearchUser("Please enter a valid search term.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClear = () => {
    setSearch("");
    setPhone("");
    setAllUserData(null);
    setSelectedAddress(null);
    setSelectedAddressArray(null);
    setCartItems([]);
  };

  useEffect(() => {
    if (theme === "dark") {
      setColor("#fff");
    } else {
      setColor("#000");
    }
  }, [theme]);

  const [selectedEditAddress, setSelectedEditAddress] = useState(null);

  // useEffect(() => {
  //   if (deliveryMethod === "pickup") {
  //     const currentSelectedBranchId = getValueCreateOrder("branches");
  //     if (selectedBranchId && selectedBranchId !== currentSelectedBranchId) {
  //       setValueCreateOrder("branches", selectedBranchId, { shouldValidate: true });
  //     }
  //   }
  //   console.log("currentSelectedBranchId",getValueCreateOrder("branches"));
  //   console.log("selectedBranchId",selectedBranchId);

  // }, [selectedBranchId, deliveryMethod, setValueCreateOrder]);

  // console.log("SelectedAddressArray", selectedAddressArray);
  // console.log("SelectedAddress", selectedAddress);
  // console.log("selectedEditAddress", selectedEditAddress);
  // console.log("selectedAddress", selectedAddress?.id);

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

  // const handleDecreaseTable = (id) => {
  //   setCartItems((prevItems) =>
  //     prevItems.map((item) =>
  //       item.id === id && item.quantity > 1
  //         ? {
  //             ...item,
  //             quantity: item.quantity - 1,
  //             total: (item.quantity - 1) * item.price,
  //           }
  //         : item
  //     )
  //   );
  // };
  const handleDecreaseTable = (id) => {
    setCartItems(
      (prevItems) =>
        prevItems
          .map((item) => {
            if (item.id === id) {
              if (item.quantity > 1) {
                return {
                  ...item,
                  quantity: item.quantity - 1,
                  total: (item.quantity - 1) * item.price,
                };
              } else {
                // لما الكمية تكون 1 ونضغط "-" يتم الحذف فورًا
                handleRemoveItem(id);
                return null; // إزالة العنصر
              }
            }
            return item;
          })
          .filter(Boolean) // إزالة العناصر المحذوفة
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const [cartItems, setCartItems] = useState([]);

  const [note, setNote] = useState("");

  const handleAddToCart = () => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === selectedItem.id
      );

      if (existingItemIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...selectedItem,
          quantity: counter,
          total: counter * selectedItem.price,
          // mainExtras: [...selectedItem.mainExtras],
          mainExtras: Array.isArray(selectedItem.mainExtras)
            ? [...selectedItem.mainExtras]
            : [],
          selectedMainExtras: Array.isArray(selectedItem.selectedMainExtras)
            ? [...selectedItem.selectedMainExtras]
            : [],
          selectedExtras: Array.isArray(selectedItem.selectedExtras)
            ? [...selectedItem.selectedExtras]
            : [],
          // selectedIdSize: Array.isArray(selectedItem.selectedIdSize) ? [...selectedItem.selectedIdSize] : [],
          // selectedInfo: Array.isArray(selectedItem.selectedInfo) ? [...selectedItem.selectedInfo] : [],

          // selectedMainExtras: [...selectedItem.selectedMainExtras],
          // // selectedExtras: [...selectedItem.selectedExtras],
          selectedIdSize: selectedItem.selectedIdSize,
          selectedInfo: selectedItem.selectedInfo,
          note: note,
        };
        return updatedItems;
      } else {
        return [
          ...prevItems,
          {
            ...selectedItem,
            id: `${selectedItem.id}-${Date.now()}`,
            quantity: counter,
            total: counter * selectedItem.price,
            // mainExtras: [...selectedItem.mainExtras],
            mainExtras: Array.isArray(selectedItem.mainExtras)
              ? [...selectedItem.mainExtras]
              : [],

            // selectedMainExtras: [...selectedItem.selectedMainExtras],
            // selectedExtras: [...selectedItem.selectedExtras],
            selectedIdSize: selectedItem.selectedIdSize,
            selectedInfo: selectedItem.selectedInfo,
            selectedMainExtras: Array.isArray(selectedItem.selectedMainExtras)
              ? [...selectedItem.selectedMainExtras]
              : [],
            selectedExtras: Array.isArray(selectedItem.selectedExtras)
              ? [...selectedItem.selectedExtras]
              : [],
            // selectedIdSize: Array.isArray(selectedItem.selectedIdSize) ? [...selectedItem.selectedIdSize] : [],
            // selectedInfo: Array.isArray(selectedItem.selectedInfo) ? [...selectedItem.selectedInfo] : [],
            note: note,
          },
        ];
      }
    });

    setNote("");
    setIsItemDialogOpen(false);
  };

  // console.log("selectedIdSize", selectedItem?.selectedIdSize);
  const handleNoteChange = (e, itemId) => {
    const newNote = e.target.value;

    setCartItems((prevCart) =>
      prevCart.map((cartItem) =>
        cartItem.id === itemId ? { ...cartItem, note: newNote } : cartItem
      )
    );
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

  const [showRestaurantChangeAlert, setShowRestaurantChangeAlert] =
    useState(false);
  const [pendingRestaurant, setPendingRestaurant] = useState(null);

  const handleRestaurantChange = (selectedOption) => {
    if (cartItems.length > 0) {
      setPendingRestaurant(selectedOption);
      setShowRestaurantChangeAlert(true);
    } else {
      setSelectedRestaurantId(selectedOption.value);
      setSelectedBranchId(null);
      // refetchBranches();
      setCartItems([]);
      setActiveSection("all");
      setIsBranchManuallySelected(!!selectedBranchId);
      setSelectedBranchName("");
    }
  };

  const confirmRestaurantChange = () => {
    if (pendingRestaurant) {
      setSelectedRestaurantId(pendingRestaurant.value);
      setSelectedBranchId(null);
      // refetchBranches();
      setCartItems([]);
      setActiveSection("all");
      setShowRestaurantChangeAlert(false);
      setPendingRestaurant(null);
      setIsBranchManuallySelected(!!selectedBranchId);
      setSelectedBranchName("");
    }
  };

  // banches

  const [dialogToReopen, setDialogToReopen] = useState(null);

  const [pendingBranch, setPendingBranch] = useState(null);
  const [showAlertBranch, setShowAlertBranch] = useState(false);
  //   useEffect(() => {
  //     if (selectedBranchInSelected) {
  //       setValueCreateOrder("branches", selectedBranchInSelected?.value);
  //     }
  //   }, [selectedBranchInSelected, setValueCreateOrder]);
  //   const prevBranchOptions = useRef([]); // لتخزين الفروع السابقة للمقارنة

  // useEffect(() => {
  //   if (branchOptions?.length > 0) {
  //     const firstBranch = branchOptions[0];

  //     // التحقق مما إذا كانت البرانشات قد تغيّرت فعليًا
  //     const isBranchListChanged = JSON.stringify(prevBranchOptions.current) !== JSON.stringify(branchOptions);

  //     if (isBranchListChanged) {
  //       console.log("🔄 تحديث الفروع الجديدة:", branchOptions);
  //       prevBranchOptions.current = branchOptions; // تحديث الفروع المخزنة

  //       // إذا لم يكن هناك فرع مختار يدويًا، قم باختيار أول فرع تلقائيًا
  //       if (!selectedBranchInSelected || !branchOptions.some(branch => branch.id === selectedBranchInSelected.id)) {
  //         console.log("✅ تحديد أول فرع تلقائيًا:", firstBranch);
  //         updateBranch(firstBranch);
  //       }
  //     }
  //   }
  // }, [branchOptions, selectedAddress,selectedRestaurantId,selectedUser ]);
  const handleSelectChangeBranches = (selectedOption) => {
    // console.log("selectedOption",selectedOption);

    if (!selectedOption) {
      setSelectedBranchInSelected(null);
      setSelectedBranchId(null);
      setSavedBranch(null);
      setSelectedBranchPriceList(null);
      setIsBranchManuallySelected(false);
      setMassegeNotSelectedBranch("Please select branch first");
      return;
    }

    const isFirstSelection = !selectedBranchInSelected; // أول اختيار؟
    if (isFirstSelection && selectedOption?.priceList === 1) {
      updateBranch(selectedOption);
      setSelectedBranchName(selectedOption.label);
      return;
    }

    if (
      cartItems.length > 0 &&
      pendingBranch?.value !== selectedOption?.value &&
      selectedBranchInSelected?.value !== selectedOption.value
    ) {
      setPendingBranch(selectedOption);
      setShowAlertBranch(true);
      setCreateOrderDialogOpen(false);
    } else {
      updateBranch(selectedOption);
      setSelectedBranchName(selectedOption.label);
    }
  };

  const updateBranch = (selectedOption) => {
    setSelectedBranchInSelected(selectedOption);
    setSavedBranch(null);
    setSelectedBranchId(selectedOption.value);
    setSelectedBranchPriceList(selectedOption.priceList);
    setIsBranchManuallySelected(true);
    setMassegeNotSelectedBranch(null);
    refetchMenu();
  };
  // console.log("panding", pendingBranch);

  useEffect(() => {
    if (deliveryMethod === "pickup") {
      setSelectedBranchInSelected(null);
      setSavedBranch(null);
      setSelectedBranchId(null);
      // setSelectedBranchPriceList(null);
      setMassegeNotSelectedBranch("Select branch first");
    } else if (deliveryMethod === "delivery" && branchOptions.length > 0) {
      const firstBranch = branchOptions[0];
      setSelectedBranchId(firstBranch.value);
      // setSelectedBranchName(firstBranch.label);
      setSavedBranch(firstBranch);
      setMassegeNotSelectedBranch(null); // إزالة الرسالة إن وجدت
    }
  }, [deliveryMethod, branchOptions]);

  // console.log("updateBranch",updateBranch);
  // console.log("selectedBranchInSelected",selectedBranchInSelected);
  // console.log("setSavedBranch",selectedBranchInSelected);
  // console.log("setIsBranchManuallySelected",isBranchManuallySelected);
  // console.log("selectedBranchInSelected",selectedBranchInSelected?.value);

  const handleConfirmChange = () => {
    // console.log("pendingBranch",pendingBranch);
    updateBranch(pendingBranch);
    setSelectedBranchName(pendingBranch.label);
    setShowAlertBranch(false);
    setCartItems([]);
  };

  const handleCancelChange = () => {
    setPendingBranch(null);
    setShowAlertBranch(false);
  };

  useEffect(() => {
    if (deliveryMethod !== "pickup") {
      setSelectedBranch(null);
      setSelectedBranchName("");
      setSelectedBranchInSelected(null);
      setSelectedBranchId(null);
    }
  }, [deliveryMethod]);
  const prevUserRef = useRef(null);
  const previousBranchId = useRef(null);
  useEffect(() => {
    if (
      selectedBranchNew?.id &&
      selectedBranchNew.id !== previousBranchId.current
    ) {
      refetchMenu();
      previousBranchId.current = selectedBranchNew.id; // تحديث القيمة القديمة
    }
  }, [selectedBranchNew?.id]);
  // useEffect(() => {
  //   setDeliveryMethod("delivery");
  //   setSelectedBranch(null);
  //   setSelectedBranchName("");
  //   setSelectedBranchInSelected(null);
  //   setSelectedBranchId(null);
  //   // setCartItems([]);
  // }, [selectedUser]);
  useEffect(() => {
    if (
      prevUserRef?.current !== null &&
      prevUserRef?.current?.id !== selectedUser?.id
    ) {
      setDeliveryMethod("delivery");
      setSelectedBranch(null);
      setSelectedBranchName("");
      // setSelectedBranchInSelected(null);
      setSelectedBranchId(null);
      setCartItems([]);
    }

    prevUserRef.current = selectedUser;
  }, [selectedUser]);
  useEffect(() => {
    setIsBranchManuallySelected(!!selectedBranchId);
  }, [selectedBranchId]);
  // console.log("setSelectedBranchInSelected",selectedBranchInSelected);
  // console.log("setSelectedBranchId",selectedBranchId);

  const [showDateTime, setShowDateTime] = useState(false);

  const handleSelectChangeBranchesCreateOrder = (selectedOption) => {
    if (selectedOption) {
      const branchId = Number(selectedOption.value); // ✅ تحويل القيمة إلى رقم
      setSelectedBranchIdCreateOrder(branchId);
      setSelectedBranchPriceList(selectedOption.priceList);
      setValueCreateOrder("branches", branchId); // ✅ تسجيلها كرقم
      // console.log("SelectedBranchIdCreateOrder", branchId); // تحقق من القيمة
    }
  };

  // console.log("isBranchManuallySelected", isBranchManuallySelected);

  // order source
  const orderSourceOptions = orderSource?.map((val) => ({
    value: val.id,
    label: val.source_name,
  }));

  const [orderSourceSelected, setOrderSourceSelected] = useState(null);

  useEffect(() => {
    if (orderSourceOptions?.length > 0 && !orderSourceSelected) {
      const firstOption = orderSourceOptions[0];

      // ✅ تأكد من عدم التحديث إذا كانت القيمة نفسها
      if (orderSourceSelected?.label !== firstOption.label) {
        setOrderSourceSelected(firstOption);
        setValueCreateOrder("ordersource", firstOption.label);
      }
    }
  }, [orderSourceOptions]);
  // console.log("orderSourceSelected", orderSourceSelected);
  // order type

  const orderTypeOptions = [
    { value: 1, label: "Delivery" },
    { value: 2, label: "Pickup" },
  ];

  const [selectedOrderType, setSelectedOrderType] = useState(null);

  useEffect(() => {
    if (orderTypeOptions.length > 0) {
      const defaultValue =
        deliveryMethod === "pickup" ? orderTypeOptions[1] : orderTypeOptions[0];

      setSelectedOrderType(defaultValue);
      setValueCreateOrder("ordertype", defaultValue.value);

      // console.log("🚀 selectedOrderType Updated:", defaultValue);
    }
  }, [deliveryMethod]);

  useEffect(() => {
    const currentSelectedBranchId = getValueCreateOrder("branches");
    const deliveryBranch = selectedAddress?.branch?.[0]?.id || null;

    if (deliveryMethod === "pickup") {
      if (selectedBranchId && selectedBranchId !== currentSelectedBranchId) {
        setValueCreateOrder("branches", selectedBranchId, {
          shouldValidate: true,
        });
      }
    }

    if (deliveryMethod === "delivery") {
      if (deliveryBranch && deliveryBranch !== currentSelectedBranchId) {
        setValueCreateOrder("branches", deliveryBranch, {
          shouldValidate: true,
        });
        setSelectedBranchId(deliveryBranch);
        setSelectedBranch(null);
        setSelectedBranchName("");
        setSelectedBranchInSelected(null);
        setSelectedBranchId(null);
      }
    }
  }, [selectedBranchId, deliveryMethod, selectedAddress, setValueCreateOrder]);
  useEffect(() => {
    if (deliveryMethod === "delivery" && selectedUser?.address?.length > 0) {
      setSelectedAddress(selectedUser.address[0]);
    }
  }, [deliveryMethod, selectedUser]);
  useEffect(() => {
    if (selectedOrderType?.value === 2) {
      // console.log("selectedOrderType?.value",selectedOrderType?.value);
      setDeliveryMethod("pickup");
    } else {
      setDeliveryMethod("delivery");
    }
  }, [selectedOrderType]);
  // useEffect(() => {
  //   if (selectedOrderType?.value === 2) {
  //     const selectedBranch = getValueCreateOrder("branches"); // احصل على الفرع المختار داخل الكنترول
  //     console.log("selectedBranch",selectedBranch);

  //     if (selectedBranch) {
  //       const matchedBranch = branchOptions.find(
  //         (option) => option.value === selectedBranch
  //       );
  //       setSelectedBranchInSelected(matchedBranch || null);
  //     }
  //   }
  // }, [selectedOrderType, setSelectedBranchInSelected, getValueCreateOrder]);

  // console.log("selectedOrderType",selectedOrderType);

  // useEffect(() => {
  //   if (selectedOrderType?.value === 2) {
  //     const selectedBranch = getValueCreateOrder("branches")
  //     console.log("selectedBranch", selectedBranch);

  //     if (selectedBranch) {
  //       const matchedBranch = branchOptions.find(
  //         (option) => option.value === selectedBranch
  //       );

  //       if (matchedBranch && matchedBranch.value !== selectedBranchInSelected?.value) {
  //         setSelectedBranchInSelected(matchedBranch);
  //         // setSelectedBranchName
  //         setSelectedBranchName(matchedBranch.label);
  //       }

  //     }
  //   }
  // }, [selectedOrderType, getValueCreateOrder("branches"), branchOptions]);

  // useEffect(() => {
  //   // (createOrderDialogOpen && selectedOrderType?.value === 2)
  //   if (selectedOrderType?.value === 2) {
  //     const selectedBranch = getValueCreateOrder("branches"); // احصل على الفرع المختار داخل الكنترول
  //     console.log("selectedBranch", selectedBranch);

  //     if (selectedBranch) {
  //       const matchedBranch = branchOptions?.find(
  //         (option) => option.value === selectedBranch
  //       );

  //       if (matchedBranch && matchedBranch.value !== selectedBranchInSelected?.value) {
  //         // تحديث القيم وكأن المستخدم اختار الفرع يدوياً
  //         handleSelectChangeBranches(matchedBranch);
  //       }
  //     }
  //   }
  // }, [selectedOrderType, getValueCreateOrder("branches")]);

  // (createOrderDialogOpen && selectedOrderType?.value === 2)
  useEffect(() => {
    if (selectedOrderType?.value === 2) {
      const selectedBranch = getValueCreateOrder("branches"); // احصل على الفرع المختار داخل الكنترول
      // console.log("selectedBranch", selectedBranch);

      if (selectedBranch) {
        const matchedBranch = branchOptions?.find(
          (option) => option.value === selectedBranch
        );

        if (
          matchedBranch &&
          matchedBranch.value !== selectedBranchInSelected?.value
        ) {
          // تحديث القيم وكأن المستخدم اختار الفرع يدوياً
          handleSelectChangeBranches(matchedBranch);
        }
      }
    }
  }, [createOrderDialogOpen]);

  // console.log("setSelectedBranchInSelected",selectedBranchInSelected);

  const [selectedOrderPaymeny, setSelectedOrderPaymeny] = useState(null);
  const orderPaymenyOptions = [{ value: 1, label: "Cash" }];

  useEffect(() => {
    const defaultValue = orderPaymenyOptions[0];
    setSelectedOrderPaymeny(defaultValue);
    setValueCreateOrder("orderpayment", orderPaymenyOptions[0].value);
  }, [setValueCreateOrder]);

  // console.log("selectedOrderPaymeny", selectedOrderPaymeny);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState(null);
  const orderStatusOptions = [
    { value: 1, label: "Pending" },
    { value: 2, label: "New" },
  ];

  useEffect(() => {
    if (orderStatusOptions.length > 0) {
      const defaultValue = orderStatusOptions[0];
      setSelectedOrderStatus(defaultValue);
      setValueCreateOrder("orderstatus", orderStatusOptions[0].value);
    }
  }, [setValueCreateOrder]);

  // console.log("selectedOrderStatus", selectedOrderStatus);
  // areas
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
      // setValueEditAddressUser("name", selectedEditAddress.address_name);
      if (["home", "work"].includes(selectedEditAddress.address_name)) {
        seEditAddressType(selectedEditAddress.address_name);
        setCustomAddressName(""); // إخفاء الإدخال
      } else {
        seEditAddressType("other");
        setCustomAddressName(selectedEditAddress.address_name); // إدخال الاسم المخصص
      }

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
  const handleEditAddressTypeChange = (type) => {
    seEditAddressType(type);

    if (type === "other") {
      setCustomAddressName("");
      setValueEditAddressUser("name", "");
    } else {
      setCustomAddressName(""); // إخفاء الإدخال
      setValueEditAddressUser("name", type);
    }
  };
  const [totalExtrasPrice, setTotalExtrasPrice] = useState(0);
  // console.log("totalExtrasPrice", totalExtrasPrice);
  const [lodaingEditUserData, setLodaingEditUserData] = useState(false);
  const onSubmitEditUserData = async (data) => {
    const formattedData = Object.entries({
      username: data.username,
      email: data.email,
      phone: data.phone,
      phone2: data.phone2,
      userId: selectedUser?.id,
      token: token,
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
        setSelectedAddress((prevSelectedAddress) => ({
          ...prevSelectedAddress,
          address_name: data.address_name || prevSelectedAddress.address_name,
          // أي حقل آخر تحتاج تحديثه
        }));
        setOpenEditDialog(false);
      } else {
        toast.error("something error");
      }
    } catch {
      console.error("Error updating user data:", error);
    }
  };
  // console.log("set slected ", selectedAddress);
  const [loading, setLoading] = useState(false);
  const [selectedAddressType, setSelectedAddressType] = useState("home");
  const [addAddressType, setaddAddressType] = useState("home");
  const [editAddressType, seEditAddressType] = useState("home");
  const [customAddressName, setCustomAddressName] = useState("");
  const [isOpenAddress, setIsOpenAddress] = useState(false);
  const [isOpenUserData, setIsOpenUserData] = useState(true);

  const toggleOpenAddress = () => setIsOpenAddress((prev) => !prev);
  const toggleOpenUserData = () => setIsOpenUserData((prev) => !prev);
  useEffect(() => {
    if (selectedAddressType !== "other") {
      setValueAddNewUser("name", selectedAddressType);
    } else {
      setValueAddNewUser("name", "");
    }
    trigger("name");
  }, [selectedAddressType]);

  const handleAddressTypeChange = (type) => {
    setSelectedAddressType(type);
    if (type !== "other") {
      setValueAddNewUser("name", type);
    } else {
      setValueAddNewUser("name", "");
    }
    trigger("name");
  };

  useEffect(() => {
    if (selectedAddressType !== "other") {
      setValueAddNewAddress("name", selectedAddressType);
    } else {
      setValueAddNewAddress("name", "");
    }
    trigger("name");
  }, [selectedAddressType]);

  const handleAddressTypeAdd = (type) => {
    setaddAddressType(type);
    if (type !== "other") {
      setValueAddNewAddress("name", type);
    } else {
      setValueAddNewAddress("name", "");
    }
    trigger("name");
  };

  const onSubmitAddUserData = async (data) => {
    // console.log("data", data);
    setLoading(true);
    try {
      const userId = await createUser(
        data.username,
        data.phone,
        data.phone2,
        token
      );

      if (!userId) throw new Error("User ID not received");
      // console.log("userId from onSubmitAddUserData ", userId);
      // const nameValue = data?.name?.trim() === "" ? "home" : data?.name;
      const nameValue =
        typeof data.name === "string" && data.name.trim() !== ""
          ? data.name
          : "home";

      await createAddress(
        userId,
        data.area.value,
        data.street,
        data.building,
        data.floor,
        data.apt,
        data.additionalInfo,
        // data.name
        nameValue,
        token
      );
      setIsNewUserDialogOpen(false);
      resetAddNewUser();
      toast.success("User added successfully");
    } catch (error) {
      const errorMessage = error.message || "Unexpected error";
      console.error(error);
      // toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const onSubmitAddAddress = async (data) => {
    // console.log("data", data);
    setLoading(true);
    const userId = selectedUser?.id;
    try {
      // if (!userId) throw new Error("User ID not received");
      // console.log("userId from onSubmitAddUserData ", userId);
      // const nameValue = data.name.trim() === "" ? "home" : data.name;
      const nameValue =
        typeof data.name === "string" && data.name.trim() !== ""
          ? data.name
          : "home";
      await createAddress(
        userId,
        data.area.value,
        data.street,
        data.building,
        data.floor,
        data.apt,
        data.additionalInfo,
        // data.name
        nameValue,
        token
      );

      queryClient.invalidateQueries(["userSearch", phone]);
      setIsNewAddressDialogOpen(false);
      toast.success("Address added successfully");
      resetAddNewAddress();
      setaddAddressType("home");
    } catch (error) {
      const errorMessage = error.message || "Unexpected error";
      console.error(error);
      // toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const onSubmitEditUserAddress = async (data) => {
    const nameValue =
      typeof data.name === "string" && data.name.trim() !== ""
        ? data.name
        : "home";
    const formattedData = {
      id: selectedEditAddress.id, // تأكيد إرسال ID صحيح
      area: data.area.value,
      street: data.street || "", // تأكيد إرسال قيمة فارغة   `undefined`
      building: data.building || "",
      floor: data.floor || "",
      apt: data.apt || "",
      additional_info: data.additionalInfo || "",
      address_name: nameValue,
      token: token,
    };

    // console.log("Formatted Data to Send:", formattedData); // تحقق من البيانات

    try {
      const response = await updateUserAddress(formattedData);

      if (response) {
        toast.success("Address updated successfully");

        queryClient.invalidateQueries(["userSearch", phone]);
        setOpenEditAddressDialog(false);
      } else {
        toast.error("Something went wrong");
      }

      // console.log("Response onSubmit:", response);
    } catch (error) {
      console.error("Error updating user address:", error);
      toast.error("Failed to update address. Please try again.");
    }
  };
  const handleDeleteAddress = async (id) => {
    // console.log("id remove", id);
    try {
      const response = await deleteAddress(id, token);

      toast.success("Address deleted successfully");
      queryClient.invalidateQueries(["userSearch", phone]);
      // console.log("Response onSubmit delete:", response);
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

  const onSubmithandleCreateOrder = async (data) => {
    // console.log(" بيانات الطلب:", data);
    // console.log("branchId", branchId);
    setLoading(true);

    try {
      await createOrder({
        lookupId: selectedUser?.id,
        address: selectedAddress?.id,
        area: selectedAddress?.area,
        notes: data.notes || "",
        source: data.ordersource,
        status: data.orderstatus === 1 ? "pending" : "New",
        insertcoupon: data.insertcoupon,
        insertpoints: data.insertpoints,
        time: data?.startTime,
        payment: 1,
        delivery_type: data.ordertype,
        items: cartItems,
        lat: 0,
        lng: 0,
        branch: savedBranch?.value,
        restaurant: selectedRestaurantId,
        token,
      });

      toast.success("Order created successfully");
      setCreateOrderDialogOpen(false);

      resetCreateOrder({
        ordertype: orderTypeOptions.length > 0 ? orderTypeOptions[0].value : "",
        ordersource:
          orderSourceOptions.length > 0 ? orderSourceOptions[0].label : "",
        orderstatus:
          orderStatusOptions.length > 0 ? orderStatusOptions[0].value : "",
        orderpayment:
          orderPaymenyOptions.length > 0 ? orderPaymenyOptions[0].value : "",
      });

      setShowDateTime(false);

      if (orderSourceOptions.length > 0) {
        setOrderSourceSelected(orderSourceOptions[0]);
      }
      if (orderStatusOptions.length > 0) {
        setSelectedOrderStatus(orderStatusOptions[0]);
      }
      setDiscountValue("");
      setDiscountPercentage("");
      setSearch("");
      setPhone("");
      setAllUserData(null);
      setSelectedAddress(null);
      setSelectedAddressArray(null);
      setCartItems([]);
      setIsOpenUserData(true);
      setSelectedBranchPriceList(1);
    } catch (error) {
      console.error(" خطأ في إنشاء الطلب:", error);
      toast.error(error.message || "حدث خطأ غير متوقع!");
    } finally {
      setLoading(false);
    }
  };

  const handleEditAddress = (address) => {
    setSelectedEditAddress(address);
    setOpenEditAddressDialog(true);
  };

  const grandTotal = cartItems.reduce((sum, item) => {
    const itemPrice = parseFloat(item.price) || 0;
    const itemQuantity = parseFloat(item.quantity) || 0;

    const extrasTotal =
      item.selectedMainExtras?.reduce(
        (acc, extra) => acc + (parseFloat(extra.price_en) || 0),
        0
      ) || 0;

    const itemTotal = itemPrice * itemQuantity + extrasTotal;

    return sum + itemTotal;
  }, 0);

  // const formattedGrandTotal = parseFloat(grandTotal).toFixed(2);

  const [discountValue, setDiscountValue] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");

  const vatAmount = parseFloat(grandTotal * (parseFloat(Tax) / 100));
  const discount = 0;

  const Delivery =
    selectedOrderType?.value === 2
      ? 0
      : parseFloat(savedBranch?.deliveryFees) || 0;

  const totalAmount = grandTotal + vatAmount + Delivery - discount;

  const finalTotal = useMemo(() => {
    let total =
      selectedOrderType?.value === 2 ? totalAmount - Delivery : totalAmount;
    return total - discountValue;
  }, [totalAmount, selectedOrderType, Delivery, discountValue]);

  const handleDiscountValueChange = (e) => {
    let value = parseFloat(e.target.value);

    if (!isNaN(value)) {
      if (value > totalAmount) {
        value = totalAmount;
      }
      setDiscountValue(value);

      setDiscountPercentage(Number(((value / totalAmount) * 100).toFixed(3)));
    } else {
      setDiscountValue("");
      setDiscountPercentage("");
    }
  };

  const handleDiscountPercentageChange = (e) => {
    let value = parseFloat(e.target.value);

    if (!isNaN(value)) {
      if (value > 100) {
        value = 100;
      }
      setDiscountPercentage(value);

      setDiscountValue(Number(((value / 100) * totalAmount).toFixed(3)));
    } else {
      setDiscountPercentage("");
      setDiscountValue("");
    }
  };

  const handleCacelOrder = () => {
    setSearch("");
    setPhone("");
    setAllUserData(null);
    setSelectedAddress(null);
    setSelectedAddressArray(null);
    setCartItems([]);
    setIsOpenUserData(true);
    setSelectedBranchPriceList(1);
  };

  // console.log(">>>>>>:");
  // console.log("extrasData:", selectedItem?.extrasData);
  // console.log("extrasData:", selectedItem?.selectedItem?.itemExtras);
  // console.log("selectedExtras:", selectedItem?.selectedExtras);
  // console.log("selectedItem?.mainExtras:", selectedItem?.mainExtras);
  // console.log("selectedItem?.info?.:", selectedItem?.info);
  if (isLoadingBranchs) return <p>Loading branches...</p>;
  if (errorBranchs) return <p>Error loading branches: {error.message}</p>;
  return (
    <div className="flex flex-col gap-4">
      {/* <div className="flex flex-col lg:flex-row lg:items-center gap-2 ml-4">
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
      </div> */}
      <AlertDialog
        open={showRestaurantChangeAlert}
        onOpenChange={setShowRestaurantChangeAlert}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Changing the restaurant will clear your cart. Do you want to
              proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              type="button"
              variant="outline"
              color="info"
              onClick={() => setShowRestaurantChangeAlert(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/80"
              onClick={confirmRestaurantChange}
            >
              Ok
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-4">
        <div className="lg:col-span p-4 shadow- rounded-lg mt-0">
          {/*  مربع البحث */}
          <div className="space-y-4">
            {/*  مربع البحث */}
            <Card className="p-4 shadow-md rounded-lg mt-[-15px]">
              <div className="relative min-w-[240px] mb-2">
                <span className="absolute top-1/2 -translate-y-1/2 left-2">
                  <Search className="w-4 h-4 text-gray-500" />
                </span>
                <Input
                  type="text"
                  placeholder="Search"
                  className="pl-7 w-full text-[#000] dark:text-[#fff] "
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute top-1/2 right-2 -translate-y-1/2 text-[#000] dark:text-[#fff] text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
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
                        {item?.name}
                      </h3>
                      <p className=" text-sm text-[#000] dark:text-[#fff] ">
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
                    <DialogContent size="3xl" hiddenCloseIcon={true}>
                      {/* <DialogHeader>
                        <DialogTitle className="text-xl font-semibold ">
                        </DialogTitle>
                      </DialogHeader> */}
                      <div className=" flex justify-between items-center space-y-4">
                        <p className="text-xl">{selectedItem?.name}</p>

                        <div className="flex items-center space-">
                          {/* السعر الإجمالي */}
                          <p className="text-sm font-semibold text-gray-">
                            {(selectedItem?.price * counter).toFixed(2)} EGP
                          </p>

                          <button
                            onClick={() =>
                              setCounter((prev) => (prev > 1 ? prev - 1 : 1))
                            }
                            className="px-2 py-1 bg-red-500 text-white rounded-[6px] hover:bg-red-600 transition-colors mr-1 ml-4"
                          >
                            <FaMinus />
                          </button>

                          <input
                            type="number"
                            step="0.001"
                            value={counter}
                            onInput={(e) => {
                              if (e.target.value.length > 4) {
                                e.target.value = e.target.value.slice(0, 4); // اقتصاص القيمة إلى 4 أرق
                              }
                            }}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              if (!isNaN(value) && value >= 0.1) {
                                // السماح بالأرقام العشرية وعدم السماح بالقيم السالبة
                                setCounter(value);
                              }
                            }}
                            className="w-16 text-center border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:-blue-500 focus:border-transparent "
                          />
                          <button
                            onClick={() => setCounter((prev) => prev + 1)}
                            className="px-2 py-1 bg-green-500 text-white rounded-[6px] hover:bg-green-600 transition-colors ml5 mr-2 ml-1"
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </div>
                      <div className="items-center">
                        <h3 className="font-medium ">
                          {selectedItem?.description}
                        </h3>
                      </div>
                      <hr className="my-2" />
                      <div className="mt-4">
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
                                      size?.item_extras || [];
                                    const newExtrasData =
                                      size?.item_extras?.[0]?.data || [];

                                    return {
                                      ...prev,
                                      selectedInfo: size?.size_en,
                                      itemExtras: newItemExtras,
                                      extrasData: newExtrasData,
                                      selectedItemExtras: [],
                                      price: size?.price?.price,
                                      selectedIdSize: size?.id,
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

                      {selectedItem?.extrasData?.length > 0 && (
                        <div className="border rounded-lg overflow-hidden shadow-md mt-3">
                          <div
                            className="p-3 bg-gray- cursor-pointer flex justify-between items-center"
                            onClick={toggleExtras}
                          >
                            <h3 className="font-bold text-[16px]">
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
                              <span className="text-[#000] dark:text-[#fff] font-medium">
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
                                  <span className="text-[#000] dark:text-[#fff]">
                                    {extra.name_en}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedItem?.mainExtras?.length > 0 && (
                        <div className="border rounded-lg overflow-hidden shadow-md">
                          <div
                            className="p-3 bg-gray- cursor-pointer flex justify-between items-center"
                            onClick={toggleExtrasMainExtra}
                          >
                            <h3 className="font-bold text-[16px] ">
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
                              <span className="text-[#000] dark:text-[#fff] font-medium">
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

                                        let updatedExtrasIds =
                                          updatedExtras.map((ex) => ex.id); // تخزين الـ ID فقط

                                        // حساب السعر الإجمالي الجديد
                                        const newTotalPrice =
                                          updatedExtras.reduce(
                                            (acc, curr) =>
                                              acc +
                                              parseFloat(curr.price_en || "0"), // تحويل السعر إلى رقم مع معالجة القيم الفارغة
                                            0
                                          );

                                        // console.log(
                                        //   "Selected Extras:",
                                        //   updatedExtras
                                        // );
                                        // console.log(
                                        //   "Total Price:",
                                        //   newTotalPrice
                                        // );
                                        setTotalExtrasPrice(newTotalPrice);
                                        return {
                                          ...prev,
                                          selectedMainExtras: updatedExtras,
                                          selectedMainExtrasIds:
                                            updatedExtrasIds, // تحديث قائمة الـ IDs
                                        };
                                      });
                                    }}
                                  />
                                  <span className="text-[#000] dark:text-[#fff]">
                                    {extra.name_en}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col lg:flex-row lg:items-center gap-2 my-4">
                        <Label className="lg:min-w-[100px]">Note:</Label>
                        <Input
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          type="text"
                          placeholder="Note"
                          className="w-full text-[#000] dark:text-[#fff]"
                        />
                      </div>
                      <div className="flex justify-end">
                        <p className="text-sm font-semibold mr-1 ">Subtoal: </p>
                        <p className="text-sm font-semibold ">
                          {(
                            selectedItem?.price * counter +
                            totalExtrasPrice
                          ).toFixed(2)}
                          EGP
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-semibold flex flex-wrap max-w-[300px]">
                          <p>
                            {[
                              selectedItem?.selectedInfo,
                              ...(selectedItem?.selectedExtras || []).map(
                                (extra) => extra.name_en
                              ),
                              ...(selectedItem?.selectedMainExtras || []).map(
                                (extra) => extra.name_en
                              ),
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        </div>

                        <DialogFooter className="mt-4">
                          <div className="flex items-center gap-4">
                            {/* <p className="text-sm font-semibold mr-1 ">
                            {selectedUser ? massegeNotSerachPhone : ""} 
                            </p> */}
                            {!selectedUser && massegeNotSerachPhone && (
                              <p className="text-sm font-semibold mr-1">
                                {massegeNotSerachPhone}
                              </p>
                            )}

                            <p className="text-sm font-semibold mr-1 ">
                              {deliveryMethod === "pickup" &&
                              !isBranchManuallySelected
                                ? massegeNotSelectedBranch
                                : ""}
                            </p>

                            <Button
                              type="submit"
                              color="success"
                              onClick={handleAddToCart}
                              disabled={
                                !selectedUser ||
                                (deliveryMethod === "pickup" &&
                                  !isBranchManuallySelected) ||
                                !selectedItem?.description
                              }
                            >
                              Add to Cart
                            </Button>
                          </div>
                        </DialogFooter>
                      </div>
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
                            <div className="flex gap-2 items-start mb-4">
                              {/* Username Input */}
                              <div className="flex-1 flex flex-col">
                                <Input
                                  type="text"
                                  placeholder="Username"
                                  {...registerAddNewUser("username")}
                                  className="w-full text-[#000] dark:text-[#fff]"
                                />
                                {errorsAddNewUser.username && (
                                  <p className="text-red-500 text-sm h-[20px] mt-2">
                                    {errorsAddNewUser.username.message}
                                  </p>
                                )}
                              </div>
                              <div className="flex-1 flex flex-col">
                                <Controller
                                  name="area"
                                  control={control}
                                  rules={{ required: "Area is required" }}
                                  render={({ field }) => (
                                    <Select
                                      {...field}
                                      options={areasOptions || []}
                                      placeholder="Area"
                                      className="react-select w-full mb"
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
                                  <p className="text-red-500 text-sm h-[20px]">
                                    {errorsAddNewUser.area.message}
                                  </p>
                                )}
                              </div>
                              {/* Phone Input */}
                            </div>
                            <div className="flex gap-2 items-start mb-4">
                              <div className="flex-1 flex flex-col">
                                <Input
                                  type="number"
                                  placeholder="Phone"
                                  {...registerAddNewUser("phone")}
                                  className="w-full  text-[#000] dark:text-[#fff]"
                                />
                                {errorsAddNewUser.phone && (
                                  <p className="text-red-500 text-sm h-[20px] mt-2">
                                    {errorsAddNewUser.phone.message}
                                  </p>
                                )}
                              </div>
                              <div className="flex-1 flex flex-col">
                                <Input
                                  type="number"
                                  placeholder="Phone 2"
                                  {...registerAddNewUser("phone2")}
                                  className="w-full text-[#000] dark:text-[#fff]"
                                />
                                {errorsAddNewUser.phone2 && (
                                  <p className="text-red-500 text-sm h-[20px] mt-2">
                                    {errorsAddNewUser.phone2.message}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex gap-2 items-center my-3 mb-4">
                              {/* Street Input */}
                              <div className="flex-1">
                                <Input
                                  type="text"
                                  placeholder="Street"
                                  {...registerAddNewUser("street")}
                                  className="w-full text-[#000] dark:text-[#fff]"
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
                                  className="w-full text-[#000] dark:text-[#fff]"
                                />
                                {errorsAddNewUser.street && (
                                  <div className="h-[20px]"></div>
                                )}
                              </div>
                            </div>

                            <div className="flex gap-2 items- my-3 mb-4">
                              <Input
                                type="text"
                                placeholder="Floor"
                                {...registerAddNewUser("floor")}
                                // className="mb-4"
                                // className={`${
                                //   errorsAddNewUser.floor ? "mb-1" : "mb-4"
                                // }`}
                                className=" text-[#000] dark:text-[#fff]"
                              />

                              <Input
                                type="text"
                                placeholder="Apt"
                                {...registerAddNewUser("apt")}
                                className="mb-1 text-[#000] dark:text-[#fff]"
                              />
                            </div>
                            <Input
                              type="text"
                              placeholder="Land mark"
                              {...registerAddNewUser("additionalInfo")}
                              className="mb-4 text-[#000] dark:text-[#fff]"
                            />

                            <div className="space-y-1">
                              {/* Checkboxes */}
                              <div className="flex gap-4 items-center">
                                {["home", "work", "other"].map((type) => (
                                  <label
                                    key={type}
                                    className="flex items-center gap-2 "
                                  >
                                    <Input
                                      type="checkbox"
                                      name="addressType"
                                      className="mt-1"
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
                                  className="text-[#000] dark:text-[#fff]"
                                />
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
                                  className="react-select w-full my-3 mb-4"
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
                            {errorsAddNewAddress.area && (
                              <p className="text-red-500 text-sm">
                                {errorsAddNewAddress.area.message}
                              </p>
                            )}

                            <div className="flex gap-2 items-center my-3 mb-4">
                              <div className="flex-1">
                                <Input
                                  type="text"
                                  placeholder="Street"
                                  {...registerAddNewAddress("street")}
                                  className="w-full text-[#000] dark:text-[#fff] "
                                />
                                <p
                                  className={`text-red-500 text-sm mt-1 transition-all duration-200 ${
                                    errorsAddNewAddress.street
                                      ? "h-auto opacity-100"
                                      : "h-0 opacity-0"
                                  }`}
                                >
                                  {errorsAddNewAddress.street?.message}
                                </p>
                              </div>

                              <div className="flex-1">
                                <Input
                                  type="text"
                                  placeholder="Building"
                                  {...registerAddNewAddress("building")}
                                  className="w-full  text-[#000] dark:text-[#fff]"
                                />
                                {errorsAddNewAddress.street && (
                                  <div className="h-[20px]"></div>
                                )}
                              </div>
                            </div>

                            <div className="flex gap-2 items- my- mb-4">
                              <Input
                                type="text"
                                placeholder="Floor"
                                {...registerAddNewAddress("floor")}
                                // className="mb-4"
                                // className={`${
                                //   registerAddNewAddress.floor ? "mb-1" : "mb-4"
                                // }`}
                                className=" text-[#000] dark:text-[#fff]"
                              />

                              <Input
                                type="text"
                                placeholder="Apt"
                                {...registerAddNewAddress("apt")}
                                className="mb-  text-[#000] dark:text-[#fff]"
                              />
                            </div>
                            <Input
                              type="text"
                              placeholder="Land mark"
                              {...registerAddNewAddress("additionalInfo")}
                              className="mb-  text-[#000] dark:text-[#fff]"
                            />

                            <div className="space-y-1">
                              <div className="flex gap-4 items-center">
                                {["home", "work", "other"].map((type) => (
                                  <label
                                    key={type}
                                    className="flex items-center gap-2"
                                  >
                                    <Input
                                      type="checkbox"
                                      name="addressType"
                                      className="mt-1"
                                      value={type}
                                      checked={addAddressType === type}
                                      onChange={() =>
                                        handleAddressTypeAdd(type)
                                      }
                                    />
                                    {type.charAt(0).toUpperCase() +
                                      type.slice(1)}{" "}
                                  </label>
                                ))}
                              </div>

                              {addAddressType === "other" && (
                                <Input
                                  type="text"
                                  placeholder="Enter address name"
                                  {...registerAddNewAddress("name")}
                                  className="text-[#000] dark:text-[#fff]"
                                />
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
        <div className="flex flex-col gap-4 mt-[15px]">
          <Select
            placeholder="Select Restaurant"
            className="react-select w-[3] mb-0"
            classNamePrefix="select"
            options={restaurantsSelect}
            value={restaurantsSelect.find(
              (option) => option.value === selectedRestaurantId
            )}
            onChange={handleRestaurantChange}
            styles={selectStyles(theme, color)}
          />
          <Card className="p-4 shadow-m rounded-lg w-full mt-0">
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
                  className="pl-7 pr-8 w-full text-[#000] dark:text-[#fff]"
                />
                {search && (
                  <button
                    onClick={handleClear}
                    className="absolute top-1/2 right-2 -translate-y-1/2 text-[#000] dark:text-[#fff] text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSearch}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "none",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#0056b3")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "#007bff")
                  }
                >
                  <FiSearch className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleNewUserClick}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    border: "none",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#0056b3")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "#007bff")
                  }
                >
                  <Admin />
                </Button>
              </div>
            </div>

            {selectedUser && isOpenUserData && (
              <div className="mt-2 p-2  rounded-md">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    {selectedUser.user_name}
                  </h3>
                  <Button
                    className="my3"
                    onClick={() => setOpenEditDialog(true)}
                  >
                    <FiEdit className=" " />
                  </Button>
                </div>
                <div className="mt-2">
                  <p className="mb-2 flex">Phone: {selectedUser.phone}</p>

                  {selectedUser?.phone2 && (
                    <p>Phone2: {selectedUser?.phone2 || ""} </p>
                  )}
                </div>

                <div className="flex items-center gap-4 mt-2">
                  <p>Orders Count: {selectedUser.orders_count}</p>
                  <p>Points: {selectedUser.user.points}</p>
                </div>
              </div>
            )}
          </Card>

          {selectedAddressArray?.length > 0 && (
            <>
              <h3 className="text-lg font-semibold "></h3>
              <Card className="p-4 s w-full mt-0">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setIsOpenAddress(!isOpenAddress)}
                >
                  {deliveryMethod === "delivery" && selectedAddress && (
                    <div className="mt- ">
                      <p className="text-sm">{selectedAddress?.address1}</p>
                    </div>
                  )}
                  {deliveryMethod === "pickup" && selectedAddress && (
                    <div>
                      <p className="text-sm">
                        Pickup{" "}
                        {selectedBranchName ? `- ${selectedBranchName}` : ""}
                      </p>
                    </div>
                  )}
                  <span className="ml-auto">
                    {isOpenAddress ? <FaChevronUp /> : <FaChevronDown />}
                  </span>
                </div>

                {isOpenAddress && selectedUser && (
                  <div className="mt-2 p-2  rounded-md">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <input
                            type="radio"
                            id="delivery"
                            checked={deliveryMethod === "delivery"}
                            onChange={() => setDeliveryMethod("delivery")}
                          />
                          <label htmlFor="delivery">Delivery</label>
                        </div>
                        <div className="flex items-center gap-1">
                          <input
                            type="radio"
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
                        <FaPlus className="m text-xs" />
                      </Button>
                    </div>

                    {deliveryMethod === "delivery" && (
                      <div className="my-3">
                        <h4 className="font-medium my-3">Address:</h4>
                        {selectedAddressArray.map((address) => (
                          <div
                            key={address.id}
                            className="flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <input
                                type="radio"
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
                                      permanently delete this address.
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
                                      onClick={() =>
                                        handleDeleteAddress(address.id)
                                      }
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

                    {deliveryMethod === "pickup" && (
                      <div className="flex flex-col lg:flex-row lg:items-center gap-2">
                        <Select
                          className="react-select w-full"
                          classNamePrefix="select"
                          options={branchOptions}
                          onChange={handleSelectChangeBranches}
                          placeholder="Branches"
                          styles={selectStyles(theme, color)}
                          value={selectedBranchInSelected}
                        />
                        {showAlertBranch && (
                          <AlertDialog
                            open={showAlertBranch}
                            onOpenChange={setShowAlertBranch}
                          >
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Changing the branch will clear your cart. Do
                                  you want to proceed?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={handleCancelChange}>
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleConfirmChange}
                                >
                                  Ok
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}

                        {/* <AlertDialog
  open={showBranchChangeAlert}
  onOpenChange={setShowBranchChangeAlert}
>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>
        Changing the branch will clear your cart. Do you want to proceed?
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel
        type="button"
        variant="outline"
        color="info"
        onClick={() => setShowBranchChangeAlert(false)}
      >
        Cancel
      </AlertDialogCancel>
      <AlertDialogAction
        className="bg-destructive hover:bg-destructive/80"
        onClick={confirmBranchChange}
      >
        Ok
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog> */}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </>
          )}
          {cartItems.length > 0 && (
            <>
              <h3 className="text-lg font-semibold"></h3>
              <Card className="w-full mt-0 mb-3">
                {cartItems.length > 0 && (
                  <>
                    <Card className="w-full p-2  mt-0">
                      {cartItems.length > 0 && (
                        <>
                          <Card className="w-full p-2  mt-0">
                            {cartItems.map((item, index) => {
                              const extrasTotal =
                                item.selectedMainExtras?.reduce(
                                  (sum, extra) =>
                                    sum + parseFloat(extra?.price_en || 0),
                                  0
                                ) || 0;

                              const itemPrice = parseFloat(item?.price || 0);
                              const itemQuantity = parseFloat(
                                item?.quantity || 0
                              );
                              const total = itemPrice * itemQuantity;
                              const itemTotal = total + extrasTotal;

                              return (
                                <div key={item.id} className="p-2 mb-4">
                                  <div className="flex justify-between gap-2 pb-2 mb-1">
                                    <span className="text-center break-words whitespace-nowrap overflow-hidden text-[14px] font-semibold">
                                      {item.selectedInfo}
                                    </span>
                                    <span className="inline-flex items-center gap-1">
                                      {item.price.toFixed(2)}
                                      <span>EGP</span>
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm text-[#fff] mb-2">
                                      {item.selectedExtras?.map((extra) => (
                                        <p
                                          key={extra.id}
                                          className="mb-1 text-[#000] dark:text-[#fff]"
                                        >
                                          {extra.name_en}
                                        </p>
                                      ))}
                                      {item.selectedMainExtras?.map((extra) => (
                                        <p
                                          key={extra.id}
                                          className="mb-1 text-[#000] dark:text-[#fff]"
                                        >
                                          {extra.name_en}
                                        </p>
                                      ))}
                                    </div>
                                    <div className="flex items-center">
                                      <button
                                        onClick={() =>
                                          handleDecreaseTable(item.id)
                                        }
                                        className="text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400"
                                      >
                                        -
                                      </button>
                                      <span className="mx-4 text-gray-800 dark:text-gray-200">
                                        {item.quantity}
                                      </span>
                                      <button
                                        onClick={() =>
                                          handleIncreaseTable(item.id)
                                        }
                                        className="text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                  <div className="my-3">
                                    <Input
                                      type="text"
                                      value={item.note || ""}
                                      onChange={(e) =>
                                        handleNoteChange(e, item.id)
                                      }
                                      placeholder="No note added"
                                      className="w-full px-3 py- border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700"
                                    />
                                  </div>

                                  <div className="flex justify-between items-center">
                                    <div className="flex ml-1  items-center">
                                      <button
                                        size="icon"
                                        onClick={() => handleEditItem(item)}
                                        className="text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400"
                                      >
                                        <FiEdit className="mr-3 text-l" />
                                      </button>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <button className="flex items-center text-red-500 hover:text-red-400 gap-[2px]">
                                            <FiTrash2 className="text-l" />
                                          </button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                                          <AlertDialogHeader>
                                            <AlertDialogTitle className="text-gray-800 dark:text-gray-200">
                                              Are you absolutely sure?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                                              This action cannot be undone. This
                                              will permanently delete this item
                                              from your saved items.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel
                                              type="button"
                                              variant="outline"
                                              className="text-gray-800 dark:text-gray-200 border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
                                            >
                                              Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                              className="bg-red-600 hover:bg-red-500 text-white"
                                              onClick={() =>
                                                handleRemoveItem(item.id)
                                              }
                                            >
                                              Ok
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                    <span className="inline-flex items-center gap-1">
                                      {itemTotal.toFixed(2)} EGP
                                    </span>
                                  </div>
                                  {index !== cartItems.length - 1 && (
                                    <div className="border-b border-gray-500 -mx-4 mt-4"></div>
                                  )}
                                </div>
                              );
                            })}
                            {/* <div className="border-b border-gray-300  my-3"></div> */}

                            {/* <div className="flex justify-between items-center">
                        <span>grandTotal:</span>
                        <p className="inline-flex items-center gap-1">
                          {grandTotal.toFixed(2)}
                          <span>EGP</span>
                        </p>
                      </div> */}
                          </Card>
                        </>
                      )}
                    </Card>
                  </>
                )}
              </Card>
            </>
          )}
          {cartItems.length > 0 && (
            <>
              <h3 className="text-lg font-semibold"></h3>
              <Card className="w-full p-2 shadow-md rounded-lg mt-0">
                {cartItems.length > 0 && (
                  <>
                    <Card title="Bordered Tables">
                      <Table>
                        <TableBody>
                          {/* <TableRow>
                            <TableCell className="text-[#000] dark:text-[#fff]">
                            grandTotal
                            </TableCell>
                            <TableCell className="text-[#000] dark:text-[#fff] ml-">
                             
                            </TableCell>
                            <TableCell className="text-[#000] dark:text-[#fff]">
                            <p className="inline-flex items-center gap-1">
                          {grandTotal.toFixed(2)}
                          <span>EGP</span>
                        </p>
                            </TableCell>
                          </TableRow> */}
                          <TableRow>
                            <TableCell className="text-[#000] dark:text-[#fff]">
                              Subtotal
                            </TableCell>
                            <TableCell className="text-[#000] dark:text-[#fff] ml-">
                              {cartItems?.length}
                            </TableCell>
                            <TableCell className="text-[#000] dark:text-[#fff]">
                              {grandTotal.toFixed(2)} EGP
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-[#000] dark:text-[#fff]">
                              VAT
                            </TableCell>
                            <TableCell className="text-[#000] dark:text-[#fff]">
                              {Tax}%
                            </TableCell>
                            <TableCell className="text-[#000] dark:text-[#fff]">
                              {(grandTotal * (Tax / 100)).toFixed(2)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-[#000] dark:text-[#fff]">
                              Delivery
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell className="text-[#000] dark:text-[#fff]">
                              {Delivery || 0} EGP
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-[#000] dark:text-[#fff]">
                              Discount
                            </TableCell>
                            <TableCell className="text-[#000] dark:text-[#fff]">
                              0%
                            </TableCell>
                            <TableCell className="text-[#000] dark:text-[#fff]">
                              0
                            </TableCell>
                          </TableRow>
                        </TableBody>
                        <TableFooter className="bg-default-100 border-t border-default-300">
                          <TableRow>
                            <TableCell
                              colSpan="2"
                              className="text-sm  font-semibold text-[#000] dark:text-[#fff]"
                            >
                              Total
                            </TableCell>
                            <TableCell className="text-sm  font-semibold text-right text-[#000] dark:text-[#fff]">
                              {totalAmount.toFixed(2)} EGP
                            </TableCell>
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </Card>

                    {createOrderDialogOpen && (
                      <Dialog
                        open={createOrderDialogOpen}
                        onOpenChange={setCreateOrderDialogOpen}
                      >
                        <DialogContent size="3xl">
                          <DialogHeader>
                            <DialogTitle className="text-base font-medium text-default-700">
                              Payment Process
                            </DialogTitle>
                          </DialogHeader>
                          <div className="text-sm text-default-500 space-y-4">
                            <form
                              onSubmit={handleCreateOrder(
                                onSubmithandleCreateOrder
                              )}
                            >
                              <div className="flex gap-4 my-3">
                                <div className="flex flex-col w-1/2">
                                  <label className="text-gray-700 dark:text-gray-200 font-medium mb-1">
                                    Payment
                                  </label>

                                  <Controller
                                    name="orderpayment"
                                    control={controlCreateOrder}
                                    rules={{
                                      required: "Order payment is required",
                                    }}
                                    render={({ field }) => (
                                      <Select
                                        {...field}
                                        options={orderPaymenyOptions}
                                        placeholder="Select Order Payment"
                                        className="react-select"
                                        classNamePrefix="select"
                                        value={
                                          orderPaymenyOptions.find(
                                            (option) =>
                                              option.value === field.value
                                          ) || null
                                        } // ✅ تصحيح القيمة
                                        onChange={(selectedOption) => {
                                          field.onChange(selectedOption.value);
                                          setValueCreateOrder(
                                            "orderpayment",
                                            selectedOption.value
                                          );
                                        }}
                                        styles={selectStyles(theme, color)}
                                      />
                                    )}
                                  />
                                </div>
                                <div className="flex flex-col w-1/2">
                                  <label className="text-gray-700 dark:text-gray-200 font-medium mb-1">
                                    Channal
                                  </label>

                                  <Controller
                                    name="ordersource"
                                    control={controlCreateOrder}
                                    rules={{
                                      required: "Order source is required",
                                    }}
                                    render={({ field }) => (
                                      <Select
                                        {...field}
                                        options={orderSourceOptions}
                                        placeholder="Select Order Source"
                                        className="react-select"
                                        classNamePrefix="select"
                                        value={
                                          orderSourceOptions.find(
                                            (option) =>
                                              option.label === field.value
                                          ) || null
                                        }
                                        onChange={(selectedOption) => {
                                          field.onChange(selectedOption.label); // ✅ تخزين label فقط
                                          setValueCreateOrder(
                                            "ordersource",
                                            selectedOption.label,
                                            { shouldValidate: true }
                                          );
                                          setOrderSourceSelected(
                                            selectedOption
                                          ); // ✅ تحديث useState
                                        }}
                                        styles={selectStyles(theme, color)}
                                      />
                                    )}
                                  />
                                </div>
                                <div className="flex flex-col w-1/2">
                                  <label className="text-gray-700 dark:text-gray-200 font-medium mb-1">
                                    Order Type
                                  </label>

                                  <Controller
                                    name="ordertype"
                                    control={controlCreateOrder}
                                    rules={{
                                      required: "Order type is required",
                                    }}
                                    render={({ field }) => (
                                      <Select
                                        {...field}
                                        options={orderTypeOptions}
                                        placeholder="Select Order Type"
                                        className="react-select"
                                        classNamePrefix="select"
                                        value={
                                          orderTypeOptions.find(
                                            (option) =>
                                              option.value === field.value
                                          ) || null
                                        }
                                        onChange={(selectedOption) => {
                                          field.onChange(selectedOption.value);
                                          setSelectedOrderType(selectedOption);
                                        }}
                                        styles={selectStyles(theme, color)}
                                      />
                                    )}
                                  />
                                </div>
                              </div>

                              <div className="flex flex-col lg:flex-row lg:items-center gap-2">
                                {/* <div className="flex flex-col w-1/2">
                             <label className="text-gray-700 dark:text-gray-200 font-medium mb-1">
                             Address:
                                  </label>
                                  <p > {selectedOrderType?.value === 1 ?  selectedAddress?.address1 : "Pickup"}</p>
                             </div> */}

                                <div className="flex w-1/2 items-center">
                                  <label className="text-[#000] dark:text-[#fff] font-medium text-[] mb-1  mr-2">
                                    Address:
                                  </label>
                                  {selectedOrderType?.value === 1 ? (
                                    <p className="w-full text-[#000] dark:text-[#fff]">
                                      {selectedAddress?.address1}
                                    </p>
                                  ) : (
                                    <p className="w-full text-[#000] dark:text-[#fff]">
                                      Pickup
                                    </p>
                                  )}
                                </div>

                                <div className="flex flex-col w-1/2">
                                  <label className="text-gray-700 dark:text-gray-200 font-medium mb-1">
                                    Branch
                                  </label>
                                  {/* 
                                    <Controller
                                      name="branches"
                                      control={controlCreateOrder}
                                      defaultValue={selectedBranch?.id || ""}
                                      render={({ field }) => {
                                      
                                        return (
                                          <Select
                                            {...field}
                                            className="react-select w-full"
                                            classNamePrefix="select"
                                            options={branchOptions}
                                            onChange={(selectedOption) => {
                                              if (!selectedOption) return;

                                              const branchId = Number(
                                                selectedOption.value
                                              );
                                              // console.log(
                                              //   "Selected Branch ID Before Storing:",
                                              //   branchId
                                              // );

                                              field.onChange(branchId);
                                              setSelectedBranchIdCreateOrder(
                                                branchId
                                              );
                                              setSelectedBranchPriceList(
                                                selectedOption.priceList
                                              );
                                              setValueCreateOrder(
                                                "branches",
                                                branchId,
                                                { shouldValidate: true }
                                              );

                                              // console.log(
                                              //   "Stored Branch ID in Form setValueCreateOrder:",
                                              //   getValueCreateOrder("branches")
                                              // ); // ✅ تأكيد التخزين
                                            }}
                                            value={
                                              branchOptions?.find(
                                                (option) =>
                                                  option.value === field.value
                                              ) || null
                                            }
                                            placeholder="Branches"
                                            styles={selectStyles(theme, color)}
                                          />
                    
                                        );
                                      }}
                                    /> */}
                                  <Controller
                                    name="branches"
                                    control={controlCreateOrder}
                                    defaultValue={
                                      selectedBranch?.id ||
                                      branchOptions?.[0]?.value ||
                                      ""
                                    }
                                    render={({ field }) => {
                                      return (
                                        <Select
                                          {...field}
                                          className="react-select w-full"
                                          classNamePrefix="select"
                                          options={branchOptions}
                                          onChange={(selectedOption) => {
                                            if (!selectedOption) return;

                                            const branchId = Number(
                                              selectedOption.value
                                            );

                                            field.onChange(branchId);
                                            setSelectedBranchIdCreateOrder(
                                              branchId
                                            );
                                            setSelectedBranchPriceList(
                                              selectedOption?.priceList
                                            );
                                            setSavedBranch(selectedOption);
                                            setSelectedBranchInSelected(
                                              selectedOption
                                            );
                                            setSelectedBranchName(
                                              selectedOption?.label
                                            );
                                            setValueCreateOrder(
                                              "branches",
                                              branchId,
                                              { shouldValidate: true }
                                            );
                                          }}
                                          value={
                                            branchOptions?.find(
                                              (option) =>
                                                option.value === field.value
                                            ) ||
                                            branchOptions?.[0] || // اختيار أول عنصر تلقائيًا
                                            null
                                          }
                                          placeholder="Branches"
                                          styles={selectStyles(theme, color)}
                                        />
                                      );
                                    }}
                                  />

                                  {/* <Controller
  name="branches"
  control={controlCreateOrder}
  defaultValue={selectedBranch?.id || ""}
  render={({ field }) => (
    <Select
      {...field}
      className="react-select w-full"
      classNamePrefix="select"
      options={branchOptions}
      onChange={handleBranchChangeCreateOrder} // استدعاء الدالة عند تغيير الفرع
      value={branchOptions.find((option) => option.value === field.value) || null}
      placeholder="Branches"
      styles={selectStyles(theme, color)}
    />
  )}
/> */}
                                </div>
                              </div>

                              <div className="flex flex-col gap-4 my-3">
                                {/* ✅ Checkbox للتحكم في ظهور الـ Inputs */}
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    id="toggleDateTime"
                                    checked={showDateTime}
                                    onChange={() =>
                                      setShowDateTime(!showDateTime)
                                    }
                                    className="w-5 h-5 accent-blue-500 cursor-pointer"
                                  />
                                  <label
                                    htmlFor="toggleDateTime"
                                    className="text-gray-700 dark:text-gray-200 font-medium cursor-pointer"
                                  >
                                    Schedule
                                  </label>
                                </div>

                                {showDateTime && (
                                  <div className="flex gap-4">
                                    {/* Start Date */}

                                    <div className="flex flex-col  w-1/2">
                                      <label className="text-gray-700 dark:text-gray-200 font-medium mb-1">
                                        Start Date
                                      </label>
                                      <Controller
                                        name="startDate"
                                        control={controlCreateOrder}
                                        rules={{
                                          required: "Start date is required",
                                        }}
                                        render={({ field }) => (
                                          <Input
                                            {...field}
                                            type="date"
                                            className="border -gray-300 rounded-md p-2 w-full"
                                            min="1900-01-01"
                                            max="2099-12-31"
                                          />
                                        )}
                                      />
                                    </div>
                                    {/* Start Time */}
                                    <div className="flex flex-col  w-1/2">
                                      <label className="text-gray-700 dark:text-gray-200 font-medium mb-1">
                                        Start Time
                                      </label>
                                      <Controller
                                        name="startTime"
                                        control={controlCreateOrder}
                                        rules={{
                                          required: "Start time is required",
                                        }}
                                        render={({ field }) => (
                                          <Input
                                            {...field}
                                            type="time"
                                            className="border -gray-300 rounded-md p-2 w-full"
                                          />
                                        )}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col lg:flex-row lg:items-center gap-2 mt-3">
                                <div className="flex flex-col w-1/2">
                                  <label className="text-gray-700 dark:text-gray-200 font-medium mb-1">
                                    Insert coupon
                                  </label>

                                  <Input
                                    type="text"
                                    placeholder="insert Coupon"
                                    {...registerCreateOrder("insertcoupon")}
                                    // className="w-full"
                                  />
                                </div>
                                <div className="flex flex-col w-1/2 ">
                                  <label className="text-gray-700 dark:text-gray-200 font-medium mb-1">
                                    Insert Points
                                  </label>
                                  <div className="flex gap-2">
                                    <Input
                                      type="number"
                                      placeholder="Insert Points"
                                      className="border p-2 text-"
                                      {...registerCreateOrder("insertpoints", {
                                        setValueAs: (v) =>
                                          v === "" ? 0 : Number(v),
                                      })}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col lg:flex-row lg:items-center gap-2 mt-2">
                                {/* ✅ قسم الخصم */}
                                <div className="flex flex-col w-1/2">
                                  <label className="text-gray-700 dark:text-gray-200 font-medium mb-1">
                                    Discount
                                  </label>
                                  <div className="flex gap-2 items-center">
                                    <div className="flex items-center border rounded overflow-hidden">
                                      <Input
                                        type="number"
                                        value={discountValue}
                                        onChange={handleDiscountValueChange}
                                        className="border-0 p-2 w-20 text-center"
                                      />
                                      <span className="px-3 bg-gray- border-l h-[36px] flex items-center justify-center">
                                        L.E
                                      </span>
                                    </div>

                                    <div className="flex items-center border rounded overflow-hidden">
                                      <Input
                                        type="number"
                                        value={discountPercentage}
                                        onChange={
                                          handleDiscountPercentageChange
                                        }
                                        className="border-0 p-2 w-20 text-center"
                                      />
                                      <span className="px-3 bg-gray- border-l h-[36px] flex items-center justify-center">
                                        %
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* ✅ ملاحظات الطلب */}
                                <div className="flex flex-col h-full flex-1">
                                  <label className="text-gray-700 dark:text-gray-200 font-medium mb-1">
                                    Order notes
                                  </label>
                                  <div className="flex-1 w-full">
                                    <Textarea
                                      type="text"
                                      placeholder="Order notes"
                                      className="border p-2  h-full resize-none !w-full"
                                      {...registerCreateOrder("notes")}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between mt-5">
                                {/* Total Order على اليسار */}
                                <div className="text-sm font-medium text-[#]">
                                  <span className="text- text-[#000] dark:text-[#fff]">
                                    {/* Total Order : {totalAmount.toFixed(2)} EGP */}
                                    Total Order : {finalTotal.toFixed(2)} EGP
                                  </span>
                                </div>

                                {/* Select في المنتصف */}
                                <div className="w-1/3 flex justify-center">
                                  <Controller
                                    name="orderstatus"
                                    control={controlCreateOrder}
                                    rules={{
                                      required: "Order status is required",
                                    }}
                                    render={({ field }) => (
                                      <Select
                                        {...field}
                                        options={orderStatusOptions || []}
                                        placeholder="Select Order status"
                                        className="react-select w-full"
                                        classNamePrefix="select"
                                        value={
                                          orderStatusOptions.find(
                                            (option) =>
                                              option.value === field.value
                                          ) || null
                                        }
                                        onChange={(selectedOption) => {
                                          field.onChange(selectedOption.value);
                                          setValueCreateOrder(
                                            "orderstatus",
                                            selectedOption.value
                                          );
                                        }}
                                        styles={selectStyles(theme, color)}
                                      />
                                    )}
                                  />
                                </div>

                                <DialogFooter>
                                  <DialogClose asChild></DialogClose>
                                  <Button type="submit">Send order</Button>
                                </DialogFooter>
                              </div>
                            </form>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}

                    <div className="flex items-center justify-between gap-5 my-5">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button className="w-1/2" color="destructive">
                            Cancel
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action will reset everything and start the
                              process from the beginning.
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
                              onClick={handleCacelOrder}
                            >
                              Ok
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <Button
                        className="w-1/2"
                        color="success"
                        onClick={() => setCreateOrderDialogOpen(true)}
                      >
                        Checkout
                      </Button>
                    </div>
                  </>
                )}
              </Card>
            </>
          )}

          {/* 
          <Table className="border border-default-300">
            <TableHeader>
              <TableRow className="bg-gray-200 dark:bg-gray-800"></TableRow>
            </TableHeader>

            <TableBody>
              {cartItems.map((item) => {
                const extrasTotal =
                  item.selectedMainExtras?.reduce(
                    (sum, extra) => sum + parseFloat(extra?.price_en || 0), // تأكد أن القيمة رقمية
                    0
                  ) || 0;

                const itemPrice = parseFloat(item?.price || 0);
                const itemQuantity = parseFloat(item?.quantity || 0);

                const total = itemPrice * itemQuantity;
                const itemTotal = total + extrasTotal;

                return (
                  <React.Fragment key={item.id}>
                    <TableRow className="bg-white dark:bg-gray-600">
                      <TableCell className="text-gray-800 dark:text-gray-200">
                        <div className="flex flex-col gap-1 mb-2 ">
                          <span className="text-center break-words whitespace-nowrap overflow-hidden text-[14px] font-semibold">
                            {item.selectedInfo}
                          </span>
                        </div>
                        <div>
                          <Input
                            type="text"
                            value={item.note || ""}
                            onChange={(e) => handleNoteChange(e, item.id)}
                            placeholder="No note added"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700"
                          />
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center">
                          <button
                            onClick={() => handleDecreaseTable(item.id)}
                            className="text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400"
                          >
                            -
                          </button>
                          <span className="mx-4 text-gray-800 dark:text-gray-200">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleIncreaseTable(item.id)}
                            className="text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400"
                          >
                            +
                          </button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-3 ml-auto ">
                          <button
                            size="icon"
                            onClick={() => handleEditItem(item)}
                            className="text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400"
                          >
                            <FiEdit className="mr-1 text-xs" />
                          </button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button className="flex items-center text-red-500 hover:text-red-400 gap-[2px]">
                                <FiTrash2 className="text-xs" />
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-gray-800 dark:text-gray-200">
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                                  This action cannot be undone. This will
                                  permanently delete this item from your saved
                                  items.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel
                                  type="button"
                                  variant="outline"
                                  className="text-gray-800 dark:text-gray-200 border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
                                >
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-600 hover:bg-red-500 text-white"
                                  onClick={() => handleRemoveItem(item.id)}
                                >
                                  Ok
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-800 dark:text-gray-200">
                        <span className="inline-flex items-center gap-1">
                          {item.price.toFixed(2)}
                          <span>EGP</span>
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-800 dark:text-gray-200">
                        {itemTotal.toFixed(2)} EGP
                      </TableCell>
                    </TableRow>

                    {item.selectedMainExtras?.map((extra) => (
                      <TableRow
                        key={extra.id}
                        className="bg-gray-100 dark:bg-gray-700"
                      >
                        <TableCell className="pl-6 text-gray-800 dark:text-gray-200 whitespace-nowrap overflow-hidden text-ellipsis">
                          {extra.name_en}
                        </TableCell>

                        <TableCell colSpan={3}></TableCell>
                        <TableCell className="text-gray-800 dark:text-gray-200">
                          {extra.price_en} EGP
                        </TableCell>
                      </TableRow>
                    ))}
                    {item.selectedExtras?.map((extra) => (
                      <TableRow
                        key={extra.id}
                        className="bg-gray-100 dark:bg-gray-700"
                      >
                        <TableCell className="pl-6 text-gray-800 dark:text-gray-200">
                          {extra.name_en}
                        </TableCell>
                        <TableCell colSpan={3}></TableCell>
                        <TableCell className="text-gray-800 dark:text-gray-200">
                          <span className="inline-flex items-center gap-1">
                            {extra.price_en}
                            <span>EGP</span>
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                );
              })}
            </TableBody>
            <tfoot>
              <TableRow className="bg-gray-300 dark:bg-gray-900">
                <TableCell
                  colSpan={4}
                  className="font-bold text-gray-900 dark:text-gray-100 text-left"
                >
                  Grand Total:
                </TableCell>
                <TableCell className="font-bold text-gray-900 dark:text-gray-100">
                  <span className="inline-flex items-center gap-1">
                    {grandTotal.toFixed(2)}
                    <span>EGP</span>
                  </span>
                </TableCell>
              </TableRow>
            </tfoot>
          </Table> */}
        </div>
        <>
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
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-[#000] dark:text-[#fff]"
                  >
                    Username
                    {/* <span className="text-red-500">*</span> */}
                  </label>

                  <Input
                    id="username"
                    type="text"
                    placeholder="Username"
                    {...registerEdit("username")}
                    className={`${
                      errorsEdit.username ? "mb-1" : "mb-4"
                    } text-[#000] dark:text-[#fff]`}
                  />
                  {errorsEdit.username && (
                    <p className="text-red-500 text-sm my-1">
                      {errorsEdit.username.message}
                    </p>
                  )}

                  {/* Phone */}
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-[#000] dark:text-[#fff]"
                  >
                    Phone
                    {/* <span className="text-red-500">*</span>    */}
                  </label>
                  <Input
                    id="phone"
                    type="number"
                    placeholder="Phone"
                    {...registerEdit("phone")}
                    className={`${
                      errorsEdit.phone ? "mb-1" : "mb-4"
                    } text-[#000] dark:text-[#fff]`}
                  />
                  {errorsEdit.phone && (
                    <p className="text-red-500 text-sm">
                      {errorsEdit.phone.message}
                    </p>
                  )}

                  {/* Phone 2 */}
                  <label
                    htmlFor="phone2"
                    className="block text-sm font-medium text-[#000] dark:text-[#fff]"
                  >
                    Phone 2
                  </label>
                  <Input
                    id="phone2"
                    type="number"
                    placeholder="Phone 2"
                    {...registerEdit("phone2", { required: false })}
                    className={`${
                      errorsEdit.phone2 ? "mb-1" : "mb-4"
                    } text-[#000] dark:text-[#fff]`}
                  />
                  {errorsEdit.phone2 && (
                    <p className="text-red-500 text-sm mt-1">
                      {errorsEdit.phone2.message}
                    </p>
                  )}

                  {/* Email */}
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#000] dark:text-[#fff]"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="Email"
                    {...registerEdit("email", { required: false })}
                    className={`${
                      errorsEdit.email ? "mb-1" : "mb-4"
                    } text-[#000] dark:text-[#fff]`}
                  />
                  {errorsEdit.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errorsEdit.email.message}
                    </p>
                  )}

                  {/* Buttons */}
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
                  <DialogTitle>Edit User Address</DialogTitle>
                </DialogHeader>

                <form
                  onSubmit={handleEditAddressUser(onSubmitEditUserAddress)}
                  className="space-y-4"
                >
                  {/* Select Field */}
                  <div>
                    <label className="block mb-1">Area</label>
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
                  </div>
                  {errorsEditAddressUser.area && (
                    <p className="text-red-500 text-sm">
                      {errorsEditAddressUser.area.message}
                    </p>
                  )}

                  {/* Input Fields */}
                  <div className="flex gap-2 items-center my-3">
                    <div className="flex-1">
                      <label className="block mb-1">Street</label>
                      <Input
                        type="text"
                        {...registerEditAddressUser("street")}
                        className="w-full text-[#000] dark:text-[#fff]"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block mb-1">Building</label>
                      <Input
                        type="text"
                        {...registerEditAddressUser("building")}
                        className="w-full text-[#000] dark:text-[#fff]"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 items-center my-3">
                    <div className="flex-1">
                      <label className="block mb-1">Floor</label>
                      <Input
                        type="text"
                        {...registerEditAddressUser("floor")}
                        className="w-full text-[#000] dark:text-[#fff]"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block mb-1">Apt</label>
                      <Input
                        type="text"
                        {...registerEditAddressUser("apt")}
                        className="w-full text-[#000] dark:text-[#fff]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1">Landmark</label>
                    <Input
                      type="text"
                      {...registerEditAddressUser("additionalInfo")}
                      className="w-full text-[#000] dark:text-[#fff]"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex gap-4 items-center">
                      {["home", "work", "other"].map((type) => (
                        <label key={type} className="flex items-center gap-2">
                          <Input
                            type="checkbox"
                            name="addressType"
                            className="mt-1"
                            value={type}
                            checked={editAddressType === type}
                            onChange={() => handleEditAddressTypeChange(type)}
                          />
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </label>
                      ))}
                    </div>

                    {editAddressType === "other" && (
                      <Input
                        type="text"
                        placeholder="Enter address name"
                        value={customAddressName}
                        onChange={(e) => {
                          setCustomAddressName(e.target.value);
                          setValueEditAddressUser("name", e.target.value);
                        }}
                        className="text-[#000] dark:text-[#fff]"
                      />
                    )}
                  </div>

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
        </>
      </div>
    </div>
  );
}

export default CreateOrder;
