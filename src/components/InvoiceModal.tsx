import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save, Loader2, FileText, Calendar, DollarSign } from 'lucide-react';
import { useGetContractsQuery } from '../store/api/contractApi';
import type { InvoiceResponse } from '../types/invoice.type';

interface InvoiceModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  selected: InvoiceResponse | null;
  onClose: () => void;
  onSubmit: (data: any) => Promise<any>;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, mode, selected, onClose, onSubmit }) => {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const { data: contractsData } = useGetContractsQuery({ page: 1, size: 100 });

  const contracts = contractsData?.data?.data || [];

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && selected) {
        reset({
          id: selected.id,
          contractId: selected.contract?.id,
          month: selected.month,
          year: selected.year,
          status: selected.status,
          dueDate: selected.dueDate
        });
      } else {
        const now = new Date();
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 5);
        reset({ contractId: '', month: now.getMonth() + 1, year: now.getFullYear(), status: 'UNPAID', dueDate: nextMonth.toISOString().split('T')[0] });
      }
    }
  }, [isOpen, mode, selected, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d2d2d]">
          <h3 className="text-xl font-bold text-white">{mode === 'add' ? 'Generate Invoice' : 'Edit Invoice'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-[#1a1a1a] rounded-xl text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">Target Contract</label>
              <select {...register('contractId', { required: true })} className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-2.5 px-4 text-sm text-white focus:border-[#FF9500] outline-none">
                <option value="">Select Contract...</option>
                {contracts.map(c => <option key={c.id} value={c.id}>{c.room?.name} - {c.tenantEntity?.fullName}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">Month</label>
                <input type="number" {...register('month', { required: true })} className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-2.5 px-4 text-sm text-white outline-none focus:border-[#FF9500]" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">Year</label>
                <input type="number" {...register('year', { required: true })} className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-2.5 px-4 text-sm text-white outline-none focus:border-[#FF9500]" />
              </div>
            </div>

            {mode === 'edit' && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">Total Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input type="number" {...register('amountTotal')} className="w-full bg-[#1a1a1a] border border-[#2d2d2d] rounded-xl py-2.5 pl-10 pr-4 text-sm text-white outline-none cursor-not-allowed" disabled />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">Due Date</label>
                <input type="date" {...register('dueDate', { required: true })} className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-2.5 px-4 text-sm text-white outline-none focus:border-[#FF9500]" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">Status</label>
                <select {...register('status')} className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-2.5 px-4 text-sm text-white outline-none focus:border-[#FF9500] cursor-pointer">
                  <option value="UNPAID">Unpaid</option>
                  <option value="PAID">Paid</option>
                  <option value="OVERDUE">Overdue</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-[#2d2d2d] rounded-xl text-sm font-bold text-gray-400 hover:bg-[#1a1a1a]">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex-[2] py-3 bg-[#FF9500] text-black rounded-xl text-sm font-bold hover:bg-[#e68600] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,149,0,0.2)]">
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} {mode === 'add' ? 'Generate' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
