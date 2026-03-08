import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";

export const store = configureStore({
  reducer: {
    // Đăng ký reducer của baseApi
    [baseApi.reducerPath]: baseApi.reducer,
  },
  // Middleware của RTK Query là bắt buộc để hỗ trợ cache, invalidation, polling, và các tính năng khác
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

// Export các type cần thiết cho TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
