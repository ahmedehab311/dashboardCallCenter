import { z } from "zod";
import {
  menuField,
  nameFields,
  descFields,
  restaurantField,
  imageField,
  statusFields,
  ParentSectionSelect,
  offerStatusFields
} from "../Schemas";
export const itemSchema = z.object({
  ...nameFields,
  ...descFields,
  ...imageField,
  ...statusFields,
  ...offerStatusFields,
  ...menuField,
  ...ParentSectionSelect,
});
