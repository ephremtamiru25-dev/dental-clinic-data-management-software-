import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  CreditCard, 
  Settings, 
  Bell, 
  Search, 
  Menu, 
  X,
  Stethoscope,
  ChevronRight,
  LogOut,
  Layers,
  ClipboardList,
  ShieldCheck,
  UserCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { useAuth } from '../../lib/auth-context';
import { toast } from 'sonner';

export const Shell: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout, hasPermission } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', resource: 'dashboard', action: 'read' },
    { id: 'patients', label: 'Patients', icon: Users, path: '/patients', resource: 'patient', action: 'read' },
    { id: 'appointments', label: 'Smart Scheduler', icon: Calendar, path: '/appointments', resource: 'appointment', action: 'read' },
    { id: 'clinical', label: 'Clinical Charting', icon: Layers, path: '/history', resource: 'dental_procedure', action: 'read' },
    { id: 'treatment', label: 'Treatment & Labs', icon: ClipboardList, path: '/treatment', resource: 'lab_case', action: 'read' },
    { id: 'billing', label: 'Billing', icon: CreditCard, path: '/billing', resource: 'billing', action: 'read' },
    { id: 'staff', label: 'Staff Management', icon: ShieldCheck, path: '/admin/staff', resource: 'user', action: 'manage' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings', resource: 'settings', action: 'read' },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.id === 'dashboard' || hasPermission(item.resource, item.action)
  );

  return (
    <div className="flex h-screen bg-gray-50/50 overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Stethoscope className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-gray-900">DentalOS</span>
          </div>

          <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
            {filteredMenuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all",
                    isActive 
                      ? "bg-indigo-50 text-indigo-700" 
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-indigo-600" : "text-gray-400")} />
                  <span className="truncate">{item.label}</span>
                  {isActive && <ChevronRight className="ml-auto w-4 h-4 shrink-0" />}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl group transition-all">
              <Link to="/profile" className="flex items-center gap-3 flex-1 overflow-hidden">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold overflow-hidden">
                  {user?.employee_id.charAt(0) || <UserCircle className="w-6 h-6" />}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user?.employee_id || 'Staff'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.role || 'User'}</p>
                </div>
              </Link>
              <button 
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-600 transition-colors p-1"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 shrink-0">
          <button 
            className="md:hidden p-2 text-gray-500"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1 max-w-xl mx-4 relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search patients, appointments..." 
              className="w-full bg-gray-100/50 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </Button>
            <div className="h-8 w-[1px] bg-gray-100 mx-2"></div>
            <Link to="/history">
              <Button size="sm" className="hidden sm:flex bg-indigo-600 hover:bg-indigo-700">Quick Chart</Button>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#FAFAFB]">
          <Outlet />
        </main>
      </div>

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Shell;