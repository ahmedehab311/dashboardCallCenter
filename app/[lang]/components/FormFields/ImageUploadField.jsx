import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { cn } from "@/lib/utils";
function ImageUploadField({
  errors,
  control,
  fileInputRef,
  handleRemoveImage,
  imagePreview,
  setImagePreview,
  isEditing
}) {
  return (
    <div className="col-span-2 flex flex-col lg:items-center lg:flex-row lg:gap-0 gap-2 mb-4">
      <Label className="lg:min-w-[160px]">Image:</Label>
      <div className="flex flex-col w-full">
        <Controller
          name="image"
          control={control}
          render={({ field }) => (
            <>
              <Label   className={cn(
          "cursor-pointer flex items-center",
          isEditing && "pointer-events-none opacity-50"
        )}>
                <Button asChild  disabled={isEditing}>
                  <div>
                    <Upload className="mr-2 h-4 w-4"  /> Choose File
                  </div>
                </Button>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className=" hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      field.onChange(file);
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                  disabled={isEditing}
                />
              </Label>
            </>
          )}
        />
       {/* <Controller
  name="image"
  control={control}
  render={({ field }) => (
    <Button asChild>
      <label
        className={cn(
          "cursor-pointer flex items-center",
          isEditing && "pointer-events-none opacity-50"
        )}
      >
        <Upload className="mr-2 h-4 w-4" />
        Choose File
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={isEditing}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              field.onChange(file);
              setImagePreview(URL.createObjectURL(file));
            }
          }}
        />
      </label>
    </Button>
  )}
/> */}


        {errors.image && (
          <span className="text-red-500 text-sm mt-1">
            {errors.image.message}
          </span>
        )}

        {imagePreview && (
          <div className="mt-2 relative w-fit">
            <Image
              width={150}
              height={150}
              src={imagePreview}
              alt="Preview"
              className="w-40 h-40 object-cover rounded-md border"
            />
            <button
             disabled={isEditing}
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-1 right-1 font-bold text-red-700 cursor-pointer text-[22px] px-2 py-1 rounded shadow "
            >
              X
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageUploadField;
