import type { APIResponse } from "../../types/common.type";
import type { PermissionResponse } from "../../types/permission.type";
import { baseApi } from "./baseApi";

export const permissionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPermissions: builder.query<APIResponse<PermissionResponse[]>, void>({
            query: () => "/permissions/list",
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ name }) => ({ type: "Permissions" as const, id: name })),
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

        deletePermission: builder.mutation<APIResponse<void>, string>({
            query: (name) => ({
                url: `/permissions/delete/${name}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, name) => [
                { type: "Permissions", id: name },
                { type: "Permissions", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useGetPermissionsQuery,
    useCreatePermissionMutation,
    useDeletePermissionMutation,
} = permissionApi;
