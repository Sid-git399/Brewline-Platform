import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password is too long"),
});

export const checkoutSchema = z.object({
  shippingName: z.string().trim().min(1, "Name is required").max(100),
  shippingLine1: z.string().trim().min(1, "Address is required").max(200),
  shippingCity: z.string().trim().min(1, "City is required").max(100),
  shippingZip: z.string().trim().min(3, "Postal code is required").max(20),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(50),
      })
    )
    .min(1, "Your cart is empty"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
