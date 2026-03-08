import React, { useState } from 'react';
import { Plus, Search, Loader2, RefreshCw, User } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { useTenants } from '../hooks/useTenants';
import Pagination from '../components/Pagination';
import { ConfirmModal } from '../components/ConfirmModal';
import { TenantModal } from '../components/TenantModal';
import { TenantDetailModal } from '../components/TenantDetailModal';
import type { TenantResponse } from '../types/tenant.type';

export default function TenantPage() {
  const { 
    tenants,
    data,
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
  } = useTenants();

  // State cho Modal chi tiết
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailTenant, setDetailTenant] = useState<TenantResponse | null>(null);

  const openDetail = (tenant: TenantResponse) => {
    setDetailTenant(tenant);
    setDetailOpen(true);
  };

  const pagination = data?.data || { totalElements: 0, totalPages: 0, pageNumber: 1 };

  const columns = [
    { 
      key: 'avatar' as keyof TenantResponse, 
      label: 'Photo',
      render: (item: TenantResponse) => (
        <div 
          onClick={() => openDetail(item)}
          className="w-10 h-10 rounded-xl overflow-hidden border border-[#2d2d2d] bg-[#1a1a1a] flex items-center justify-center cursor-pointer hover:border-[#FF9500] transition-all group"
        >
          {item.avatar ? (
            <img 
              src={`${item.avatar}?t=${new Date().getTime()}`} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
              alt="avatar" 
            />
          ) : (
            <User size={18} className="text-gray-600 group-hover:text-[#FF9500]" />
          )}
        </div>
      )
    },
    { 
      key: 'fullName' as keyof TenantResponse, 
      label: 'Full Name', 
      sortable: true,
      render: (item: TenantResponse) => (
        <div 
          onClick={() => openDetail(item)}
          className="flex flex-col cursor-pointer group"
        >
          <span className="text-sm font-bold text-white group-hover:text-[#FF9500] transition-colors">{item.fullName}</span>
          <span className="text-[10px] text-gray-500 uppercase tracking-widest">{item.email || 'No Email'}</span>
        </div>
      )
    },
    { 
      key: 'phone' as keyof TenantResponse, 
      label: 'Phone Number', 
      sortable: true,
      render: (item: TenantResponse) => <span className="text-sm text-gray-300 font-medium">{item.phone}</span>
    },
    { 
      key: 'citizenId' as keyof TenantResponse, 
      label: 'Citizen ID', 
      sortable: true,
      render: (item: TenantResponse) => <span className="text-xs text-gray-400 font-mono bg-[#1a1a1a] px-2 py-1 rounded border border-[#2d2d2d]">{item.citizenId}</span>
    },
    { 
      key: 'permanentAddress' as keyof TenantResponse, 
      label: 'Address',
      render: (item: TenantResponse) => (
        <span className="text-xs text-gray-500 line-clamp-1 max-w-[180px]">{item.permanentAddress || 'N/A'}</span>
      )
    },
  ];

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Tenant Directory</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and view detailed profiles of all residents.</p>
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
            <Plus size={20} /> Add Resident
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-4 mb-6 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search by name, phone or ID..."
            value={keyword}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#FF9500] text-white"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Loader2 className="w-10 h-10 animate-spin text-[#FF9500] mb-4" />
          <p>Loading residents...</p>
        </div>
      ) : tenants.length === 0 ? (
        <div className="glass-panel rounded-2xl py-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center text-gray-500 mb-4 border border-[#2d2d2d]">
                <User size={32} />
            </div>
            <h3 className="text-white font-bold text-lg">No residents found</h3>
            <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto">
                Try adjusting your search criteria or add a new resident to the system.
            </p>
        </div>
      ) : (
        <>
          <DataTable 
            data={tenants}
            columns={columns}
            onSort={(key) => handleSortChange(String(key))}
            onDelete={(item) => askDelete(item.id)}
            onEdit={openEdit}
          />

          <div className="mt-6 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">
              Showing {tenants.length} of {pagination.totalElements} records
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
        title="Delete Resident"
        message="Are you sure you want to remove this resident? This may affect their active lease contracts."
        onClose={cancelDelete}
        onConfirm={doDelete}
      />

      <TenantModal 
        isOpen={modalOpen}
        mode={modalMode}
        selected={selected}
        onClose={closeModal}
        onSubmit={modalMode === 'add' ? doCreate : doUpdate}
      />

      <TenantDetailModal 
        isOpen={detailOpen}
        tenant={detailTenant}
        onClose={() => setDetailOpen(false)}
      />
    </>
  );
}
