/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save, Loader2, Upload, Trash2 } from 'lucide-react';
import { roomSchema, type RoomFormData } from '../schemas/room';
import type { RoomResponse } from '../types/room.type';

interface RoomModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  selected: RoomResponse | null;
  onClose: () => void;
  onSubmit: (data: any) => Promise<any>;
}

export const RoomModal: React.FC<RoomModalProps> = ({ isOpen, mode, selected, onClose, onSubmit }) => {
  const isEdit = mode === 'edit' && !!selected;

  // 1. Khởi tạo useForm. Ép kiểu 'as any' cho resolver là cách xử lý triệt để lỗi vênh kiểu của RHF + Zod
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema) as any,
    defaultValues: isEdit ? {
      name: selected.name,
      area: selected.area,
      basePrice: Number(selected.basePrice),
      status: selected.status,
      description: selected.description || '',
    } : { 
      name: '', 
      area: 0, 
      basePrice: 0, 
      status: 'AVAILABLE', 
      description: '' 
    }
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(isEdit ? (selected.roomImage || []) : []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const srcToRemove = previews[index];
    setPreviews(prev => prev.filter((_, i) => i !== index));
    if (srcToRemove.startsWith('blob:')) {
      const blobIndex = previews.slice(0, index).filter(p => p.startsWith('blob:')).length;
      setSelectedFiles(prev => prev.filter((_, i) => i !== blobIndex));
    }
  };

  if (!isOpen) return null;

  const onFormSubmit = async (data: RoomFormData) => {
    try {
      const payload = {
        ...data,
        id: isEdit ? selected?.id : undefined,
        roomImage: previews.filter(p => p.startsWith('http')),
        roomFiles: selectedFiles
      };
      await onSubmit(payload);
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d2d2d] shrink-0">
          <h3 className="text-xl font-bold text-white tracking-tight">{mode === 'add' ? 'Add New Room' : 'Edit Room Details'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-[#1a1a1a] rounded-xl text-gray-500 hover:text-white transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 overflow-y-auto custom-scrollbar space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">Room Images</label>
            <div className="grid grid-cols-4 gap-3">
              {previews.map((src, index) => (
                <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-[#2d2d2d] bg-[#0f0f0f]">
                  <img src={src} className="w-full h-full object-cover" alt="preview" />
                  <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 p-1.5 bg-red-500 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                </div>
              ))}
              <button type="button" onClick={() => fileInputRef.current?.click()} className="aspect-square rounded-xl border-2 border-dashed border-[#2d2d2d] hover:border-[#FF9500] hover:bg-[#FF9500]/5 transition-all flex flex-col items-center justify-center text-gray-500 hover:text-[#FF9500] gap-2">
                <Upload size={24} />
                <span className="text-[10px] font-bold uppercase">Upload</span>
              </button>
            </div>
            <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">Room Name</label>
                    <input {...register('name')} className={`w-full bg-[#0f0f0f] border ${errors.name ? 'border-red-500/50' : 'border-[#2d2d2d]'} rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#FF9500] text-white`} placeholder="e.g., Studio 101" />
                    {errors.name && <p className="text-red-500 text-[10px] px-1 font-bold uppercase">{errors.name.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">Area (m²)</label>
                        <input type="number" step="any" {...register('area')} className={`w-full bg-[#0f0f0f] border ${errors.area ? 'border-red-500/50' : 'border-[#2d2d2d]'} rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#FF9500] text-white`} />
                        {errors.area && <p className="text-red-500 text-[10px] px-1 font-bold uppercase">{errors.area.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">Price (VNĐ)</label>
                        <input type="number" {...register('basePrice')} className={`w-full bg-[#0f0f0f] border ${errors.basePrice ? 'border-red-500/50' : 'border-[#2d2d2d]'} rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#FF9500] text-white`} />
                        {errors.basePrice && <p className="text-red-500 text-[10px] px-1 font-bold uppercase">{errors.basePrice.message}</p>}
                    </div>
                </div>
            </div>
            <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">Status</label>
                    <select {...register('status')} className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#FF9500] text-white cursor-pointer">
                        <option value="AVAILABLE">Available</option>
                        <option value="OCCUPIED">Occupied</option>
                        <option value="MAINTENANCE">Maintenance</option>
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">Description</label>
                    <textarea {...register('description')} rows={4} className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#FF9500] text-white resize-none" placeholder="Details..." />
                </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-[#2d2d2d] shrink-0">
            <button type="button" onClick={onClose} className="flex-1 py-3 px-4 rounded-xl border border-[#2d2d2d] text-sm font-bold text-gray-400 hover:bg-[#1a1a1a] transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-3 px-4 rounded-xl bg-[#FF9500] text-black text-sm font-bold hover:bg-[#e68600] transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,149,0,0.2)]">
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} {mode === 'add' ? 'Create Room' : 'Update Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
