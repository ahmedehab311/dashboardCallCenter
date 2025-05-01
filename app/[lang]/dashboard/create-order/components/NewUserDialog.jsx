"use client";
import { toast } from "react-hot-toast";
import Select from "react-select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAddress, createUser } from "../apICallCenter/apisUser";
import { selectStyles } from "@/lib/utils";
import { useSubdomin } from "@/provider/SubdomainContext";
import { useEffect } from "react";
const addUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  phone: z.string().regex(/^\d{3,15}$/, "Invalid phone number"),
  phone2: z.string().optional(),
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

function NewUserDialog({
  isNewUserDialogOpen,
  setIsNewUserDialogOpen,
  selectedAddressType,
  areasOptions,
  handleChangeArea,
  color,
  theme,
  setLoading,
  token,
}) {
  const { apiBaseUrl } = useSubdomin();
  const {
    control,
    register: registerAddNewUser,
    handleSubmit: handleSubmitAddNewUser,
    setValue: setValueAddNewUser,
    reset: resetAddNewUser,
    trigger,
    formState: { errors: errorsAddNewUser },
  } = useForm({ resolver: zodResolver(addUserSchema), mode: "onSubmit" });
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
  const onSubmitAddUserData = async (data) => {
    // console.log("data", data);
    setLoading(true);
    try {
      const userId = await createUser(
        data.username,
        data.phone,
        data.phone2,
        token,
        apiBaseUrl
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
        token,
        apiBaseUrl
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
  return (
    <Dialog open={isNewUserDialogOpen} onOpenChange={setIsNewUserDialogOpen}>
      <DialogContent size="3xl">
        <DialogHeader>
          <DialogTitle className="text-base font-medium text-default-700">
            Create New User
          </DialogTitle>
        </DialogHeader>
        <div className="text-sm text-default-500 space-y-4">
          <form onSubmit={handleSubmitAddNewUser(onSubmitAddUserData)}>
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
                {/* {errorsAddNewUser.phone2 && (
                  <p className="text-red-500 text-sm h-[20px] mt-2">
                    {errorsAddNewUser.phone2.message}
                  </p>
                )} */}
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
                {errorsAddNewUser.street && <div className="h-[20px]"></div>}
              </div>
            </div>

            <div className="flex gap-2 items- my-3 mb-4">
              <Input
                type="text"
                placeholder="Floor"
                {...registerAddNewUser("floor")}
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
                  <label key={type} className="flex items-center gap-2 ">
                    <Input
                      type="checkbox"
                      name="addressType"
                      className="mt-1"
                      value={type}
                      checked={selectedAddressType === type}
                      onChange={() => handleAddressTypeChange(type)}
                    />
                    {type.charAt(0).toUpperCase() + type.slice(1)}{" "}
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
  );
}

export default NewUserDialog;
