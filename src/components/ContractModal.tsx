/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save, Loader2, Home, User, DollarSign, Calendar, Hash } from 'lucide-react';
import { useGetRoomsQuery } from '../store/api/roomApi';
import { useGetTenantsQuery } from '../store/api/tenantApi';
import { contractSchema, type ContractFormData } from '../schemas/contract';
import type { ContractResponse } from '../types/contract.type';

interface ContractModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  selected: ContractResponse | null;
  onClose: () => void;
  onSubmit: (data: any) => Promise<any>;
}

export const ContractModal: React.FC<ContractModalProps> = ({ isOpen, mode, selected, onClose, onSubmit }) => {
  const isEdit = mode === 'edit' && !!selected;

  const { register, handleSubmit, watch, setValue, formState: { isSubmitting, errors } } = useForm<ContractFormData>({
    resolver: zodResolver(contractSchema),
    defaultValues: isEdit ? {
      roomId: selected.room?.id,
      tenantId: selected.tenantEntity?.id,
      startDate: selected.startDate,
      endDate: selected.endDate,
      rentalPrice: Number(selected.rentalPrice),
      depositAmount: Number(selected.depositAmount),
      status: selected.status as any
    } : { 
      roomId: 0, 
      tenantId: 0, 
      startDate: '', 
      endDate: '', 
      rentalPrice: 0, 
      depositAmount: 0, 
      status: 'ACTIVE' 
    }
  });
  
  const { data: roomsData } = useGetRoomsQuery({ page: 1, size: 100 });
  const { data: tenantsData } = useGetTenantsQuery({ page: 1, size: 100 });

  const rooms = roomsData?.data?.data || [];
  const tenants = tenantsData?.data?.data || [];

  const watchedRoomId = watch('roomId');

  // Tự động điền giá thuê khi chọn phòng (Side effect duy nhất được giữ lại)
  useEffect(() => {
    if (mode === 'add' && watchedRoomId && watchedRoomId > 0) {
      const selectedRoom = rooms.find(r => r.id === Number(watchedRoomId));
      if (selectedRoom) {
        setValue('rentalPrice', Number(selectedRoom.basePrice));
      }
    }
  }, [watchedRoomId, rooms, mode, setValue]);

  if (!isOpen) return null;

  const onFormSubmit = async (data: ContractFormData) => {
    await onSubmit({
      ...data,
      id: isEdit ? selected?.id : undefined,
      code: isEdit ? selected?.code : undefined, // Giữ code cũ nếu là edit
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d2d2d]">
          <h3 className="text-xl font-bold text-white">{mode === 'add' ? 'New Lease Contract' : 'Edit Contract'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-[#1a1a1a] rounded-xl text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1 flex items-center gap-2"><Home size={12}/> Room</label>
                <select 
                  {...register('roomId', { valueAsNumber: true })} 
                  className={`w-full bg-[#0f0f0f] border ${errors.roomId ? 'border-red-500/50' : 'border-[#2d2d2d]'} rounded-xl py-2.5 px-4 text-sm text-white focus:border-[#FF9500] outline-none transition-colors`}
                >
                  <option value="0">Select Room...</option>
                  {rooms.map(r => (
                    <option key={r.id} value={r.id} disabled={r.status === 'OCCUPIED' && mode === 'add'}>
                      {r.name} - {Number(r.basePrice).toLocaleString()} VNĐ {r.status === 'OCCUPIED' ? '(Occupied)' : ''}
                    </option>
                  ))}
                </select>
                {errors.roomId && <p className="text-red-500 text-[10px] font-bold uppercase px-1">{errors.roomId.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1 flex items-center gap-2"><User size={12}/> Tenant</label>
                <select 
                  {...register('tenantId', { valueAsNumber: true })} 
                  className={`w-full bg-[#0f0f0f] border ${errors.tenantId ? 'border-red-500/50' : 'border-[#2d2d2d]'} rounded-xl py-2.5 px-4 text-sm text-white focus:border-[#FF9500] outline-none transition-colors`}
                >
                  <option value="0">Select Tenant...</option>
                  {tenants.map(t => <option key={t.id} value={t.id}>{t.fullName} ({t.phone})</option>)}
                </select>
                {errors.tenantId && <p className="text-red-500 text-[10px] font-bold uppercase px-1">{errors.tenantId.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1 flex items-center gap-2"><DollarSign size={12}/> Rental Price</label>
                <input 
                  type="number" 
                  {...register('rentalPrice', { valueAsNumber: true })} 
                  className={`w-full bg-[#0f0f0f] border ${errors.rentalPrice ? 'border-red-500/50' : 'border-[#2d2d2d]'} rounded-xl py-2.5 px-4 text-sm text-white focus:border-[#FF9500] outline-none transition-colors`} 
                  placeholder="Monthly price" 
                />
                {errors.rentalPrice && <p className="text-red-500 text-[10px] font-bold uppercase px-1">{errors.rentalPrice.message}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1 flex items-center gap-2"><Calendar size={12}/> Start Date</label>
                <input 
                  type="date" 
                  {...register('startDate')} 
                  className={`w-full bg-[#0f0f0f] border ${errors.startDate ? 'border-red-500/50' : 'border-[#2d2d2d]'} rounded-xl py-2.5 px-4 text-sm text-white focus:border-[#FF9500] outline-none transition-colors`} 
                />
                {errors.startDate && <p className="text-red-500 text-[10px] font-bold uppercase px-1">{errors.startDate.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1 flex items-center gap-2"><Calendar size={12}/> End Date (Optional)</label>
                <input 
                  type="date" 
                  {...register('endDate')} 
                  className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-2.5 px-4 text-sm text-white focus:border-[#FF9500] outline-none" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1 flex items-center gap-2"><DollarSign size={12}/> Deposit Amount</label>
                <input 
                  type="number" 
                  {...register('depositAmount', { valueAsNumber: true })} 
                  className={`w-full bg-[#0f0f0f] border ${errors.depositAmount ? 'border-red-500/50' : 'border-[#2d2d2d]'} rounded-xl py-2.5 px-4 text-sm text-white focus:border-[#FF9500] outline-none transition-colors`} 
                  placeholder="Security deposit" 
                />
                {errors.depositAmount && <p className="text-red-500 text-[10px] font-bold uppercase px-1">{errors.depositAmount.message}</p>}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-[#2d2d2d] rounded-xl text-sm font-bold text-gray-400 hover:bg-[#1a1a1a]">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex-[2] py-3 bg-[#FF9500] text-black rounded-xl text-sm font-bold hover:bg-[#e68600] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,149,0,0.2)]">
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} {mode === 'add' ? 'Create Contract' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
