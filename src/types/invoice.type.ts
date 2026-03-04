
import type { APIResponse, InvoiceStatus, PageResponse } from "./common.type.ts";
import type { ContractResponse } from "./contract.type.ts";


export interface InvoiceResponse {
  id: number;
  contract: ContractResponse;
  month: number;
  year: number;
  amountRoom: number;
  amountElectricity: number;
  amountWater: number;
  amountServices: number;
  amountTotal: number;
  status: InvoiceStatus;
  dueDate: string;
  paymentDate?: string;
}
export type InvoicePageResponse = APIResponse<PageResponse<InvoiceResponse>>;