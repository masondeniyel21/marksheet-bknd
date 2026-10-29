
import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(254)
    .transform((value) => value.toLowerCase()),

  // Do not trim passwords: whitespace can be intentional.
  password: z.string().min(1, "Password is required.").max(128),
});

export type LoginInput = z.infer<typeof loginSchema>;
