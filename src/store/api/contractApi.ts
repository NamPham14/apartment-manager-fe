/* eslint-disable @typescript-eslint/no-explicit-any */


import { type APIResponse } from "../../types/common.type";
import { type ContractPageResponse, type ContractResponse } from "../../types/contract.type";
import { baseApi } from "./baseApi";


export const contractApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getContracts : builder.query<ContractPageResponse, {page?:number; size?:number; keyword?:string ;sort?:string}>({
            query:({page= 1, size= 10, keyword="" , sort= "asc"}) =>({
                url:'/contracts/list',
                params:{page, size, keyword,sort}
            }),
            providesTags:(result) =>
                result?.data?.data 
                   ? [
                    ...result.data.data.map(({id}) =>  ({type:"Contracts" as const ,id})),
                    {type:"Contracts", id:"LIST"},
                   ]
                   : [{type:"Contracts", id:"LIST"}],
        }),

        getContractById: builder.query<APIResponse<ContractResponse>,number>({
            query:(id) => `/contracts/${id}`,
            providesTags:(_result, _error,id) => [{type:"Contracts",id}]
        }),

        createContract: builder.mutation<APIResponse<ContractResponse>,ContractResponse>({
            query: (body) => ({url:"/contracts/create",method:"POST",body}),
            invalidatesTags:[{type:"Contracts", id:"LIST"}]
        }),


        updateContract: builder.mutation<APIResponse<void>, ContractResponse>({
               query: (body) => ({
                   url: `/contracts/update`,
                   method: 'PUT',
                   body: body 
               }),
               invalidatesTags: (result, error, arg) => [
                   {type: "Contracts", id: arg.id}, // Làm mới cái id đang sửa
                   {type: "Contracts", id: "LIST"}
               ],
           }),
   

        deleteContract: builder.mutation<APIResponse<void>,number>({
            query:(id) => ({url:`/contract/delete/${id}`, method:'DELETE'} ),
             
            invalidatesTags: (result, error, id) => [
                {type:"Contracts", id},
                {type:"Contracts",id:"LIST"}
            ]
        })

    })
})

export const {useCreateContractMutation, useUpdateContractMutation, useDeleteContractMutation,useGetContractByIdQuery,useGetContractsQuery} = contractApi;