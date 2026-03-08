import { 
  Home, 
  Activity,
  Loader2,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

export default function DashBoardPage() {
  const navigate = useNavigate();
  const {
    totalRooms,
    occupiedRooms,
    availableRooms,
    occupancyRate,
    unpaidInvoices,
    totalRevenueMonth,
    revenueChart,
    recentInvoices,
    isLoading
  } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500">
        <Loader2 className="w-12 h-12 animate-spin text-[#FF9500] mb-4" />
        <p className="animate-pulse font-medium tracking-widest uppercase text-xs text-gray-400">Synchronizing live data...</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Revenue (Monthly)', value: `${totalRevenueMonth.toLocaleString()} đ`, sub: 'Paid this month', icon: TrendingUp, color: 'text-[#FF9500]', bg: 'bg-[#FF9500]/10', path: '/invoices' },
    { label: 'Available Rooms', value: availableRooms, sub: `${totalRooms} Total Units`, icon: Home, color: 'text-blue-500', bg: 'bg-blue-500/10', path: '/rooms' },
    { label: 'Occupancy', value: `${occupancyRate}%`, sub: `${occupiedRooms} Rooms Rented`, icon: Activity, color: 'text-green-500', bg: 'bg-green-500/10', path: '/rooms' },
    { label: 'Unpaid Invoices', value: unpaidInvoices, sub: 'Action required', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10', path: '/invoices' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1a1a] border border-[#2d2d2d] p-3 rounded-xl shadow-2xl backdrop-blur-md">
          <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">{payload[0].payload.month}</p>
          <p className="text-sm font-black text-[#FF9500]">{payload[0].value.toLocaleString()} đ</p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">System Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Real-time financial and operational health metrics.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] rounded-2xl border border-[#2d2d2d]">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Live Updates Active</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div 
            key={index} 
            onClick={() => navigate(stat.path)}
            className="glass-panel p-6 rounded-3xl hover:border-[#FF9500]/30 hover:bg-[#FF9500]/5 transition-all group cursor-pointer border-[#2d2d2d]"
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={22} />
              </div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#1a1a1a] text-gray-600 group-hover:text-[#FF9500] transition-colors">
                <ChevronRight size={16} />
              </div>
            </div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-2xl font-black text-white mt-1 group-hover:text-[#FF9500] transition-colors">{stat.value}</h3>
            <div className="mt-4 flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40"></span>
               <p className="text-[10px] text-gray-500 font-semibold uppercase">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Growth Chart with Recharts */}
        <div className="glass-panel p-8 rounded-3xl lg:col-span-2 border-[#2d2d2d] min-h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BarChart3 size={20} className="text-[#FF9500]" /> Revenue Growth
              </h3>
              <p className="text-gray-500 text-xs mt-1">Paid collections over the last 6 months.</p>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#666', fontSize: 10, fontWeight: 'bold' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#666', fontSize: 10, fontWeight: 'bold' }} 
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
                <Bar 
                  dataKey="amount" 
                  radius={[6, 6, 0, 0]} 
                  barSize={40}
                >
                  {revenueChart.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === revenueChart.length - 1 ? '#FF9500' : '#333'} 
                      className="transition-all duration-500 hover:fill-[#FF9500]"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-panel p-8 rounded-3xl border-[#2d2d2d] flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Activity size={20} className="text-[#FF9500]" /> Recent Activity
          </h3>
          <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {recentInvoices.length > 0 ? recentInvoices.map((inv) => (
              <div key={inv.id} className="flex items-start gap-4 p-1 group">
                <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${inv.status === 'PAID' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-[#FF9500] shadow-[0_0_10px_rgba(255,149,0,0.5)]'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm text-gray-200 font-bold truncate group-hover:text-[#FF9500] transition-colors">{inv.contract?.room?.name || 'Room'}</p>
                    <p className="text-xs font-black text-white whitespace-nowrap">{(inv.amountTotal || 0).toLocaleString()}đ</p>
                  </div>
                  <p className="text-[10px] text-gray-500 font-medium mt-0.5">Invoice #{inv.id} generated</p>
                  <div className="flex items-center gap-2 mt-2">
                     <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${inv.status === 'PAID' ? 'bg-green-500/10 text-green-500' : 'bg-[#FF9500]/10 text-[#FF9500]'}`}>
                        {inv.status}
                     </span>
                     <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">{inv.month}/{inv.year}</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="h-full flex items-center justify-center text-gray-600 italic text-sm py-20">No recent activity.</div>
            )}
          </div>
          
          <button 
            onClick={() => navigate('/invoices')}
            className="mt-8 w-full py-3 bg-[#1a1a1a] hover:bg-[#2d2d2d] text-gray-400 hover:text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all border border-[#2d2d2d]"
          >
            View All Transactions
          </button>
        </div>
      </div>
    </>
  );
}
