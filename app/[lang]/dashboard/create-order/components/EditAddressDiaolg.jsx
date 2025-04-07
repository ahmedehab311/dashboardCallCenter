"use client";
import { useEffect } from "react";
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
import { selectStyles } from "@/lib/utils";
import { useSubdomin } from "@/provider/SubdomainContext";
import { updateUserAddress } from "../apICallCenter/apisUser";
const editUserAddressSchema = z.object({
  area: z.object(
    { value: z.number(), label: z.string() },
    { required_error: "Area is required" }
  ),
  street: z.string().min(1, "Street name is required"),
  name: z.string().optional(),
  building: z.string().min(1, "Building number is required").or(z.literal("")),
  building: z.string().min(1, "Building number is required").or(z.literal("")),
  floor: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => val || ""),
  apt: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => val || ""),
  additionalInfo: z.string().optional(),
});
function EditAddressDiaolg({
  open,
  setOpen,
  color,
  theme,
  areasOptions,
  handleChangeArea,
  token,
  phone,
  queryClient,
  setCustomAddressName,
  seEditAddressType,
  selectedEditAddress,
  editAddressType,
  customAddressName,
  apiBaseUrl,
}) {
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

  useEffect(() => {
    if (selectedEditAddress) {
      const selectedAreaOption = areasOptions?.find(
        (option) => option.value === selectedEditAddress.area
      );

      setValueEditAddressUser("area", selectedAreaOption);

      if (["home", "work"].includes(selectedEditAddress.address_name)) {
        seEditAddressType(selectedEditAddress.address_name);
        setCustomAddressName("");
      } else {
        seEditAddressType("other");
        setCustomAddressName(selectedEditAddress.address_name);
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
      setCustomAddressName("");
      setValueEditAddressUser("name", type);
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
      apiBaseUrl,
    };

    // console.log("Formatted Data to Send:", formattedData); // تحقق من البيانات

    try {
      const response = await updateUserAddress(formattedData);

      if (response) {
        toast.success("Address updated successfully");

        queryClient.invalidateQueries(["userSearch", phone]);
        setOpen(false);
      } else {
        toast.error("Something went wrong");
      }

      // console.log("Response onSubmit:", response);
    } catch (error) {
      console.error("Error updating user address:", error);
      toast.error("Failed to update address. Please try again.");
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
            </DialogClose>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditAddressDiaolg;
