import type { APIResponse, PageResponse } from "./common.type";

export interface PermissionResponse {
  name: string;
  description: string;
}

export type PermissionPageResponse = APIResponse<PageResponse<PermissionResponse>>