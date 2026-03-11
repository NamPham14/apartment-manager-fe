import { z } from "zod";

export const measurementSchema = z.object({
  contractId: z.number().min(1, "Vui lòng chọn hợp đồng"),
  month: z.number().min(1, "Tháng không hợp lệ").max(12, "Tháng không hợp lệ"),
  year: z.number().min(2000, "Năm không hợp lệ"),
  electricityIndex: z.number().min(0, "Không được là số âm"),
  waterIndex: z.number().min(0, "Không được là số âm"),
  recordedDate: z.string().min(1, "Ngày ghi số không được để trống"),
});

export type MeasurementFormData = z.infer<typeof measurementSchema>;
