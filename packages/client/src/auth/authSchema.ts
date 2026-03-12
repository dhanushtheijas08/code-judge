import { z } from "zod";

const authSchema = z.object({
  email: z
    .email({ error: "Invalid email address" })
    .min(1, { error: "Email is required" })
    .max(100, { error: "Email must be less than 100 characters" }),
  password: z
    .string()
    .min(6, { error: "Password must be at least 6 characters" })
    .max(28, { error: "Password must be less than 28 characters" }),
  username: z
    .string()
    .min(1, { error: "Username is required" })
    .max(28, { error: "Username must be less than 28 characters" }),
});

export const loginSchema = authSchema.pick({ email: true, password: true });
export const registerSchema = authSchema.pick({
  email: true,
  password: true,
  username: true,
});
export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
