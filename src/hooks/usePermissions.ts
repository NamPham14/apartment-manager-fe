/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from "react";
import { useDebounce } from "./useDebounce";
import { 
  useGetPermissionsQuery, 
  useCreatePermissionMutation, 
  useUpdatePermissionMutation, 
  useDeletePermissionMutation 
} from "../store/api/permissionApi";
import type { PermissionResponse } from "../types/permission.type";
import type { PageResponse } from "../types/common.type";

export function usePermissions(defaultPage = 1, defaultSize = 10) {
  const [keyword, setKeyword] = useState<string>("");
  const debouncedKeyword = useDebounce(keyword, 400);
  const [page, setPage] = useState(defaultPage);
  const [size] = useState<number>(defaultSize);
  const [sort, setSort] = useState<string>("id:asc");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selected, setSelected] = useState<PermissionResponse | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<number | null>(null);

  const query = useGetPermissionsQuery({
    page,
    size,
    sort,
    keyword: debouncedKeyword,
  });

  const [createPermission] = useCreatePermissionMutation();
  const [updatePermission] = useUpdatePermissionMutation();
  const [deletePermission] = useDeletePermissionMutation();

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

  const openEdit = useCallback((p: PermissionResponse) => {
    setModalMode("edit");
    setSelected(p);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => setModalOpen(false), []);

  const doCreate = useCallback((payload: any) => createPermission(payload).unwrap(), [createPermission]);
  const doUpdate = useCallback((payload: any) => {
    if (!selected) return Promise.reject("No permission selected");
    return updatePermission({ id: selected.id, body: payload }).unwrap();
  }, [updatePermission, selected]);

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
    if (!targetId) throw new Error("No target");
    const res = await deletePermission(targetId).unwrap();
    setConfirmOpen(false);
    setConfirmTarget(null);
    return res;
  }, [confirmTarget, deletePermission]);

  const setSearch = useCallback((kw: string) => {
    setKeyword(kw);
    setPage(1);
  }, []);

  const goToPage = useCallback((p: number) => setPage(p), []);

  const pagination: PageResponse<PermissionResponse> = query.data?.data || { 
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
    permissions: pagination.data || [],
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
