/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from 'react';
import { X, Loader2, Camera, User } from 'lucide-react';
import type { TenantResponse } from '../types/tenant.type';

interface TenantModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  selected: TenantResponse | null;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<any>;
}

export const TenantModal: React.FC<TenantModalProps> = ({ 
  isOpen, 
  mode, 
  selected, 
  onClose, 
  onSubmit 
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    citizenId: '',
    email: '',
    permanentAddress: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && selected) {
        setFormData({
          fullName: selected.fullName,
          phone: selected.phone,
          citizenId: selected.citizenId,
          email: selected.email,
          permanentAddress: selected.permanentAddress,
        });
        setPreview(selected.avatar || null);
      } else {
        setFormData({
          fullName: '',
          phone: '',
          citizenId: '',
          email: '',
          permanentAddress: '',
        });
        setPreview(null);
      }
      setAvatarFile(null);
    }
  }, [mode, selected, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataObj = new FormData();
      
      const payload = {
        ...formData,
        id: mode === 'edit' ? selected?.id : undefined
      };
      
      formDataObj.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
      
      if (avatarFile) {
        formDataObj.append('file', avatarFile);
      }

      await onSubmit(formDataObj);
      onClose();
    } catch (error) {
      console.error('Submit tenant error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0f0f0f] border border-[#2d2d2d] w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-[#2d2d2d] flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {mode === 'add' ? 'Add New Tenant' : 'Edit Tenant Info'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-2 mb-2">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#2d2d2d] bg-[#1a1a1a] flex items-center justify-center">
                {preview ? (
                  <img src={preview} className="w-full h-full object-cover" alt="avatar" />
                ) : (
                  <User size={32} className="text-gray-600" />
                )}
              </div>
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-1.5 bg-[#FF9500] rounded-full text-black shadow-lg hover:scale-110 transition-transform"
              >
                <Camera size={14} />
              </button>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Resident Photo</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase">Full Name</label>
              <input
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Ex: Nguyen Van A"
                className="w-full bg-[#1a1a1a] border border-[#2d2d2d] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#FF9500] transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Phone Number</label>
                <input
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="09xx..."
                  className="w-full bg-[#1a1a1a] border border-[#2d2d2d] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#FF9500] transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Citizen ID</label>
                <input
                  required
                  value={formData.citizenId}
                  onChange={(e) => setFormData({ ...formData, citizenId: e.target.value })}
                  placeholder="ID Number"
                  className="w-full bg-[#1a1a1a] border border-[#2d2d2d] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#FF9500] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@gmail.com"
                className="w-full bg-[#1a1a1a] border border-[#2d2d2d] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#FF9500] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase">Permanent Address</label>
              <textarea
                value={formData.permanentAddress}
                onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })}
                placeholder="City, Province, Country..."
                rows={2}
                className="w-full bg-[#1a1a1a] border border-[#2d2d2d] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#FF9500] transition-colors resize-none text-sm"
              />
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#2d2d2d] text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition-all font-bold text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] bg-[#FF9500] hover:bg-[#e68600] disabled:opacity-50 text-black font-bold py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(255,149,0,0.3)] flex items-center justify-center gap-2 text-sm"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : (mode === 'add' ? 'Create Tenant' : 'Save Changes')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
