import React, { useState } from 'react';
import { Plus, Search, Loader2, RefreshCw, User, Mail, ShieldCheck, CheckCircle, XCircle } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { useUsers } from '../hooks/useUsers';
import Pagination from '../components/Pagination';
import { ConfirmModal } from '../components/ConfirmModal';
import { UserModal } from '../components/UserModal';
import { UserDetailModal } from '../components/UserDetailModal';
import type { UserResponse } from '../types/user.type';

export default function UserPage() {
  const { 
    users,
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
  } = useUsers();

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailUser, setDetailUser] = useState<UserResponse | null>(null);

  const handleOpenDetail = (user: UserResponse) => {
    setDetailUser(user);
    setDetailOpen(true);
  };

  const columns = [
    { 
      key: 'username' as keyof UserResponse, 
      label: 'User Account', 
      sortable: true,
      render: (item: UserResponse) => (
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleOpenDetail(item)}>
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#2d2d2d] bg-[#1a1a1a] flex items-center justify-center text-[#FF9500] group-hover:border-[#FF9500] transition-all">
            {item.avatar ? (
              <img src={item.avatar} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="avatar" />
            ) : (
              <User size={18} />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white group-hover:text-[#FF9500] transition-colors">{item.username}</span>
            <div className="flex items-center gap-1 text-[10px] text-gray-500">
                <Mail size={10} />
                <span>{item.email}</span>
            </div>
          </div>
        </div>
      )
    },
    { 
      key: 'roles' as keyof UserResponse, 
      label: 'Permissions',
      render: (item: UserResponse) => (
        <div className="flex flex-wrap gap-1">
          {item.roles?.map((role, idx) => (
            <span key={idx} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FF9500]/10 text-[#FF9500] text-[10px] font-bold border border-[#FF9500]/20">
              <ShieldCheck size={10} />
              {role.name}
            </span>
          ))}
        </div>
      )
    },
    { 
      key: 'status' as keyof UserResponse, 
      label: 'Account Status',
      render: (item: UserResponse) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
          item.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
        }`}>
          {item.status === 'ACTIVE' ? <CheckCircle size={10} /> : <XCircle size={10} />}
          {item.status}
        </span>
      )
    },
  ];

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">System Access</h1>
          <p className="text-gray-500 text-sm mt-1">Configure administrative accounts and fine-grained system permissions.</p>
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
            <Plus size={20} /> New Administrator
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-4 mb-6 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search by username or email address..."
            value={keyword}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#FF9500] text-white"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Loader2 className="w-10 h-10 animate-spin text-[#FF9500] mb-4" />
          <p>Verifying access records...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="glass-panel rounded-2xl py-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center text-gray-500 mb-4 border border-[#2d2d2d]">
                <User size={32} />
            </div>
            <h3 className="text-white font-bold text-lg">No administrators found</h3>
            <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto">
                No system accounts match your current filters. Clear the search or add a new user.
            </p>
        </div>
      ) : (
        <>
          <DataTable 
            data={users}
            columns={columns}
            onSort={(key) => handleSortChange(String(key))}
            onDelete={(item) => askDelete(item.id)}
            onEdit={openEdit}
          />

          <div className="mt-6 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">
              Database contains {pagination.totalElements} access records
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
        title="Revoke Access"
        message="Are you sure you want to delete this administrator account? This will immediately revoke their access to the system."
        onClose={cancelDelete}
        onConfirm={doDelete}
      />

      <UserModal 
        isOpen={modalOpen}
        mode={modalMode}
        selected={selected}
        onClose={closeModal}
        onSubmit={modalMode === 'add' ? doCreate : doUpdate}
      />

      <UserDetailModal 
        isOpen={detailOpen}
        user={detailUser}
        onClose={() => setDetailOpen(false)}
      />
    </>
  );
}
