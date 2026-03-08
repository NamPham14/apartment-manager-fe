import type { DashboardSummaryResponse } from "../../types/dashboard.type";
import { baseApi } from "./baseApi";


export const dashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardSummary: builder.query<DashboardSummaryResponse, void>({
            query: () => "/dashboard/summary",
            providesTags: ["Dashboard"]
        }),
    })
});

export const { useGetDashboardSummaryQuery } = dashboardApi;
