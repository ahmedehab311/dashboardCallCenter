"use client";
import { FiTrash2, FiEdit } from "react-icons/fi";
import { Switch } from "@/components/ui/switch";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import "./main.css";

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
  ({ imageUrl, title, className, headerTitle, ...props }, ref) => (
    <div ref={ref} className={cn("w-full", className)} {...props}>
      {headerTitle ? (
        <div className="text-lg font-bold mb-4 text-center">{headerTitle}</div>
      ) : (
        <>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title || "Section Image"}
              className="w-full h-48 object-cover"
            />
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

const CardContent = React.forwardRef(
  (
    { sectionName, description, isActive, onToggleActive, className, ...props },
    ref
  ) => (
    <div ref={ref} className={cn("p-4 space-y-3", className)} {...props}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">{sectionName}</h3>
        <Switch checked={isActive} onCheckedChange={onToggleActive} />
      </div>

      <p className="text-sm text-gray-600 overflow-hidden text-ellipsis max-h-16">
        {description}
      </p>
    </div>
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(
  (
    { sectionItems, onViewEdit, onDelete, onEnter, className, ...props },
    ref
  ) => (
    <div ref={ref} className={cn("p-4 space-y-3", className)} {...props}>
      <div className="flex justify-between items-center">
        <button
          onClick={onViewEdit}
          className="flex items-center text-blue-500 hover:underline"
        >
          <FiEdit className="mr-1" />
          View & Edit
        </button>
        <button
          onClick={onDelete}
          className="flex items-center text-red-500 hover:underline"
        >
          <FiTrash2 className="mr-1" />
          Delete
        </button>
      </div>

      <Button onClick={() => onEnter(sectionItems)} className="w-full">
        View
      </Button>
    </div>
  )
);

CardFooter.displayName = "CardFooter";

CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardContent, CardFooter };
