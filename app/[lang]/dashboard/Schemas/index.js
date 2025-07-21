import { z } from "zod";

export const nameFields = {
  enName: z.string().min(3, "English name is required"),
  arName: z.string().optional(),
};
export const menuItemIdields = {
  menuItemId: z.string().optional(),
};

// fields/descFields.js
export const descFields = {
  enDesc: z.string().min(3, "English description is required"),
  arDesc: z.string().optional(),
};

// fields/restaurantField.js
export const restaurantField = {
  restaurant: z
    .object({
      value: z.number(),
      label: z.string(),
    })
    .nullable()
    .refine((val) => val !== null, {
      message: "Restaurant is required",
    }),
};
// fields/menuField.js
export const menuField = {
  menu: z
    .object({
      value: z.number(),
      label: z.string(),
    })
    .optional(),
};
// fields/menuField.js
export const ParentSectionSelect = {
  ParentSection: z
    .object({
      value: z.number(),
      label: z.string(),
    })
    .optional(),
};
export const itemForSizeSelect = {
  ParentSection: z
    .object({
      value: z.number(),
      label: z.string(),
    })
    .nullable(),
};

// fields/imageField.js
export const imageField = {
  image: z.union([z.instanceof(File), z.string()]).optional(),
};

// fields/statusField.js
export const statusFields = {
  status: z.union([z.literal(1), z.literal(2)]).default(1),
  default: z.union([z.literal(1), z.literal(2)]).default(1),
};
export const offerStatusFields = {
  offer: z.union([z.literal(1), z.literal(2)]).default(1),
};
