import * as React from "react";

import { cn } from "@/lib/utils";

import { cva } from "class-variance-authority";

export const textareaVariants = cva(
  "flex flex-1 bg-background w-full min-h-[80px]   px-3 py-[10px] text-sm  file:border-0 file:bg-transparent file:text-sm file:font-medium  read-only:bg-background  disabled:cursor-not-allowed disabled:opacity-50  transition duration-300 ",
  {
    variants: {
      color: {
        default:
          "border-default-300 text-default-500 focus:outline-none focus:border-primary disabled:bg-default-200  placeholder:text-accent-foreground/50",
        primary:
          "border-primary text-primary focus:outline-none focus:border-primary-700 disabled:bg-primary/30 disabled:placeholder:text-primary  placeholder:text-primary/70",
        info: "border-info/50 text-info focus:outline-none focus:border-info-700 disabled:bg-info/30 disabled:placeholder:text-info  placeholder:text-info/70",
        warning:
          "border-warning/50 text-warning focus:outline-none focus:border-warning-700 disabled:bg-warning/30 disabled:placeholder:text-info  placeholder:text-warning/70",
        success:
          "border-success/50 text-success focus:outline-none focus:border-success-700 disabled:bg-success/30 disabled:placeholder:text-info  placeholder:text-success/70",
        destructive:
          "border-destructive/50 text-destructive focus:outline-none focus:border-destructive-700 disabled:bg-destructive/30 disabled:placeholder:text-destructive  placeholder:text-destructive/70",
      },
      variant: {
        flat: "bg-default-100 read-only:bg-default-100",
        underline: "border-b",
        bordered: "border",
        faded: "border border-default-300 bg-default-100",
        ghost: "border-0 focus:border",
        "flat-underline": "bg-default-100 border-b",
      },
      shadow: {
        none: "",
        sm: "shadow-sm",
        md: "shadow-md",
        lg: "shadow-lg",
        xl: "shadow-xl",
        "2xl": "shadow-2xl",
      },
      radius: {
        none: "rounded-none",
        sm: "rounded",
        md: "rounded-md",
        lg: "rounded-xl",
        xl: "rounded-[20px]",
      },
    },
    compoundVariants: [
      {
        variant: "flat",
        color: "primary",
        className: "bg-primary/10 read-only:bg-primary/10",
      },
      {
        variant: "flat",
        color: "info",
        className: "bg-info/10 read-only:bg-info/10",
      },
      {
        variant: "flat",
        color: "warning",
        className: "bg-warning/10 read-only:bg-warning/10",
      },
      {
        variant: "flat",
        color: "success",
        className: "bg-success/10 read-only:bg-success/10",
      },
      {
        variant: "flat",
        color: "destructive",
        className: "bg-destructive/10 read-only:bg-destructive/10",
      },
      {
        variant: "faded",
        color: "primary",
        className:
          "bg-primary/10 border-primary/30 read-only:bg-primary/10 border-primary/30",
      },
      {
        variant: "faded",
        color: "info",
        className: "bg-info/10 border-info/30",
      },
      {
        variant: "faded",
        color: "warning",
        className: "bg-warning/10 border-warning/30",
      },
      {
        variant: "faded",
        color: "success",
        className: "bg-success/10 border-success/30",
      },
      {
        variant: "faded",
        color: "destructive",
        className: "bg-destructive/10 border-destructive/30",
      },
    ],

    defaultVariants: {
      color: "default",
      variant: "bordered",
      radius: "md",
    },
  }
);

const Textarea = React.forwardRef(
  (
    {
      className,
      color,
      radius,
      variant,
      shadow,
      children,
      value,
      onChange,
      required,
      isEnglishField,
      defaultValue,
      readOnly,
      disabled,
      theme,
      placeholder,
      ...props
    },
    ref
  ) => {
    return (
      <div className=" w-full">
      
        <textarea
          className={cn(
            textareaVariants({ color, radius, variant, shadow }),
            className
          )}
          ref={ref}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          defaultValue={defaultValue}
          disabled={disabled}
          theme={theme}
          {...props}
        >
          {children}
        </textarea>
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
