import { useState } from 'react';
import { Plus, Search, Loader2, RefreshCw, Gauge, Droplets, Zap, Home, Calendar } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { useMeasurements } from '../hooks/useMeasurements';
import Pagination from '../components/Pagination';
import { ConfirmModal } from '../components/ConfirmModal';
import { MeasureModal } from '../components/MeasureModal';
import { MeasureDetailModal } from '../components/MeasureDetailModal';
import type { MeasureResponse } from '../types/measure.type';

export default function MeasurePage() {
  const { 
    measurements,
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
  } = useMeasurements();

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailMeasure, setDetailMeasure] = useState<MeasureResponse | null>(null);

  const handleOpenDetail = (measure: MeasureResponse) => {
    setDetailMeasure(measure);
    setDetailOpen(true);
  };

  const columns = [
    { 
      key: 'room' as keyof MeasureResponse, 
      label: 'Room / Unit',
      render: (item: MeasureResponse) => (
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleOpenDetail(item)}>
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#2d2d2d] bg-[#1a1a1a] flex items-center justify-center text-[#FF9500] group-hover:border-[#FF9500] transition-all">
            {item.room?.roomImage && item.room.roomImage.length > 0 ? (
              <img src={item.room.roomImage[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="room" />
            ) : (
              <Home size={18} />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white group-hover:text-[#FF9500] transition-colors">{item.room?.name || 'N/A'}</span>
            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                Period: {item.month}/{item.year}
            </span>
          </div>
        </div>
      )
    },
    { 
      key: 'newElectricityIndex' as keyof MeasureResponse, 
      label: 'Electricity Index',
      render: (item: MeasureResponse) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-yellow-500" />
            <span className="font-bold text-white">{item.newElectricityIndex}</span>
          </div>
          <span className="text-[10px] text-gray-500 font-medium ml-5">Usage: {(item.newElectricityIndex - item.oldElectricityIndex).toFixed(1)} kWh</span>
        </div>
      )
    },
    { 
      key: 'newWaterIndex' as keyof MeasureResponse, 
      label: 'Water Index',
      render: (item: MeasureResponse) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Droplets size={14} className="text-blue-500" />
            <span className="font-bold text-white">{item.newWaterIndex}</span>
          </div>
          <span className="text-[10px] text-gray-500 font-medium ml-5">Usage: {(item.newWaterIndex - item.oldWaterIndex).toFixed(1)} m³</span>
        </div>
      )
    },
    { 
      key: 'recordedDate' as keyof MeasureResponse, 
      label: 'Recording Info',
      render: (item: MeasureResponse) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <Calendar size={14} className="text-gray-500" />
            <span>{new Date(item.recordedDate).toLocaleDateString()}</span>
          </div>
          <span className="text-[10px] text-gray-500 font-medium ml-5 italic">By {item.createdBy?.username || 'System'}</span>
        </div>
      )
    },
  ];

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Utility Tracking</h1>
          <p className="text-gray-500 text-sm mt-1">Monitor and record monthly resource consumption for active contracts.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => refetch()}
            className="p-2.5 rounded-xl border border-[#2d2d2d] hover:bg-[#1a1a1a] transition-colors text-gray-400 hover:text-white"
            title="Refresh Data"
          >
            <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={openAdd}
            className="bg-[#FF9500] hover:bg-[#e68600] text-black font-bold py-2.5 px-6 rounded-xl transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(255,149,0,0.3)]"
          >
            <Plus size={20} /> Record New Usage
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-4 mb-6 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search measurements by room name..."
            value={keyword}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#FF9500] text-white"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Loader2 className="w-10 h-10 animate-spin text-[#FF9500] mb-4" />
          <p>Scanning resource logs...</p>
        </div>
      ) : measurements.length === 0 ? (
        <div className="glass-panel rounded-2xl py-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center text-gray-500 mb-4 border border-[#2d2d2d]">
                <Gauge size={32} />
            </div>
            <h3 className="text-white font-bold text-lg">No consumption logs</h3>
            <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto">
                No utility records found. Click "Record New Usage" to start tracking consumption.
            </p>
        </div>
      ) : (
        <>
          <DataTable 
            data={measurements}
            columns={columns}
            onSort={(key) => handleSortChange(String(key))}
            onDelete={(item) => askDelete(item.id)}
            onEdit={openEdit}
          />

          <div className="mt-6 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">
              System monitoring {pagination.totalElements} consumption logs
            </span>
            <Pagination 
              currentPage={pagination.pageNumber}
              totalPages={pagination.totalPages}
              onPageChange={goToPage}
            />
          </div>
        </>
      )}

      <ConfirmModal 
        isOpen={confirmOpen}
        title="Delete Record"
        message="Are you sure you want to delete this measurement log? This may invalidate pending invoices for this room."
        onClose={cancelDelete}
        onConfirm={doDelete}
      />

      <MeasureModal 
        isOpen={modalOpen}
        mode={modalMode}
        selected={selected}
        onClose={closeModal}
        onSubmit={modalMode === 'add' ? doCreate : doUpdate}
      />

      <MeasureDetailModal 
        isOpen={detailOpen}
        measure={detailMeasure}
        onClose={() => setDetailOpen(false)}
      />
    </>
  );
}
