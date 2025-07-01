// import { z } from "zod";

// export const menuSchema = z.object({
//   enName: z
//     .string()
//     .min(3, "English name is required")
//     .max(19, "Maximum 15 characters allowed"),
//   arName: z.string().max(19, "Maximum 15 characters allowed").optional(),
//   enDesc: z.string().min(3, "English description is required"),
//   arDesc: z.string().optional(),
//   restaurant: z
//     .object({
//       value: z.string(),
//       label: z.string(),
//     })
//     .nullable()
//     .refine((val) => val !== null, {
//       message: "Restaurant is required",
//     }),
//   image: z.any().refine((file) => file instanceof File, {
//     message: "Image is required",
//   }),
//   status: z.union([z.literal(1), z.literal(2)]).default(1),
// default: z.union([z.literal(1), z.literal(2)]).default(1),
// });


import { z } from "zod";
import { nameFields } from "../Schemas";
import { descFields } from "../Schemas";
import { restaurantField } from "../Schemas";
import { imageField } from "../Schemas";
import { statusFields } from "../Schemas";
export const menuSchema = z.object({
  ...nameFields,
  ...descFields,
  ...restaurantField,
  ...imageField,
  ...statusFields,
});
