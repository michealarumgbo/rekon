import { z } from "zod";

export const regSchema = z.object({
  firstname: z
    .string("Firstname is required")
    .min(3, "Firstname must be at least 3 characters")
    .max(30, "Firstname must b less than 50 characters")
    .trim(),
  lastname: z
    .string("Lastname is required")
    .min(3, "Lastname must be at least 3 characters")
    .max(30, "Lastname must b less than 50 characters")
    .trim(),
  email: z.email("Enter a valid email address").trim(),
  password: z
    .string("Password is required")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[\W_]).{8,40}$/,
      "Password must be atleast 8 characters and not more than 15 characters, and must contain atleast a number, 1 uppercase, 1 lowercase, and a special character"
    )
    .trim(),
  type: z.enum(["super_admin", "admin"]).optional().nullable(),
});
