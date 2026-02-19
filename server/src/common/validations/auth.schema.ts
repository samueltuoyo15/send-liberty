import { z } from "zod";

export const signupSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        display_name: z.string().optional(),
        avatar: z.string().optional(),
    }),
    query: z.object({}).optional(),
    params: z.object({}).optional(),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(1, "Password is required"),
    }),
    query: z.object({}).optional(),
    params: z.object({}).optional(),
});
