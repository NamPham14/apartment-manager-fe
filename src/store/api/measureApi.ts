import type { APIResponse } from "../../types/common.type";
import type { MeasureResponse } from "../../types/measure.type";
import { baseApi } from "./baseApi";

export const measureApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMeasurements: builder.query<APIResponse<MeasureResponse[]>, void>({
            query: () => "/measurements/list",
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ id }) => ({ type: "Measurements" as const, id })),
                        { type: "Measurements", id: "LIST" },
                      ]
                    : [{ type: "Measurements", id: "LIST" }],
        }),

        getMeasureById: builder.query<APIResponse<MeasureResponse>, number>({
            query: (id) => `/measurements/${id}`,
            providesTags: (_result, _error, id) => [{ type: "Measurements", id }],
        }),

        createMeasure: builder.mutation<APIResponse<MeasureResponse>, {
            contractId: number;
            month: number;
            year: number;
            oldElectricityIndex: number;
            newElectricityIndex: number;
            oldWaterIndex: number;
            newWaterIndex: number;
            recordDate: string;
        }>({
            query: (body) => ({
                url: "/measurements/create",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Measurements", id: "LIST" }],
        }),

        deleteMeasure: builder.mutation<APIResponse<void>, number>({
            query: (id) => ({
                url: `/measurements/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: "Measurements", id },
                { type: "Measurements", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useGetMeasurementsQuery,
    useGetMeasureByIdQuery,
    useCreateMeasureMutation,
    useDeleteMeasureMutation,
} = measureApi;
