import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username can be up to 20 characters long"),

  email: z
    .string()
    .email("Please enter a valid email")
    .min(5, "Email must be at least 5 characters long"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-zA-Z]/, "Password must contain letters")
    .regex(/[0-9]/, "Password must contain numbers"),

  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be no more than 15 digits")
    .regex(/^\+?[0-9]+$/, "Phone number must be valid"),
});
