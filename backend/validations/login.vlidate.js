import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Enter a valid email address").trim(),
  password: z
    .string("Password is required")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[\W_]).{8,40}/,
      "Password must be atleast 8 characters , and must contain atleast a number, 1 uppercase, 1 lowercase, and a special character"
    )
    .trim(),
});
