import React, { useState } from 'react';
import { useAdmin } from './AdminContext';
import { AdminLayout } from './AdminLayout';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminLeads } from './pages/AdminLeads';
import { AdminLeadDetail } from './pages/AdminLeadDetail';
import { AdminPages } from './pages/AdminPages';
import { AdminPageBuilder } from './pages/AdminPageBuilder';
import { AdminMedia } from './pages/AdminMedia';
import { AdminServices } from './pages/AdminServices';
import { AdminPortfolio } from './pages/AdminPortfolio';
import { AdminVideos } from './pages/AdminVideos';
import { AdminUsers } from './pages/AdminUsers';
import { AdminRoles } from './pages/AdminRoles';
import { AdminSettings } from './pages/AdminSettings';
import { AdminActivity } from './pages/AdminActivity';
import { Loader2 } from 'lucide-react';

interface AdminRootProps {
  onBackToSite: () => void;
}

export const AdminRoot: React.FC<AdminRootProps> = ({ onBackToSite }) => {
  const { user, loading } = useAdmin();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleNavigate = (tab: string, param?: string | number) => {
    if (tab === 'public') {
      onBackToSite();
      return;
    }

    if (param !== undefined && typeof param === 'number') {
      setSelectedId(param);
    } else if (param !== undefined && typeof param === 'string' && !isNaN(Number(param))) {
      setSelectedId(Number(param));
    }

    setCurrentTab(tab);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4 text-white">
        <div className="w-12 h-12 rounded-2xl bg-[#D50000] flex items-center justify-center font-black text-2xl shadow-[0_0_30px_rgba(213,0,0,0.5)] animate-pulse">
          S
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <Loader2 className="w-4 h-4 animate-spin text-[#D50000]" />
          <span>Authenticating Slice Enterprise Session...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin onBackToSite={onBackToSite} />;
  }

  const renderActiveModule = () => {
    switch (currentTab) {
      case 'dashboard':
        return <AdminDashboard onNavigate={handleNavigate} />;
      case 'leads':
        return <AdminLeads onNavigate={handleNavigate} />;
      case 'lead-detail':
        return selectedId ? (
          <AdminLeadDetail leadId={selectedId} onBack={() => setCurrentTab('leads')} />
        ) : (
          <AdminLeads onNavigate={handleNavigate} />
        );
      case 'pages':
        return <AdminPages onNavigate={handleNavigate} />;
      case 'page-builder':
        return selectedId ? (
          <AdminPageBuilder pageId={selectedId} onBack={() => setCurrentTab('pages')} />
        ) : (
          <AdminPages onNavigate={handleNavigate} />
        );
      case 'media':
        return <AdminMedia />;
      case 'services':
        return <AdminServices />;
      case 'portfolio':
        return <AdminPortfolio />;
      case 'videos':
        return <AdminVideos />;
      case 'users':
        return <AdminUsers />;
      case 'roles':
        return <AdminRoles />;
      case 'settings':
        return <AdminSettings />;
      case 'activity':
        return <AdminActivity />;
      default:
        return <AdminDashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <AdminLayout currentTab={currentTab} onNavigate={handleNavigate}>
      {renderActiveModule()}
    </AdminLayout>
  );
};
export default AdminRoot;
