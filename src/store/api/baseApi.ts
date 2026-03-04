import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  // Tên định danh cho reducer trong Redux Store
  reducerPath: "baseApi",

  // baseQuery: cấu hình URL gốc và các thiết lập request chung
  baseQuery: fetchBaseQuery({
    baseUrl: (import.meta.env.VITE_API_URL ?? "http://localhost:8080/api").replace(/\/$/, ""),
    
    prepareHeaders: (headers) => {
     
      return headers;
    },
  }),

  // Định nghĩa các loại dữ liệu để RTK Query tự động làm mới (Refetch)
  tagTypes: ["Rooms", "Tenants", "Invoices", "Contracts", "Users", "Roles", "Permissions", "Measurements"],

  // Endpoints ban đầu để trống, sẽ được inject từ các file con
  endpoints: () => ({}),
});
