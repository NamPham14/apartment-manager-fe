/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from "react";
import { useDebounce } from "./useDebounce";
import { 
  useGetRolesQuery, 
  useCreateRoleMutation, 
  useUpdateRoleMutation, 
  useDeleteRoleMutation 
} from "../store/api/roleApi";
import type { RoleResponse } from "../types/role.type";
import type { PageResponse } from "../types/common.type";
import toast from "react-hot-toast";

export function useRoles(defaultPage = 1, defaultSize = 10) {
  const [keyword, setKeyword] = useState<string>("");
  const debouncedKeyword = useDebounce(keyword, 400);
  const [page, setPage] = useState(defaultPage);
  const [size] = useState<number>(defaultSize);
  const [sort, setSort] = useState<string>("id:asc");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selected, setSelected] = useState<RoleResponse | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<number | null>(null);

  const query = useGetRolesQuery({
    page,
    size,
    sort,
    keyword: debouncedKeyword,
  });

  const [createRole] = useCreateRoleMutation();
  const [updateRole] = useUpdateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();

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
  }, []);

  const openEdit = useCallback((r: RoleResponse) => {
    setModalMode("edit");
    setSelected(r);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => setModalOpen(false), []);

  const doCreate = useCallback(async (payload: any) => {
    try {
      const res = await createRole(payload).unwrap();
      toast.success(res.message || "Role created successfully");
      closeModal();
      return res;
    } catch (error: any) {
      console.error(error);
      toast.error(error.data?.message || "Failed to create role");
      throw error;
    }
  }, [createRole, closeModal]);
  
  const doUpdate = useCallback(async (payload: any) => {
    if (!selected) return Promise.reject("No role selected");
    try {
      const res = await updateRole({ id: selected.id, body: payload }).unwrap();
      toast.success(res.message || "Role updated successfully");
      closeModal();
      return res;
    } catch (error: any) {
      console.error(error);
      toast.error(error.data?.message || "Failed to update role");
      throw error;
    }
  }, [updateRole, selected, closeModal]);

  const askDelete = useCallback((id: number) => {
    setConfirmTarget(id);
    setConfirmOpen(true);
  }, []);

  const cancelDelete = useCallback(() => {
    setConfirmOpen(false);
    setConfirmTarget(null);
  }, []);

  const doDelete = useCallback(async (id?: number) => {
    const targetId = id ?? confirmTarget;
    if (!targetId) return;
    try {
      const res = await deleteRole(targetId).unwrap();
      toast.success(res.message || "Role deleted successfully");
      setConfirmOpen(false);
      setConfirmTarget(null);
      return res;
    } catch (error: any) {
      console.error(error);
      toast.error(error.data?.message || "Failed to delete role");
      throw error;
    }
  }, [confirmTarget, deleteRole]);

  const setSearch = useCallback((kw: string) => {
    setKeyword(kw);
    setPage(1);
  }, []);

  const goToPage = useCallback((p: number) => setPage(p), []);

  const pagination: PageResponse<RoleResponse> = query.data?.data || { 
    totalElements: 0, 
    totalPages: 0, 
    pageNumber: 1, 
    pageSize: defaultSize, 
    data: [] 
  };

  return {
    page,
    keyword,
    modalOpen,
    modalMode,
    selected,
    confirmOpen,
    roles: pagination.data || [],
    pagination,
    isLoading: query.isFetching,
    refetch: query.refetch,
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
