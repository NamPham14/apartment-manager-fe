/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => Promise<any>;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, title, message, onClose, onConfirm }) => {
  const [isDeleting, setIsDeleting] = React.useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      toast.success("Item deleted successfully");
      onClose();
    } catch (error: any) {
      console.error(error);
      const errorMessage = error?.data?.message || "An error occurred while deleting.";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto mb-4">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-500 text-sm mb-6">{message}</p>
          
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-[#2d2d2d] text-sm font-bold text-gray-400 hover:bg-[#1a1a1a] transition-colors"
            >
              No, Keep it
            </button>
            <button 
              onClick={handleConfirm}
              disabled={isDeleting}
              className="flex-1 py-3 px-4 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
            >
              {isDeleting ? <Loader2 className="animate-spin" size={18} /> : "Yes, Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
