
import { Plus, Search, Loader2, RefreshCw, FileText, User, Home, Calendar } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { useContracts } from '../hooks/useContracts';
import Pagination from '../components/Pagination';
import { ConfirmModal } from '../components/ConfirmModal';
import { ContractModal } from '../components/ContractModal';
import type { ContractResponse } from '../types/contract.type';

export default function ContractPage() {
  const { 
    contracts,
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
  } = useContracts();

  const columns = [
    { 
      key: 'code' as keyof ContractResponse, 
      label: 'Contract Code', 
      sortable: true,
      render: (item: ContractResponse) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] border border-[#2d2d2d] flex items-center justify-center text-[#FF9500]">
            <FileText size={16} />
          </div>
          <span className="text-sm font-bold text-white">{item.code}</span>
        </div>
      )
    },
    { 
      key: 'room' as keyof ContractResponse, 
      label: 'Room',
      render: (item: ContractResponse) => (
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Home size={14} className="text-gray-500" />
          <span>{item.room?.name || 'N/A'}</span>
        </div>
      )
    },
    { 
      key: 'tenantEntity' as keyof ContractResponse, 
      label: 'Tenant',
      render: (item: ContractResponse) => (
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <User size={14} className="text-gray-500" />
          <span>{item.tenantEntity?.fullName || 'N/A'}</span>
        </div>
      )
    },
    { 
      key: 'startDate' as keyof ContractResponse, 
      label: 'Duration',
      render: (item: ContractResponse) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
             <Calendar size={12} />
             <span>From: {new Date(item.startDate).toLocaleDateString()}</span>
          </div>
          {item.endDate && (
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
               <Calendar size={12} />
               <span>To: {new Date(item.endDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      )
    },
    { 
      key: 'rentalPrice' as keyof ContractResponse, 
      label: 'Price',
      sortable: true,
      render: (item: ContractResponse) => <span className="text-[#FF9500] font-medium">{item.rentalPrice.toLocaleString()} VNĐ</span>
    },
    { 
      key: 'status' as keyof ContractResponse, 
      label: 'Status',
      render: (item: ContractResponse) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
          item.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
        }`}>
          {item.status}
        </span>
      )
    },
  ];

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Contract Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage rental agreements between tenants and the apartment.</p>
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
            <Plus size={20} /> New Contract
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-4 mb-6 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search by contract code..."
            value={keyword}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#FF9500] text-white"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Loader2 className="w-10 h-10 animate-spin text-[#FF9500] mb-4" />
          <p>Loading contracts...</p>
        </div>
      ) : contracts.length === 0 ? (
        <div className="glass-panel rounded-2xl py-20 text-center flex flex-col items-center">
            <FileText size={48} className="text-gray-600 mb-4" />
            <h3 className="text-white font-bold text-lg">No contracts found</h3>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search or create a new contract.</p>
        </div>
      ) : (
        <>
          <DataTable 
            data={contracts}
            columns={columns}
            onSort={(key) => handleSortChange(String(key))}
            onDelete={(item) => askDelete(item.id)}
            onEdit={openEdit}
          />

          <div className="mt-6 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Showing {contracts.length} of {pagination.totalElements} entries
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
        title="Delete Contract"
        message="Are you sure you want to delete this contract? This may affect existing invoices."
        onClose={cancelDelete}
        onConfirm={doDelete}
      />

      <ContractModal 
        isOpen={modalOpen}
        mode={modalMode}
        selected={selected}
        onClose={closeModal}
        onSubmit={modalMode === 'add' ? doCreate : doUpdate}
      />
    </>
  );
}
