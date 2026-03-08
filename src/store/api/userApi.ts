/* eslint-disable @typescript-eslint/no-explicit-any */
import type { APIResponse } from "../../types/common.type";
import type { UserPageResponse, UserResponse } from "../../types/user.type";
import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query<UserPageResponse, { page?: number; size?: number; keyword?: string; sort?: string }>({
            query: ({ page = 1, size = 10, keyword = "", sort = "" } = {}) => ({
                url: "/users/list",
                params: { page, size, keyword, sort },
            }),
            providesTags: (result) =>
                result?.data?.data
                    ? [
                        ...result.data.data.map(({ id }) => ({ type: "Users" as const, id })),
                        { type: "Users", id: "LIST" },
                      ]
                    : [{ type: "Users", id: "LIST" }],
        }),

        createUser: builder.mutation<APIResponse<UserResponse>, any>({
            query: (body) => ({
                url: "/users/create-user",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Users", id: "LIST" }],
        }),

        updateUser: builder.mutation<APIResponse<void>, FormData>({
            query: (formData) => ({
                url: "/users/update",
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: () => [{ type: "Users", id: "LIST" }],
        }),

        inactiveAccount: builder.mutation<APIResponse<void>, number>({
            query: (id) => ({
                url: `/users/Inactive-account/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: "Users", id },
                { type: "Users", id: "LIST" },
            ],
        }),

        getMyInfo: builder.query<APIResponse<UserResponse>, void>({
            query: () => "/users/myInfo",
            providesTags: (result) => (result?.data ? [{ type: "Users", id: result.data.id }] : []),
        }),

        changePassword: builder.mutation<APIResponse<void>, any>({
            query: (body) => ({
                url: "/users/change-pwd-user",
                method: "PUT",
                body,
            }),
        }),
    }),
});

export const {
    useGetUsersQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useInactiveAccountMutation,
    useGetMyInfoQuery,
    useChangePasswordMutation,
} = userApi;

export { useInactiveAccountMutation as useDeleteUserMutation };
