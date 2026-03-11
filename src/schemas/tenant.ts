import { z } from "zod";

export const tenantSchema = z.object({
  fullName: z.string().min(1, "Họ tên không được để trống"),
  phone: z.string()
    .min(1, "Số điện thoại không được để trống")
    .regex(/^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/, "Số điện thoại không đúng định dạng Việt Nam"),
  citizenId: z.string().min(1, "Số CCCD không được để trống"),
  email: z.string().optional().or(z.literal("")).pipe(
    z.string().email("Email không hợp lệ").optional().or(z.literal(""))
  ),
  permanentAddress: z.string().optional(),
});

export type TenantFormData = z.infer<typeof tenantSchema>;
