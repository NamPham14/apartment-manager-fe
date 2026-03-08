import React from 'react';
import { X, Maximize, CircleDollarSign, Info } from 'lucide-react';
import type { RoomResponse } from '../types/room.type';

interface RoomDetailModalProps {
  isOpen: boolean;
  room: RoomResponse | null;
  onClose: () => void;
}

export const RoomDetailModal: React.FC<RoomDetailModalProps> = ({ isOpen, room, onClose }) => {
  if (!isOpen || !room) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="glass-panel w-full max-w-4xl rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Left: Image Gallery */}
        <div className="w-full md:w-1/2 bg-[#0a0a0a] p-2 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
          {room.roomImage && room.roomImage.length > 0 ? (
            room.roomImage.map((img, index) => (
              <img key={index} src={img} alt="room" className="w-full rounded-2xl object-cover border border-[#2d2d2d]" />
            ))
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-gray-600 bg-[#141414] rounded-2xl border-2 border-dashed border-[#2d2d2d]">
              <Info size={48} />
              <p className="mt-2 text-sm">No images available</p>
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="w-full md:w-1/2 p-8 flex flex-col relative">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-[#1a1a1a] rounded-full text-gray-500 hover:text-white transition-all">
            <X size={24} />
          </button>

          <div className="mb-6">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border mb-4 ${
              room.status === 'OCCUPIED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
              room.status === 'AVAILABLE' ? 'bg-[#FF9500]/10 text-[#FF9500] border-[#FF9500]/20' : 
              'bg-amber-500/10 text-amber-500 border-amber-500/20'
            }`}>
              {room.status}
            </span>
            <h2 className="text-4xl font-black text-white leading-tight">{room.name}</h2>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#FF9500]/10 rounded-2xl text-[#FF9500]">
                <Maximize size={20} />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold">Area</p>
                <p className="text-white font-bold">{room.area} m²</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
                <CircleDollarSign size={20} />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold">Base Price</p>
                <p className="text-white font-bold">{Number(room.basePrice).toLocaleString()} VNĐ</p>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Description</h4>
            <p className="text-gray-400 text-sm leading-relaxed bg-[#141414] p-4 rounded-2xl border border-[#2d2d2d]">
              {room.description || "No description provided for this unit. Please contact management for more details."}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-[#2d2d2d]">
             <button onClick={onClose} className="w-full py-4 bg-white text-black font-black rounded-2xl hover:bg-gray-200 transition-all uppercase tracking-widest text-xs">
                Close View
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
