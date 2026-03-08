/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { useDebounce } from "./useDebounce";
import { 
  useGetContractsQuery, 
  useCreateContractMutation, 
  useUpdateContractMutation, 
  useDeleteContractMutation 
} from "../store/api/contractApi";
import type { ContractResponse } from "../types/contract.type";

export function useContracts(defaultPage = 1, defaultSize = 10) {
  const [keyword, setKeyword] = useState<string>("");
  const debouncedKeyword = useDebounce(keyword, 400);
  const [page, setPage] = useState(defaultPage);
  const [size] = useState<number>(defaultSize);
  const [sort, setSort] = useState<string>("id:desc");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selected, setSelected] = useState<ContractResponse | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<number | null>(null);

  const query = useGetContractsQuery({
    page,
    size,
    sort,
    keyword: debouncedKeyword,
  });

  const [createContract] = useCreateContractMutation();
  const [updateContract] = useUpdateContractMutation();
  const [deleteContract] = useDeleteContractMutation();

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

  const openEdit = useCallback((c: ContractResponse) => {
    setModalMode("edit");
    setSelected(c);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => setModalOpen(false), []);

  const doCreate = useCallback(async (payload: any) => {
    try {
      const res = await createContract(payload).unwrap();
      toast.success("Contract created successfully!");
      setModalOpen(false);
      return res;
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to create contract");
      throw err;
    }
  }, [createContract]);

  const doUpdate = useCallback(async (payload: any) => {
    try {
      const res = await updateContract(payload).unwrap();
      toast.success("Contract updated successfully!");
      setModalOpen(false);
      return res;
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to update contract");
      throw err;
    }
  }, [updateContract]);

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
      const res = await deleteContract(targetId).unwrap();
      toast.success("Contract deleted successfully!");
      setConfirmOpen(false);
      setConfirmTarget(null);
      return res;
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to delete contract");
      throw err;
    }
  }, [confirmTarget, deleteContract]);

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
    contracts: query.data?.data?.data || [],
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
