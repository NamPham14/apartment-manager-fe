import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save, Loader2, Home, User, DollarSign, Calendar, Hash } from 'lucide-react';
import { useGetRoomsQuery } from '../store/api/roomApi';
import { useGetTenantsQuery } from '../store/api/tenantApi';
import type { ContractResponse } from '../types/contract.type';

interface ContractModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  selected: ContractResponse | null;
  onClose: () => void;
  onSubmit: (data: any) => Promise<any>;
}

export const ContractModal: React.FC<ContractModalProps> = ({ isOpen, mode, selected, onClose, onSubmit }) => {
  const { register, handleSubmit, reset, watch, setValue, formState: { isSubmitting } } = useForm();
  
  // Lấy danh sách phòng và người thuê để chọn
  const { data: roomsData } = useGetRoomsQuery({ page: 1, size: 100 });
  const { data: tenantsData } = useGetTenantsQuery({ page: 1, size: 100 });

  const rooms = roomsData?.data?.data || [];
  const tenants = tenantsData?.data?.data || [];

  const watchedRoomId = watch('roomId');

  // Tự động điền giá thuê khi chọn phòng
  useEffect(() => {
    if (mode === 'add' && watchedRoomId) {
      const selectedRoom = rooms.find(r => r.id === Number(watchedRoomId));
      if (selectedRoom) {
        setValue('rentalPrice', selectedRoom.basePrice);
      }
    }
  }, [watchedRoomId, rooms, mode, setValue]);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && selected) {
        reset({
          id: selected.id,
          code: selected.code,
          roomId: selected.room?.id,
          tenantId: selected.tenantEntity?.id,
          startDate: selected.startDate,
          endDate: selected.endDate,
          rentalPrice: selected.rentalPrice,
          depositAmount: selected.depositAmount,
          status: selected.status
        });
      } else {
        reset({ code: '', roomId: '', tenantId: '', startDate: '', endDate: '', rentalPrice: '', depositAmount: '', status: 'ACTIVE' });
      }
    }
  }, [isOpen, mode, selected, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d2d2d]">
          <h3 className="text-xl font-bold text-white">{mode === 'add' ? 'New Lease Contract' : 'Edit Contract'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-[#1a1a1a] rounded-xl text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1 flex items-center gap-2"><Hash size={12}/> Contract Code</label>
            <input {...register('code')} className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-2.5 px-4 text-sm text-white focus:border-[#FF9500] outline-none" placeholder="Ex: HD-101 (Leave blank to auto-generate)" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1 flex items-center gap-2"><Home size={12}/> Room</label>
                <select {...register('roomId', { required: true })} className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-2.5 px-4 text-sm text-white focus:border-[#FF9500] outline-none">
                  <option value="">Select Room...</option>
                  {rooms.map(r => (
                    <option key={r.id} value={r.id} disabled={r.status === 'OCCUPIED' && mode === 'add'}>
                      {r.name} - {r.basePrice.toLocaleString()} VNĐ {r.status === 'OCCUPIED' ? '(Occupied)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1 flex items-center gap-2"><User size={12}/> Tenant</label>
                <select {...register('tenantId', { required: true })} className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-2.5 px-4 text-sm text-white focus:border-[#FF9500] outline-none">
                  <option value="">Select Tenant...</option>
                  {tenants.map(t => <option key={t.id} value={t.id}>{t.fullName} ({t.phone})</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1 flex items-center gap-2"><DollarSign size={12}/> Rental Price</label>
                <input type="number" {...register('rentalPrice', { required: true })} className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-2.5 px-4 text-sm text-white focus:border-[#FF9500] outline-none" placeholder="Monthly price" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1 flex items-center gap-2"><Calendar size={12}/> Start Date</label>
                <input type="date" {...register('startDate', { required: true })} className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-2.5 px-4 text-sm text-white focus:border-[#FF9500] outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1 flex items-center gap-2"><Calendar size={12}/> End Date (Optional)</label>
                <input type="date" {...register('endDate')} className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-2.5 px-4 text-sm text-white focus:border-[#FF9500] outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1 flex items-center gap-2"><DollarSign size={12}/> Deposit Amount</label>
                <input type="number" {...register('depositAmount', { required: true })} className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-2.5 px-4 text-sm text-white focus:border-[#FF9500] outline-none" placeholder="Security deposit" />
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
