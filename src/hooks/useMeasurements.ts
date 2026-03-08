/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { useDebounce } from "./useDebounce";
import { 
  useCreateMeasureMutation,
  useDeleteMeasureMutation,
  useGetMeasurementsQuery,
  useUpdateMeasureMutation, 
} from "../store/api/measureApi";
import type { MeasureResponse } from "../types/measure.type";

export function useMeasurements(defaultPage = 1, defaultSize = 10) {
  const [keyword, setKeyword] = useState<string>("");
  const debouncedKeyword = useDebounce(keyword, 400);
  const [page, setPage] = useState(defaultPage);
  const [size] = useState<number>(defaultSize);
  const [sort, setSort] = useState<string>("id:desc");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selected, setSelected] = useState<MeasureResponse | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<number | null>(null);

  const query = useGetMeasurementsQuery({
    page,
    size,
    sort,
    keyword: debouncedKeyword,
  });

  const [createMeasurement] = useCreateMeasureMutation();
  const [updateMeasurement] = useUpdateMeasureMutation();
  const [deleteMeasurement] = useDeleteMeasureMutation();

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

  const openEdit = useCallback((m: MeasureResponse) => {
    setModalMode("edit");
    setSelected(m);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => setModalOpen(false), []);

  const doCreate = useCallback(async (payload: any) => {
    try {
      const res = await createMeasurement(payload).unwrap();
      toast.success("Measurement recorded successfully!");
      setModalOpen(false);
      return res;
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to record usage");
      throw err;
    }
  }, [createMeasurement]);

  const doUpdate = useCallback(async (payload: any) => {
    try {
      const res = await updateMeasurement(payload).unwrap();
      toast.success("Measurement updated successfully!");
      setModalOpen(false);
      return res;
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to update record");
      throw err;
    }
  }, [updateMeasurement]);

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
      const res = await deleteMeasurement(targetId).unwrap();
      toast.success("Measurement deleted successfully!");
      setConfirmOpen(false);
      setConfirmTarget(null);
      return res;
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to delete record");
      throw err;
    }
  }, [confirmTarget, deleteMeasurement]);

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
    measurements: query.data?.data?.data || [],
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
