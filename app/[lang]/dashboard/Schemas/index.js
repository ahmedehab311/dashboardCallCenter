import { z } from "zod";

export const nameFields = {
  enName: z
    .string()
    .min(3, "English name is required")
    .max(19, "Maximum 15 characters allowed"),
  arName: z.string().max(19, "Maximum 15 characters allowed").optional(),
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

// fields/imageField.js
export const imageField = {
  image: z.any().refine((file) => file instanceof File, {
    message: "Image is required",
  }),
};

// fields/statusField.js
export const statusFields = {
  status: z.union([z.literal(1), z.literal(2)]).default(1),
  default: z.union([z.literal(1), z.literal(2)]).default(1),
};
