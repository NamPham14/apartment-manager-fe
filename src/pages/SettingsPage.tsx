/* eslint-disable @typescript-eslint/no-explicit-any */

import { useForm } from 'react-hook-form';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '../store/api/settingApi';
import { Zap, Droplets, Info, Save, Loader2, Settings, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { data: settingsData, isLoading } = useGetSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();
  
  const { register, handleSubmit } = useForm({
    values: settingsData?.data
  });

  const onSubmit = async (data: any) => {
    try {
      await updateSettings(data).unwrap();
      toast.success("System settings updated successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update settings");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <Loader2 className="w-10 h-10 animate-spin text-[#FF9500] mb-4" />
        <p>Loading configurations...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
          <Settings className="text-[#FF9500]" /> System Configuration
        </h1>
        <p className="text-gray-500 text-sm mt-1">Global unit prices and application-wide parameters.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Unit Prices Section */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-[#2d2d2d]">
          <div className="px-6 py-4 border-b border-[#2d2d2d] bg-[#1a1a1a]/50">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#FF9500]" /> Utility Unit Prices
            </h3>
          </div>
          
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1 flex items-center gap-2">
                <Zap size={14} className="text-yellow-500" /> Electricity (per kWh)
              </label>
              <div className="relative">
                <input 
                  type="number"
                  {...register('ELECTRICITY_PRICE', { required: true })}
                  className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#FF9500] text-white"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-600">VNĐ / kWh</span>
              </div>
              <p className="text-[10px] text-gray-600 italic">Current rate applied to all new invoice generation.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1 flex items-center gap-2">
                <Droplets size={14} className="text-blue-400" /> Water (per m³)
              </label>
              <div className="relative">
                <input 
                  type="number"
                  {...register('WATER_PRICE', { required: true })}
                  className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#FF9500] text-white"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-600">VNĐ / m³</span>
              </div>
              <p className="text-[10px] text-gray-600 italic">Water consumption rate for apartment units.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1 flex items-center gap-2">
                <Info size={14} className="text-purple-500" /> Fixed Service Fee
              </label>
              <div className="relative">
                <input 
                  type="number"
                  {...register('SERVICE_PRICE', { required: true })}
                  className="w-full bg-[#0f0f0f] border border-[#2d2d2d] rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#FF9500] text-white"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-600">VNĐ / Month</span>
              </div>
              <p className="text-[10px] text-gray-600 italic">Includes garbage, wifi, and common area cleaning.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit"
            disabled={isUpdating}
            className="bg-[#FF9500] hover:bg-[#e68600] text-black font-bold py-3 px-10 rounded-2xl transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,149,0,0.3)] disabled:opacity-50"
          >
            {isUpdating ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Save System Changes
          </button>
        </div>
      </form>

      {/* Info Alert */}
      <div className="mt-8 p-4 rounded-2xl bg-[#FF9500]/5 border border-[#FF9500]/10 flex gap-4">
        <div className="text-[#FF9500] mt-1"><Info size={20} /></div>
        <div className="text-sm text-gray-400 leading-relaxed">
          <strong className="text-[#FF9500]">Important:</strong> Updating these prices will <strong>not</strong> affect invoices that have already been generated. Only future invoices (including those generated via "Auto Generate All") will use the new unit prices.
        </div>
      </div>
    </div>
  );
}
