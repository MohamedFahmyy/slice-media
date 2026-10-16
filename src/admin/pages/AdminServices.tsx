import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Eye,
  EyeOff,
  RefreshCw,
  X,
  Layers,
} from 'lucide-react';
import type { Service } from '../../types/api';
import { api } from '../../services/api';
import { useAdmin } from '../AdminContext';

export const AdminServices: React.FC = () => {
  const { hasPermission, showToast } = useAdmin();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'en' | 'ar'>('en');

  // Form State
  const [form, setForm] = useState({
    slug: '',
    title_en: '',
    title_ar: '',
    description_en: '',
    description_ar: '',
    duration_en: '',
    duration_ar: '',
    deliverables_text: '',
    is_visible: true,
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminServices();
      setServices(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch services', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setForm({
      slug: '',
      title_en: '',
      title_ar: '',
      description_en: '',
      description_ar: '',
      duration_en: 'Monthly / Continuous',
      duration_ar: 'شهرياً / مستمر',
      deliverables_text: '',
      is_visible: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (s: Service) => {
    setEditingService(s);
    const en = s.translations?.find((t) => t.locale === 'en');
    const ar = s.translations?.find((t) => t.locale === 'ar');

    setForm({
      slug: s.slug,
      title_en: en?.title || '',
      title_ar: ar?.title || '',
      description_en: en?.description || '',
      description_ar: ar?.description || '',
      duration_en: s.duration_en || '',
      duration_ar: s.duration_ar || '',
      deliverables_text: Array.isArray(s.deliverables) ? s.deliverables.join('\n') : '',
      is_visible: s.is_visible,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const deliverables = form.deliverables_text
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);

    const payload = {
      slug: form.slug,
      title_en: form.title_en,
      title_ar: form.title_ar,
      description_en: form.description_en,
      description_ar: form.description_ar,
      duration_en: form.duration_en,
      duration_ar: form.duration_ar,
      deliverables,
      is_visible: form.is_visible,
    };

    try {
      if (editingService) {
        await api.updateService(editingService.id, payload);
        showToast('Service updated successfully.');
      } else {
        await api.createService(payload);
        showToast('New service created.');
      }
      setIsModalOpen(false);
      fetchServices();
    } catch (err: any) {
      showToast(err.message || 'Failed to save service', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this service? Public website references will be updated.')) return;
    try {
      await api.deleteService(id);
      showToast('Service removed.');
      fetchServices();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete service', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-[#FF3333] mb-1">
            Commercial Offerings
          </div>
          <h1 className="font-headline text-2xl sm:text-3xl text-white tracking-tight">
            Agency Services Management
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Configure strategic services, deliverables, and timelines in English & Arabic
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openCreateModal}
            className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Service</span>
          </button>

          <button
            onClick={fetchServices}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#D50000]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service, idx) => {
          const en = service.translations?.find((t) => t.locale === 'en');
          const ar = service.translations?.find((t) => t.locale === 'ar');

          return (
            <div
              key={service.id}
              className="p-6 rounded-3xl bg-[#0F0F0F] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-[#FF3333] bg-[#D50000]/10 border border-[#D50000]/30 px-2.5 py-1 rounded-lg">
                    0{idx + 1} // {service.slug}
                  </span>

                  <span
                    className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-full border font-bold ${
                      service.is_visible
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-neutral-800 text-neutral-500 border-white/5'
                    }`}
                  >
                    {service.is_visible ? 'VISIBLE' : 'HIDDEN'}
                  </span>
                </div>

                <h3 className="font-headline text-xl text-white mb-1">
                  {en?.title || service.slug}
                </h3>
                {ar?.title && (
                  <p className="text-xs text-neutral-400 font-ar mb-3" dir="rtl">
                    {ar.title}
                  </p>
                )}

                <p className="text-xs text-neutral-300 leading-relaxed line-clamp-3 mb-4">
                  {en?.description}
                </p>

                {service.deliverables && (
                  <div className="space-y-1 pt-3 border-t border-white/5">
                    <span className="text-[10px] font-mono uppercase text-neutral-500 block mb-1">
                      Deliverables ({service.deliverables.length})
                    </span>
                    {service.deliverables.slice(0, 3).map((d, i) => (
                      <div key={i} className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-[#D50000]" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(service)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Service</span>
                </button>

                <button
                  onClick={() => handleDelete(service.id)}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-neutral-500 hover:text-red-400 transition-colors"
                  title="Delete Service"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0F0F0F] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline text-xl text-white">
                {editingService ? 'Edit Strategic Service' : 'Add New Strategic Service'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Language Switch Tabs */}
            <div className="flex items-center gap-2 mb-6 p-1 rounded-xl bg-[#141414] border border-white/10 w-fit">
              <button
                type="button"
                onClick={() => setActiveTab('en')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                  activeTab === 'en' ? 'bg-[#D50000] text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                English Fields
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ar')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors font-ar ${
                  activeTab === 'ar' ? 'bg-[#D50000] text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                البيانات بالعربية
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-mono uppercase text-neutral-400 mb-1">
                  Unique Slug Identifier
                </label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''),
                    }))
                  }
                  placeholder="viral-short-content"
                  className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white focus:outline-none focus:border-[#D50000]"
                />
              </div>

              {activeTab === 'en' ? (
                <>
                  <div>
                    <label className="block font-mono uppercase text-neutral-400 mb-1">
                      Service Title (EN)
                    </label>
                    <input
                      type="text"
                      required
                      value={form.title_en}
                      onChange={(e) => setForm((p) => ({ ...p, title_en: e.target.value }))}
                      placeholder="Viral Content Creation & Video Formats"
                      className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white focus:outline-none focus:border-[#D50000]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-neutral-400 mb-1">
                      Description & Hook (EN)
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={form.description_en}
                      onChange={(e) => setForm((p) => ({ ...p, description_en: e.target.value }))}
                      className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white focus:outline-none focus:border-[#D50000] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-neutral-400 mb-1">
                      Estimated Duration (EN)
                    </label>
                    <input
                      type="text"
                      value={form.duration_en}
                      onChange={(e) => setForm((p) => ({ ...p, duration_en: e.target.value }))}
                      placeholder="Monthly Retainer"
                      className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white focus:outline-none focus:border-[#D50000]"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block font-mono uppercase text-neutral-400 mb-1">
                      عنوان الخدمة (بالعربية)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      required
                      value={form.title_ar}
                      onChange={(e) => setForm((p) => ({ ...p, title_ar: e.target.value }))}
                      className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white font-ar text-right focus:outline-none focus:border-[#D50000]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-neutral-400 mb-1">
                      الوصف التسويقي (بالعربية)
                    </label>
                    <textarea
                      rows={3}
                      dir="rtl"
                      required
                      value={form.description_ar}
                      onChange={(e) => setForm((p) => ({ ...p, description_ar: e.target.value }))}
                      className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white font-ar text-right focus:outline-none focus:border-[#D50000] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-neutral-400 mb-1">
                      مدة التنفيذ (بالعربية)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={form.duration_ar}
                      onChange={(e) => setForm((p) => ({ ...p, duration_ar: e.target.value }))}
                      placeholder="مستمر / شهرياً"
                      className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white font-ar text-right focus:outline-none focus:border-[#D50000]"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block font-mono uppercase text-neutral-400 mb-1">
                  Deliverables (One per line)
                </label>
                <textarea
                  rows={4}
                  value={form.deliverables_text}
                  onChange={(e) => setForm((p) => ({ ...p, deliverables_text: e.target.value }))}
                  placeholder="Scriptwriting&#10;Cinematic 4K Filming&#10;Fast-Paced Sound Design"
                  className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white focus:outline-none focus:border-[#D50000] font-mono resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_visible"
                  checked={form.is_visible}
                  onChange={(e) => setForm((p) => ({ ...p, is_visible: e.target.checked }))}
                  className="rounded border-white/20 text-[#D50000] focus:ring-[#D50000]"
                />
                <label htmlFor="is_visible" className="text-neutral-300 font-semibold cursor-pointer">
                  Visible on public website
                </label>
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
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
