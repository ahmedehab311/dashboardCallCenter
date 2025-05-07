"use client";
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
import { toast } from "react-hot-toast";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { deleteAddress } from "../apICallCenter/apisUser";
function DeleteAddressFotUser({
  token,
  apiBaseUrl,
  setSelectedEditAddress,
  setOpen,
  queryClient,
  address,
  selectedAddressArray,
  setSelectedAddressArray,
  selectedAddress,
  setSelectedAddress,
  phone,
}) {
  const handleEditAddress = (address) => {
    setSelectedEditAddress(address);
    setOpen(true);
  };
  const handleDeleteAddress = async (id) => {
    // console.log("id remove", id);
    try {
      const response = await deleteAddress(id, token, apiBaseUrl);

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
  return (
    <div className="flex gap-3 ml-auto mb-3">
      <button size="icon" onClick={() => handleEditAddress(address)}>
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
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              address.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel type="button" variant="outline" color="info">
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
  );
}

export default DeleteAddressFotUser;
