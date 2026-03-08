/* eslint-disable @typescript-eslint/no-explicit-any */
import type { APIResponse, PageResponse } from "../../types/common.type";
import type { RoleResponse } from "../../types/role.type";
import { baseApi } from "./baseApi";

export const roleApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getRoles: builder.query<APIResponse<PageResponse<RoleResponse>>, { page?: number; size?: number; keyword?: string; sort?: string }>({
            query: ({ page = 1, size = 10, keyword = "", sort = "" }) => ({
                url: "/roles/list",
                params: { page, size, keyword, sort },
            }),
            providesTags: (result) =>
                result?.data?.data
                    ? [
                        ...result.data.data.map(({ id }) => ({ type: "Roles" as const, id })),
                        { type: "Roles", id: "LIST" },
                      ]
                    : [{ type: "Roles", id: "LIST" }],
        }),

        createRole: builder.mutation<APIResponse<RoleResponse>, any>({
            query: (body) => ({
                url: "/roles/create",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Roles", id: "LIST" }],
        }),

        updateRole: builder.mutation<APIResponse<RoleResponse>, { id: number; body: any }>({
            query: ({ id, body }) => ({
                url: `/roles/update/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Roles", id },
                { type: "Roles", id: "LIST" },
            ],
        }),

        deleteRole: builder.mutation<APIResponse<void>, number>({
            query: (id) => ({
                url: `/roles/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: "Roles", id },
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
