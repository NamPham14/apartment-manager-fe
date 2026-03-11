import { z } from "zod";

export const userSchema = z.object({
  username: z.string().min(3, "Tên đăng nhập phải từ 3 ký tự trở lên"),
  email: z.string().min(1, "Email không được để trống").email("Email không hợp lệ"),
  phone: z.string()
    .min(1, "Số điện thoại không được để trống")
    .regex(/^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/, "Số điện thoại không đúng định dạng"),
  password: z.string().min(6, "Mật khẩu phải từ 6 ký tự trở lên").optional().or(z.literal("")),
  status: z.enum(["ACTIVE", "INACTIVE", "NONE"]).optional(),
  roles: z.array(z.number()).min(1, "Vui lòng chọn ít nhất một vai trò"),
});

export type UserFormData = z.infer<typeof userSchema>;
