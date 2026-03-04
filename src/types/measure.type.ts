import type { APIResponse, PageResponse } from "./common.type";
import type { ContractResponse } from "./contract.type";
import type { UserResponse } from "./user.type";


export interface MeasureResponse {
  id: number;
  contract: ContractResponse;
  month: number;
  year: number;
  oldElectricityIndex: number;
  newElectricityIndex: number;
  oldWaterIndex: number;
  newWaterIndex: number;
  recordDate: string;
  createdBy: UserResponse;
}

export type MeasurePageResponse = APIResponse<PageResponse<MeasureResponse>>