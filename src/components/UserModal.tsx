import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save, Loader2, User as UserIcon, Mail, Lock, ShieldCheck, Camera, Phone } from 'lucide-react';
import { useGetRolesQuery } from '../store/api/roleApi';
import type { UserResponse } from '../types/user.type';

interface UserModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  selected: UserResponse | null;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<any>;
}

export const UserModal: React.FC<UserModalProps> = ({ isOpen, mode, selected, onClose, onSubmit }) => {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const { data: roleData } = useGetRolesQuery({ page: 1, size: 100 });
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const roles = roleData?.data?.data || [];

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && selected) {
        reset({ username: selected.username, email: selected.email, status: selected.status, phone: selected.phone || '' });
        setSelectedRoles(selected.roles.map(r => r.id));
        setPreview(selected.avatar || null);
      } else {
        reset({ username: '', email: '', password: '', status: 'ACTIVE', phone: '' });
        setSelectedRoles([]);
        setPreview(null);
      }
      setAvatarFile(null);
    }
  }, [isOpen, mode, selected, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const toggleRole = (id: number) => {
    setSelectedRoles(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const onFormSubmit = async (data: any) => {
    const formData = new FormData();
    
    // Đóng gói JSON vào part "data"
    const payload = {
      ...data,
      id: mode === 'edit' ? selected?.id : undefined,
      roles: selectedRoles
    };
    formData.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }));

    // Đóng gói file vào part "file"
    if (avatarFile) {
      formData.append('file', avatarFile);
    }

    await onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d2d2d]">
          <h3 className="text-xl font-bold text-white">{mode === 'add' ? 'New System User' : 'Edit User'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-[#1a1a1a] rounded-xl text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#2d2d2d] bg-[#1a1a1a] flex items-center justify-center">
                {preview ? (
                  <img src={preview} className="w-full h-full object-cover" alt="avatar" />
                ) : (
                  <UserIcon size={40} className="text-gray-600" />
                )}
              </div>
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-[#FF9500] rounded-full text-black shadow-lg hover:scale-110 transition-transform"
              >
                <Camera size={16} />
              </button>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Profile Picture</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">Username</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input {...register('username', { required: true })} className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-[#FF9500] outline-none" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input {...register('email', { required: true })} className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-[#FF9500] outline-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input {...register('phone')} className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-[#FF9500] outline-none" placeholder="Ex: 0912..." />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">Account Status</label>
              <select {...register('status')} className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-2.5 px-4 text-sm text-white focus:border-[#FF9500] outline-none cursor-pointer">
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {mode === 'add' && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input type="password" {...register('password', { required: true })} className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-[#FF9500] outline-none" />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">Assign Roles</label>
            <div className="flex flex-wrap gap-2 pr-2">
              {roles.map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => toggleRole(r.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                    selectedRoles.includes(r.id) ? 'bg-[#FF9500]/10 border-[#FF9500] text-[#FF9500]' : 'bg-[#1a1a1a] border-[#2d2d2d] text-gray-400 hover:border-gray-500'
                  }`}
                >
                  <ShieldCheck size={14} />
                  <span className="text-xs font-bold">{r.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-[#2d2d2d] rounded-xl text-sm font-bold text-gray-400 hover:bg-[#1a1a1a]">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex-[2] py-3 bg-[#FF9500] text-black rounded-xl text-sm font-bold hover:bg-[#e68600] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,149,0,0.2)]">
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} {mode === 'add' ? 'Create User' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
