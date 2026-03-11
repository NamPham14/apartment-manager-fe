/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save, Loader2, Zap, Droplets, Calendar, FileText } from 'lucide-react';
import { useGetContractsQuery } from '../store/api/contractApi';
import { measurementSchema, type MeasurementFormData } from '../schemas/measurement';
import type { MeasureResponse } from '../types/measure.type';

interface MeasureModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  selected: MeasureResponse | null;
  onClose: () => void;
  onSubmit: (data: any) => Promise<any>;
}

export const MeasureModal: React.FC<MeasureModalProps> = ({ isOpen, mode, selected, onClose, onSubmit }) => {
  const isEdit = mode === 'edit' && !!selected;

  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<MeasurementFormData>({
    resolver: zodResolver(measurementSchema),
    defaultValues: isEdit ? {
      contractId: selected.contractId,
      month: selected.month,
      year: selected.year,
      electricityIndex: selected.newElectricityIndex,
      waterIndex: selected.newWaterIndex,
      recordedDate: selected.recordedDate
    } : { 
      contractId: 0, 
      month: new Date().getMonth() + 1, 
      year: new Date().getFullYear(), 
      electricityIndex: 0, 
      waterIndex: 0, 
      recordedDate: new Date().toISOString().split('T')[0] 
    }
  });

  const { data: contractsData } = useGetContractsQuery({ page: 1, size: 100 });
  const contracts = contractsData?.data?.data || [];

  if (!isOpen) return null;

  const onFormSubmit = async (data: MeasurementFormData) => {
    await onSubmit({
      ...data,
      id: isEdit ? selected?.id : undefined
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d2d2d]">
          <h3 className="text-xl font-bold text-white">{mode === 'add' ? 'Record Usage' : 'Edit Record'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-[#1a1a1a] rounded-xl text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1 flex items-center gap-2"><FileText size={12}/> Contract / Room</label>
              <select 
                {...register('contractId', { valueAsNumber: true })} 
                className={`w-full bg-[#0f0f0f] border ${errors.contractId ? 'border-red-500/50' : 'border-[#2d2d2d]'} rounded-xl py-2.5 px-4 text-sm text-white focus:border-[#FF9500] outline-none transition-colors`}
              >
                <option value="0">Select Contract...</option>
                {contracts.map(c => <option key={c.id} value={c.id}>{c.room?.name} - {c.tenantEntity?.fullName}</option>)}
              </select>
              {errors.contractId && <p className="text-red-500 text-[10px] font-bold uppercase px-1">{errors.contractId.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1 flex items-center gap-2"><Calendar size={12}/> Month</label>
                <input 
                  type="number" 
                  {...register('month', { valueAsNumber: true })} 
                  className={`w-full bg-[#0f0f0f] border ${errors.month ? 'border-red-500/50' : 'border-[#2d2d2d]'} rounded-xl py-2.5 px-4 text-sm text-white outline-none focus:border-[#FF9500] transition-colors`} 
                />
                {errors.month && <p className="text-red-500 text-[10px] font-bold uppercase px-1">{errors.month.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1 flex items-center gap-2"><Calendar size={12}/> Year</label>
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
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1 flex items-center gap-2"><Zap size={12} className="text-yellow-500"/> Electricity (kWh)</label>
                <input 
                  type="number" 
                  step="any" 
                  {...register('electricityIndex', { valueAsNumber: true })} 
                  className={`w-full bg-[#0f0f0f] border ${errors.electricityIndex ? 'border-red-500/50' : 'border-[#2d2d2d]'} rounded-xl py-2.5 px-4 text-sm text-white outline-none focus:border-[#FF9500] transition-colors`} 
                  placeholder="Current index" 
                />
                {errors.electricityIndex && <p className="text-red-500 text-[10px] font-bold uppercase px-1">{errors.electricityIndex.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1 flex items-center gap-2"><Droplets size={12} className="text-blue-500"/> Water (m³)</label>
                <input 
                  type="number" 
                  step="any" 
                  {...register('waterIndex', { valueAsNumber: true })} 
                  className={`w-full bg-[#0f0f0f] border ${errors.waterIndex ? 'border-red-500/50' : 'border-[#2d2d2d]'} rounded-xl py-2.5 px-4 text-sm text-white outline-none focus:border-[#FF9500] transition-colors`} 
                  placeholder="Current index" 
                />
                {errors.waterIndex && <p className="text-red-500 text-[10px] font-bold uppercase px-1">{errors.waterIndex.message}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">Record Date</label>
              <input 
                type="date" 
                {...register('recordedDate')} 
                className={`w-full bg-[#0f0f0f] border ${errors.recordedDate ? 'border-red-500/50' : 'border-[#2d2d2d]'} rounded-xl py-2.5 px-4 text-sm text-white outline-none focus:border-[#FF9500] transition-colors`} 
              />
              {errors.recordedDate && <p className="text-red-500 text-[10px] font-bold uppercase px-1">{errors.recordedDate.message}</p>}
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
