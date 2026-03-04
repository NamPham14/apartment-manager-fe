/* eslint-disable @typescript-eslint/no-explicit-any */


import type { APIResponse } from "../../types/common.type";
import type { TenantPageResponse, TenantResponse } from "../../types/tenant.type";
import { baseApi } from "./baseApi";



export const tenantApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        
        getTenants: builder.query<TenantPageResponse,{page?:number ; size?:number; keyword?:string; sort?:string}>({
            query:({page =1 , size=10, keyword= "" ,sort ="asc"}) =>({
                url:`/tenants/list`,
                params:{page,size,keyword,sort},
            }),

            providesTags: (result) =>
                result?.data?.data
                    ? 
                    [
                          ...result.data.data.map(({id}) => ({type:"Tenants" as const, id})),
                          {type:"Tenants",id:"LIST"},
                    ] 
                    : 
                    [{type:"Tenants",id :"LIST"}],
               
        }),


        getTenantById: builder.query<APIResponse<TenantResponse>, number>({
            query:(id) => `/tenants/${id}`,
            providesTags:(result, error, id) => [{type:"Tenants",id}],
        }),

        createTenant: builder.mutation<APIResponse<TenantResponse>,TenantResponse>({
            query:(body) => ({url:"/tenants/create",method:"POST",body}),
            invalidatesTags:[{type:"Tenants",id:'LIST'}]
        }),

        updateTenant: builder.mutation<APIResponse<void>, TenantResponse>({
            query:(body) => ({
                url:"/tenants/update",
                method:'PUT',
                body
            }),
            invalidatesTags:(result, error, arg) => [
                {type:"Tenants", id:arg.id},
                {type:"Tenants", id:"LIST"}
            ],
            
        }),

        deleteTenant: builder.mutation<APIResponse<void>,number>({
            query:(id) => ({url:`/tenants/delete/${id}`,method:'DELETE'}),

            invalidatesTags:(result, error, id) => [
                {type:"Tenants", id},
                {type:"Tenants", id:"LIST"}
            ]
        })

    })
})

export const {useGetTenantsQuery,useGetTenantByIdQuery,useCreateTenantMutation,useUpdateTenantMutation,useDeleteTenantMutation} = tenantApi;