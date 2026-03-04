
import type { APIResponse, ContractStatus, PageResponse } from "./common.type.ts";
import type { InvoiceResponse } from "./invoice.type.ts";
import type { RoomResponse } from "./room.type.ts";
import type { TenantResponse } from "./tenant.type.ts";


export interface ContractResponse {
  id: number;
  code: string;
  room: RoomResponse;
  tenantEntity: TenantResponse;
  startDate: string;
  endDate?: string;
  rentalPrice: number;
  depositAmount: number;
  status: ContractStatus;
  invoices: InvoiceResponse[];
}


export type ContractPageResponse = APIResponse<PageResponse<ContractResponse>>