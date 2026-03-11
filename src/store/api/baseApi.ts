import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { logout, setAuth, setUserProfile } from "../authSlice"; // Thêm setUserProfile vào đây
import type { APIResponse, AuthResponse } from "../../types/common.type";
import type { UserResponse } from "../../types/user.type";

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}


const baseQuery = fetchBaseQuery({
  baseUrl: (() => {
    const url = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
    return (url.endsWith("/api") ? url : `${url}/api`).replace(/\/$/, "");
  })(),

  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const customBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);


  if (result.error?.status === 401) {
    const refreshToken = (api.getState() as RootState).auth.refreshToken;
    
    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: "/auth/refresh-token",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      const data = refreshResult.data as APIResponse<AuthResponse>;
      const newAccessToken = data?.data?.accessToken;
      // Lấy refreshToken mới nếu có, nếu không giữ cái cũ
      const newRefreshToken = data?.data?.refreshToken || refreshToken;

      if (newAccessToken) {
        api.dispatch(
          setAuth({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          })
        );
        // Thử lại request ban đầu
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    } else {
      api.dispatch(logout());
    }
  }

  // Xử lý lỗi 403
  if (result.error?.status === 403) {
    // Không nên nhảy cứng sang forbidden ở đây nếu chỉ là một request nhỏ bị từ chối
    // Tùy nhu cầu bạn có thể giữ hoặc bỏ
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: customBaseQuery,
  tagTypes: [
    "Rooms",
    "Tenants",
    "Invoices",
    "Contracts",
    "Users",
    "Roles",
    "Permissions",
    "Measurements",
    "Dashboard",
    "Settings",
    "MyInfo",
  ],
  endpoints: (builder) => ({
    login: builder.mutation<APIResponse<AuthResponse>, LoginRequest>({
      query: (loginData) => ({
        url: "/auth/login",
        method: "POST",
        body: loginData,
      }),
    }),

    getMyInfo: builder.query<APIResponse<UserResponse>, void>({
        query: () => "/users/myInfo",
        providesTags: [{ type: "MyInfo", id: "CURRENT_USER" }],
        async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
            try {
                const { data } = await queryFulfilled;
                if (data.data) {
                    dispatch(setUserProfile(data.data));
                }
            } catch (err) {
                console.error("Failed to sync user profile:", err);
            }
        },
    }),

    logout: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    register: builder.mutation<APIResponse<UserResponse>, RegisterRequest>({
      query: (userData) => ({
        url: "/api/users/create-user",
        method: "POST",
        body: userData,
      }),
    }),
  }),
});


export const {
  useLoginMutation,
  useGetMyInfoQuery,
  useRegisterMutation,
  useLogoutMutation,
} = baseApi;
