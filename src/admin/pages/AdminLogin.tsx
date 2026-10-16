import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { useAdmin } from '../AdminContext';
import { api } from '../../services/api';

interface AdminLoginProps {
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToSite }) => {
  const { login, showToast } = useAdmin();
  const [email, setEmail] = useState('superadmin@slicemedia.agency');
  const [password, setPassword] = useState('SliceAdmin#2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const demoAccounts = [
    {
      role: 'Super Admin',
      email: 'superadmin@slicemedia.agency',
      pass: 'SliceAdmin#2026!',
      color: 'bg-red-500/10 text-red-400 border-red-500/30',
    },
    {
      role: 'Content Manager',
      email: 'content@slicemedia.agency',
      pass: 'SliceContent#2026!',
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    },
    {
      role: 'Sales Manager',
      email: 'sales.mgr@slicemedia.agency',
      pass: 'SliceSales#2026!',
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    },
    {
      role: 'Sales Agent',
      email: 'agent.omar@slicemedia.agency',
      pass: 'SliceAgent#2026!',
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.login({ email, password });
      login(response.token, response.user);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials or staff account status.');
      showToast(err.message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#D50000]/15 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-grid-subtle opacity-20 pointer-events-none" />

      {/* Top back button */}
      <button
        onClick={onBackToSite}
        className="absolute top-6 left-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Live Website</span>
      </button>

      {/* Login Box */}
      <div className="w-full max-w-md bg-[#0D0D0D] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#D50000] text-white font-black text-2xl shadow-[0_0_25px_rgba(213,0,0,0.5)] mb-4">
            S
          </div>
          <h1 className="font-headline text-2xl sm:text-3xl text-white tracking-tight">
            SLICE ADMINISTRATION
          </h1>
          <p className="text-xs text-neutral-400 mt-1 font-mono uppercase tracking-wider">
            Secure CMS, Visual Builder & Lead CRM
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
              Staff Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@slicemedia.agency"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141414] border border-white/10 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-[#D50000] focus:ring-1 focus:ring-[#D50000] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141414] border border-white/10 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-[#D50000] focus:ring-1 focus:ring-[#D50000] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-[#D50000] hover:bg-[#b00000] text-white font-bold text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(213,0,0,0.35)] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating with Laravel...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Account Switcher */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
            <span>Switch Role (Test Accounts):</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.role}
                type="button"
                onClick={() => {
                  setEmail(acc.email);
                  setPassword(acc.pass);
                }}
                className={`p-2 rounded-lg border text-left text-[11px] transition-colors ${acc.color}`}
              >
                <div className="font-bold">{acc.role}</div>
                <div className="text-[9px] opacity-75 font-mono truncate">{acc.email}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
