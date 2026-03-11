import { z } from "zod";

export const loginSchema = z.object({
    email:z 
    .string()
    .min(1, "Vui lòng không được bỏ trống")
    .email("Email không hợp lệ"),


    password: z
    .string()
    .min(1, "Password không được bỏ trống")
    .min(6, "Password phải 6 ký tụ"),
});

export type LoginFormData = z.infer<typeof loginSchema>;


export const registerSchema = z.object({
  username: z.string().min(2, "Vui lòng không bỏ trống"),

  email: z
    .string()
    .min(1, "Vui lòng không được bỏ trống")
    .email("Email không hợp lệ"),

  password: z
    .string()
    .min(1, "Password không được bỏ trống")
    .min(6, "Password phải 6 ký tụ"),

  confirmPassword: z
    .string()
    .min(1, "Password không được bỏ trống")
    .min(6, "Password phải 6 ký tụ"),
}).refine((data) => data.password === data.confirmPassword, {
    message:"Password không khớp",
    path:["confirmPassword"]
});

export type RegisterFormData = z.infer<typeof registerSchema>;
