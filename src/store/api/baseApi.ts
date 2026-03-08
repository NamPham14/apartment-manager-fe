import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  // Tên định danh cho reducer trong Redux Store
  reducerPath: "baseApi",

  // baseQuery: cấu hình URL gốc và các thiết lập request chung
  baseQuery: fetchBaseQuery({
    baseUrl: (() => {
      const url = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
      return (url.endsWith("/api") ? url : `${url}/api`).replace(/\/$/, "");
    })(),
    
    prepareHeaders: (headers) => {
      // Lấy token từ localStorage (hoặc Redux store)
      const token = localStorage.getItem('accessToken');
      
      // Nếu có token, gắn nó vào Authorization header
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  }),

  // Định nghĩa các loại dữ liệu để RTK Query tự động làm mới (Refetch)
  tagTypes: ["Rooms", "Tenants", "Invoices", "Contracts", "Users", "Roles", "Permissions", "Measurements", "Dashboard", "Settings"],

  // Endpoints ban đầu để trống, sẽ được inject từ các file con
  endpoints: () => ({}),
});
