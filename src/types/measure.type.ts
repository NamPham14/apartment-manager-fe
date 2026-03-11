import type { APIResponse, PageResponse } from "./common.type";
import type { ContractResponse } from "./contract.type";
import type { UserResponse } from "./user.type";


import type { RoomResponse } from "./room.type";

export interface MeasureResponse {
  id: number;
  contractId: number;
  contract: ContractResponse;
  room?: RoomResponse;
  month: number;
  year: number;
  oldElectricityIndex: number;
  newElectricityIndex: number;
  oldWaterIndex: number;
  newWaterIndex: number;
  recordedDate: string;
  createdBy: UserResponse;
}

export type MeasurePageResponse = APIResponse<PageResponse<MeasureResponse>>