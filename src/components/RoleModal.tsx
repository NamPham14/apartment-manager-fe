/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save, Loader2, CheckSquare, Square } from 'lucide-react';
import { useGetPermissionsQuery } from '../store/api/permissionApi';
import type { RoleResponse } from '../types/role.type';

interface RoleModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  selected: RoleResponse | null;
  onClose: () => void;
  onSubmit: (data: any) => Promise<any>;
}

export const RoleModal: React.FC<RoleModalProps> = ({ isOpen, mode, selected, onClose, onSubmit }) => {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      name: mode === 'edit' && selected ? selected.name : '',
      description: mode === 'edit' && selected ? selected.description : ''
    }
  });
  const { data: permData } = useGetPermissionsQuery({ page: 1, size: 100 });
  const [selectedPerms, setSelectedPerms] = useState<number[]>(
    mode === 'edit' && selected ? selected.permissions.map(p => p.id) : []
  );

  const permissions = permData?.data?.data || [];

  const togglePermission = (id: number) => {
    setSelectedPerms(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const onFormSubmit = (data: any) => {
    onSubmit({ ...data, permissions: selectedPerms });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d2d2d]">
          <h3 className="text-xl font-bold text-white">{mode === 'add' ? 'New Role' : 'Edit Role'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-[#1a1a1a] rounded-xl text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-5">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">Role Name</label>
              <input {...register('name', { required: true })} className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#FF9500] text-white" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">Description</label>
              <input {...register('description')} className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#FF9500] text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">Assign Permissions</label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
              {permissions.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => togglePermission(p.id)}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${
                    selectedPerms.includes(p.id) ? 'bg-[#FF9500]/10 border-[#FF9500] text-[#FF9500]' : 'bg-[#1a1a1a] border-[#2d2d2d] text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {selectedPerms.includes(p.id) ? <CheckSquare size={14} /> : <Square size={14} />}
                  <span className="text-xs font-medium truncate">{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-[#2d2d2d] rounded-xl text-sm font-bold text-gray-400 hover:bg-[#1a1a1a]">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex-[2] py-3 bg-[#FF9500] text-black rounded-xl text-sm font-bold hover:bg-[#e68600] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,149,0,0.2)]">
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} {mode === 'add' ? 'Create Role' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
