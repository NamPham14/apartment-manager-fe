import type { APIResponse, PageResponse } from "./common.type";
import type { PermissionResponse } from "./permission.type";



export interface RoleResponse {
  name: string;
  description: string;
  permissions: PermissionResponse[];
}
export type RolePageResponse = APIResponse<PageResponse<RoleResponse>>