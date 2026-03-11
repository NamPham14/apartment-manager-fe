import React from 'react';
import { X, Zap, Droplets, Calendar, Home, User, Hash } from 'lucide-react';
import type { MeasureResponse } from '../types/measure.type';

interface MeasureDetailModalProps {
  isOpen: boolean;
  measure: MeasureResponse | null;
  onClose: () => void;
}

export const MeasureDetailModal: React.FC<MeasureDetailModalProps> = ({ isOpen, measure, onClose }) => {
  if (!isOpen || !measure) return null;

  const electricityUsage = measure.newElectricityIndex - measure.oldElectricityIndex;
  const waterUsage = measure.newWaterIndex - measure.oldWaterIndex;

  const infoItems = [
    { icon: Home, label: 'Room Name', value: measure.room?.name || 'N/A' },
    { icon: User, label: 'Tenant', value: measure.contract?.tenantEntity?.fullName || 'N/A' },
    { icon: Calendar, label: 'Billing Period', value: `${measure.month}/${measure.year}` },
    { icon: Hash, label: 'Record ID', value: `#${measure.id}` },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#0f0f0f] border border-[#2d2d2d] w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Header with Room Image */}
        <div className="relative h-48 bg-[#1a1a1a]">
          {measure.room?.roomImage && measure.room.roomImage.length > 0 ? (
            <img src={measure.room.roomImage[0]} className="w-full h-full object-cover opacity-60" alt="room" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-700">
              <Home size={64} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] to-transparent"></div>
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-all z-10"
          >
            <X size={20} />
          </button>
          <div className="absolute bottom-6 left-8">
            <h2 className="text-3xl font-black text-white tracking-tight">{measure.room?.name}</h2>
            <p className="text-[#FF9500] font-bold text-xs uppercase tracking-widest mt-1">Consumption Details</p>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Electricity Card */}
            <div className="p-6 rounded-[2rem] bg-yellow-500/5 border border-yellow-500/10 relative overflow-hidden group">
              <Zap className="absolute -right-4 -top-4 w-24 h-24 text-yellow-500/10 group-hover:scale-110 transition-transform" />
              <div className="relative">
                <p className="text-[10px] font-bold text-yellow-500/60 uppercase tracking-widest mb-1">Electricity Usage</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white">{electricityUsage.toFixed(1)}</span>
                  <span className="text-sm font-bold text-gray-500">kWh</span>
                </div>
                <div className="mt-4 space-y-1.5 border-t border-yellow-500/10 pt-4">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-gray-500">Previous Index:</span>
                    <span className="text-gray-300 font-bold">{measure.oldElectricityIndex}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-gray-500">Current Index:</span>
                    <span className="text-gray-300 font-bold">{measure.newElectricityIndex}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Water Card */}
            <div className="p-6 rounded-[2rem] bg-blue-500/5 border border-blue-500/10 relative overflow-hidden group">
              <Droplets className="absolute -right-4 -top-4 w-24 h-24 text-blue-500/10 group-hover:scale-110 transition-transform" />
              <div className="relative">
                <p className="text-[10px] font-bold text-blue-500/60 uppercase tracking-widest mb-1">Water Usage</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white">{waterUsage.toFixed(1)}</span>
                  <span className="text-sm font-bold text-gray-500">m³</span>
                </div>
                <div className="mt-4 space-y-1.5 border-t border-blue-500/10 pt-4">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-gray-500">Previous Index:</span>
                    <span className="text-gray-300 font-bold">{measure.oldWaterIndex}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-gray-500">Current Index:</span>
                    <span className="text-gray-300 font-bold">{measure.newWaterIndex}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            {infoItems.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#141414] border border-[#2d2d2d] hover:border-[#FF9500]/30 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#1a1a1a] text-gray-500 group-hover:text-[#FF9500] transition-colors">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm font-semibold text-gray-200 mt-0.5">{item.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Record Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[#2d2d2d]">
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar size={14} />
              <span className="text-xs font-medium">Recorded on: {new Date(measure.recordedDate).toLocaleDateString()}</span>
            </div>
            <div className="text-xs text-gray-500">
              Staff: <span className="text-white font-bold">{measure.createdBy?.username || 'System'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
