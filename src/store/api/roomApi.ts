import type { RoomPageResponse, RoomResponse } from "../../types/room.type";
import { baseApi } from "./baseApi";
import type { APIResponse } from "../../types/common.type";

export const roomApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getRooms: builder.query<RoomPageResponse, { page?: number; size?: number; keyword?: string; sort?: string }>({
            query: ({ page = 1, size = 10, keyword = "", sort = "asc" }) => ({
                url: "/rooms/list",
                params: { page, size, keyword, sort }
            }),
            providesTags: (result) =>
                result?.data?.data
                    ? [
                        ...result.data.data.map(({ id }) => ({ type: "Rooms" as const, id })),
                        { type: "Rooms", id: "LIST" },
                    ]
                    : [{ type: "Rooms", id: "LIST" }]
        }),

        getRoomById: builder.query<APIResponse<RoomResponse>, number>({
            query: (id) => `/rooms/${id}`,
            providesTags: (result, error, id) => [{ type: "Rooms", id }]
        }),

        createRoom: builder.mutation<APIResponse<RoomResponse>, FormData>({
            query: (formData) => ({
                url: "/rooms/create",
                method: "POST",
                body: formData,
                // Chú ý: Khi dùng FormData với RTK Query, KHÔNG SET Content-Type header
                // Browser sẽ tự động set multipart/form-data kèm boundary
            }),
            invalidatesTags: [{ type: "Rooms", id: "LIST" }]
        }),

        updateRoom: builder.mutation<APIResponse<void>, FormData>({
            query: (formData) => ({
                url: "/rooms/update",
                method: 'PUT',
                body: formData,
            }),
            invalidatesTags: (result, error, arg) => {
                // Chúng ta cần extract ID từ FormData nếu muốn invalidate tag cụ thể
                // Nhưng đơn giản nhất là invalidate cả LIST
                return [{ type: "Rooms", id: "LIST" }];
            },
        }),

        deleteRoom: builder.mutation<APIResponse<void>, number>({
            query: (id) => ({ url: `/rooms/delete/${id}`, method: 'DELETE' }),
            invalidatesTags: (result, error, id) => [
                { type: "Rooms", id },
                { type: "Rooms", id: "LIST" }
            ]
        }),
    })
})

export const { 
    useGetRoomsQuery, 
    useGetRoomByIdQuery, 
    useCreateRoomMutation, 
    useUpdateRoomMutation, 
    useDeleteRoomMutation 
} = roomApi;
