/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from "react";
import { useDebounce } from "./useDebounce";
import { 
  useGetInvoicesQuery, 
  useCreateInvoiceMutation, 
  useUpdateInvoiceMutation, 
  useDeleteInvoiceMutation,
  useGenerateInvoicesMutation
} from "../store/api/invoiceApi";
import type { InvoiceResponse } from "../types/invoice.type";
import toast from "react-hot-toast";

export function useInvoices(defaultPage = 1, defaultSize = 10) {
  const [keyword, setKeyword] = useState<string>("");
  const debouncedKeyword = useDebounce(keyword, 400);
  const [page, setPage] = useState(defaultPage);
  const [size] = useState<number>(defaultSize);
  const [sort, setSort] = useState<string>("id:desc");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selected, setSelected] = useState<InvoiceResponse | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<number | null>(null);

  const query = useGetInvoicesQuery({
    page,
    size,
    sort,
    keyword: debouncedKeyword,
  });

  const [createInvoice] = useCreateInvoiceMutation();
  const [updateInvoice] = useUpdateInvoiceMutation();
  const [deleteInvoice] = useDeleteInvoiceMutation();
  const [generateInvoices] = useGenerateInvoicesMutation();

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

  const openEdit = useCallback((i: InvoiceResponse) => {
    setModalMode("edit");
    setSelected(i);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => setModalOpen(false), []);

  const doCreate = useCallback(async (payload: any) => {
    try {
      const res = await createInvoice(payload).unwrap();
      toast.success("Invoice generated successfully!");
      setModalOpen(false);
      return res;
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to generate invoice");
      throw err;
    }
  }, [createInvoice]);

  const doUpdate = useCallback(async (payload: any) => {
    try {
      const res = await updateInvoice(payload).unwrap();
      toast.success("Invoice updated successfully!");
      setModalOpen(false);
      return res;
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to update invoice");
      throw err;
    }
  }, [updateInvoice]);

  const doGenerateBulk = useCallback(async (month: number, year: number) => {
    try {
      const res = await generateInvoices({ month, year }).unwrap();
      toast.success(`Invoices for ${month}/${year} generated for all rooms!`);
      return res;
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to bulk generate");
      throw err;
    }
  }, [generateInvoices]);

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
      const res = await deleteInvoice(targetId).unwrap();
      toast.success("Invoice deleted successfully!");
      setConfirmOpen(false);
      setConfirmTarget(null);
      return res;
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to delete invoice");
      throw err;
    }
  }, [confirmTarget, deleteInvoice]);

  const setSearch = useCallback((kw: string) => {
      setKeyword(kw);
      setPage(1);
  }, []);

  const goToPage = useCallback((p: number) => {
      setPage(p);
  }, []);

  return {
    page,
    keyword,
    modalOpen,
    modalMode,
    selected,
    confirmOpen,
    invoices: query.data?.data?.data || [],
    pagination: query.data?.data || { totalElements: 0, totalPages: 0, pageNumber: 1 },
    isLoading: query.isFetching,
    refetch: query.refetch,
    handleSortChange,
    openAdd,
    openEdit,
    closeModal,
    doCreate,
    doUpdate,
    doGenerateBulk,
    askDelete,
    cancelDelete,
    doDelete,
    setSearch,
    goToPage,
  } as const;
}
