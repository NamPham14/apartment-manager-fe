import { z } from "zod";

export const contractSchema = z.object({
  roomId: z.number().min(1, "Vui lòng chọn phòng"),
  tenantId: z.number().min(1, "Vui lòng chọn khách thuê"),
  startDate: z.string().min(1, "Ngày bắt đầu không được để trống"),
  endDate: z.string().optional().nullable(),
  rentalPrice: z.number().min(0, "Giá thuê không được âm"),
  depositAmount: z.number().min(0, "Tiền cọc không được âm"),
  status: z.enum(["ACTIVE", "TERMINATED"]).optional(),
});

export type ContractFormData = z.infer<typeof contractSchema>;
