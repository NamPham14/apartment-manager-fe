import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save, Loader2 } from 'lucide-react';
import type { PermissionResponse } from '../types/permission.type';

interface PermissionModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  selected: PermissionResponse | null;
  onClose: () => void;
  onSubmit: (data: any) => Promise<any>;
}

export const PermissionModal: React.FC<PermissionModalProps> = ({ isOpen, mode, selected, onClose, onSubmit }) => {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && selected) {
        reset({ name: selected.name, description: selected.description });
      } else {
        reset({ name: '', description: '' });
      }
    }
  }, [isOpen, mode, selected, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d2d2d]">
          <h3 className="text-xl font-bold text-white">
            {mode === 'add' ? 'New Permission' : 'Edit Permission'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-[#1a1a1a] rounded-xl text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">Permission Name</label>
            <input 
              {...register('name', { required: true })}
              className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#FF9500] text-white"
              placeholder="e.g., USER_VIEW"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">Description</label>
            <textarea 
              {...register('description')}
              rows={3}
              className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#FF9500] text-white resize-none"
              placeholder="What this permission allows..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-[#2d2d2d] rounded-xl text-sm font-bold text-gray-400 hover:bg-[#1a1a1a]">Cancel</button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-[2] py-3 bg-[#FF9500] text-black rounded-xl text-sm font-bold hover:bg-[#e68600] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,149,0,0.2)]"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {mode === 'add' ? 'Create' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
