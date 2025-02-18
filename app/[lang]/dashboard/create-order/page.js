"use client";
import { useState, useEffect, useRef } from "react";
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
import img1 from "./img/macr1.png";
import img2 from "./img/marc2.png";
import img3 from "./img/marc3.png";
import img4 from "./img/marc4.png";
import img5 from "./img/marc5.png";
import img6 from "./img/marc7.png";
import img7 from "./img/marc8.png";
import img8 from "./img/marc9.png";
import img9 from "./img/marc11.png";
import imgV from "./img/vcola.png";
import imgV7 from "./img/v7.png";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { selectStyles } from "@/lib/utils";
import Test from "./test";
import BorderedTables from "./bordered-tables";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchRestaurantsList,
  fetchUserByPhone,
} from "./apICallCenter/ApisCallCenter";
function CreateOrder() {
  const { theme } = useTheme();
  const [color, setColor] = useState("");
  const [phone, setPhone] = useState("");
  // const [selectedAddress, setSelectedAddress] = useState(null);
  const {
    data: dataRestaurants,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["RestaurantsList"],
    queryFn: fetchRestaurantsList,
  });

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
  if (process.env.NODE_ENV === "development") {
    console.log("selectedUser", selectedUser);
  }
  // const {
  //   data: dataUserOFsearch,
  //   isLoadingUserDataForSerach,
  //   errorUserDataForSearch,
  // } = useQuery({
  //   queryKey: ["userList"],
  //   queryFn: fetchUserByPhone,
  // });

  // console.log("fetchRestaurantsList", dataRestaurants);

  const [activeSection, setActiveSection] = useState("all");
  const [counter, setCounter] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
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
    setIsNewUserDialog(true); // ✅ هذا ديالوج New User
    setOpenDialog(true);
  };
  const handleIncrease = () => setCounter((prev) => prev + 1);
  const handleDecrease = () => setCounter((prev) => (prev > 1 ? prev - 1 : 1));

  const sections = [
    { id: "all", name: "All" },
    { id: "offers", name: "Offers" },
    { id: "pasta", name: "Pasta" },
    { id: "drinks", name: "Drinks" },
    { id: "sandwiches", name: "Sandwiches" },
    { id: "Dessert Pizza", name: "Dessert Pizza" },
    { id: "Large Shakes Flavor", name: "Large Shakes Flavor" },
    { id: "Ice Cream Add on", name: "Ice Cream Add on" },
    { id: "Water", name: "Water" },
    { id: "Soft Drink", name: "Drinks" },
  ];

  const items = [
    {
      id: 1,
      name: "Spaghetti",
      price: 10.99,
      image: img1,
      section: "pasta",
    },

    {
      id: 2,
      name: "Lasagna",
      price: 12.99,
      image: img2,
      section: "pasta",
    },
    {
      id: 3,
      name: "Coca-Cola",
      price: 2.99,
      image: img3,
      section: "drinks",
    },
    {
      id: 4,
      name: "Pepsi",
      price: 2.99,
      image: imgV,
      section: "drinks",
    },
    {
      id: 5,
      name: "Burger Meal1",
      price: 8.99,
      image: img5,
      section: "offers",
    },
    {
      id: 6,
      name: "Burger Meal2",
      price: 8.99,
      image: img6,
      section: "Water",
    },
    {
      id: 7,
      name: "Burger Meal3",
      price: 8.99,
      image: img4,
      section: "Large Shakes Flavor",
    },
    {
      id: 8,
      name: "Burger Meal4",
      price: 8.99,
      image: img7,
      section: "Soft Drink",
    },
    {
      id: 9,
      name: "مكرونة جمبري",
      price: 10.99,
      image: img1,
      section: "pasta",
    },
    {
      id: 10,
      name: "مكرونة جبن",
      price: 10.99,
      image: img1,
      section: "pasta",
    },
  ];
  const [searchQuery, setSearchQuery] = useState("");

  // فلترة العناصر بناءً على البحث
  const filteredItems = searchQuery
    ? items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items;

  // استخراج الأقسام التي تحتوي فقط على العناصر المفلترة
  const filteredSections = [
    { id: "all", name: "All" }, // تأكد أن "All" دائمًا موجود
    ...sections.filter((section) =>
      filteredItems.some((item) => item.section === section.id)
    ),
  ];

  // تطبيق فلترة القسم إذا لم يكن "All"
  const displayedItems =
    activeSection === "all"
      ? filteredItems
      : filteredItems.filter((item) => item.section === activeSection);

  const [search, setSearch] = useState("");
  const [allUserData, setAllUserData] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState([]);
  const [errorSearchUser, setErrorSearchUser] = useState(null);
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
    if (dataRestaurants) {
      const formattedRestaurants = dataRestaurants.map((restaurant) => ({
        value: restaurant.id,
        label: restaurant.res_name_en,
      }));
      setRestaurantsSelect(formattedRestaurants);
    }
  }, [dataRestaurants]);

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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-2">
        <Label className="lg:min-w-[160px]">Restaurants:</Label>
        <Select
          placeholder="Select Restaurant"
          className="react-select w-[30%]"
          classNamePrefix="select"
          options={restaurantsSelect}
          value={restaurantsSelect[0]}
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
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setActiveSection("all");
                  }}
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
                    {section.name}
                  </button>
                ))}
              </div>

              {/*  عرض العناصر مع التعديلات */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {displayedItems.map((item) => (
                  <Card
                    onClick={() => handleItemClick(item)}
                    key={item.id}
                    className="p-0 shadow-md rounded-lg overflow-hidden mt-7 text-white cursor-pointer"
                  >
                    <div className="w-full h-40">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={150}
                        height={150}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex justify-between items-center p-3">
                      <h3 className="text-sm text-muted-foreground mt-2">
                        {item.name}
                      </h3>
                      <p className="text-gray-300 text-sm">
                        ${item.price.toFixed(2)}
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
                        <div className="text-sm flex justify-between items-center text-default-500 space-y-4">
                          <div className="items-center">
                            <h3 className="font-medium">{selectedItem.name}</h3>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <p className="text-sm mr-5">
                              ${(selectedItem.price * counter).toFixed(2)}
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

        <Card className="p-4  shadow-md rounded-lg">
          <div className="flex gap-1 items-center justify-between mb-3">
            <div className="relative flex-grow">
              <span className="absolute top-1/2 -translate-y-1/2 left-2">
                <Search className="w-4 h-4 text-gray-500" />
              </span>
              <Input
                type="text"
                placeholder="Enter phone number"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyPress}
                className="pl-7 w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSearch}>Search</Button>
              <Button onClick={handleClear}>Clear</Button>
            </div>
          </div>

          <Button onClick={handleNewUserClick}>New user</Button>
          {selectedUser && (
            <div className="mt-4 p-4 border rounded-md">
              <h3 className="text-lg font-semibold">
                {selectedUser.user_name}
              </h3>
              <p>Phone: {selectedUser.phone}</p>
              <p>Orders Count: {selectedUser.orders_count}</p>
              <p>Points: {selectedUser.user.points}</p>
              <Button className="my-3">Edit user data</Button>
              <div className="mt-3">
                <h4 className="font-medium">Select Address:</h4>
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

              {selectedAddress && (
                <div className="mt-3 p-3 ">
                  <p className="text-sm"> {selectedAddress}</p>
                </div>
              )}
            </div>
          )}

          <Card title="Bordered Tables">
            <h3 className="text-2xl my-5">Products</h3>
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
                          <Button onClick={() => handleDecreaseTable(item.id)}>
                            -
                          </Button>
                          <span className="mx-4">{item.quantity}</span>
                          <Button onClick={() => handleIncreaseTable(item.id)}>
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
