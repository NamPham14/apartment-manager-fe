/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { useDebounce } from "./useDebounce";
import { 
  useGetUsersQuery, 
  useCreateUserMutation, 
  useUpdateUserMutation, 
  useInactiveAccountMutation 
} from "../store/api/userApi";
import type { UserResponse } from "../types/user.type";

export function useUsers(defaultPage = 1, defaultSize = 10) {
  const [keyword, setKeyword] = useState<string>("");
  const debouncedKeyword = useDebounce(keyword, 400);
  const [page, setPage] = useState(defaultPage);
  const [size] = useState<number>(defaultSize);
  const [sort, setSort] = useState<string>("id:asc");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selected, setSelected] = useState<UserResponse | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<number | null>(null);

  const query = useGetUsersQuery({
    page,
    size,
    sort,
    keyword: debouncedKeyword,
  });

  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [inactiveAccount] = useInactiveAccountMutation();

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

  const openEdit = useCallback((u: UserResponse) => {
    setModalMode("edit");
    setSelected(u);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => setModalOpen(false), []);

  const doCreate = useCallback(async (payload: any) => {
    try {
      const res = await createUser(payload).unwrap();
      toast.success("User created successfully!");
      setModalOpen(false);
      return res;
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to create user");
      throw err;
    }
  }, [createUser]);
  
  const doUpdate = useCallback(async (payload: any) => {
    try {
      const res = await updateUser(payload).unwrap();
      toast.success("User updated successfully!");
      setModalOpen(false);
      return res;
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to update user");
      throw err;
    }
  }, [updateUser]);

  const askDelete = useCallback((id: number) => {
    setConfirmTarget(id);
    setConfirmOpen(true);
  }, []);

  const cancelDelete = useCallback(() => {
    setConfirmOpen(false);
    setConfirmTarget(null);
  }, []);

  const doDelete = useCallback(async (id?: number) => {
    try {
      const targetId = id ?? confirmTarget;
      if (!targetId) throw new Error("No target");
      const res = await inactiveAccount(targetId).unwrap();
      toast.success("Account inactivated!");
      setConfirmOpen(false);
      setConfirmTarget(null);
      return res;
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to inactivate account");
      throw err;
    }
  }, [confirmTarget, inactiveAccount]);

  const setSearch = useCallback((kw: string) => {
    setKeyword(kw);
    setPage(1);
  }, []);

  const goToPage = useCallback((p: number) => setPage(p), []);

  return {
    page,
    keyword,
    modalOpen,
    modalMode,
    selected,
    confirmOpen,
    users: query.data?.data?.data || [],
    pagination: query.data?.data || { totalElements: 0, totalPages: 0, pageNumber: 1 },
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
