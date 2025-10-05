import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name must be less than 255 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),

  price: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Price must be a positive number",
    }),

  stock: z
    .string()
    .refine((val) => val === undefined || (!isNaN(parseInt(val)) && parseInt(val) >= 0), {
      message: "Stock must be a non-negative integer",
    }),

  category: z
    .string()
    .min(2, "Category must be at least 2 characters")
    .max(100, "Category must be less than 100 characters"),

  imageUrl: z
    .string()
    .url("Image URL must be a valid URL")
    .min(5, "Image URL must be at least 5 characters")
    .max(255, "Image URL must be less than 255 characters"),

  brand: z
    .string()
    .max(100, "Brand must be less than 100 characters")
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;