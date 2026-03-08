import React from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Users2, 
  UserCheck, 
  Ruler, 
  UserCog, 
  DoorOpen, 
  FileText, 
  Receipt,
  ChevronLeft,
  ChevronRight,
  Building2
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setCollapsed: (value: boolean) => void;
  activeItem: string;
  setActiveItem: (id: string) => void;
}

const MENU_ITEMS = [
  { id: 'nav-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'nav-permissions', icon: ShieldCheck, label: 'Permission Manager' },
  { id: 'nav-roles', icon: Users2, label: 'Role Manager' },
  { id: 'nav-tenants', icon: UserCheck, label: 'Tenant Manager' }
];

const OPERATION_ITEMS = [
  { id: 'nav-measures', icon: Ruler, label: 'Measure Manager' },
  { id: 'nav-users', icon: UserCog, label: 'User Manager' },
  { id: 'nav-rooms', icon: DoorOpen, label: 'Room Manager' },
  { id: 'nav-contracts', icon: FileText, label: 'Contract Manager' },
  { id: 'nav-invoices', icon: Receipt, label: 'Invoice Manager' }
];

export const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed, 
  setCollapsed,
  activeItem,
  setActiveItem
}) => {
  return (
    <aside className={`${
      isCollapsed ? 'w-20' : 'w-64'
    } bg-[#141414] border-r border-[#2d2d2d] flex flex-col transition-all duration-300 ease-in-out z-30 h-screen sticky top-0 hidden md:flex`}>
      {/* Logo Section */}
      <div className="h-16 flex items-center px-6 border-b border-[#2d2d2d]">
        <div 
          onClick={() => setActiveItem('nav-dashboard')}
          className="flex items-center gap-2 group cursor-pointer overflow-hidden"
        >
          <div className="min-w-8 h-8 bg-[#FF9500] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(255,149,0,0.3)]">
            <Building2 className="text-white w-5 h-5" />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-lg tracking-tight whitespace-nowrap text-white">
              Rent<span className="text-[#FF9500]">Dash</span>
            </span>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto custom-scrollbar py-6 space-y-1">
        <p className="px-6 text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-4 truncate">
          {isCollapsed ? '•••' : 'Main Menu'}
        </p>
        {MENU_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveItem(item.id)}
            className={`flex items-center px-6 py-3 gap-3 text-sm font-medium transition-all group w-full ${
              activeItem === item.id
                ? 'bg-[#FF9500]/10 border-r-4 border-[#FF9500] text-[#FF9500]'
                : 'text-gray-400 hover:text-[#FF9500] hover:bg-[#FF9500]/5'
            }`}
          >
            <item.icon className="w-5 h-5 min-w-5" />
            {!isCollapsed && <span className="truncate">{item.label}</span>}
          </button>
        ))}

        <p className="px-6 text-[10px] font-semibold text-gray-500 uppercase tracking-widest mt-8 mb-4 truncate">
          {isCollapsed ? '•••' : 'Operations'}
        </p>
        {OPERATION_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveItem(item.id)}
            className={`flex items-center px-6 py-3 gap-3 text-sm font-medium transition-all group w-full ${
              activeItem === item.id
                ? 'bg-[#FF9500]/10 border-r-4 border-[#FF9500] text-[#FF9500]'
                : 'text-gray-400 hover:text-[#FF9500] hover:bg-[#FF9500]/5'
            }`}
          >
            <item.icon className="w-5 h-5 min-w-5" />
            {!isCollapsed && <span className="truncate">{item.label}</span>}
          </button>
        ))}
      </div>

      {/* Collapse Button */}
      <div className="p-4 border-t border-[#2d2d2d]">
        <button
          onClick={() => setCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#2d2d2d] transition-colors text-gray-400"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
};
