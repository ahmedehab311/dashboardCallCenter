import { z } from "zod";

const adminSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(150, "Name must not exceed 150 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().length(11, "Phone number must be exactly 11 digits"),
  gender: z.string().nonempty("Gender is required"),
  title: z.string().nonempty("Title is required"),
  cover: z.any(),
});

const restaurantSchema = z.object({
  phone: z.string().min(11, "Phone number must be at least 11 digits"),
 
  note: z
    .string()
    .optional()
    .refine(
      (val) => val === undefined || val.length <= 255,
      "Note must not exceed 255 characters"
    ),
  logo: z.any().optional(),
  cover: z.any().optional(),
});

const branchSchema = z.object({
phone: z.string().min(11, "Phone number must be at least 11 digits"),
  open: z
    .string()
    .nonempty("Open time is required")
    .regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
  close: z
    .string()
    .nonempty("Close time is required")
    .regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
  daysOff: z
    .array(z.enum(["MO", "TU", "WE", "TH", "FR", "SA", "SU"]))
    .min(1, "At least one day off is required")
    .or(z.literal("")),
  note: z
    .string()
    .optional()
    .refine(
      (val) => val === undefined || val.length <= 255,
      "Note must not exceed 255 characters"
    ),
  logo: z.any().optional(),
  cover: z.any().optional(),
});

const getSchema = (type) => {
  switch (type) {
    case "admins":
      return adminSchema;
    case "restaurants":
      return restaurantSchema;
    case "branchs":
      return branchSchema;
    default:
      console.warn(`Unknown schema type: ${type}`);
      return adminSchema;
  }
};

export { getSchema };
