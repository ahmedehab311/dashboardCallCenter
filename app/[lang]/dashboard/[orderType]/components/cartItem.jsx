import React from "react";
import { Card } from "@/components/ui/card";
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
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { Input } from "@/components/ui/input";
function CartItem({ cartItems, setCartItems, isEditMode,handleNoteChange ,handleEditItem ,handleRemoveItem  }) {
  return (
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
                        (sum, extra) => sum + parseFloat(extra?.price_en || 0),
                        0
                      ) || 0;

                    const itemPrice = parseFloat(item?.price || 0);
                    const itemQuantity = parseFloat(item?.quantity || 0);
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
                        <div className="mt-1 flex flex-col gap-1 text-xs text-gray-700 dark:text-gray-300">
                          {/* Option */}
                          {item.selectedoption?.length > 0 && (
                            <div>
                              <div className="grid grid-cols-3 gap-x-2 gap-y-1 text-[12px]">
                                {item.selectedoption.map((opt, i) => (
                                  <React.Fragment key={i}>
                                    <span className="truncate">{opt.name}</span>
                                    <span className="text-center">×1</span>
                                    <span className="text-end">
                                      {opt.price?.toFixed(2)} EGP
                                    </span>
                                  </React.Fragment>
                                ))}
                              </div>
                              {/* <span className="text-end">{(extra.price * extra.quantity)?.toFixed(2)} EGP</span> */}
                            </div>
                          )}

                          {/* Extras */}
                          {item.selectedExtras?.length > 0 && (
                            <div>
                              <div className="grid grid-cols-3 gap-x-2 text-[12px] mt-2 mb-2">
                                {item.selectedExtras.map((extra, i) => (
                                  <React.Fragment key={i}>
                                    <span className="whitespace-normal break-words">
                                      {extra.name}
                                    </span>
                                    <span className="text-center">
                                      ×{extra.quantity}
                                    </span>
                                    <span className="text-end">
                                      {(extra.price * extra.quantity)?.toFixed(
                                        2
                                      )}{" "}
                                      EGP
                                    </span>
                                  </React.Fragment>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Main Extras */}
                          {item.selectedMainExtras?.length > 0 && (
                            <div>
                              <div className="grid grid-cols-3 gap-x-2 gap-y-1 text-[12px]">
                                {item.selectedMainExtras.map((main, i) => (
                                  <React.Fragment key={i}>
                                    <span className="whitespace-normal break-words">
                                      {main.name}
                                    </span>
                                    <span className="text-center">
                                      ×{main.quantity || 1}
                                    </span>
                                    <span className="text-end">
                                      {(
                                        (Number(main?.price) || 0) *
                                        (Number(main?.quantity) || 1)
                                      ).toFixed(2)}{" "}
                                      EGP
                                    </span>
                                  </React.Fragment>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* If selectedExtras exist, show them. Else, fallback to size_condiments */}
                          {(item.selectedExtras?.length > 0 ||
                            item.size_condiments?.length > 0) && (
                            <div>
                              <div className="grid grid-cols-3 gap-x-2 text-[12px] mt-2 mb-2">
                                {(item.selectedExtras?.length > 0
                                  ? item.selectedExtras
                                  : item.size_condiments
                                ).map((extra, i) => (
                                  <React.Fragment key={i}>
                                    <span className="whitespace-normal break-words">
                                      {extra.name ||
                                        extra?.condiment_info?.name_en}
                                    </span>
                                    <span className="text-center">
                                      ×{extra.quantity || extra.count}
                                    </span>
                                    <span className="text-end">
                                      {(
                                        Number(extra.price) *
                                        (extra.quantity || extra.count || 1)
                                      ).toFixed(2)}{" "}
                                      EGP
                                    </span>
                                  </React.Fragment>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="my-3">
                            <Input
                              type="text"
                              value={item.note || ""}
                              onChange={(e) => handleNoteChange(e, item.cartId)}
                              placeholder="No note added"
                              className="w-full px-3 py- border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700"
                              //  className="w-16 text-center border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:-blue-500 focus:border-transparent "
                            />
                          </div>
                          <div className="flex items-center">
                            <button
                              onClick={() => handleDecreaseTable(item.cartId)}
                              className="text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400"
                            >
                              -
                            </button>

                            <input
                              type="number"
                              step="0.001"
                              value={item.quantity}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                if (!isNaN(value) && value >= 0.1) {
                                  setCartItems((prevItems) =>
                                    prevItems.map((i) =>
                                      i.cartId === item.cartId
                                        ? {
                                            ...i,
                                            quantity: value,
                                            total: value * i.price,
                                          }
                                        : i
                                    )
                                  );
                                }
                              }}
                              className="w-12 text-center border border-gray-300 rounded-[6px] mx-1"
                            />

                            <button
                              onClick={() => handleIncreaseTable(item.cartId)}
                              className="text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400"
                            >
                              +
                            </button>
                          </div>
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
                                    onClick={() =>
                                      handleRemoveItem(item.cartId)
                                    }
                                  >
                                    Ok
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>

                          <span>
                            {isEditMode
                              ? `${item.total?.toFixed(2)} EGP`
                              : (() => {
                                  const optionsTotal = (
                                    item.selectedoption || []
                                  ).reduce(
                                    (sum, o) =>
                                      sum +
                                      (Number(o.price) || 0) *
                                        (Number(o.quantity) || 1),
                                    0
                                  );
                                  const extrasTotal = (
                                    item.selectedExtras || []
                                  ).reduce(
                                    (sum, e) =>
                                      sum +
                                      (Number(e.price) || 0) *
                                        (Number(e.quantity) || 1),
                                    0
                                  );
                                  const mainExtrasTotal = (
                                    item.selectedMainExtras || []
                                  ).reduce(
                                    (sum, e) =>
                                      sum +
                                      (Number(e.price) || 0) *
                                        (Number(e.quantity) || 1),
                                    0
                                  );
                                  const basePrice = Number(item.price) || 0;
                                  const total =
                                    (basePrice +
                                      optionsTotal +
                                      extrasTotal +
                                      mainExtrasTotal) *
                                    item.quantity;
                                  return `${total.toFixed(2)} EGP`;
                                })()}
                          </span>
                        </div>
                        {index !== cartItems.length - 1 && (
                          <div className="border-b border-gray-500 -mx-4 mt-4"></div>
                        )}
                      </div>
                    );
                  })}
                </Card>
              </>
            )}
          </Card>
        </>
      )}
    </Card>
  );
}

export default CartItem;
