import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  Lock,
} from 'lucide-react';
import type { Role } from '../../types/api';
import { api } from '../../services/api';
import { useAdmin } from '../AdminContext';

export const AdminRoles: React.FC = () => {
  const { showToast } = useAdmin();
  const [roles, setRoles] = useState<Role[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const data = await api.getRoles();
      setRoles(data.roles);
      setAvailablePermissions(data.available_permissions);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch roles', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-[#FF3333] mb-1">
            Access Control Architecture
          </div>
          <h1 className="font-headline text-2xl sm:text-3xl text-white tracking-tight">
            Roles & Permissions Matrix
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Granular role-based capability boundaries enforced on backend API endpoints
          </p>
        </div>

        <button
          onClick={fetchRoles}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#D50000]' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div
            key={role.id}
            className="p-6 rounded-3xl bg-[#0F0F0F] border border-white/10 flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-[#FF3333] bg-[#D50000]/10 border border-[#D50000]/30 px-2.5 py-1 rounded-lg">
                  {role.slug}
                </span>
                <span className="text-[10px] font-mono text-neutral-500">
                  {role.users_count || 0} active user(s)
                </span>
              </div>

              <h3 className="font-headline text-xl text-white mb-2">{role.name}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed mb-6">
                {role.description}
              </p>

              <div className="space-y-2 pt-4 border-t border-white/5">
                <div className="text-[10px] font-mono uppercase text-neutral-500">
                  Granted Capabilities ({role.permissions?.length || 0})
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                  {role.permissions?.map((p) => (
                    <span
                      key={p.id}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/10"
                    >
                      {p.slug}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-neutral-500 font-mono">
              <span>Security Policy</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Enforced</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
