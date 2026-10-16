import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  RefreshCw,
  Building,
} from 'lucide-react';
import type { Lead, LeadFilters, LeadPriority, LeadStatus, User } from '../../types/api';
import { api } from '../../services/api';
import { useAdmin } from '../AdminContext';

interface AdminLeadsProps {
  onNavigate: (tab: string, param?: string | number) => void;
}

export const AdminLeads: React.FC<AdminLeadsProps> = ({ onNavigate }) => {
  const { hasPermission, showToast } = useAdmin();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<LeadFilters>({
    search: '',
    status: '',
    priority: '',
    page: 1,
    per_page: 15,
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const [staffUsers, setStaffUsers] = useState<User[]>([]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await api.getLeads(filters);
      setLeads(res.data);
      setPagination({
        current_page: res.current_page,
        last_page: res.last_page,
        total: res.total,
      });
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch leads', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [filters.status, filters.priority, filters.page]);

  useEffect(() => {
    if (hasPermission('leads.assign')) {
      api.getUsers().then(setStaffUsers).catch(() => {});
    }
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, page: 1 }));
    fetchLeads();
  };

  const handleQuickStatusChange = async (leadId: number, newStatus: LeadStatus) => {
    try {
      await api.updateLead(leadId, { status: newStatus });
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
      );
      showToast('Lead status updated successfully.');
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const statusColors: Record<LeadStatus, string> = {
    new: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    contacted: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    qualified: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    proposal_sent: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    negotiation: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
    won: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    lost: 'bg-neutral-800 text-neutral-400 border-white/10',
    archived: 'bg-neutral-900 text-neutral-500 border-white/5',
  };

  const priorityColors: Record<LeadPriority, string> = {
    urgent: 'bg-red-500/20 text-red-400 border-red-500/40',
    high: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    medium: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    low: 'bg-neutral-800 text-neutral-400 border-white/10',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-[#FF3333] mb-1">
            Sales & Client Acquisition
          </div>
          <h1 className="font-headline text-2xl sm:text-3xl text-white tracking-tight">
            Lead CRM Pipeline
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Total {pagination.total} inquiries recorded from public marketing touchpoints
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasPermission('leads.export') && (
            <a
              href={api.getExportCsvUrl(filters)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </a>
          )}

          <button
            onClick={fetchLeads}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-colors"
            title="Refresh Leads"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#D50000]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0F0F0F] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="w-full md:w-96 relative">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            placeholder="Search name, email, company, code..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#141414] border border-white/10 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-[#D50000]"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  status: e.target.value as LeadStatus | '',
                  page: 1,
                }))
              }
              className="px-3 py-1.5 rounded-xl bg-[#141414] border border-white/10 text-neutral-200 text-xs focus:outline-none focus:border-[#D50000]"
            >
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="proposal_sent">Proposal Sent</option>
              <option value="negotiation">Negotiation</option>
              <option value="won">Won Contract</option>
              <option value="lost">Lost</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Priority Filter */}
          <select
            value={filters.priority}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                priority: e.target.value as LeadPriority | '',
                page: 1,
              }))
            }
            className="px-3 py-1.5 rounded-xl bg-[#141414] border border-white/10 text-neutral-200 text-xs focus:outline-none focus:border-[#D50000]"
          >
            <option value="">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="rounded-2xl bg-[#0F0F0F] border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#141414] border-b border-white/10 text-[11px] font-mono uppercase tracking-wider text-neutral-400">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Ref Code</th>
                <th className="py-3.5 px-4 font-semibold">Client & Company</th>
                <th className="py-3.5 px-4 font-semibold">Service & Budget</th>
                <th className="py-3.5 px-4 font-semibold">Pipeline Status</th>
                <th className="py-3.5 px-4 font-semibold">Priority</th>
                <th className="py-3.5 px-4 font-semibold">Assigned Agent</th>
                <th className="py-3.5 px-4 font-semibold">Date</th>
                <th className="py-3.5 px-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#D50000]" />
                    <span>Loading CRM leads from database...</span>
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-500">
                    No leads found matching current criteria.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                    onClick={() => onNavigate('lead-detail', lead.id)}
                  >
                    {/* Ref Code */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#FF3333]">
                      {lead.reference_code}
                    </td>

                    {/* Client & Company */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white group-hover:text-[#FF3333] transition-colors">
                        {lead.full_name}
                      </div>
                      <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 mt-0.5">
                        {lead.company && (
                          <span className="flex items-center gap-1">
                            <Building className="w-3 h-3 text-neutral-500" />
                            <span>{lead.company}</span>
                          </span>
                        )}
                        <span>• {lead.email}</span>
                      </div>
                    </td>

                    {/* Service & Budget */}
                    <td className="py-3.5 px-4 max-w-[200px]">
                      <div className="text-neutral-200 truncate font-medium">
                        {lead.requested_service || 'General Inquiry'}
                      </div>
                      <div className="text-[11px] font-mono text-emerald-400 mt-0.5">
                        {lead.budget_range || 'Flexible budget'}
                      </div>
                    </td>

                    {/* Pipeline Status */}
                    <td
                      className="py-3.5 px-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          handleQuickStatusChange(lead.id, e.target.value as LeadStatus)
                        }
                        className={`text-[10px] font-mono uppercase font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${
                          statusColors[lead.status] || ''
                        }`}
                      >
                        <option value="new">NEW</option>
                        <option value="contacted">CONTACTED</option>
                        <option value="qualified">QUALIFIED</option>
                        <option value="proposal_sent">PROPOSAL SENT</option>
                        <option value="negotiation">NEGOTIATION</option>
                        <option value="won">WON CONTRACT</option>
                        <option value="lost">LOST</option>
                        <option value="archived">ARCHIVED</option>
                      </select>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold border ${
                          priorityColors[lead.priority] || ''
                        }`}
                      >
                        {lead.priority}
                      </span>
                    </td>

                    {/* Assigned Agent */}
                    <td className="py-3.5 px-4">
                      {lead.assignedAgent ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                            {lead.assignedAgent.name.slice(0, 2)}
                          </div>
                          <span className="text-neutral-300 font-medium text-[11px]">
                            {lead.assignedAgent.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-neutral-500 font-mono text-[11px]">Unassigned</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-400 whitespace-nowrap">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>

                    {/* Action Button */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('lead-detail', lead.id);
                        }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white text-neutral-400 transition-colors"
                        title="View Full Lead Details & Notes"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {pagination.last_page > 1 && (
          <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
            <span>
              Page {pagination.current_page} of {pagination.last_page}
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={pagination.current_page <= 1}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: (prev.page || 1) - 1,
                  }))
                }
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white"
              >
                Previous
              </button>

              <button
                disabled={pagination.current_page >= pagination.last_page}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: (prev.page || 1) + 1,
                  }))
                }
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
