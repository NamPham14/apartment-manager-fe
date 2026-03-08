import type { APIResponse, PageResponse } from "../../types/common.type";
import type { PermissionResponse } from "../../types/permission.type";
import { baseApi } from "./baseApi";

export const permissionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPermissions: builder.query<APIResponse<PageResponse<PermissionResponse>>, { page?: number; size?: number; keyword?: string; sort?: string }>({
            query: ({ page = 1, size = 10, keyword = "", sort = "" }) => ({
                url: "/permissions/list",
                params: { page, size, keyword, sort }
            }),
            providesTags: (result) =>
                result?.data?.data
                    ? [
                        ...result.data.data.map(({ id }) => ({ type: "Permissions" as const, id })),
                        { type: "Permissions", id: "LIST" },
                      ]
                    : [{ type: "Permissions", id: "LIST" }],
        }),

        createPermission: builder.mutation<APIResponse<PermissionResponse>, { name: string; description: string }>({
            query: (body) => ({
                url: "/permissions/create",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Permissions", id: "LIST" }],
        }),

        updatePermission: builder.mutation<APIResponse<PermissionResponse>, { id: number; body: { name: string; description: string } }>({
            query: ({ id, body }) => ({
                url: `/permissions/update/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Permissions", id },
                { type: "Permissions", id: "LIST" },
            ],
        }),

        deletePermission: builder.mutation<APIResponse<void>, number>({
            query: (id) => ({
                url: `/permissions/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: "Permissions", id },
                { type: "Permissions", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useGetPermissionsQuery,
    useCreatePermissionMutation,
    useUpdatePermissionMutation,
    useDeletePermissionMutation,
} = permissionApi;
