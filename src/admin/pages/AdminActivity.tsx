import React, { useEffect, useState, useCallback } from 'react';
import {
  History,
  Search,
  RefreshCw,
  User as UserIcon,
  ChevronLeft,
  ChevronRight,
  Code,
  Globe,
  Clock,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { api } from '../../services/api';
import type { AuditLogItem } from '../../types/api';
import { useAdmin } from '../AdminContext';

export const AdminActivity: React.FC = () => {
  const { showToast } = useAdmin();
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLogId, setExpandedLogId] = useState<number | null>(null);

  const fetchLogs = useCallback(
    async (targetPage = 1) => {
      setLoading(true);
      try {
        const res = await api.getActivityLogs(targetPage);
        setLogs(res.data || []);
        setPage(res.current_page || 1);
        setTotalPages(res.last_page || 1);
        setTotalCount(res.total || 0);
      } catch (err: any) {
        showToast(err.message || 'Failed to load audit logs', 'error');
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  useEffect(() => {
    fetchLogs(page);
  }, [fetchLogs, page]);

  const filteredLogs = logs.filter((log) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const actionMatch = log.action.toLowerCase().includes(q);
    const userMatch = log.user?.name.toLowerCase().includes(q) || log.user?.email.toLowerCase().includes(q);
    const entityMatch = log.auditable_type?.toLowerCase().includes(q);
    const ipMatch = log.ip_address?.toLowerCase().includes(q);
    return actionMatch || userMatch || entityMatch || ipMatch;
  });

  const getActionBadge = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes('created') || act.includes('stored') || act.includes('add')) {
      return (
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          {action}
        </span>
      );
    }
    if (act.includes('updated') || act.includes('edit') || act.includes('modified') || act.includes('assign')) {
      return (
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
          {action}
        </span>
      );
    }
    if (act.includes('deleted') || act.includes('remove') || act.includes('destroy')) {
      return (
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
          {action}
        </span>
      );
    }
    if (act.includes('published') || act.includes('restored')) {
      return (
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
          {action}
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">
        {action}
      </span>
    );
  };

  const formatTimestamp = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <History className="w-6 h-6 text-[#D50000]" />
              Audit Trail & Activity Log
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-800 text-neutral-400 border border-neutral-700">
              {totalCount} Events Recorded
            </span>
          </div>
          <p className="text-sm text-neutral-400 mt-1">
            Immutable log of all administrative actions, content mutations, lead updates, and security events.
          </p>
        </div>

        <button
          onClick={() => fetchLogs(page)}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-200 transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search activity by action, staff member, entity, or IP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-900/80 border border-neutral-800 rounded-xl text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-[#D50000] transition-colors"
          />
        </div>
      </div>

      {/* Logs Table / List */}
      <div className="bg-[#0A0A0A] border border-neutral-800/80 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3 text-neutral-400">
            <RefreshCw className="w-8 h-8 animate-spin text-[#D50000]" />
            <p className="text-sm">Loading audit records...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <ShieldCheck className="w-12 h-12 text-neutral-600 mb-3" />
            <h3 className="text-base font-semibold text-neutral-300">No activity logs found</h3>
            <p className="text-sm text-neutral-500 mt-1 max-w-sm">
              {searchQuery
                ? 'No events match your search query.'
                : 'System actions will be recorded here automatically.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-800/80">
            {filteredLogs.map((log) => {
              const isExpanded = expandedLogId === log.id;
              const hasDiff =
                (log.old_values && Object.keys(log.old_values).length > 0) ||
                (log.new_values && Object.keys(log.new_values).length > 0);

              return (
                <div
                  key={log.id}
                  className="p-4 hover:bg-neutral-900/40 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    {/* Left: User & Action */}
                    <div className="flex items-start gap-3">
                      {log.user?.avatar ? (
                        <img
                          src={log.user.avatar}
                          alt={log.user.name}
                          className="w-9 h-9 rounded-full object-cover border border-neutral-700 mt-0.5"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-400 mt-0.5">
                          <UserIcon className="w-4 h-4" />
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm text-neutral-200">
                            {log.user ? log.user.name : 'System Automation'}
                          </span>
                          {log.user?.email && (
                            <span className="text-xs text-neutral-500">
                              ({log.user.email})
                            </span>
                          )}
                          <span className="text-neutral-600">•</span>
                          {getActionBadge(log.action)}
                        </div>

                        <div className="flex items-center gap-3 mt-1.5 text-xs text-neutral-400 flex-wrap">
                          {log.auditable_type && (
                            <span className="inline-flex items-center gap-1 font-mono text-neutral-300 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                              <Code className="w-3 h-3 text-[#D50000]" />
                              {log.auditable_type} #{log.auditable_id}
                            </span>
                          )}

                          {log.ip_address && (
                            <span className="inline-flex items-center gap-1 text-neutral-500">
                              <Globe className="w-3 h-3" />
                              {log.ip_address}
                            </span>
                          )}

                          <span className="inline-flex items-center gap-1 text-neutral-500">
                            <Clock className="w-3 h-3" />
                            {formatTimestamp(log.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Toggle Diff Details */}
                    {hasDiff && (
                      <button
                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                        className="self-start lg:self-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 transition-colors cursor-pointer"
                      >
                        <Code className="w-3.5 h-3.5 text-[#D50000]" />
                        <span>{isExpanded ? 'Hide Payload' : 'View Payload'}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Expanded JSON Diff Box */}
                  {isExpanded && hasDiff && (
                    <div className="mt-3.5 pt-3.5 border-t border-neutral-800/80 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                      {log.old_values && Object.keys(log.old_values).length > 0 && (
                        <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 overflow-x-auto">
                          <p className="text-[11px] font-sans font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">
                            Previous Values
                          </p>
                          <pre className="text-red-400/90 whitespace-pre-wrap break-all">
                            {JSON.stringify(log.old_values, null, 2)}
                          </pre>
                        </div>
                      )}
                      {log.new_values && Object.keys(log.new_values).length > 0 && (
                        <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 overflow-x-auto">
                          <p className="text-[11px] font-sans font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">
                            New Values
                          </p>
                          <pre className="text-emerald-400/90 whitespace-pre-wrap break-all">
                            {JSON.stringify(log.new_values, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
                className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 disabled:opacity-40 disabled:hover:border-neutral-800 cursor-pointer text-neutral-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || loading}
                className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 disabled:opacity-40 disabled:hover:border-neutral-800 cursor-pointer text-neutral-300"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminActivity;
