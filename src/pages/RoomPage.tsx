import React, { useState } from 'react';
import { DataTable } from '../components/DataTable';
import { useRooms } from '../hooks/useRooms';
import { RoomModal } from '../components/RoomModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { RoomDetailModal } from '../components/RoomDetailModal';
import Pagination from '../components/Pagination';
import { 
  Plus, 
  Search, 
  Loader2, 
  RefreshCw, 
  Image as ImageIcon, 
  LayoutGrid, 
  List, 
  Edit2,
  Trash2,
  Eye,
} from 'lucide-react';
import type { RoomResponse } from '../types/room.type';

const RoomImagePreview = ({ item, onClick }: { item: RoomResponse, onClick: () => void }) => {
  const [imgError, setImgError] = useState(false);
  const hasImage = item.roomImage && item.roomImage.length > 0 && !imgError;

  return (
    <div 
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="w-12 h-12 rounded-lg overflow-hidden border border-[#2d2d2d] bg-[#1a1a1a] flex items-center justify-center cursor-pointer hover:border-[#FF9500] transition-all group"
    >
      {hasImage ? (
        <img 
          src={item.roomImage[0]} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
          onError={() => setImgError(true)}
        />
      ) : (
        <ImageIcon size={18} className="text-gray-600" />
      )}
    </div>
  );
};

