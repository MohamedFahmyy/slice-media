import React, { useState, useEffect } from 'react';
import {
  Users2,
  TrendingUp,
  DollarSign,
  Award,
  Layers,
  FileCheck2,
  RefreshCw,
  Clock,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import type { DashboardResponse } from '../../types/api';
import { api } from '../../services/api';

interface AdminDashboardProps {
  onNavigate: (tab: string, param?: string | number) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getDashboard();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch executive dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-neutral-400">
        <RefreshCw className="w-8 h-8 animate-spin text-[#D50000] mb-3" />
        <span className="text-sm font-mono">Aggregating live CRM metrics & CMS records...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300">
        <h3 className="font-bold text-base mb-1">Failed to Load Dashboard</h3>
        <p className="text-sm">{error}</p>
        <button
          onClick={fetchDashboard}
          className="mt-4 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { metrics, leads_by_status, leads_by_service, recent_activities, cms_stats } = data;

  const statCards = [
    {
      label: 'Total Client Inquiries',
      value: metrics.total_leads,
      sub: `${metrics.new_leads} awaiting first contact`,
      icon: Users2,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      action: () => onNavigate('leads'),
    },
    {
      label: 'Qualified Pipeline Value',
      value: `$${metrics.pipeline_value.toLocaleString()}`,
      sub: `${metrics.qualified_leads} actively qualified`,
      icon: DollarSign,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      action: () => onNavigate('leads'),
    },
    {
      label: 'Closed & Won Revenue',
      value: `$${metrics.won_revenue.toLocaleString()}`,
      sub: `${metrics.won_leads} closed partner brands`,
      icon: Award,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      action: () => onNavigate('leads'),
    },
    {
      label: 'Win Conversion Rate',
      value: `${metrics.conversion_rate_percentage}%`,
      sub: 'Based on qualified decisions',
      icon: TrendingUp,
      color: 'text-[#FF3333] bg-[#D50000]/10 border-[#D50000]/20',
      action: () => onNavigate('leads'),
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#FF3333] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Executive Control Center</span>
          </div>
          <h1 className="font-headline text-2xl sm:text-3xl text-white tracking-tight">
            Dashboard Overview
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboard}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Metrics</span>
          </button>

          <button
            onClick={() => onNavigate('leads')}
            className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5"
          >
            <span>Open CRM Pipeline</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={card.action}
              className="p-5 sm:p-6 rounded-2xl bg-[#0F0F0F] border border-white/10 hover:border-white/20 transition-all cursor-pointer group shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                  {card.label}
                </span>
                <div className={`p-2 rounded-xl border ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="font-headline text-3xl text-white group-hover:text-[#FF3333] transition-colors">
                {card.value}
              </div>
              <div className="text-xs text-neutral-500 mt-2 flex items-center justify-between">
                <span>{card.sub}</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Pipeline Status & Service Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads by Status */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0F0F0F] border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-headline text-lg text-white">Lead Pipeline Distribution</h3>
              <p className="text-xs text-neutral-400">Active status breakdown across client pipeline</p>
            </div>
            <button
              onClick={() => onNavigate('leads')}
              className="text-xs text-[#FF3333] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { key: 'new', label: 'New Inquiries', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
              { key: 'contacted', label: 'Contacted', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
              { key: 'qualified', label: 'Qualified', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
              { key: 'proposal_sent', label: 'Proposal Sent', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
              { key: 'negotiation', label: 'Negotiation', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
              { key: 'won', label: 'Won Contracts', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
              { key: 'lost', label: 'Lost / Disqualified', color: 'bg-neutral-800 text-neutral-400 border-white/10' },
              { key: 'archived', label: 'Archived', color: 'bg-neutral-800 text-neutral-500 border-white/10' },
            ].map((st) => (
              <div
                key={st.key}
                onClick={() => onNavigate('leads')}
                className={`p-3.5 rounded-xl border cursor-pointer hover:border-white/30 transition-colors ${st.color}`}
              >
                <div className="text-[11px] font-mono uppercase tracking-wider opacity-80 mb-1">
                  {st.label}
                </div>
                <div className="font-headline text-2xl font-bold">
                  {leads_by_status[st.key] || 0}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CMS Live Modules Summary */}
        <div className="p-6 rounded-2xl bg-[#0F0F0F] border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-headline text-lg text-white">CMS Platform Assets</h3>
                <p className="text-xs text-neutral-400">Database-backed content units</p>
              </div>
              <Layers className="w-5 h-5 text-neutral-500" />
            </div>

            <div className="space-y-3">
              <div
                onClick={() => onNavigate('pages')}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <FileCheck2 className="w-4 h-4 text-[#D50000]" />
                  <span className="text-xs font-semibold text-white">Published CMS Pages</span>
                </div>
                <span className="text-xs font-mono font-bold text-neutral-300">
                  {cms_stats.published_pages} / {cms_stats.pages_count}
                </span>
              </div>

              <div
                onClick={() => onNavigate('services')}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs font-semibold text-white">Agency Services</span>
                </div>
                <span className="text-xs font-mono font-bold text-neutral-300">
                  {cms_stats.services_count} active
                </span>
              </div>

              <div
                onClick={() => onNavigate('portfolio')}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-xs font-semibold text-white">Portfolio Blueprints</span>
                </div>
                <span className="text-xs font-mono font-bold text-neutral-300">
                  {cms_stats.portfolio_count} cases
                </span>
              </div>

              <div
                onClick={() => onNavigate('videos')}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="text-xs font-semibold text-white">3D Video Strip Formats</span>
                </div>
                <span className="text-xs font-mono font-bold text-neutral-300">
                  {cms_stats.videos_count} reels
                </span>
              </div>

              <div
                onClick={() => onNavigate('media')}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <span className="text-xs font-semibold text-white">Media Library Assets</span>
                </div>
                <span className="text-xs font-mono font-bold text-neutral-300">
                  {cms_stats.media_assets_count} files
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-neutral-500 font-mono">
            <span>Dynamic CMS Status</span>
            <span className="text-emerald-400 font-bold">100% Synced</span>
          </div>
        </div>
      </div>

      {/* Demand by Service & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demand by Service */}
        <div className="p-6 rounded-2xl bg-[#0F0F0F] border border-white/10">
          <h3 className="font-headline text-lg text-white mb-2">Demand by Requested Service</h3>
          <p className="text-xs text-neutral-400 mb-6">Most requested strategic services by incoming clients</p>

          <div className="space-y-4">
            {Object.keys(leads_by_service).length === 0 ? (
              <div className="text-xs text-neutral-500 font-mono py-8 text-center">
                No services requested yet.
              </div>
            ) : (
              Object.entries(leads_by_service).map(([service, count]) => (
                <div key={service} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-200">{service}</span>
                    <span className="font-mono text-neutral-400">{count} inquiries</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#D50000] to-[#FF3333] rounded-full"
                      style={{
                        width: `${Math.min(100, (count / (metrics.total_leads || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Audit / Administrative Activities */}
        <div className="p-6 rounded-2xl bg-[#0F0F0F] border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-headline text-lg text-white">Recent System Activities</h3>
              <p className="text-xs text-neutral-400">Audit trail of administrative actions</p>
            </div>
            <button
              onClick={() => onNavigate('activity')}
              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 font-mono"
            >
              <span>View Logs</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recent_activities.length === 0 ? (
              <div className="text-xs text-neutral-500 font-mono py-8 text-center">
                No recent activity logged.
              </div>
            ) : (
              recent_activities.slice(0, 5).map((act) => (
                <div
                  key={act.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-xs"
                >
                  <Clock className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-bold text-white capitalize">
                      {act.action.replace('_', ' ')}
                    </span>
                    <span className="text-neutral-400">
                      {' '}by {act.user?.name || 'System'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 whitespace-nowrap">
                    {new Date(act.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
