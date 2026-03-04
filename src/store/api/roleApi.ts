import type { APIResponse } from "../../types/common.type";
import type { RoleResponse } from "../../types/role.type";
import { baseApi } from "./baseApi";

export const roleApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getRoles: builder.query<APIResponse<RoleResponse[]>, void>({
            query: () => "/roles/list",
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ name }) => ({ type: "Roles" as const, id: name })),
                        { type: "Roles", id: "LIST" },
                      ]
                    : [{ type: "Roles", id: "LIST" }],
        }),

        createRole: builder.mutation<APIResponse<RoleResponse>, { name: string; description: string; permissions: string[] }>({
            query: (body) => ({
                url: "/roles/create",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Roles", id: "LIST" }],
        }),

        updateRole: builder.mutation<APIResponse<RoleResponse>, { roleName: string; body: { description: string; permissions: string[] } }>({
            query: ({ roleName, body }) => ({
                url: `/roles/update/${roleName}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (_result, _error, { roleName }) => [
                { type: "Roles", id: roleName },
                { type: "Roles", id: "LIST" },
            ],
        }),

        deleteRole: builder.mutation<APIResponse<void>, string>({
            query: (roleName) => ({
                url: `/roles/delete/${roleName}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, roleName) => [
                { type: "Roles", id: roleName },
                { type: "Roles", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useGetRolesQuery,
    useCreateRoleMutation,
    useUpdateRoleMutation,
    useDeleteRoleMutation,
} = roleApi;
