import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Shield,
  X,
  Mail,
  Phone,
} from 'lucide-react';
import type { Role, User } from '../../types/api';
import { api } from '../../services/api';
import { useAdmin } from '../AdminContext';

export const AdminUsers: React.FC = () => {
  const { hasPermission, showToast, user: currentUser } = useAdmin();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role_id: 1,
    phone: '',
    status: 'active' as 'active' | 'inactive' | 'suspended',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [uData, rData] = await Promise.all([api.getUsers(), api.getRoles()]);
      setUsers(uData);
      setRoles(rData.roles);
      if (rData.roles.length > 0 && !form.role_id) {
        setForm((p) => ({ ...p, role_id: rData.roles[0].id }));
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch staff users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingUser(null);
    setForm({
      name: '',
      email: '',
      password: '',
      role_id: roles[0]?.id || 1,
      phone: '',
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (u: User) => {
    setEditingUser(u);
    setForm({
      name: u.name,
      email: u.email,
      password: '',
      role_id: u.role?.id || roles[0]?.id || 1,
      phone: u.phone || '',
      status: u.status || 'active',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.updateUser(editingUser.id, form);
        showToast('Staff user updated.');
      } else {
        await api.createUser(form);
        showToast('New staff user created.');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save staff user', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Revoke access and delete this staff user?')) return;
    try {
      await api.deleteUser(id);
      showToast('Staff user removed.');
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete user', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-[#FF3333] mb-1">
            Access & Security
          </div>
          <h1 className="font-headline text-2xl sm:text-3xl text-white tracking-tight">
            Staff & User Management
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage administrative personnel, sales strategists, and role allocations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openCreateModal}
            className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Staff User</span>
          </button>

          <button
            onClick={fetchData}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#D50000]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-[#0F0F0F] border border-white/10 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#141414] border-b border-white/10 text-[11px] font-mono uppercase tracking-wider text-neutral-400">
            <tr>
              <th className="py-3.5 px-4 font-semibold">User</th>
              <th className="py-3.5 px-4 font-semibold">Assigned Role</th>
              <th className="py-3.5 px-4 font-semibold">Contact Info</th>
              <th className="py-3.5 px-4 font-semibold">Status</th>
              <th className="py-3.5 px-4 font-semibold">Last Active</th>
              <th className="py-3.5 px-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-neutral-500 font-mono">
                  Loading staff accounts...
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center font-bold text-white uppercase text-[11px]">
                        {u.avatar ? (
                          <img src={u.avatar} alt={u.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          u.name.slice(0, 2)
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-white">{u.name}</div>
                        <div className="text-[11px] text-neutral-400 font-mono">{u.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-200 font-semibold text-[11px]">
                      <Shield className="w-3 h-3 text-[#D50000]" />
                      <span>{u.role?.name || 'Staff Member'}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-neutral-300 font-mono text-[11px]">
                    {u.phone || 'No phone recorded'}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                        u.status === 'active'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-red-500/15 text-red-400'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-neutral-400 font-mono text-[11px]">
                    {u.last_login_at
                      ? new Date(u.last_login_at).toLocaleDateString()
                      : 'Never'}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(u)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
                        title="Edit User"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {u.id !== currentUser?.id && u.role?.slug !== 'super-admin' && (
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-neutral-500 hover:text-red-400 transition-colors"
                          title="Revoke User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0F0F0F] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline text-xl text-white">
                {editingUser ? 'Edit Staff Profile' : 'Create Staff User'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-mono uppercase text-neutral-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Omar Client Strategist"
                  className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white focus:outline-none focus:border-[#D50000]"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-neutral-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="agent@slicemedia.agency"
                  className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white focus:outline-none focus:border-[#D50000]"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-neutral-400 mb-1">
                  Password {editingUser && '(Leave blank to keep unchanged)'}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••••••"
                  className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white focus:outline-none focus:border-[#D50000]"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-neutral-400 mb-1">
                  Assigned System Role
                </label>
                <select
                  value={form.role_id}
                  onChange={(e) => setForm((p) => ({ ...p, role_id: parseInt(e.target.value, 10) }))}
                  className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white focus:outline-none focus:border-[#D50000]"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono uppercase text-neutral-400 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="+20 100 000 0000"
                  className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white focus:outline-none focus:border-[#D50000]"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-neutral-400 mb-1">
                  Account Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as any }))}
                  className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white focus:outline-none focus:border-[#D50000]"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-5"
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
