import type { APIResponse, PageResponse, RoomStatus } from "./common.type";


export interface RoomResponse {
  id: number;
  name: string;
  roomImage: string[];
  area: number;
  basePrice: string;
  status: RoomStatus;
  description: string;
}

export interface RoomResponseUpdate {
  id: number;
  name: string;
  roomImage: string[];
  area: number;
  basePrice: string;
  status: RoomStatus;
  description: string;
}

export type RoomPageResponse = APIResponse<PageResponse<RoomResponse>>;