/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save, Loader2, Calendar } from 'lucide-react';
import { useGetContractsQuery } from '../store/api/contractApi';
import { invoiceSchema, type InvoiceFormData } from '../schemas/invoice';
import type { InvoiceResponse } from '../types/invoice.type';

interface InvoiceModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  selected: InvoiceResponse | null;
  onClose: () => void;
  onSubmit: (data: any) => Promise<any>;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, mode, selected, onClose, onSubmit }) => {
  const isEdit = mode === 'edit' && !!selected;

  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: isEdit ? {
      contractId: selected.contract?.id || 0,
      month: selected.month,
      year: selected.year,
      totalAmount: Number(selected.amountTotal) || 0,
      status: selected.status as any,
      dueDate: selected.dueDate
    } : { 
      contractId: 0, 
      month: new Date().getMonth() + 1, 
      year: new Date().getFullYear(), 
      totalAmount: 0, 
      status: 'UNPAID',
      dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 5).toISOString().split('T')[0]
    }
  });

  const { data: contractsData } = useGetContractsQuery({ page: 1, size: 100 });
  const contracts = contractsData?.data?.data || [];

  if (!isOpen) return null;

  const onFormSubmit = async (data: InvoiceFormData) => {
    await onSubmit({
      ...data,
      id: isEdit ? selected?.id : undefined
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d2d2d]">
          <h3 className="text-xl font-bold text-white">{mode === 'add' ? 'Generate Invoice' : 'Edit Invoice'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-[#1a1a1a] rounded-xl text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">Target Contract</label>
              <select 
                {...register('contractId', { valueAsNumber: true })} 
                className={`w-full bg-[#0f0f0f] border ${errors.contractId ? 'border-red-500/50' : 'border-[#2d2d2d]'} rounded-xl py-2.5 px-4 text-sm text-white focus:border-[#FF9500] outline-none transition-colors`}
              >
                <option value="0">Select Contract...</option>
                {contracts.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.room?.name} - {c.tenantEntity?.fullName}
                  </option>
                ))}
              </select>
              {errors.contractId && <p className="text-red-500 text-[10px] font-bold uppercase px-1">{errors.contractId.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">Month</label>
                <input 
                  type="number" 
                  {...register('month', { valueAsNumber: true })} 
                  className={`w-full bg-[#0f0f0f] border ${errors.month ? 'border-red-500/50' : 'border-[#2d2d2d]'} rounded-xl py-2.5 px-4 text-sm text-white outline-none focus:border-[#FF9500] transition-colors`} 
                />
                {errors.month && <p className="text-red-500 text-[10px] font-bold uppercase px-1">{errors.month.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">Year</label>
                <input 
                  type="number" 
                  {...register('year', { valueAsNumber: true })} 
                  className={`w-full bg-[#0f0f0f] border ${errors.year ? 'border-red-500/50' : 'border-[#2d2d2d]'} rounded-xl py-2.5 px-4 text-sm text-white outline-none focus:border-[#FF9500] transition-colors`} 
                />
                {errors.year && <p className="text-red-500 text-[10px] font-bold uppercase px-1">{errors.year.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1 flex items-center gap-2"><Calendar size={12}/> Due Date</label>
                <input 
                  type="date" 
                  {...register('dueDate')} 
                  className={`w-full bg-[#0f0f0f] border ${errors.dueDate ? 'border-red-500/50' : 'border-[#2d2d2d]'} rounded-xl py-2.5 px-4 text-sm text-white outline-none focus:border-[#FF9500] transition-colors`} 
                />
                {errors.dueDate && <p className="text-red-500 text-[10px] font-bold uppercase px-1">{errors.dueDate.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">Status</label>
                <select {...register('status')} className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-2.5 px-4 text-sm text-white focus:border-[#FF9500] outline-none cursor-pointer">
                  <option value="UNPAID">Unpaid</option>
                  <option value="PAID">Paid</option>
                  <option value="OVERDUE">Overdue</option>
                  <option value="CANCELLED">Cancelled</option>
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