export default function RoomPage() {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
  const { 
    rooms, 
    pagination, 
    isLoading, 
    keyword,
    setSearch,
    handleSortChange,
    goToPage,
    refetch,
    modalOpen,
    modalMode,
    selected,
    openAdd,
    openEdit,
    closeModal,
    doCreate,
    doUpdate,
    confirmOpen,
    askDelete,
    cancelDelete,
    doDelete
  } = useRooms();

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRoom, setDetailRoom] = useState<RoomResponse | null>(null);

  const handleOpenDetail = (room: RoomResponse) => {
    setDetailRoom(room);
    setDetailOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'border-emerald-500/50 text-emerald-500 bg-emerald-500/5';
      case 'OCCUPIED': return 'border-rose-500/50 text-rose-500 bg-rose-500/5';
      case 'MAINTENANCE': return 'border-amber-500/50 text-amber-500 bg-amber-500/5';
      default: return 'border-gray-500/50 text-gray-500 bg-gray-500/5';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-emerald-500';
      case 'OCCUPIED': return 'bg-rose-500';
      case 'MAINTENANCE': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };

  const columns = [
    { 
      key: 'roomImage' as keyof RoomResponse, 
      label: 'Preview', 
      render: (item: RoomResponse) => <RoomImagePreview item={item} onClick={() => handleOpenDetail(item)} />
    },
    { 
      key: 'name' as keyof RoomResponse, 
      label: 'Room Name', 
      sortable: true,
      render: (item: RoomResponse) => (
        <div className="flex flex-col cursor-pointer group" onClick={() => handleOpenDetail(item)}>
          <span className="text-sm font-semibold text-white group-hover:text-[#FF9500] transition-colors">{item.name}</span>
          <span className="text-xs text-gray-500 line-clamp-1">{item.description || 'No description'}</span>
        </div>
      )
    },
    { 
      key: 'basePrice' as keyof RoomResponse, 
      label: 'Price', 
      sortable: true,
      render: (item: RoomResponse) => <span className="text-[#FF9500] font-medium">{Number(item.basePrice).toLocaleString()} đ</span>
    },
    { 
      key: 'area' as keyof RoomResponse, 
      label: 'Area', 
      sortable: true,
      render: (item: RoomResponse) => <span>{item.area} m²</span>
    },
    { 
      key: 'status' as keyof RoomResponse, 
      label: 'Status',
      render: (item: RoomResponse) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(item.status)}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(item.status)}`}></span>
          {item.status}
        </span>
      )
    },
  ];

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Room Inventory</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and monitor apartment unit availability.</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="flex bg-[#1a1a1a] p-1 rounded-xl border border-[#2d2d2d]">
               <button 
                 onClick={() => setViewMode('grid')}
                 className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#FF9500] text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
               >
                 <LayoutGrid size={18} />
               </button>
               <button 
                 onClick={() => setViewMode('table')}
                 className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-[#FF9500] text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
               >
                 <List size={18} />
               </button>
            </div>
            <button 
                onClick={() => refetch()}
                className="p-2.5 rounded-xl border border-[#2d2d2d] hover:bg-[#1a1a1a] transition-colors text-gray-400 hover:text-white"
            >
                <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
            </button>
            <button 
              onClick={openAdd}
              className="bg-[#FF9500] hover:bg-[#e68600] text-black font-bold py-2.5 px-6 rounded-xl transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(255,149,0,0.3)]"
            >
                <Plus size={20} /> New Unit
            </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-4 mb-6 flex flex-col lg:flex-row gap-4 border-[#2d2d2d]">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search by room name..."
            value={keyword}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#FF9500] text-white transition-all"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Loader2 className="w-10 h-10 animate-spin text-[#FF9500] mb-4" />
          <p className="animate-pulse font-medium uppercase text-[10px] tracking-widest">Loading units...</p>
        </div>
      ) : rooms.length === 0 ? (
        <div className="glass-panel rounded-2xl py-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center text-gray-500 mb-4">
                <Search size={32} />
            </div>
            <h3 className="text-white font-bold text-lg">No units found</h3>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search or add a new unit.</p>
        </div>
      ) : viewMode === 'table' ? (
        <>
          <DataTable 
            data={rooms}
            columns={columns}
            onSort={(key) => handleSortChange(String(key))}
            onDelete={(item) => askDelete(item.id)}
            onEdit={openEdit}
          />
          <div className="mt-6 flex items-center justify-between">
            <span className="text-xs text-gray-500">Showing {rooms.length} of {pagination.totalElements}</span>
            <Pagination currentPage={pagination.pageNumber} totalPages={pagination.totalPages} onPageChange={goToPage} />
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {rooms.map((room) => (
              <div 
                key={room.id}
                className={`glass-panel group rounded-3xl overflow-hidden border-2 transition-all hover:shadow-2xl ${
                  room.status === 'AVAILABLE' ? 'hover:border-emerald-500/30' : 
                  room.status === 'OCCUPIED' ? 'hover:border-rose-500/30' : 
                  'hover:border-amber-500/30'
                } border-[#2d2d2d] bg-[#0a0a0a]`}
              >
                {/* Image Section */}
                <div className="relative h-40 overflow-hidden bg-[#1a1a1a]">
                  {room.roomImage && room.roomImage.length > 0 ? (
                    <img src={room.roomImage[0]} alt={room.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-700">
                      <ImageIcon size={40} />
                      <span className="text-[10px] font-bold uppercase mt-2">No Image</span>
                    </div>
                  )}
                  {/* Status Badge Over Image */}
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border-2 backdrop-blur-md ${getStatusColor(room.status)}`}>
                    {room.status}
                  </div>
                  
                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                     <button onClick={() => handleOpenDetail(room)} className="p-2.5 bg-white text-black rounded-xl hover:scale-110 transition-transform"><Eye size={18} /></button>
                     <button onClick={() => openEdit(room)} className="p-2.5 bg-[#FF9500] text-black rounded-xl hover:scale-110 transition-transform"><Edit2 size={18} /></button>
                     <button onClick={() => askDelete(room.id)} className="p-2.5 bg-rose-500 text-white rounded-xl hover:scale-110 transition-transform"><Trash2 size={18} /></button>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-black text-white group-hover:text-[#FF9500] transition-colors tracking-tight">{room.name}</h3>
                    <div className="text-right">
                       <p className="text-[10px] font-bold text-gray-500 uppercase">Monthly</p>
                       <p className="text-sm font-black text-[#FF9500]">{Number(room.basePrice).toLocaleString()}đ</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-4 py-3 border-y border-[#2d2d2d]">
                     <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-gray-600 uppercase">Area</span>
                        <span className="text-xs font-bold text-gray-300">{room.area} m²</span>
                     </div>
                     <div className="w-px h-6 bg-[#2d2d2d]"></div>
                     <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-gray-600 uppercase">Unit ID</span>
                        <span className="text-xs font-bold text-gray-300">#{room.id}</span>
                     </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-4 line-clamp-2 min-h-[32px] leading-relaxed italic">
                    {room.description || 'No description available for this unit.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Page {pagination.pageNumber} of {pagination.totalPages}</span>
            <Pagination currentPage={pagination.pageNumber} totalPages={pagination.totalPages} onPageChange={goToPage} />
          </div>
        </>
      )}

      <RoomModal 
        key={modalOpen ? (selected?.id || 'new') : 'closed'}
        isOpen={modalOpen}
        mode={modalMode}
        selected={selected}
        onClose={closeModal}
        onSubmit={modalMode === 'add' ? doCreate : doUpdate}
      />

      <ConfirmModal 
        isOpen={confirmOpen}
        title="Delete Room"
        message="Are you sure you want to delete this room? This action cannot be undone."
        onClose={cancelDelete}
        onConfirm={doDelete}
      />

      <RoomDetailModal 
        isOpen={detailOpen}
        room={detailRoom}
        onClose={() => setDetailOpen(false)}
      />
    </>
  );
}
