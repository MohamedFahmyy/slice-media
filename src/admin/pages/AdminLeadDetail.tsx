import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building,
  DollarSign,
  Send,
  MessageSquare,
  Activity,
  MessageCircle,
} from 'lucide-react';
import type { Lead, LeadPriority, LeadStatus, User } from '../../types/api';
import { api } from '../../services/api';
import { useAdmin } from '../AdminContext';

interface AdminLeadDetailProps {
  leadId: number;
  onBack: () => void;
}

export const AdminLeadDetail: React.FC<AdminLeadDetailProps> = ({ leadId, onBack }) => {
  const { hasPermission, showToast } = useAdmin();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [staffUsers, setStaffUsers] = useState<User[]>([]);
  const [newNote, setNewNote] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);
  const [dealValue, setDealValue] = useState<string>('');

  const fetchLead = async () => {
    setLoading(true);
    try {
      const data = await api.getLead(leadId);
      setLead(data);
      setDealValue(data.estimated_deal_value ? String(data.estimated_deal_value) : '');
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch lead details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLead();
    if (hasPermission('leads.assign')) {
      api.getUsers().then(setStaffUsers).catch(() => {});
    }
  }, [leadId]);

  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (!lead) return;
    try {
      const updated = await api.updateLead(lead.id, { status: newStatus });
      setLead(updated);
      showToast(`Status changed to ${newStatus.toUpperCase()}`);
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handlePriorityChange = async (newPriority: LeadPriority) => {
    if (!lead) return;
    try {
      const updated = await api.updateLead(lead.id, { priority: newPriority });
      setLead(updated);
      showToast(`Priority changed to ${newPriority.toUpperCase()}`);
    } catch (err: any) {
      showToast(err.message || 'Failed to update priority', 'error');
    }
  };

  const handleAssignChange = async (userId: string) => {
    if (!lead) return;
    try {
      const agentId = userId ? parseInt(userId, 10) : null;
      const updated = await api.assignLead(lead.id, agentId);
      setLead(updated);
      showToast('Lead assignment updated.');
    } catch (err: any) {
      showToast(err.message || 'Failed to assign lead', 'error');
    }
  };

  const handleSaveDealValue = async () => {
    if (!lead) return;
    try {
      const value = dealValue ? parseFloat(dealValue) : 0;
      const updated = await api.updateLead(lead.id, { estimated_deal_value: value });
      setLead(updated);
      showToast('Deal value updated.');
    } catch (err: any) {
      showToast(err.message || 'Failed to update deal value', 'error');
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !lead) return;

    setSubmittingNote(true);
    try {
      const note = await api.addLeadNote(lead.id, newNote.trim());
      setLead((prev) => (prev ? { ...prev, notes: [note, ...(prev.notes || [])] } : prev));
      setNewNote('');
      showToast('Internal note saved.');
    } catch (err: any) {
      showToast(err.message || 'Failed to save note', 'error');
    } finally {
      setSubmittingNote(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-neutral-400 font-mono text-sm">
        Loading strategic inquiry details...
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300">
        <h3 className="font-bold text-base mb-1">Lead Not Found</h3>
        <p className="text-xs">The requested lead ID does not exist or you lack access permission.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-bold">
          Back to Leads
        </button>
      </div>
    );
  }

  const cleanPhone = lead.phone ? lead.phone.replace(/[^0-9]/g, '') : '';

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Top Header / Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Leads</span>
        </button>

        <div className="flex items-center gap-2">
          {cleanPhone && (
            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                `Hello ${lead.full_name}, thank you for reaching out to Slice Marketing Agency regarding your project brief (${lead.reference_code}).`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Open WhatsApp</span>
            </a>
          )}

          <a
            href={`mailto:${lead.email}?subject=Slice%20Marketing%20Agency%20//%20Strategic%20Brief%20${lead.reference_code}`}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 text-xs font-bold transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Send Email</span>
          </a>
        </div>
      </div>

      {/* Main Banner Card */}
      <div className="p-6 rounded-3xl bg-[#0F0F0F] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold text-white bg-[#D50000] px-2.5 py-0.5 rounded-md">
                {lead.reference_code}
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                Captured {new Date(lead.created_at).toLocaleString()}
              </span>
            </div>

            <h1 className="font-headline text-3xl sm:text-4xl text-white tracking-tight">
              {lead.full_name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-neutral-300">
              {lead.company && (
                <span className="flex items-center gap-1.5 font-medium text-white">
                  <Building className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{lead.company}</span>
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-neutral-500" />
                <span>{lead.email}</span>
              </span>
              {lead.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{lead.phone}</span>
                </span>
              )}
            </div>
          </div>

          {/* Quick Actions (Status & Priority) */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono uppercase text-neutral-400">Pipeline Status</span>
              <select
                value={lead.status}
                onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
                className="px-3 py-2 rounded-xl bg-[#141414] border border-white/15 text-xs font-bold text-white focus:outline-none focus:border-[#D50000]"
              >
                <option value="new">NEW INQUIRY</option>
                <option value="contacted">CONTACTED</option>
                <option value="qualified">QUALIFIED</option>
                <option value="proposal_sent">PROPOSAL SENT</option>
                <option value="negotiation">NEGOTIATION</option>
                <option value="won">WON CONTRACT</option>
                <option value="lost">LOST</option>
                <option value="archived">ARCHIVED</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono uppercase text-neutral-400">Lead Priority</span>
              <select
                value={lead.priority}
                onChange={(e) => handlePriorityChange(e.target.value as LeadPriority)}
                className="px-3 py-2 rounded-xl bg-[#141414] border border-white/15 text-xs font-bold text-white focus:outline-none focus:border-[#D50000]"
              >
                <option value="urgent">URGENT</option>
                <option value="high">HIGH</option>
                <option value="medium">MEDIUM</option>
                <option value="low">LOW</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Details & Commercials | Notes & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Brief, Attribution, Deal Value, Assignment */}
        <div className="space-y-6">
          {/* Commercials & Assignment */}
          <div className="p-6 rounded-2xl bg-[#0F0F0F] border border-white/10 space-y-4">
            <h3 className="font-headline text-base text-white">Commercial Deal Value</h3>
            
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase text-neutral-400">
                Estimated Contract Value ($)
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <DollarSign className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    value={dealValue}
                    onChange={(e) => setDealValue(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#141414] border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-[#D50000]"
                  />
                </div>
                <button
                  onClick={handleSaveDealValue}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
                >
                  Save
                </button>
              </div>
            </div>

            {hasPermission('leads.assign') && (
              <div className="space-y-2 pt-2 border-t border-white/5">
                <label className="text-[11px] font-mono uppercase text-neutral-400">
                  Assigned Sales Strategist
                </label>
                <select
                  value={lead.assigned_to || ''}
                  onChange={(e) => handleAssignChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#141414] border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-[#D50000]"
                >
                  <option value="">Unassigned</option>
                  {staffUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role?.name || 'Staff'})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Project Brief */}
          <div className="p-6 rounded-2xl bg-[#0F0F0F] border border-white/10 space-y-4">
            <h3 className="font-headline text-base text-white">Client Project Brief</h3>
            
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-neutral-500 block mb-0.5">
                  Requested Service
                </span>
                <span className="text-xs font-semibold text-white">
                  {lead.requested_service || 'General Inquiry'}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-neutral-500 block mb-0.5">
                  Budget Expectation
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {lead.budget_range || 'Not specified'}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-neutral-500 block mb-0.5">
                  Brief Description
                </span>
                <div className="text-xs text-neutral-200 leading-relaxed bg-[#141414] p-3.5 rounded-xl border border-white/5 whitespace-pre-wrap">
                  {lead.project_description || 'No detailed brief provided.'}
                </div>
              </div>
            </div>
          </div>

          {/* Marketing Attribution */}
          <div className="p-6 rounded-2xl bg-[#0F0F0F] border border-white/10 space-y-3 text-xs">
            <h3 className="font-headline text-base text-white mb-2">Campaign Attribution</h3>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-neutral-500">Source:</span>
              <span className="font-mono text-white">{lead.source}</span>
            </div>
            {lead.utm_source && (
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-neutral-500">UTM Source:</span>
                <span className="font-mono text-[#FF3333]">{lead.utm_source}</span>
              </div>
            )}
            {lead.utm_campaign && (
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-neutral-500">UTM Campaign:</span>
                <span className="font-mono text-white">{lead.utm_campaign}</span>
              </div>
            )}
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-neutral-500">Preferred Language:</span>
              <span className="font-mono text-white uppercase">{lead.preferred_language}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-500">IP Location:</span>
              <span className="font-mono text-neutral-400">{lead.ip_address || 'Unknown'}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Internal Notes & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Internal Notes Section */}
          <div className="p-6 rounded-2xl bg-[#0F0F0F] border border-white/10 space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#D50000]" />
              <h3 className="font-headline text-base text-white">Internal Team Notes</h3>
            </div>

            {/* Note Input */}
            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
                placeholder="Log call summary, client requirements, proposal draft links, or next steps..."
                className="w-full p-3.5 rounded-xl bg-[#141414] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D50000] resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingNote || !newNote.trim()}
                  className="px-4 py-2 rounded-xl bg-[#D50000] hover:bg-[#b00000] text-white text-xs font-bold disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingNote ? 'Saving...' : 'Add Note'}</span>
                </button>
              </div>
            </form>

            {/* Notes List */}
            <div className="space-y-3 pt-2">
              {lead.notes && lead.notes.length > 0 ? (
                lead.notes.map((note) => (
                  <div key={note.id} className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400">
                      <span className="font-bold text-white">{note.author?.name || 'Staff'}</span>
                      <span className="font-mono text-[10px]">{new Date(note.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-neutral-200 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                  </div>
                ))
              ) : (
                <div className="text-xs text-neutral-500 font-mono py-4 text-center">
                  No internal notes recorded yet.
                </div>
              )}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="p-6 rounded-2xl bg-[#0F0F0F] border border-white/10 space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-neutral-400" />
              <h3 className="font-headline text-base text-white">Activity History</h3>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
              {lead.activities && lead.activities.length > 0 ? (
                lead.activities.map((act) => (
                  <div key={act.id} className="relative text-xs">
                    <div className="absolute -left-[27px] top-0.5 w-3 h-3 rounded-full bg-[#D50000] border-2 border-[#0F0F0F]" />
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-0.5">
                      <span className="font-semibold text-white capitalize">{act.action_type.replace('_', ' ')}</span>
                      <span className="font-mono text-[10px]">{new Date(act.created_at).toLocaleString()}</span>
                    </div>
                    <div className="text-neutral-300">{act.description}</div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-neutral-500 font-mono py-2">
                  No timeline events recorded.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
