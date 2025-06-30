import { z } from "zod";

export const menuSchema = z.object({
  enName: z.string().min(1, "English name is required"),
  arName: z.string().min(1, "Arabic name is required"),
  enDesc: z.string().optional(),
  arDesc: z.string().optional(),
  restaurant: z.object(
    {
      value: z.string(),
      label: z.string(),
    },
    { required_error: "Restaurant is required" }
  ),
});
