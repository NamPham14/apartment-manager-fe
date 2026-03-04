

export type AuthProvider =
  "LOCAL"|
  "GOOGLE";


export type ContractStatus =
  "ACTIVE"|
  "TERMINATED";


export type Gender =
  "MALE"|
  "FEMALE"|
  "OTHER";


export type InvoiceStatus =
  "UNPAID"|
  "PAID"|
  "OVERDUE"|
  "CANCELLED";


export type RoomStatus =
  "AVAILABLE"|
  "OCCUPIED"|
  "MAINTENANCE"


export type UserStatus =
  "ACTIVE"|
  "INACTIVE"|
  "NONE";


export interface APIResponse<T> {
  status: number;
  code: number;
  message: string;
  data: T;
}

export interface PageResponse<T> {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  data: T[];
}

export interface AuthResponse {
    accessToken : string,
    refreshToken : string,
}