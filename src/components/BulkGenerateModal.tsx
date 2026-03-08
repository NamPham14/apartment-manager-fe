/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useForm } from 'react-hook-form';
import { X, Calendar, Loader2, Zap } from 'lucide-react';

interface BulkGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (month: number, year: number) => Promise<any>;
}

export const BulkGenerateModal: React.FC<BulkGenerateModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const now = new Date();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      month: now.getMonth() + 1,
      year: now.getFullYear()
    }
  });

  if (!isOpen) return null;

  const onSubmit = async (data: { month: number; year: number }) => {
    await onConfirm(Number(data.month), Number(data.year));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-[#FF9500]/20">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d2d2d] bg-gradient-to-r from-[#1a1a1a] to-[#0a0a0a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF9500]/10 flex items-center justify-center text-[#FF9500]">
              <Zap size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">Bulk Generate</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#2d2d2d] rounded-xl text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <p className="text-sm text-gray-400 leading-relaxed">
            The system will automatically scan all <strong>Active Contracts</strong> and generate invoices for the selected period if they don't already exist.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1 flex items-center gap-2">
                <Calendar size={12}/> Month
              </label>
              <select 
                {...register('month', { required: true })} 
                className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-2.5 px-4 text-sm text-white focus:border-[#FF9500] outline-none"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>Month {i + 1}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1 flex items-center gap-2">
                <Calendar size={12}/> Year
              </label>
              <input 
                type="number" 
                {...register('year', { required: true })} 
                className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-2.5 px-4 text-sm text-white outline-none focus:border-[#FF9500]" 
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-[#2d2d2d] rounded-xl text-sm font-bold text-gray-400 hover:bg-[#1a1a1a]">Cancel</button>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="flex-[2] py-3 bg-[#FF9500] text-black rounded-xl text-sm font-bold hover:bg-[#e68600] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,149,0,0.2)]"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />} Start Generating
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
