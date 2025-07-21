"use client";
import { FiTrash2, FiEdit } from "react-icons/fi";
import { Switch } from "@/components/ui/switch";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import "./main.css";
import Image from "next/image";
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
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-md bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(
  (
    {
      imageUrl,
      title,
      className,
      headerTitle,
      draggable,
      onDragStart,
      onDragOver,
      onDrop,
      onDragEnd,
      ...props
    },
    ref
  ) => (
    <div ref={ref} className={cn("w-full", className)} {...props}>
      {headerTitle ? (
        <div className="text-lg font-bold mb-4 text-center">{headerTitle}</div>
      ) : (
        <>
          {imageUrl ? (
            <div
              className="card-header"
              draggable={draggable}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onDragEnd={onDragEnd}
            >
              <Image
                src={imageUrl}
                alt="Section"
                width={500}
                height={192}
                className="w-full h-48 object-cover"
                layout="responsive"
              />
            </div>
          ) : (
            <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </>
      )}
    </div>
  )
);
CardHeader.displayName = "CardHeader";

// const CardContent = React.forwardRef(
//   (
//     {
//       sectionName,
//       description,
//       isActive,
//       onToggleActive,
//       handleToggleActive,
//       trans,
//       className,
//       isSection,
//       deletedAt,
//       ...props
//     },
//     ref

//   ) => (
//     <div ref={ref} className={cn("p-4 space-y-3", className)} {...props}>
//       <div className="flex items-center justify-between">
//         <h3 className="text-lg font-bold">{sectionName}</h3>
//         {/* <Switch checked={isActive} onCheckedChange={onToggleActive} /> */}

//         {isSection && (
//           <Switch
//             checked={isActive}
//             onCheckedChange={(checked) => {
//               console.log(`Switch value for ${sectionName}:`, checked);
//               onToggleActive(checked); // تأكد من تمرير الـ checked فقط
//             }}
//             aria-label={isActive ? trans?.active : trans?.inactive}
//           />
//         )}
//       </div>

//       <p className="text-sm text-gray-600  ">{description}</p>
//     </div>
//   )
// );
const CardContent = React.forwardRef(
  (
    {
      sectionName,
      description,
      isActive,
      onToggleActive,
      handleToggleActive,
      trans,
      className,
      isSection,
      deletedAt,
      isLoading,
      isActiveDefault,
      onChangeStatus,
      isSettingLoading,
      ...props
    },
    ref
  ) => {
    // console.log(
    //   `Rendering CardContent for ${sectionName}, deletedAt:`,
    //   deletedAt
    // );

    return (
      <div ref={ref} className={cn("p-4 space-y-3", className)} {...props}>
        <div className="flex items-center justify-between">
          <h3
            className={`text-lg font-bold ${deletedAt ? "text-red-500" : ""}`}
          >
            {sectionName}
          </h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Switch
                    checked={isActive}
                    disabled={isLoading || isSettingLoading}
                    onCheckedChange={(checked) => {
                      console.log(`Switch value for ${sectionName}:`, checked);
                      onChangeStatus(checked);
                    }}
                    className="flex items-center mb-3"
                    aria-label={isActive ? trans?.active : trans?.inactive}
                  />
                </div>
              </TooltipTrigger>
              {!isSettingLoading && (
                <TooltipContent>
                  <p>Status </p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>

        <p className="text-sm text-gray-600 min-h-[60px]">{description}</p>
      </div>
    );
  }
);

CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(
  (
    {
      sectionName,
      sectionItems,
      onViewEdit,
      onDelete,
      onRestore,
      onEnter,
      className,
      isSection,
      isActive,
      isActiveDefault,
      onToggleDefaultActive,
      isDefaultForMenu,
      isDefault,
      deletedAt,
      onToggleActive,
      handleToggleActive,
      isSettingLoading,
      trans,
      isLoading,
      navigate,
      ...props
    },
    ref
  ) => (
    <div ref={ref} className={cn("p-4 space-y-3", className)} {...props}>
      <div className="flex items-center justify-between">
        <div className="flex justify-end items-end">
          {isDefault && isDefaultForMenu && (
            <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full text-center">
              Default
            </span>
          )}

          {deletedAt ? (
            <div className="flex justify-start items-start">
              <span className="inline-block  bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full text-center">
                Deleted
              </span>
            </div>
          ) : (
            <span></span>
          )}
        </div>

        <div className=" flex justify-center items-center gap-1">
          <TooltipProvider>
            <div className="flex items-center gap-4">
              <AlertDialog>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
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
                      onClick={onDelete}
                    >
                      Ok
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* زر التعديل مع Tooltip */}
              {isSection && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={onViewEdit}
                      className="flex items-center text-blue-500"
                      disabled={isSettingLoading}
                    >
                      <FiEdit className="mr-1 text-xl" />
                    </button>
                  </TooltipTrigger>
                  {!isSettingLoading && (
                    <TooltipContent>
                      <p>{trans?.viewEdit}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              )}
            </div>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                disabled={isSettingLoading}
                size="icon"
                className="group h-6 w-6 bg-transparent hover:bg-transparent  text-default-800 border border-default-200"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[196px]"
              align="end"
              side="bottom"
              avoidCollisions
            >
              {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
              {!isDefault && !deletedAt && isDefaultForMenu && (
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={isActiveDefault}
                >
                  Set as default
                </DropdownMenuItem>
              )}
              {!deletedAt ? (
                <DropdownMenuItem className="cursor-pointer" onClick={onDelete}>
                  Delete
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={onRestore}
                >
                  Restore
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {navigate !== "size" && (
        <Button
          onClick={() => (isSection ? onEnter(sectionItems) : onViewEdit())}
          className="w-full"
          title="View"
          disabled={isSettingLoading}
        >
          {isSection ? `${trans?.view}` : `${trans?.viewEdit}`}
        </Button>
      )}
    </div>
  )
);

CardFooter.displayName = "CardFooter";

CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardContent, CardFooter };
