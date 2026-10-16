import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Star,
  RefreshCw,
  X,
  ExternalLink,
} from 'lucide-react';
import type { PortfolioProject } from '../../types/api';
import { api } from '../../services/api';
import { useAdmin } from '../AdminContext';

export const AdminPortfolio: React.FC = () => {
  const { hasPermission, showToast } = useAdmin();
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);
  const [activeTab, setActiveTab] = useState<'en' | 'ar'>('en');

  const [form, setForm] = useState({
    slug: '',
    client_name: '',
    industry: '',
    featured_image: '',
    is_featured: false,
    title_en: '',
    title_ar: '',
    summary_en: '',
    summary_ar: '',
    challenge_en: '',
    challenge_ar: '',
    strategy_en: '',
    strategy_ar: '',
    execution_en: '',
    execution_ar: '',
    outcomes_en: '',
    outcomes_ar: '',
  });

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminPortfolio();
      setProjects(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch portfolio projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const openCreateModal = () => {
    setEditingProject(null);
    setForm({
      slug: '',
      client_name: '',
      industry: '',
      featured_image: '/assets/project-streetwear.jpg',
      is_featured: true,
      title_en: '',
      title_ar: '',
      summary_en: '',
      summary_ar: '',
      challenge_en: '',
      challenge_ar: '',
      strategy_en: '',
      strategy_ar: '',
      execution_en: '',
      execution_ar: '',
      outcomes_en: '',
      outcomes_ar: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: PortfolioProject) => {
    setEditingProject(p);
    const en = p.translations?.find((t) => t.locale === 'en');
    const ar = p.translations?.find((t) => t.locale === 'ar');

    setForm({
      slug: p.slug,
      client_name: p.client_name,
      industry: p.industry || '',
      featured_image: p.featured_image || '',
      is_featured: p.is_featured,
      title_en: en?.title || '',
      title_ar: ar?.title || '',
      summary_en: en?.summary || '',
      summary_ar: ar?.summary || '',
      challenge_en: en?.challenge || '',
      challenge_ar: ar?.challenge || '',
      strategy_en: en?.strategy || '',
      strategy_ar: ar?.strategy || '',
      execution_en: en?.execution || '',
      execution_ar: ar?.execution || '',
      outcomes_en: en?.outcomes || '',
      outcomes_ar: ar?.outcomes || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await api.updatePortfolio(editingProject.id, form);
        showToast('Portfolio case study updated.');
      } else {
        await api.createPortfolio(form);
        showToast('New case study created.');
      }
      setIsModalOpen(false);
      fetchPortfolio();
    } catch (err: any) {
      showToast(err.message || 'Failed to save case study', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this case study?')) return;
    try {
      await api.deletePortfolio(id);
      showToast('Case study deleted.');
      fetchPortfolio();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete project', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-[#FF3333] mb-1">
            Proven Track Record
          </div>
          <h1 className="font-headline text-2xl sm:text-3xl text-white tracking-tight">
            Portfolio & Case Studies
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage strategic concept cases, results, and client success stories
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openCreateModal}
            className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Case Study</span>
          </button>

          <button
            onClick={fetchPortfolio}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#D50000]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => {
          const en = p.translations?.find((t) => t.locale === 'en');
          const ar = p.translations?.find((t) => t.locale === 'ar');

          return (
            <div
              key={p.id}
              className="rounded-3xl bg-[#0F0F0F] border border-white/10 overflow-hidden shadow-xl flex flex-col justify-between group"
            >
              {p.featured_image && (
                <div className="h-44 w-full bg-neutral-900 relative overflow-hidden">
                  <img
                    src={p.featured_image}
                    alt={p.client_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-white border border-white/10 uppercase">
                    {p.industry || 'Campaign'}
                  </div>
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-[#FF3333]">
                      {p.client_name}
                    </span>
                    {p.is_featured && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-400">
                        <Star className="w-3 h-3 fill-current" />
                        <span>Featured</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-headline text-lg text-white mb-1">
                    {en?.title || p.client_name}
                  </h3>
                  {ar?.title && (
                    <p className="text-xs text-neutral-400 font-ar mb-3" dir="rtl">
                      {ar.title}
                    </p>
                  )}

                  <p className="text-xs text-neutral-300 leading-relaxed line-clamp-3 mb-4">
                    {en?.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEditModal(p)}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Case</span>
                  </button>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-neutral-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Case Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0F0F0F] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline text-xl text-white">
                {editingProject ? 'Edit Case Study' : 'Create Case Study'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2 mb-6 p-1 rounded-xl bg-[#141414] border border-white/10 w-fit">
              <button
                type="button"
                onClick={() => setActiveTab('en')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                  activeTab === 'en' ? 'bg-[#D50000] text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                English Case Study
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ar')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors font-ar ${
                  activeTab === 'ar' ? 'bg-[#D50000] text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                دراسة الحالة بالعربية
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono uppercase text-neutral-400 mb-1">
                    Client / Brand Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.client_name}
                    onChange={(e) => setForm((p) => ({ ...p, client_name: e.target.value }))}
                    placeholder="AURA // ATELIER"
                    className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white focus:outline-none focus:border-[#D50000]"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase text-neutral-400 mb-1">
                    Slug
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
                    placeholder="aura-atelier"
                    className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white focus:outline-none focus:border-[#D50000]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono uppercase text-neutral-400 mb-1">
                    Industry
                  </label>
                  <input
                    type="text"
                    value={form.industry}
                    onChange={(e) => setForm((p) => ({ ...p, industry: e.target.value }))}
                    placeholder="Luxury Streetwear"
                    className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white focus:outline-none focus:border-[#D50000]"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase text-neutral-400 mb-1">
                    Featured Image URL
                  </label>
                  <input
                    type="text"
                    value={form.featured_image}
                    onChange={(e) => setForm((p) => ({ ...p, featured_image: e.target.value }))}
                    placeholder="/assets/project-streetwear.jpg"
                    className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white focus:outline-none focus:border-[#D50000]"
                  />
                </div>
              </div>

              {activeTab === 'en' ? (
                <>
                  <div>
                    <label className="block font-mono uppercase text-neutral-400 mb-1">
                      Campaign Headline (EN)
                    </label>
                    <input
                      type="text"
                      required
                      value={form.title_en}
                      onChange={(e) => setForm((p) => ({ ...p, title_en: e.target.value }))}
                      className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white focus:outline-none focus:border-[#D50000]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-neutral-400 mb-1">
                      Summary (EN)
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={form.summary_en}
                      onChange={(e) => setForm((p) => ({ ...p, summary_en: e.target.value }))}
                      className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white focus:outline-none focus:border-[#D50000] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-neutral-400 mb-1">
                      Strategy & Execution (EN)
                    </label>
                    <textarea
                      rows={3}
                      value={form.strategy_en}
                      onChange={(e) => setForm((p) => ({ ...p, strategy_en: e.target.value }))}
                      className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white focus:outline-none focus:border-[#D50000] resize-none"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block font-mono uppercase text-neutral-400 mb-1">
                      عنوان الحملة (بالعربية)
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
                      الملخص التسويقي (بالعربية)
                    </label>
                    <textarea
                      rows={2}
                      dir="rtl"
                      required
                      value={form.summary_ar}
                      onChange={(e) => setForm((p) => ({ ...p, summary_ar: e.target.value }))}
                      className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white font-ar text-right focus:outline-none focus:border-[#D50000] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-neutral-400 mb-1">
                      الاستراتيجية والتنفيذ (بالعربية)
                    </label>
                    <textarea
                      rows={3}
                      dir="rtl"
                      value={form.strategy_ar}
                      onChange={(e) => setForm((p) => ({ ...p, strategy_ar: e.target.value }))}
                      className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white font-ar text-right focus:outline-none focus:border-[#D50000] resize-none"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={form.is_featured}
                  onChange={(e) => setForm((p) => ({ ...p, is_featured: e.target.checked }))}
                  className="rounded border-white/20 text-[#D50000] focus:ring-[#D50000]"
                />
                <label htmlFor="is_featured" className="text-neutral-300 font-semibold cursor-pointer">
                  Featured Case Study on Homepage
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
                  Save Case Study
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
