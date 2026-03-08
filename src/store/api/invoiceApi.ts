
import type { InvoicePageResponse, InvoiceResponse } from "../../types/invoice.type";
import { baseApi } from "./baseApi";
import type { APIResponse } from "../../types/common.type";



export const invoiceApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getInvoices: builder.query<InvoicePageResponse,{page?: number; size?:number; keyword?: string ; sort?: string}>({
            query:({page= 1, size = 10 , keyword="" , sort= "asc"}) =>({
                url:"/invoices/list",
                params:{page,size,keyword,sort}
               
            }),

            providesTags:(result) =>
                result?.data?.data 
            ? 
            [... result.data.data.map(({id}) => ({type:"Invoices" as const , id})),
                  {type:"Invoices", id:"LIST"},
            ]
            :
            [{type:"Invoices",id:"LIST"}]     
        }),

        getInvoiceById: builder.query<APIResponse<InvoiceResponse>,number>({
            query:(id) => `/invoices/${id}`,
            providesTags:(result, error, id) => [{type:"Invoices",id}]
        }),

        createInvoice: builder.mutation<APIResponse<InvoiceResponse>,InvoiceResponse>({
            query:(body) => ({
                url:"/invoices/create",
                method:"POST",
                body
            }),

            invalidatesTags:[{type:"Invoices", id:"LIST"}]
        }),

        updateInvoice: builder.mutation<APIResponse<InvoiceResponse>, InvoiceResponse>({
            query:(body) => ({
                url:"/invoices/update",
                method:'PUT',
                body
            }),

            invalidatesTags:(result, error, arg) => [
                {type:"Invoices", id: arg.id},
                {type:"Invoices", id:"LIST"}

            ],
        }),

        deleteInvoice: builder.mutation<APIResponse<void>,number>({
            query:(id) => ({url:`/invoices/delete/${id}`, method:'DELETE'} ),
             
            invalidatesTags: (result, error, id) => [
                {type:"Invoices", id},
                {type:"Invoices",id:"LIST"}
            ]
        }),

        generateInvoices: builder.mutation<APIResponse<void>, { month: number; year: number }>({
            query: ({ month, year }) => ({
                url: "/invoices/generate-monthly",
                method: "POST",
                params: { month, year },
            }),
            invalidatesTags: [{ type: "Invoices", id: "LIST" }],
        }),

    })
})

export const {
    useGetInvoiceByIdQuery,
    useGetInvoicesQuery, 
    useCreateInvoiceMutation,
    useUpdateInvoiceMutation,
    useDeleteInvoiceMutation,
    useGenerateInvoicesMutation
} = invoiceApi;