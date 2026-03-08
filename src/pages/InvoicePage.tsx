/* eslint-disable @typescript-eslint/no-unused-vars */

import { Plus, Search, Loader2, RefreshCw, Receipt, Calendar, CheckCircle2, Clock, AlertCircle, Home } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { useInvoices } from '../hooks/useInvoices';
import Pagination from '../components/Pagination';
import { ConfirmModal } from '../components/ConfirmModal';
import { InvoiceModal } from '../components/InvoiceModal';
import { InvoiceDetailModal } from '../components/InvoiceDetailModal';
import { BulkGenerateModal } from '../components/BulkGenerateModal';
import type { InvoiceResponse } from '../types/invoice.type';
import { useState } from 'react';

export default function InvoicePage() {
  const { 
    invoices,
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
    doGenerateBulk,
    confirmOpen,
    askDelete,
    cancelDelete,
    doDelete
  } = useInvoices();

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailInvoice, setDetailInvoice] = useState<InvoiceResponse | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);

  const handleOpenDetail = (invoice: InvoiceResponse) => {
    setDetailInvoice(invoice);
    setDetailOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID': return <CheckCircle2 size={12} />;
      case 'UNPAID': return <Clock size={12} />;
      case 'OVERDUE': return <AlertCircle size={12} />;
      default: return null;
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return 'Invalid Date';
    }
  };

  const columns = [
    { 
      key: 'id' as keyof InvoiceResponse, 
      label: 'Invoice Info', 
      sortable: true,
      render: (item: InvoiceResponse) => (
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleOpenDetail(item)}>
          <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] border border-[#2d2d2d] flex items-center justify-center text-[#FF9500] group-hover:border-[#FF9500] transition-all">
            <Receipt size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white group-hover:text-[#FF9500] transition-colors">INV-{item.id}</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">Period: {item.month}/{item.year}</span>
          </div>
        </div>
      )
    },
    { 
      key: 'contract' as keyof InvoiceResponse, 
      label: 'Room',
      render: (item: InvoiceResponse) => (
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Home size={14} className="text-gray-500" />
          <span>{item.contract?.room?.name || 'N/A'}</span>
        </div>
      )
    },
    { 
      key: 'amountTotal' as keyof InvoiceResponse, 
      label: 'Total Amount',
      sortable: true,
      render: (item: InvoiceResponse) => (
        <div className="flex flex-col">
          <span className="text-[#FF9500] font-bold">{(item.amountTotal || 0).toLocaleString()} VNĐ</span>
          <span className="text-[10px] text-gray-500 italic">Room price: {item.amountRoom?.toLocaleString()}</span>
        </div>
      )
    },
    { 
      key: 'dueDate' as keyof InvoiceResponse, 
      label: 'Due Date',
      render: (item: InvoiceResponse) => (
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Calendar size={14} className="text-gray-500" />
          <span>{formatDate(item.dueDate)}</span>
        </div>
      )
    },
    { 
      key: 'status' as keyof InvoiceResponse, 
      label: 'Status',
      render: (item: InvoiceResponse) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
          item.status === 'PAID' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
          item.status === 'UNPAID' ? 'bg-[#FF9500]/10 text-[#FF9500] border-[#FF9500]/20' : 
          'bg-red-500/10 text-red-500 border-red-500/20'
        }`}>
          {getStatusIcon(item.status)}
          {item.status || 'UNPAID'}
        </span>
      )
    },
  ];

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Billing & Invoices</h1>
          <p className="text-gray-500 text-sm mt-1">Track payments, generate receipts and manage apartment finances.</p>
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
            onClick={() => setBulkOpen(true)}
            className="p-2.5 rounded-xl border border-[#2d2d2d] hover:bg-[#1a1a1a] transition-colors text-[#FF9500] flex items-center gap-2"
            title="Auto Generate for All Rooms"
          >
            <Calendar size={20} /> <span className="text-sm font-bold">Auto Generate All</span>
          </button>
          <button 
            onClick={openAdd}
            className="bg-[#FF9500] hover:bg-[#e68600] text-black font-bold py-2.5 px-6 rounded-xl transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(255,149,0,0.3)]"
          >
            <Plus size={20} /> Generate Invoice
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-4 mb-6 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search by period or status..."
            value={keyword}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#FF9500] text-white"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Loader2 className="w-10 h-10 animate-spin text-[#FF9500] mb-4" />
          <p>Processing invoice data...</p>
        </div>
      ) : invoices.length === 0 ? (
        <div className="glass-panel rounded-2xl py-20 text-center flex flex-col items-center">
            <Receipt size={48} className="text-gray-600 mb-4" />
            <h3 className="text-white font-bold text-lg">No invoices found</h3>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search or generate a new invoice.</p>
        </div>
      ) : (
        <>
          <DataTable 
            data={invoices}
            columns={columns}
            onSort={(key) => handleSortChange(String(key))}
            onDelete={(item) => askDelete(item.id)}
            onEdit={openEdit}
          />

          <div className="mt-6 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Showing {invoices.length} of {pagination.totalElements} entries
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
        title="Delete Invoice"
        message="Are you sure you want to delete this invoice? This action cannot be undone."
        onClose={cancelDelete}
        onConfirm={doDelete}
      />

      <InvoiceModal 
        isOpen={modalOpen}
        mode={modalMode}
        selected={selected}
        onClose={closeModal}
        onSubmit={modalMode === 'add' ? doCreate : doUpdate}
      />

      <InvoiceDetailModal 
        isOpen={detailOpen}
        invoice={detailInvoice}
        onClose={() => setDetailOpen(false)}
      />

      <BulkGenerateModal 
        isOpen={bulkOpen}
        onClose={() => setBulkOpen(false)}
        onConfirm={doGenerateBulk}
      />
    </>
  );
}
