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
import { createAddress } from "../apICallCenter/apisUser";
import { selectStyles } from "@/lib/utils";
import { useSubdomin } from "@/provider/SubdomainContext";
import { useEffect } from "react";

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

function NewAddressDialog({
  color,
  theme,
  setLoading,
  isNewAddressDialogOpen,
  setIsNewAddressDialogOpen,
  setIsNewUserDialogOpen,
  addAddressType,
  areasOptions,
  handleChangeArea,
  setaddAddressType,
  selectedAddressType,
  selectedUser,
  token,
  phone,
  QueryClient,
}) {
  const { apiBaseUrl } = useSubdomin();

  const {
    control: controlAddress,
    register: registerAddNewAddress,
    handleSubmit: handleSubmitAddNewAddress,
    setValue: setValueAddNewAddress,
    reset: resetAddNewAddress,
    trigger,
    formState: { errors: errorsAddNewAddress },
  } = useForm({ resolver: zodResolver(addAddressSchema), mode: "onSubmit" });

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

  const onSubmitAddAddress = async (data) => {
    // console.log("data", data);
    setLoading(true);
    const userId = selectedUser?.id;
    try {
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

      QueryClient.invalidateQueries(["userSearch", phone]);
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
  return (
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
          <form onSubmit={handleSubmitAddNewAddress(onSubmitAddAddress)}>
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
                {errorsAddNewAddress.street && <div className="h-[20px]"></div>}
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
                  <label key={type} className="flex items-center gap-2">
                    <Input
                      type="checkbox"
                      name="addressType"
                      className="mt-1"
                      value={type}
                      checked={addAddressType === type}
                      onChange={() => handleAddressTypeAdd(type)}
                    />
                    {type.charAt(0).toUpperCase() + type.slice(1)}{" "}
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
  );
}

export default NewAddressDialog;
