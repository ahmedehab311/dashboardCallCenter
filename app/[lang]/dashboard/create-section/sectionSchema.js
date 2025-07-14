import { z } from "zod";
import {
  menuField,
  nameFields,
  descFields,
  restaurantField,
  imageField,
  statusFields,
  ParentSectionSelect
} from "../Schemas";
export const sectionSchema = z.object({
  ...nameFields,
  ...descFields,
  ...restaurantField,
  ...imageField,
  ...statusFields,
  ...menuField,
  ...ParentSectionSelect,
});
