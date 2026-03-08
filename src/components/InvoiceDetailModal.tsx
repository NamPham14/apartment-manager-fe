import React from 'react';
import { X, Receipt, Calendar, Home, CheckCircle2, Clock, AlertCircle, Zap, Droplets, Info } from 'lucide-react';
import type { InvoiceResponse } from '../types/invoice.type';

interface InvoiceDetailModalProps {
  isOpen: boolean;
  invoice: InvoiceResponse | null;
  onClose: () => void;
}

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({ isOpen, invoice, onClose }) => {
  if (!isOpen || !invoice) return null;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'UNPAID': return 'bg-[#FF9500]/10 text-[#FF9500] border-[#FF9500]/20';
      case 'OVERDUE': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID': return <CheckCircle2 size={16} />;
      case 'UNPAID': return <Clock size={16} />;
      case 'OVERDUE': return <AlertCircle size={16} />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative px-8 py-6 border-b border-[#2d2d2d] bg-gradient-to-r from-[#1a1a1a] to-[#0a0a0a]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FF9500]/10 border border-[#FF9500]/20 flex items-center justify-center text-[#FF9500]">
                <Receipt size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Invoice INV-{invoice.id}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(invoice.status)}`}>
                    {getStatusIcon(invoice.status)}
                    {invoice.status}
                  </span>
                  <span className="text-gray-500 text-xs">•</span>
                  <span className="text-gray-400 text-xs font-medium uppercase tracking-widest">Period: {invoice.month}/{invoice.year}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-[#2d2d2d] rounded-xl text-gray-500 hover:text-white transition-all">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#0f0f0f] border border-[#2d2d2d] space-y-3">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Home size={12} /> Property / Room
              </label>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] border border-[#2d2d2d] flex items-center justify-center text-gray-400">
                   <Home size={18} />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{invoice.contract?.room?.name || 'N/A'}</div>
                  <div className="text-[10px] text-gray-500">Contract ID: {invoice.contract?.id}</div>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-[#0f0f0f] border border-[#2d2d2d] space-y-3">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={12} /> Due Date Info
              </label>
              <div className="space-y-1">
                <div className="text-sm font-bold text-white">{new Date(invoice.dueDate).toLocaleDateString()}</div>
                <div className="text-[10px] text-gray-500">
                  {invoice.paymentDate ? `Paid on ${new Date(invoice.paymentDate).toLocaleDateString()}` : 'Payment pending'}
                </div>
              </div>
            </div>
          </div>

          {/* Billing Details Table */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Billing Breakdown</label>
            <div className="rounded-2xl border border-[#2d2d2d] overflow-hidden">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-[#1a1a1a] text-gray-400 uppercase text-[10px] font-bold tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Service Description</th>
                    <th className="px-6 py-4 text-right">Details / Usage</th>
                    <th className="px-6 py-4 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2d2d2d] bg-[#0a0a0a]">
                  {/* Room Price */}
                  <tr>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500"><Home size={16}/></div>
                      <span className="font-medium text-gray-200">Room Rental Fee</span>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500 italic">Fixed price</td>
                    <td className="px-6 py-4 text-right font-bold text-white">{invoice.amountRoom.toLocaleString()} đ</td>
                  </tr>

                  {/* Electricity */}
                  <tr>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500"><Zap size={16}/></div>
                      <span className="font-medium text-gray-200">Electricity Usage</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-gray-200 font-medium">{(invoice.newElectricityIndex || 0) - (invoice.oldElectricityIndex || 0)} kWh</span>
                        <span className="text-[10px] text-gray-500 italic">{invoice.oldElectricityIndex || 0} → {invoice.newElectricityIndex || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-white">{invoice.amountElectricity.toLocaleString()} đ</td>
                  </tr>

                  {/* Water */}
                  <tr>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-400/10 flex items-center justify-center text-blue-400"><Droplets size={16}/></div>
                      <span className="font-medium text-gray-200">Water Usage</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-gray-200 font-medium">{(invoice.newWaterIndex || 0) - (invoice.oldWaterIndex || 0)} m³</span>
                        <span className="text-[10px] text-gray-500 italic">{invoice.oldWaterIndex || 0} → {invoice.newWaterIndex || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-white">{invoice.amountWater.toLocaleString()} đ</td>
                  </tr>

                  {/* Services */}
                  <tr>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500"><Info size={16}/></div>
                      <span className="font-medium text-gray-200">General Services (Wifi, Garbage)</span>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500 italic">Monthly fixed</td>
                    <td className="px-6 py-4 text-right font-bold text-white">{invoice.amountServices.toLocaleString()} đ</td>
                  </tr>
                </tbody>
                <tfoot className="bg-[#1a1a1a]/50">
                  <tr>
                    <td colSpan={2} className="px-6 py-5 text-right font-bold text-gray-400 uppercase tracking-widest text-xs">Total Amount Due</td>
                    <td className="px-6 py-5 text-right font-black text-xl text-[#FF9500]">{invoice.amountTotal.toLocaleString()} đ</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Note Section */}
          <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex gap-4">
            <div className="text-blue-500 mt-1"><Info size={20} /></div>
            <div className="text-sm text-gray-400 leading-relaxed">
              <strong className="text-blue-400">Payment Notice:</strong> Please make payment before the due date to avoid service interruption. You can pay via transfer or at the management office.
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-[#2d2d2d] bg-[#0a0a0a] flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 bg-[#1a1a1a] hover:bg-[#2d2d2d] text-white rounded-xl text-sm font-bold transition-all border border-[#2d2d2d]"
          >
            Close Detail
          </button>
          {invoice.status !== 'PAID' && (
             <button 
               className="flex-[1.5] py-3 bg-[#FF9500] hover:bg-[#e68600] text-black rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,149,0,0.2)]"
               onClick={() => window.print()}
             >
               <Receipt size={18} /> Print Invoice
             </button>
          )}
        </div>
      </div>
    </div>
  );
};
