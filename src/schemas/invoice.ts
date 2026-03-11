import { z } from "zod";

export const invoiceSchema = z.object({
  contractId: z.number().min(1, "Vui lòng chọn hợp đồng"),
  month: z.number().min(1, "Tháng không hợp lệ").max(12, "Tháng không hợp lệ"),
  year: z.number().min(2000, "Năm không hợp lệ"),
  totalAmount: z.number().optional(),
  status: z.enum(["UNPAID", "PAID", "OVERDUE", "CANCELLED"]).optional(),
  dueDate: z.string().min(1, "Ngày hết hạn không được để trống"),
});

export type InvoiceFormData = z.infer<typeof invoiceSchema>;
