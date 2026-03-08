import React from 'react';
import { X, User, Mail, ShieldCheck, CheckCircle, XCircle, Phone, Calendar, Hash } from 'lucide-react';
import type { UserResponse } from '../types/user.type';

interface UserDetailModalProps {
  isOpen: boolean;
  user: UserResponse | null;
  onClose: () => void;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({ isOpen, user, onClose }) => {
  if (!isOpen || !user) return null;

  const infoItems = [
    { icon: User, label: 'Username', value: user.username },
    { icon: Mail, label: 'Email Address', value: user.email },
    { icon: Phone, label: 'Phone Number', value: user.phone || 'Not provided' },
    { icon: ShieldCheck, label: 'System Roles', value: user.roles?.map(r => r.name).join(', ') || 'None' },
    { icon: Hash, label: 'User ID', value: `#${user.id}` },
    { icon: Calendar, label: 'Account Type', value: user.provider || 'LOCAL' },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#0f0f0f] border border-[#2d2d2d] w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Header with Background Pattern */}
        <div className="relative h-32 bg-gradient-to-r from-[#FF9500]/20 to-transparent">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-all z-10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Profile Section */}
        <div className="px-8 pb-8 -mt-16 relative">
          <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
            <div className="w-32 h-32 rounded-[2rem] overflow-hidden border-4 border-[#0f0f0f] bg-[#1a1a1a] shadow-2xl flex items-center justify-center">
              {user.avatar ? (
                <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#FF9500]">
                  <User size={48} />
                </div>
              )}
            </div>
            <div className="flex-1 pb-2">
              <h2 className="text-3xl font-black text-white tracking-tight">{user.username}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  user.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                }`}>
                  {user.status === 'ACTIVE' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                  {user.status}
                </span>
                <span className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">System User</span>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
      </div>
    </div>
  );
};
