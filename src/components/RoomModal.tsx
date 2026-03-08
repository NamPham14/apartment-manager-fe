/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save, Loader2, Upload, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { RoomResponse } from '../types/room.type';

interface RoomModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  selected: RoomResponse | null;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<any>;
}

export const RoomModal: React.FC<RoomModalProps> = ({ isOpen, mode, selected, onClose, onSubmit }) => {
  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedFiles([]);
      if (mode === 'edit' && selected) {
        reset({
          name: selected.name,
          area: selected.area,
          basePrice: selected.basePrice,
          status: selected.status,
          description: selected.description,
        });
        setPreviews(selected.roomImage || []);
      } else {
        reset({ 
          name: '', 
          area: '', 
          basePrice: '', 
          status: 'AVAILABLE', 
          description: '' 
        });
        setPreviews([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, mode]); 

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);

      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
    // Nếu là file mới chọn thì xóa trong selectedFiles
    // Lưu ý: Logic này đơn giản hóa, thực tế cần phân biệt ảnh cũ từ server và file mới
    const fileIndex = index - (mode === 'edit' ? (selected?.roomImage?.length || 0) : 0);
    if (fileIndex >= 0) {
        setSelectedFiles(prev => prev.filter((_, i) => i !== fileIndex));
    }
  };

  if (!isOpen) return null;
  const onFormSubmit = async (data: any) => {
    try {
      // Lọc ra các URL cũ (những link bắt đầu bằng http hoặc https)
      const existingImages = previews.filter(p => p.startsWith('http'));

      const payload = {
        ...data,
        id: mode === 'edit' ? selected?.id : undefined,
        roomImage: existingImages // Danh sách ảnh cũ muốn giữ lại
      };

      const formData = new FormData();
      formData.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }));

      // Gửi các File mới vừa chọn
      if (selectedFiles.length > 0) {
        selectedFiles.forEach(file => {
          formData.append('files', file);
        });
      }

      await toast.promise(
        onSubmit(formData),
        {
          loading: mode === 'add' ? 'Creating room...' : 'Updating room...',
          success: mode === 'add' ? 'Room created successfully!' : 'Room updated successfully!',
          error: (err) => err?.data?.message || 'Failed to process request',
        }
      );
      onClose();
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d2d2d] shrink-0">
          <h3 className="text-xl font-bold text-white tracking-tight">
            {mode === 'add' ? 'Add New Room' : 'Edit Room Details'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-[#1a1a1a] rounded-xl text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 overflow-y-auto custom-scrollbar space-y-6">
          
          {/* Image Upload Section */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">Room Images</label>
            
            <div className="grid grid-cols-4 gap-3">
              {previews.map((src, index) => (
                <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-[#2d2d2d] bg-[#0f0f0f]">
                  <img src={src} className="w-full h-full object-cover" alt="preview" />
                  <button 
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-1.5 bg-red-500 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-[#2d2d2d] hover:border-[#FF9500] hover:bg-[#FF9500]/5 transition-all flex flex-col items-center justify-center text-gray-500 hover:text-[#FF9500] gap-2"
              >
                <Upload size={24} />
                <span className="text-[10px] font-bold uppercase">Upload</span>
              </button>
            </div>
            
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">Room Name</label>
                    <input 
                    {...register('name', { required: 'Room name is required' })}
                    className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#FF9500] text-white"
                    placeholder="e.g., Studio 101"
                    />
                    {errors.name && <p className="text-red-500 text-[10px] px-1">{(errors.name as any).message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">Area (m²)</label>
                    <input 
                        type="number"
                        step="any"
                        {...register('area', { required: true })}
                        className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#FF9500] text-white"
                    />
                    </div>
                    <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">Price (VNĐ)</label>
                    <input 
                        type="number"
                        {...register('basePrice', { required: true })}
                        className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#FF9500] text-white"
                    />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">Status</label>
                    <select 
                    {...register('status')}
                    className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#FF9500] text-white cursor-pointer"
                    >
                    <option value="AVAILABLE">Available</option>
                    <option value="OCCUPIED">Occupied</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">Description</label>
                    <textarea 
                    {...register('description')}
                    rows={4}
                    className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#FF9500] text-white resize-none"
                    placeholder="Details..."
                    />
                </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-[#2d2d2d] shrink-0">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-[#2d2d2d] text-sm font-bold text-gray-400 hover:bg-[#1a1a1a] transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-xl bg-[#FF9500] text-black text-sm font-bold hover:bg-[#e68600] transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,149,0,0.2)]"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {mode === 'add' ? 'Create Room' : 'Update Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
