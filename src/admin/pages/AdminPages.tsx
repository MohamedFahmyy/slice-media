import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Edit3,
  CheckCircle,
  Clock,
  ExternalLink,
  RefreshCw,
  Eye,
  Sliders,
} from 'lucide-react';
import type { Page } from '../../types/api';
import { api } from '../../services/api';
import { useAdmin } from '../AdminContext';

interface AdminPagesProps {
  onNavigate: (tab: string, param?: string | number) => void;
}

export const AdminPages: React.FC<AdminPagesProps> = ({ onNavigate }) => {
  const { hasPermission, showToast } = useAdmin();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPage, setNewPage] = useState({
    slug: '',
    title_en: '',
    title_ar: '',
    meta_description_en: '',
    meta_description_ar: '',
  });
  const [creating, setCreating] = useState(false);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const data = await api.getPages();
      setPages(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch pages', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const created = await api.createPage(newPage);
      setPages((prev) => [...prev, created]);
      setShowCreateModal(false);
      showToast(`Page "${created.slug}" created successfully.`);
      onNavigate('page-builder', created.id);
    } catch (err: any) {
      showToast(err.message || 'Failed to create page', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleTogglePublish = async (page: Page) => {
    try {
      if (page.is_published) {
        await api.unpublishPage(page.id);
        showToast(`Page "${page.slug}" is now draft.`);
      } else {
        await api.publishPage(page.id);
        showToast(`Page "${page.slug}" published live!`);
      }
      fetchPages();
    } catch (err: any) {
      showToast(err.message || 'Failed to update publication status', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-[#FF3333] mb-1">
            Visual Content Management System
          </div>
          <h1 className="font-headline text-2xl sm:text-3xl text-white tracking-tight">
            CMS Pages & Sections
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Build, edit, reorder, preview, and publish website landing pages
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasPermission('pages.create') && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Page</span>
            </button>
          )}

          <button
            onClick={fetchPages}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#D50000]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page) => {
          const enTranslation = page.translations?.find((t) => t.locale === 'en');
          const arTranslation = page.translations?.find((t) => t.locale === 'ar');

          return (
            <div
              key={page.id}
              className="p-6 rounded-3xl bg-[#0F0F0F] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between group shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-[#FF3333] bg-[#D50000]/10 border border-[#D50000]/30 px-2.5 py-1 rounded-lg">
                    /{page.slug}
                  </span>

                  <span
                    className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-full border font-bold ${
                      page.is_published
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {page.is_published ? 'LIVE PUBLISHED' : 'DRAFT'}
                  </span>
                </div>

                <h3 className="font-headline text-xl text-white group-hover:text-[#FF3333] transition-colors leading-tight mb-1">
                  {enTranslation?.title || `Page /${page.slug}`}
                </h3>
                {arTranslation && (
                  <p className="text-xs text-neutral-400 font-ar mb-4 truncate" dir="rtl">
                    {arTranslation.title}
                  </p>
                )}

                <div className="space-y-1.5 text-xs text-neutral-400 pt-3 border-t border-white/5">
                  <div className="flex justify-between">
                    <span>Configured Sections:</span>
                    <span className="font-mono text-white font-bold">{page.sections_count || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Editor:</span>
                    <span className="text-neutral-300">{page.lastEditor?.name || 'Administrator'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Updated:</span>
                    <span className="font-mono text-[11px] text-neutral-400">
                      {new Date(page.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between gap-2">
                <button
                  onClick={() => onNavigate('page-builder', page.id)}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#D50000] hover:bg-[#b00000] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(213,0,0,0.3)]"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Visual Builder</span>
                </button>

                {hasPermission('pages.publish') && (
                  <button
                    onClick={() => handleTogglePublish(page)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 text-xs font-semibold transition-colors"
                    title={page.is_published ? 'Unpublish to draft' : 'Publish live'}
                  >
                    {page.is_published ? (
                      <Clock className="w-4 h-4 text-amber-400" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    )}
                  </button>
                )}

                <button
                  onClick={() => onNavigate('public')}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 text-xs font-semibold transition-colors"
                  title="View on site"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Page Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0F0F0F] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl animate-scale-up">
            <h3 className="font-headline text-xl text-white mb-2">Create New Landing Page</h3>
            <p className="text-xs text-neutral-400 mb-6">
              Create a database-backed page with bilingual metadata and visual section builder.
            </p>

            <form onSubmit={handleCreatePage} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-300 mb-1">
                  URL Slug (e.g. `services-landing` or `creator-summit`)
                </label>
                <div className="flex items-center rounded-xl bg-[#141414] border border-white/10 px-3">
                  <span className="text-xs text-neutral-500 font-mono">/</span>
                  <input
                    type="text"
                    required
                    value={newPage.slug}
                    onChange={(e) =>
                      setNewPage((prev) => ({
                        ...prev,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''),
                      }))
                    }
                    placeholder="custom-campaign"
                    className="w-full bg-transparent p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-300 mb-1">
                  Page Title (English)
                </label>
                <input
                  type="text"
                  required
                  value={newPage.title_en}
                  onChange={(e) => setNewPage((prev) => ({ ...prev, title_en: e.target.value }))}
                  placeholder="SLICE — Summer Creator Campaign"
                  className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D50000]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-300 mb-1">
                  Page Title (Arabic)
                </label>
                <input
                  type="text"
                  required
                  dir="rtl"
                  value={newPage.title_ar}
                  onChange={(e) => setNewPage((prev) => ({ ...prev, title_ar: e.target.value }))}
                  placeholder="سلايس — حملة صناع المحتوى الصيفية"
                  className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D50000] font-ar"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-neutral-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 rounded-xl bg-[#D50000] hover:bg-[#b00000] text-xs text-white font-bold disabled:opacity-50"
                >
                  {creating ? 'Creating Page...' : 'Create & Open Builder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
