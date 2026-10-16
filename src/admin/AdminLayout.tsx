import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users2,
  FileText,
  Image as ImageIcon,
  Briefcase,
  Layers,
  Video as VideoIcon,
  UserCheck,
  ShieldAlert,
  Settings,
  History,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
} from 'lucide-react';
import { useAdmin } from './AdminContext';

interface AdminLayoutProps {
  currentTab: string;
  onNavigate: (tab: string, param?: string | number) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onNavigate,
  children,
}) => {
  const { user, logout, hasPermission, toasts, removeToast } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Overview',
      icon: LayoutDashboard,
      permission: 'dashboard.view',
    },
    {
      id: 'leads',
      label: 'Lead CRM',
      icon: Users2,
      permission: 'leads.view',
      badge: 'Live',
    },
    {
      id: 'pages',
      label: 'CMS Pages',
      icon: FileText,
      permission: 'pages.view',
    },
    {
      id: 'media',
      label: 'Media Library',
      icon: ImageIcon,
      permission: 'media.view',
    },
    {
      id: 'services',
      label: 'Services',
      icon: Briefcase,
      permission: 'services.manage',
    },
    {
      id: 'portfolio',
      label: 'Portfolio Cases',
      icon: Layers,
      permission: 'portfolio.manage',
    },
    {
      id: 'videos',
      label: '3D Video Strip',
      icon: VideoIcon,
      permission: 'videos.manage',
    },
    {
      id: 'users',
      label: 'Staff Users',
      icon: UserCheck,
      permission: 'users.manage',
    },
    {
      id: 'roles',
      label: 'Roles & Access',
      icon: ShieldAlert,
      permission: 'roles.manage',
    },
    {
      id: 'settings',
      label: 'Site Settings',
      icon: Settings,
      permission: 'settings.manage',
    },
    {
      id: 'activity',
      label: 'Audit Trail',
      icon: History,
      permission: 'activity.view',
    },
  ];

  const visibleItems = navigationItems.filter(
    (item) => !item.permission || hasPermission(item.permission)
  );

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-100 flex flex-col font-sans">
      {/* Toast Notification Container */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-md pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border text-sm backdrop-blur-xl animate-fade-in ${
              toast.type === 'success'
                ? 'bg-neutral-900/95 border-emerald-500/40 text-emerald-300'
                : toast.type === 'error'
                ? 'bg-neutral-900/95 border-[#D50000]/50 text-red-300'
                : 'bg-neutral-900/95 border-neutral-700 text-neutral-200'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-[#D50000] shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 font-medium leading-relaxed">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Top Header */}
      <header className="h-16 bg-[#0A0A0A] border-b border-white/10 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300"
            aria-label="Toggle Navigation"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#D50000] flex items-center justify-center font-black text-white text-base tracking-tighter shadow-[0_0_15px_rgba(213,0,0,0.5)]">
              S
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-white text-sm flex items-center gap-1.5">
                SLICE <span className="text-[10px] text-[#FF3333] font-mono uppercase bg-[#D50000]/15 px-1.5 py-0.2 rounded border border-[#D50000]/30">ADMIN</span>
              </span>
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest hidden sm:inline">
                Enterprise CMS & CRM
              </span>
            </div>
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => onNavigate('public')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <div className="h-5 w-px bg-white/10 hidden sm:block" />

          {/* User Profile Pill */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="text-xs font-bold text-white leading-tight">
                {user?.name}
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                {user?.role?.name || 'Staff'}
              </span>
            </div>

            <div className="w-9 h-9 rounded-full bg-neutral-800 border border-white/15 flex items-center justify-center text-xs font-bold text-white uppercase overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name.slice(0, 2)
              )}
            </div>

            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-neutral-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop & Mobile Sidebar */}
        <aside
          className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-[#0A0A0A] border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 pt-16 md:pt-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
            <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 px-3 py-2">
              Management Modules
            </div>

            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#D50000] text-white shadow-[0_0_15px_rgba(213,0,0,0.3)]'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer info */}
          <div className="p-4 border-t border-white/10 text-[11px] text-neutral-500 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span>Environment</span>
              <span className="text-emerald-400 font-mono text-[10px]">Local / Production</span>
            </div>
            <div className="flex items-center justify-between">
              <span>API Server</span>
              <span className="text-neutral-300 font-mono text-[10px]">127.0.0.1:8001</span>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-20 md:hidden"
          />
        )}

        {/* Main Content Stage */}
        <main className="flex-1 overflow-y-auto bg-[#070707] p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
