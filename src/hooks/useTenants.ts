/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { useDebounce } from "./useDebounce";
import { useCreateTenantMutation, useDeleteTenantMutation, useGetTenantsQuery, useUpdateTenantMutation } from "../store/api/tenantApi";
import type { TenantResponse } from "../types/tenant.type";

export function useTenants(defaultPage= 1, defaultSize =10) {
    const [keyword, setKeyword] = useState<string>("");
    const debouncedKeyword = useDebounce(keyword, 400);
    const[page, setPage] = useState(defaultPage);
    const[size] =  useState<number>(defaultSize);
    const [sort, setSort] =  useState<string>("id:asc");

    // modal (add/edit)
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [selected, setSelected] = useState<TenantResponse | null>(null);

    // confirm states
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmTarget, setConfirmTarget] = useState<number | null>(null);

    // RTK QUERY
    const query = useGetTenantsQuery({
        page,
        size,
        sort,
        keyword:debouncedKeyword,
    });

    // mutations
     const [createTenant] = useCreateTenantMutation();
     const [updateTenant] = useUpdateTenantMutation();
     const [deleteTenant]  = useDeleteTenantMutation();

    const handleSortChange = useCallback((column: string) => {
    setSort(prev => {
      const [prevCol, prevDir] = prev.split(':');
      if (prevCol === column) {
        return `${column}:${prevDir === 'asc' ? 'desc' : 'asc'}`;
      }
      return `${column}:asc`;
    });
    }, []);

    const openAdd = useCallback(() => {
        setModalMode("add");
        setSelected(null);
        setModalOpen(true);
    },[]);

    const openEdit = useCallback((r: TenantResponse) => {
        setModalMode("edit");
        setSelected(r);
        setModalOpen(true)
    },[]);

    const closeModal = useCallback(() => {
        setModalOpen(false)
    },[]);

    const doCreate = useCallback(
        async (payload: any) => {
            try {
                const res = await createTenant(payload).unwrap();
                toast.success("Tenant created successfully!");
                setModalOpen(false);
                return res;
            } catch (err: any) {
                toast.error(err.data?.message || "Failed to create tenant");
                throw err;
            }
        },
        [createTenant]
    );

    const doUpdate = useCallback(
        async (payload: any) => {
            try {
                const res = await updateTenant(payload).unwrap();
                toast.success("Tenant updated successfully!");
                setModalOpen(false);
                return res;
            } catch (err: any) {
                toast.error(err.data?.message || "Failed to update tenant");
                throw err;
            }
        },
        [updateTenant]
    );

    const askDelete = useCallback((id: number) => {
        setConfirmTarget(id);
        setConfirmOpen(true);
    },[]);

    const cancelDelete = useCallback(() =>{
        setConfirmOpen(false);
        setConfirmTarget(null);
    },[]);

    const doDelete =  useCallback(
        async (id?:number) => {
            try {
                const targetId = id ?? confirmTarget;
                if(!targetId)  throw new Error("No target");
                const res = await deleteTenant(targetId).unwrap();
                toast.success("Tenant deleted successfully!");
                setConfirmOpen(false);
                setConfirmTarget(null);
                return res;
            } catch (err: any) {
                toast.error(err.data?.message || "Failed to delete tenant");
                throw err;
            }
        },
        [confirmTarget,deleteTenant]
    );

    const setSearch = useCallback((kw:string) =>{
        setKeyword(kw);
        setPage(1);
    },[])

    const goToPage = useCallback((p: number) => setPage(p), []);
    
    return {
    page,
    size,
    keyword,
    debouncedKeyword,
    sort,
    modalOpen,
    modalMode,
    selected,
    confirmOpen,
    confirmTarget,

    data: query.data,
    tenants: query.data?.data?.data || [],
    pagination : query.data?.data || {totalElements:0 ,totalPages:0, pageNumber:1},
    isLoading : query.isFetching,
    isError: query.isError,
    refetch : query.refetch,

    handleSortChange,
    openAdd,
    openEdit,
    closeModal,
    doCreate,
    doUpdate,
    askDelete,
    cancelDelete,
    doDelete,
    setSearch,
    goToPage,
    } as const;
}
