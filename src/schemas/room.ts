import { z } from "zod";

export const roomSchema = z.object({
  name: z.string().min(1, "Tên phòng không được để trống"),
  
  
  area: z.coerce
    .number()
    .gt(0, "Diện tích phải lớn hơn 0"),

  basePrice: z.coerce
    .number()
    .gt(0, "Giá phòng phải lớn hơn 0"),

  status: z.enum(["AVAILABLE", "OCCUPIED", "MAINTENANCE"]),
  
  description: z.string().optional().or(z.literal("")),
});

export type RoomFormData = z.infer<typeof roomSchema>;
