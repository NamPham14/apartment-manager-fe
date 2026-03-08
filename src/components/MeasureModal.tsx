import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save, Loader2, Zap, Droplets, Calendar, FileText } from 'lucide-react';
import { useGetContractsQuery } from '../store/api/contractApi';
import type { MeasureResponse } from '../types/measure.type';

interface MeasureModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  selected: MeasureResponse | null;
  onClose: () => void;
  onSubmit: (data: any) => Promise<any>;
}

export const MeasureModal: React.FC<MeasureModalProps> = ({ isOpen, mode, selected, onClose, onSubmit }) => {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const { data: contractsData } = useGetContractsQuery({ page: 1, size: 100 });

  const contracts = contractsData?.data?.data || [];

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && selected) {
        reset({
          id: selected.id,
          contractId: selected.contractId,
          month: selected.month,
          year: selected.year,
          electricity: selected.electricity,
          water: selected.water,
          recordedDate: selected.recordedDate
        });
      } else {
        const now = new Date();
        reset({ contractId: '', month: now.getMonth() + 1, year: now.getFullYear(), electricity: '', water: '', recordedDate: now.toISOString().split('T')[0] });
      }
    }
  }, [isOpen, mode, selected, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d2d2d]">
          <h3 className="text-xl font-bold text-white">{mode === 'add' ? 'Record Usage' : 'Edit Record'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-[#1a1a1a] rounded-xl text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1 flex items-center gap-2"><FileText size={12}/> Contract / Room</label>
              <select {...register('contractId', { required: true })} className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-2.5 px-4 text-sm text-white focus:border-[#FF9500] outline-none">
                <option value="">Select Contract...</option>
                {contracts.map(c => <option key={c.id} value={c.id}>{c.room?.name} - {c.tenantEntity?.fullName}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1 flex items-center gap-2"><Calendar size={12}/> Month</label>
                <input type="number" {...register('month', { required: true, min: 1, max: 12 })} className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-2.5 px-4 text-sm text-white outline-none focus:border-[#FF9500]" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1 flex items-center gap-2"><Calendar size={12}/> Year</label>
                <input type="number" {...register('year', { required: true })} className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-2.5 px-4 text-sm text-white outline-none focus:border-[#FF9500]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1 flex items-center gap-2"><Zap size={12} className="text-yellow-500"/> Electricity (kWh)</label>
                <input type="number" step="any" {...register('electricity', { required: true })} className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-2.5 px-4 text-sm text-white outline-none focus:border-[#FF9500]" placeholder="Current index" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1 flex items-center gap-2"><Droplets size={12} className="text-blue-500"/> Water (m³)</label>
                <input type="number" step="any" {...register('water', { required: true })} className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-2.5 px-4 text-sm text-white outline-none focus:border-[#FF9500]" placeholder="Current index" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">Record Date</label>
              <input type="date" {...register('recordedDate', { required: true })} className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-2.5 px-4 text-sm text-white outline-none focus:border-[#FF9500]" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-[#2d2d2d] rounded-xl text-sm font-bold text-gray-400 hover:bg-[#1a1a1a]">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex-[2] py-3 bg-[#FF9500] text-black rounded-xl text-sm font-bold hover:bg-[#e68600] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,149,0,0.2)]">
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
