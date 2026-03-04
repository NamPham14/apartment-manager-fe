import type { APIResponse } from "../../types/common.type";
import type { RoomPageResponse, RoomResponse } from "../../types/room.type";
import { baseApi } from "./baseApi";

export const roomApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
      
        getRooms: builder.query<RoomPageResponse, { page?: number; size?: number; keyword?: string; sort?: string }>({
            query: ({ page = 1, size = 10, keyword = "", sort = "" }) => ({
                url: `/rooms/list`, 
                params: { page, size, keyword, sort },
            }),
            // Cung cấp tag cho danh sách VÀ từng ID trong danh sách đó
            providesTags: (result) =>
                result?.data?.data
                    ? [
                        ...result.data.data.map(({ id }) => ({ type: "Rooms" as const, id })),
                        { type: "Rooms", id: "LIST" },
                      ]
                    : [{ type: "Rooms", id: "LIST" }],
        }),

       
        getRoomById: builder.query<APIResponse<RoomResponse>, number>({
            query: (id) => `/rooms/${id}`,
            providesTags: (_result, _error, id) => [{ type: "Rooms", id }],
        }),

        
        createRoom: builder.mutation<APIResponse<RoomResponse>, FormData>({
            query: (formData) => ({
                url: "/rooms/create",
                method: "POST",
                body: formData,
            }),
            // Làm mới danh sách khi thêm mới
            invalidatesTags: [{ type: "Rooms", id: "LIST" }],
        }),

        
        updateRoom: builder.mutation<APIResponse<void>, FormData>({
            query: (formData) => ({
                url: "/rooms/update",
                method: "PUT",  
                body: formData,
            }),
            // Làm mới cả danh sách để cập nhật thông tin hiển thị
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            invalidatesTags: (_result, _error, _arg) => {
                // Lấy ID từ FormData nếu có để invalidate chính xác tag )
                return [{ type: "Rooms", id: "LIST" }];
            }
        }),

        
        deleteRoom: builder.mutation<APIResponse<void>, number>({
            query: (id) => ({ url: `/rooms/delete/${id}`, method: "DELETE" }),
            invalidatesTags: (_result, _error, id) => [
                { type: "Rooms", id },
                { type: "Rooms", id: "LIST" }
            ],
        }),
    })
});

export const {
    useGetRoomsQuery,
    useGetRoomByIdQuery,
    useCreateRoomMutation,
    useUpdateRoomMutation,
    useDeleteRoomMutation
} = roomApi;
