/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { useDebounce } from "./useDebounce";
import { 
  useGetRoomsQuery, 
  useCreateRoomMutation, 
  useUpdateRoomMutation, 
  useDeleteRoomMutation 
} from "../store/api/roomApi";
import type { RoomResponse } from "../types/room.type";

export function useRooms(defaultPage = 1, defaultSize = 10) {
  const [keyword, setKeyword] = useState<string>("");
  const debouncedKeyword = useDebounce(keyword, 400);
  const [page, setPage] = useState(defaultPage);
  const [size] = useState<number>(defaultSize);
  const [sort, setSort] = useState<string>("id:desc");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selected, setSelected] = useState<RoomResponse | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<number | null>(null);

  const query = useGetRoomsQuery({
    page,
    size,
    sort,
    keyword: debouncedKeyword,
  });

  const [createRoom] = useCreateRoomMutation();
  const [updateRoom] = useUpdateRoomMutation();
  const [deleteRoom] = useDeleteRoomMutation();

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

  const openEdit = useCallback((r: RoomResponse) => {
    setModalMode("edit");
    setSelected(r);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => setModalOpen(false), []);

  const prepareFormData = (data: any) => {
    const formData = new FormData();
    
    // Tách files ra khỏi data JSON
    const { roomFiles, ...roomData } = data;
    
    // Gửi data dưới dạng Blob với application/json để BE @RequestPart("data") nhận được
    formData.append("data", new Blob([JSON.stringify(roomData)], { type: "application/json" }));
    
    // Append các files ảnh
    if (roomFiles && roomFiles.length > 0) {
      for (let i = 0; i < roomFiles.length; i++) {
        formData.append("files", roomFiles[i]);
      }
    }
    
    return formData;
  };

  const doCreate = useCallback(async (data: any) => {
    try {
      const formData = prepareFormData(data);
      const res = await createRoom(formData).unwrap();
      toast.success("Room created successfully!");
      setModalOpen(false);
      return res;
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to create room");
      throw err;
    }
  }, [createRoom]);

  const doUpdate = useCallback(async (data: any) => {
    try {
      const formData = prepareFormData(data);
      const res = await updateRoom(formData).unwrap();
      toast.success("Room updated successfully!");
      setModalOpen(false);
      return res;
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to update room");
      throw err;
    }
  }, [updateRoom]);

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
      const res = await deleteRoom(targetId).unwrap();
      toast.success("Room deleted successfully!");
      setConfirmOpen(false);
      setConfirmTarget(null);
      return res;
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to delete room");
      throw err;
    }
  }, [confirmTarget, deleteRoom]);

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
    rooms: query.data?.data?.data || [],
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
