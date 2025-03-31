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
import { FaMinus, FaPlus } from "react-icons/fa";
import Link from "next/link";

function DialogItemForMenu({
  isItemDialogOpen,
  setIsItemDialogOpen,
  selectedItem,
  counter,
  setCounter,
  toggleExtrasMainExtra,
  toggleExtras,
  language,
  note,
  setNote,
  totalExtrasPrice,
  setTotalExtrasPrice,
  isBranchManuallySelected,
  massegeNotSelectedBranch,
  deliveryMethod,
  selectedUser,
  massegeNotSerachPhone,
  massegeInvaildToken,
  handleAddToCart,
}) {
  return (
    <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
      <DialogContent size="3xl" hiddenCloseIcon={true}>
        <div className=" flex justify-between items-center space-y-4">
          <p className="text-xl">{selectedItem?.name}</p>

          <div className="flex items-center space-">
            {/* السعر الإجمالي */}
            <p className="text-sm font-semibold text-gray-">
              {(selectedItem?.price * counter).toFixed(2)} EGP
            </p>

            <button
              onClick={() => setCounter((prev) => (prev > 1 ? prev - 1 : 1))}
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
            {language === "en"
              ? selectedItem?.description_en
              : selectedItem?.description_ar}
          </h3>
        </div>
        <hr className="my-2" />
        <div className="mt-4">
          <div className="flex flex-c gap-5">
            {selectedItem?.info?.map((size, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="size"
                  value={size?.size_en}
                  checked={selectedItem?.selectedInfo === size?.size_en}
                  onChange={() =>
                    setSelectedItem((prev) => {
                      const newItemExtras = size?.item_extras || [];
                      const newExtrasData = size?.item_extras?.[0]?.data || [];

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
                {selectedItem?.itemExtras?.category_ar} (Choose up to{" "}
                {selectedItem?.extrasData?.length} Items)
              </h3>
              <span className="text-gray-600">{isOpen ? "▲" : "▼"}</span>
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
                  <label key={index} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value={extra.name_en}
                      checked={
                        selectedItem.selectedExtras.length > 0 &&
                        selectedItem.selectedExtras[0].id === extra.id
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
                {selectedItem?.mainExtras?.category_ar} (Choose up to{" "}
                {selectedItem?.mainExtras?.length} Items)
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
                  <label key={index} className="flex items-center space-x-2">
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

                          // حساب السعر الإجمالي الجديد
                          const newTotalPrice = updatedExtras.reduce(
                            (acc, curr) =>
                              acc + parseFloat(curr.price_en || "0"), // تحويل السعر إلى رقم مع معالجة القيم الفارغة
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
                            selectedMainExtrasIds: updatedExtrasIds, // تحديث قائمة الـ IDs
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
            {(selectedItem?.price * counter + totalExtrasPrice).toFixed(2)}
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
                {deliveryMethod === "pickup" && !isBranchManuallySelected
                  ? massegeNotSelectedBranch
                  : ""}
              </p>
              {massegeInvaildToken && (
                <p className="text-sm font-semibold text-red-500 mr-1">
                  {massegeInvaildToken}{" "}
                  <Link
                    href={`/${language}/login`}
                    className="text-blue-500 underline ml-1"
                  >
                    Login here
                  </Link>
                </p>
              )}

              <Button
                type="submit"
                color="success"
                onClick={handleAddToCart}
                disabled={
                  !selectedUser ||
                  (deliveryMethod === "pickup" && !isBranchManuallySelected) ||
                  !selectedItem?.selectedInfo
                }
              >
                Add to Cart
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DialogItemForMenu;
