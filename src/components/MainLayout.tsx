import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useGetMyInfoQuery, useLogoutMutation } from '../store/api/baseApi';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import toast from 'react-hot-toast';

export default function MainLayout() {
  const [isCollapsed, setCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: userData } = useGetMyInfoQuery(undefined, {
    pollingInterval: 30000, // Tự động làm mới mỗi 30 giây để cập nhật quyền
  });
  const [logoutApi] = useLogoutMutation();

  // Mapping URL path to Sidebar ID
  const activeItem = useMemo(() => {
    const path = location.pathname;
    const map: Record<string, string> = {
      '/dashboard': 'nav-dashboard',
      '/rooms': 'nav-rooms',
      '/tenants': 'nav-tenants',
      '/users': 'nav-users',
      '/contracts': 'nav-contracts',
      '/invoices': 'nav-invoices',
      '/measures': 'nav-measures',
      '/roles': 'nav-roles',
      '/permissions': 'nav-permissions',
    };
    return map[path] || 'nav-dashboard';
  }, [location.pathname]);

  const handleSetActiveItem = useCallback((id: string) => {
    const map: Record<string, string> = {
      'nav-dashboard': '/dashboard',
      'nav-rooms': '/rooms',
      'nav-tenants': '/tenants',
      'nav-users': '/users',
      'nav-contracts': '/contracts',
      'nav-invoices': '/invoices',
      'nav-measures': '/measures',
      'nav-roles': '/roles',
      'nav-permissions': '/permissions',
    };
    if (map[id] && location.pathname !== map[id]) {
      navigate(map[id]);
    }
  }, [navigate, location.pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      dispatch(logout());
      navigate('/auth/login');
      toast.success('Signed out successfully');
    }
  };

  const userInitial = userData?.data?.username?.substring(0, 2).toUpperCase() || 'AD';

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0f0f0f] text-gray-300 font-sans">
      <Sidebar 
        isCollapsed={isCollapsed} 
        setCollapsed={setCollapsed} 
        activeItem={activeItem} 
        setActiveItem={handleSetActiveItem} 
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-[#141414] border-b border-[#2d2d2d] sticky top-0 z-40 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="font-bold text-white tracking-tight">
               {location.pathname === '/dashboard' ? 'Overview' : 
                location.pathname.replace('/', '').split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </h2>
          </div>
          
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-2xl hover:bg-[#1a1a1a] transition-all border border-transparent hover:border-[#2d2d2d] group"
            >
              <div className="flex flex-col text-right hidden sm:flex">
                 <span className="text-xs font-bold text-white group-hover:text-[#FF9500] transition-colors">{userData?.data?.username}</span>
                 <span className="text-[9px] text-gray-500 font-medium uppercase tracking-tighter">{userData?.data?.roles?.[0]?.name}</span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-[#FF9500]/10 border border-[#FF9500]/20 flex items-center justify-center text-[#FF9500] font-black text-xs shadow-lg group-hover:bg-[#FF9500] group-hover:text-black transition-all">
                {userData?.data?.avatar ? (
                  <img src={userData.data.avatar} className="w-full h-full object-cover rounded-xl" alt="avatar" />
                ) : userInitial}
              </div>
              <ChevronDown size={14} className={`text-gray-600 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-56 glass-panel rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200 border-[#2d2d2d]">
                <div className="px-4 py-3 border-b border-[#2d2d2d] mb-1">
                  <p className="text-xs font-black text-white truncate">{userData?.data?.username || 'User Account'}</p>
                  <p className="text-[10px] text-gray-500 truncate mt-0.5">{userData?.data?.email}</p>
                </div>
                
                <button 
                  onClick={() => { navigate('/profile'); setIsProfileOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:bg-[#FF9500]/10 hover:text-[#FF9500] transition-colors"
                >
                  <User size={16} /> <span className="font-medium">My Profile</span>
                </button>
                
                <button 
                  onClick={() => { navigate('/settings'); setIsProfileOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:bg-[#FF9500]/10 hover:text-[#FF9500] transition-colors"
                >
                  <Settings size={16} /> <span className="font-medium">System Settings</span>
                </button>
                
                <div className="h-px bg-[#2d2d2d] my-1 mx-2"></div>
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut size={16} /> <span className="font-bold">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
