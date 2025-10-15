import * as yup from "yup";


// Frontend form type
export interface ProductFormValues {
  title: string;
  description?: string;
  price: number;
  image: FileList;
  deliveryDateTime: string;
  Warranty: "true" | "false";
  specialFeatures?: string;
}

// Yup schema
export const productSchema: yup.ObjectSchema<ProductFormValues> = yup.object({
  title: yup.string().required("Product title is required"),
  description: yup.string().optional(),
  price: yup
    .number()
    .typeError("Price must be a number")
    .positive("Price must be greater than 0")
    .required("Price is required"),
  image: yup
    .mixed<FileList>()
    .required("Product image is required")
    .test("min-files", "Please upload at least 1 image", (v) => !!v && v.length >= 1),
  deliveryDateTime: yup
  .string()
  .required("Delivery date and time is required")
  .test("future", "Delivery must be in the future", (value) => {
    if (!value) return false;
    return new Date(value).getTime() > Date.now();
  }),
  Warranty: yup
    .mixed<"true" | "false">()
    .oneOf(["true", "false"], "Select Yes or No for warranty")
    .required("Warranty selection is required"),
  specialFeatures: yup.string().max(500, "Special features max 500 chars").optional(),
});
