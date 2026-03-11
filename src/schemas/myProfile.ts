import { z } from "zod";

export const profileSchemas = z.object({
  id: z.number().optional(),
  username: z.string(),
  email: z.string().email("Email không đúng định dạng"),
  
  // Không cần preprocess vì dữ liệu đã được xử lý ở form reset
  firstName: z.string().min(2, "FirstName phải lớn hơn 2 kí tự"),

  lastName: z.string().min(2, "LastName phải lớn hơn 2 kí tự"),

  phone: z.string()
    .refine((val) => val === "" || /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/.test(val), {
      message: "Số điện thoại không đúng định dạng",
    }),
});

export type ProfileFormData = z.infer<typeof profileSchemas>;
