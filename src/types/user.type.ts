
import type { APIResponse, AuthProvider, Gender, PageResponse, UserStatus } from "./common.type.ts";
import type { RoleResponse } from "./role.type.ts";


export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  gender: Gender;
  avatar: string;
  phone: string;
  email: string;
  username: string;
  providerId: string;
  provider: AuthProvider;
  status: UserStatus;
  roles: RoleResponse[];
}

export type UserPageResponse = APIResponse<PageResponse<UserResponse>>;