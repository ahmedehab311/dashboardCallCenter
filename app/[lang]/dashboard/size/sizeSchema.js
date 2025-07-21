import { z } from "zod";
import {
  menuField,
  nameFields,
  descFields,
  imageField,
  statusFields,
  ParentSectionSelect,
  itemForSizeSelect,
  menuItemIdields,
} from "../Schemas";
export const sizeShcema = z.object({
  ...nameFields,
  ...descFields,
  ...imageField,
  ...statusFields,
  ...ParentSectionSelect,
  ...itemForSizeSelect,
  ...menuItemIdields,
});
