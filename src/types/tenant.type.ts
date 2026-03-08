import type { APIResponse, PageResponse } from "./common.type";

export interface TenantResponse {
  id: number;
  fullName: string;
  phone: string;
  citizenId: string;
  email: string;
  permanentAddress: string;
  avatar?: string;
}
export type TenantPageResponse = APIResponse<PageResponse<TenantResponse>>;