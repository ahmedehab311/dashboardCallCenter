import { z } from "zod";
import { nameFields } from "../Schemas";
import { descFields } from "../Schemas";
import { restaurantField } from "../Schemas";
import { imageField } from "../Schemas";
import { statusFields } from "../Schemas";
export const sectionSchema = z.object({
  ...nameFields,
  ...descFields,
  ...restaurantField,
  ...imageField,
  ...statusFields,
});
