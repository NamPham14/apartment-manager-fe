import React from 'react';
import { Plus, Search, Loader2, RefreshCw, Key, ShieldAlert } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { usePermissions } from '../hooks/usePermissions';
import Pagination from '../components/Pagination';
import { ConfirmModal } from '../components/ConfirmModal';
import { PermissionModal } from '../components/PermissionModal';
import type { PermissionResponse } from '../types/permission.type';

export default function PermissionPage() {
  const { 
    permissions,
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
  } = usePermissions();

  const columns = [
    { 
      key: 'name' as keyof PermissionResponse, 
      label: 'Permission Name', 
      sortable: true,
      render: (item: PermissionResponse) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] border border-[#2d2d2d] flex items-center justify-center text-[#FF9500]">
            <Key size={16} />
          </div>
          <span className="text-sm font-bold text-white uppercase tracking-widest">{item.name}</span>
        </div>
      )
    },
    { 
      key: 'description' as keyof PermissionResponse, 
      label: 'Description',
      render: (item: PermissionResponse) => <span className="text-gray-400 text-xs">{item.description}</span>
    },
  ];

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Permission Manager</h1>
          <p className="text-gray-500 text-sm mt-1">Detailed list of all access privileges available in the system.</p>
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
            <Plus size={20} /> Create Permission
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-4 mb-6 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search permissions by name..."
            value={keyword}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#FF9500] text-white"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Loader2 className="w-10 h-10 animate-spin text-[#FF9500] mb-4" />
          <p>Loading permissions...</p>
        </div>
      ) : permissions.length === 0 ? (
        <div className="glass-panel rounded-2xl py-20 text-center flex flex-col items-center">
            <ShieldAlert size={48} className="text-gray-600 mb-4" />
            <h3 className="text-white font-bold text-lg">No permissions found</h3>
            <p className="text-gray-500 text-sm mt-2">Create permissions to assign them to roles.</p>
        </div>
      ) : (
        <>
          <DataTable 
            data={permissions}
            columns={columns}
            onSort={(key) => handleSortChange(String(key))}
            onDelete={(item) => askDelete(item.id)}
            onEdit={openEdit}
          />

          <div className="mt-6 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Showing {permissions.length} of {pagination.totalElements} entries
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
        title="Delete Permission"
        message="Are you sure you want to delete this permission? This may affect roles currently using it."
        onClose={cancelDelete}
        onConfirm={doDelete}
      />

      <PermissionModal 
        isOpen={modalOpen}
        mode={modalMode}
        selected={selected}
        onClose={closeModal}
        onSubmit={modalMode === 'add' ? doCreate : doUpdate}
      />
    </>
  );
}
