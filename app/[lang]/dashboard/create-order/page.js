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
import { Plus, Search } from "lucide-react";
import Image from "next/image";
import { selectStyles } from "@/lib/utils";
import Test from "./test";
import BorderedTables from "./bordered-tables";
import { Icon } from "@iconify/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchRestaurantsList,
  fetchUserByPhone,
  fetchBranches,
  fetchMenu,
} from "./apICallCenter/ApisCallCenter";
import { BASE_URL_iamge } from "@/api/BaseUrl";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { useQueryClient } from "react-query";
const userSchemaEdit = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  phone: z.string().regex(/^\d{10,15}$/, "Invalid phone number"),
  phone2: z.string().regex(/^\d{10,15}$/, "Invalid phone number"),
  // address: z.string().min(1, "Address is required"),
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
    formState: { errors },
  } = useForm({ resolver: zodResolver(userSchemaEdit), mode: "onSubmit" });
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

  const [isNewUserDialog, setIsNewUserDialog] = useState(false);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setIsNewUserDialog(false);
    setOpenDialog(true);
  };
  const handleNewUserClick = () => {
    setSelectedItem(null);
    setIsNewUserDialog(true);
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

  // تطبيق فلترة القسم إذا لم يكن "All"
  // const displayedItems =
  //   activeSection === "all"
  //     ? filteredItems
  //     : filteredItems.filter((item) => item.section === activeSection);

  // const displayedItems =
  //   activeSection === "all"
  //     ? items
  //     : items.filter((item) => item.section === activeSection);
  // const displayedItems = useMemo(() => {
  //   if (activeSection === "all") return items;
  //   return items.filter((item) => item.section === activeSection);
  // }, [activeSection, items]);

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
  const [selectedAddress, setSelectedAddress] = useState([]);
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
  useEffect(() => {
    if (selectedUser) {
      setValueEdit("username", selectedUser.user_name);
      setValueEdit("phone", selectedUser.phone);
      setValueEdit("phone2", selectedUser.phone2);
    }
  }, [selectedUser, selectedAddress, setValueEdit]);

  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  useEffect(() => {
    // تعيين العنوان الأول في القائمة كعنوان محدد
    if (selectedUser?.address?.length > 0) {
      setSelectedAddress(selectedUser.address[0].address1);
    }
  }, [selectedUser]);

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

  // const handleIncreaseTable = (id) => {
  //   setCountersTable((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  // };

  // const handleDecreaseTable = (id) => {
  //   setCountersTable((prev) => ({ ...prev, [id]: Math.max(1, prev[id] - 1) }));
  // };

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
          total: counter * selectedItem.price,
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
  const [menuData, setMenuData] = useState({});

  // useEffect(() => {
  //   if (menu) {
  //     setMenuData((prev) => ({
  //       ...prev,
  //       [selectedTab]: menu[selectedTab] || [],
  //     }));
  //   }
  // }, [menu, selectedTab]);
  const [visibleItems, setVisibleItems] = useState(20);

  const loadMore = () => {
    setVisibleItems((prev) => prev + 20); // عرض 20 عنصر إضافي
  };
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

  if (isLoadingBranchs) return <p>Loading branches...</p>;
  if (errorBranchs) return <p>Error loading branches: {error.message}</p>;
  const onSubmit = (data) => {
    const formattedData = {
      address: data.phone2,
      username: data.username,
      phone: data.phone,
    };

    console.log("Formatted Data to Send:", formattedData);
    console.log("form data:", data);
  };
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

                {/* الديالوج المشترك لكلا الحالتين */}
                {openDialog && (
                  <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogContent size="3xl">
                      <DialogHeader>
                        <DialogTitle className="text-base font-medium text-default-700">
                          {isNewUserDialog
                            ? "Create New User"
                            : "Add Item Choices"}
                        </DialogTitle>
                      </DialogHeader>

                      {isNewUserDialog ? (
                        // محتوى ديالوج New User
                        <div className="text-sm text-default-500 space-y-4">
                          <Input
                            type="text"
                            placeholder="Username"
                            className="w-full p-2 border rounded-md"
                          />
                          <Input
                            type="number"
                            placeholder="Phone"
                            className="w-full p-2 border rounded-md"
                          />
                          <Select
                            placeholder="Address"
                            className="react-select w-full"
                            classNamePrefix="select"
                            options={[
                              { value: "roxy", label: "roxy" },
                              { value: "giza", label: "giza" },
                            ]}
                            styles={selectStyles(theme, color)}
                          />
                          <div className="flex items-center gap-2 ">
                            <Input
                              type="text"
                              placeholder="Street"
                              className="w-full p-2 border rounded-md"
                            />
                            <Input
                              type="text"
                              placeholder="Building"
                              className="w-full p-2 border rounded-md"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              type="text"
                              placeholder="Floor"
                              className="w-full p-2 border rounded-md"
                            />
                            <Input
                              type="text"
                              placeholder="Apt"
                              className="w-full p-2 border rounded-md"
                            />
                          </div>
                          <Input
                            type="text"
                            placeholder="Name"
                            className="w-full p-2 border rounded-md"
                          />
                          <Input
                            type="text"
                            placeholder="Additional Info"
                            className="w-full p-2 border rounded-md"
                          />
                        </div>
                      ) : (
                        // محتوى ديالوج add new item
                        <div className="text-sm flex justify-between items-center text-default-500 space-y-4">
                          <div className="items-center">
                            <h3 className="font-medium">{selectedItem.name}</h3>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <p className="text-sm mr-5">
                              {(selectedItem.price * counter).toFixed(2)} Egp
                            </p>
                            <Button
                              onClick={handleDecrease}
                              className="text-lg"
                            >
                              -
                            </Button>
                            <span className="text-xl mx-4">{counter}</span>
                            <Button
                              onClick={handleIncrease}
                              className="text-lg"
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      )}

                      <DialogFooter className="mt-8">
                        <DialogClose asChild>
                          <Button
                            variant="outline"
                            onClick={() => setOpenDialog(false)}
                          >
                            Close
                          </Button>
                        </DialogClose>
                        <Button type="submit" onClick={handleAddToCart}>
                          {isNewUserDialog ? "Create User" : "Add to Cart"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
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

              <button
                onClick={handleClear}
                className="absolute top-1/2 right-2 -translate-y-1/2 text-red-500 text-xs font-bold"
              >
                ✕
              </button>
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

              {/*  */}
              {/* {openEditDialog && selectedUser && (
                <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
                  <DialogContent size="3xl">
                    <DialogHeader>
                      <DialogTitle>Edit User</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmitEdit(onSubmit)}>
                      <Input
                        type="text"
                        placeholder="Username"
                        {...registerEdit("username")}
                      />
                      {errors.username && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.username.message}
                        </p>
                      )}

                      <Input
                        type="number"
                        placeholder="Phone"
                        {...registerEdit("phone")}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.phone.message}
                        </p>
                      )}

                      <Input
                        type="text"
                        placeholder="Address"
                        {...registerEdit("address")}
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.address.message}
                        </p>
                      )}

                      <DialogFooter>
                        <DialogClose asChild>
                          <Button
                            variant="outline"
                            onClick={() => setOpenEditDialog(false)}
                          >
                            Close
                          </Button>
                        </DialogClose>
                        <Button
                          type="submit"
                          onClick={() => console.log("here")}
                        >
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )} */}

              {openEditDialog && selectedUser && (
                <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
                  <DialogContent size="3xl">
                    <DialogHeader>
                      <DialogTitle>Edit User</DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={handleSubmitEdit(onSubmit)}
                      className="space-y-1"
                    >
                      <Input
                        type="text"
                        placeholder="Username"
                        {...registerEdit("username")}
                        className="mb-4"
                      />
                      {errors.username && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.username.message}
                        </p>
                      )}

                      <Input
                        type="number"
                        placeholder="Phone"
                        {...registerEdit("phone")}
                        className="mb-4"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.phone.message}
                        </p>
                      )}

                      <Input
                        type="number"
                        placeholder="Phone 2"
                        {...registerEdit("phone2")}
                      />
                      {errors.phone2 && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.phone2.message}
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
                          <Button
                            type="submit"
                            onClick={() => console.log("here")}
                          >
                            Save Changes
                          </Button>
                        </DialogFooter>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              )}

              {openEditAddressDialog && selectedUser && (
                <Dialog
                  open={openEditAddressDialog}
                  onOpenChange={setOpenEditAddressDialog}
                >
                  <DialogContent size="3xl">
                    <DialogHeader>
                      <DialogTitle>Edit User asddress</DialogTitle>
                    </DialogHeader>

                    <Input
                      type="text"
                      placeholder="Username"
                      defaultValue={selectedUser.user_name}
                    />
                    <Input
                      type="number"
                      placeholder="Phone"
                      defaultValue={selectedUser.phone}
                      readOnly
                    />
                    <Input
                      type="text"
                      placeholder="Address"
                      defaultValue={selectedAddress}
                    />

                    <DialogFooter>
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
                  </DialogContent>
                </Dialog>
              )}
            </div>
          )}
          {selectedUser && (
            <div className="mt-4 p-4 border rounded-md">
              <div className="flex item-center gap-4 mb-4 ">
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
              {deliveryMethod === "delivery" && (
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
              )}
              {deliveryMethod === "delivery" && selectedAddress && (
                <>
                  <div className="mt-3 p-3 ">
                    <p className="text-sm"> {selectedAddress}</p>
                  </div>
                  <Button
                    className="my-3"
                    onClick={() => setOpenEditDialog(true)}
                  >
                    Edit user data
                  </Button>
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
