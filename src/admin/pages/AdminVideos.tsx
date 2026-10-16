import React, { useState, useEffect } from 'react';
import {
  Video as VideoIcon,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  X,
  Play,
} from 'lucide-react';
import type { Video } from '../../types/api';
import { api } from '../../services/api';
import { useAdmin } from '../AdminContext';

export const AdminVideos: React.FC = () => {
  const { hasPermission, showToast } = useAdmin();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [activeTab, setActiveTab] = useState<'en' | 'ar'>('en');

  const [form, setForm] = useState({
    provider: 'vimeo',
    provider_id: '',
    format_type: 'storytelling',
    title_en: '',
    title_ar: '',
    tagline_en: '',
    tagline_ar: '',
    badge_en: '',
    badge_ar: '',
    description_en: '',
    description_ar: '',
    order: 1,
    is_featured: true,
    is_published: true,
  });

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminVideos();
      setVideos(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch videos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const openCreateModal = () => {
    setEditingVideo(null);
    setForm({
      provider: 'vimeo',
      provider_id: '1195094508',
      format_type: 'storytelling',
      title_en: '',
      title_ar: '',
      tagline_en: '',
      tagline_ar: '',
      badge_en: '',
      badge_ar: '',
      description_en: '',
      description_ar: '',
      order: videos.length + 1,
      is_featured: true,
      is_published: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (v: Video) => {
    setEditingVideo(v);
    const en = v.translations?.find((t) => t.locale === 'en');
    const ar = v.translations?.find((t) => t.locale === 'ar');

    setForm({
      provider: v.provider,
      provider_id: v.provider_id,
      format_type: v.format_type,
      title_en: en?.title || '',
      title_ar: ar?.title || '',
      tagline_en: en?.tagline || '',
      tagline_ar: ar?.tagline || '',
      badge_en: en?.badge || '',
      badge_ar: ar?.badge || '',
      description_en: en?.description || '',
      description_ar: ar?.description || '',
      order: v.order,
      is_featured: v.is_featured,
      is_published: v.is_published,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVideo) {
        await api.updateVideo(editingVideo.id, form);
        showToast('Video format updated.');
      } else {
        await api.createVideo(form);
        showToast('New video format created.');
      }
      setIsModalOpen(false);
      fetchVideos();
    } catch (err: any) {
      showToast(err.message || 'Failed to save video', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this video from the 3D Video Strip?')) return;
    try {
      await api.deleteVideo(id);
      showToast('Video removed.');
      fetchVideos();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete video', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-[#FF3333] mb-1">
            Visual Storytelling Formats
          </div>
          <h1 className="font-headline text-2xl sm:text-3xl text-white tracking-tight">
            3D Video Strip Showcase
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage interactive 3D rotating vertical video cards, Vimeo IDs, and format psychology
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openCreateModal}
            className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Video Format</span>
          </button>

          <button
            onClick={fetchVideos}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#D50000]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {videos.map((vid, idx) => {
          const en = vid.translations?.find((t) => t.locale === 'en');
          const ar = vid.translations?.find((t) => t.locale === 'ar');

          return (
            <div
              key={vid.id}
              className="rounded-3xl bg-[#0F0F0F] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between overflow-hidden shadow-xl group"
            >
              {/* Vertical Card Preview */}
              <div className="aspect-[9/14] w-full bg-black relative overflow-hidden flex items-center justify-center border-b border-white/10">
                <iframe
                  loading="lazy"
                  src={`https://player.vimeo.com/video/${vid.provider_id}?badge=0&autopause=0&player_id=0&app_id=58479&loop=1&muted=1&title=0&byline=0&portrait=0`}
                  className="w-full h-full object-cover pointer-events-none"
                  frameBorder="0"
                  allow="autoplay; fullscreen"
                />

                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-[#FF3333] border border-white/10 font-bold uppercase">
                  {en?.badge || vid.format_type}
                </div>

                <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-neutral-400">
                  0{idx + 1}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-mono uppercase text-[#FF3333] mb-1">
                    {en?.tagline || `Format // ${vid.format_type}`}
                  </div>
                  <h3 className="font-headline text-base text-white mb-1">
                    {en?.title || `Vimeo ID ${vid.provider_id}`}
                  </h3>
                  {ar?.title && (
                    <p className="text-xs text-neutral-400 font-ar mb-2" dir="rtl">
                      {ar.title}
                    </p>
                  )}
                  <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                    {en?.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEditModal(vid)}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(vid.id)}
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

      {/* Add / Edit Video Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0F0F0F] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline text-xl text-white">
                {editingVideo ? 'Edit Video Showcase Format' : 'Add 3D Video Showcase'}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono uppercase text-neutral-400 mb-1">
                    Vimeo Embed ID
                  </label>
                  <input
                    type="text"
                    required
                    value={form.provider_id}
                    onChange={(e) => setForm((p) => ({ ...p, provider_id: e.target.value }))}
                    placeholder="1195094508"
                    className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white font-mono focus:outline-none focus:border-[#D50000]"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase text-neutral-400 mb-1">
                    Format Identifier
                  </label>
                  <select
                    value={form.format_type}
                    onChange={(e) => setForm((p) => ({ ...p, format_type: e.target.value }))}
                    className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white focus:outline-none focus:border-[#D50000]"
                  >
                    <option value="storytelling">Storytelling</option>
                    <option value="skits">Skits</option>
                    <option value="voxpop">Voxpop</option>
                    <option value="ugc">UGC</option>
                    <option value="custom">Custom Format</option>
                  </select>
                </div>
              </div>

              {activeTab === 'en' ? (
                <>
                  <div>
                    <label className="block font-mono uppercase text-neutral-400 mb-1">
                      Badge Label (EN)
                    </label>
                    <input
                      type="text"
                      value={form.badge_en}
                      onChange={(e) => setForm((p) => ({ ...p, badge_en: e.target.value }))}
                      placeholder="Storytelling"
                      className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white focus:outline-none focus:border-[#D50000]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-neutral-400 mb-1">
                      Format Title (EN)
                    </label>
                    <input
                      type="text"
                      required
                      value={form.title_en}
                      onChange={(e) => setForm((p) => ({ ...p, title_en: e.target.value }))}
                      placeholder="Narrative Brand Storytelling"
                      className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white focus:outline-none focus:border-[#D50000]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-neutral-400 mb-1">
                      Tagline / Category (EN)
                    </label>
                    <input
                      type="text"
                      value={form.tagline_en}
                      onChange={(e) => setForm((p) => ({ ...p, tagline_en: e.target.value }))}
                      placeholder="Brand Lore // Cinematic Shorts"
                      className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white focus:outline-none focus:border-[#D50000]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-neutral-400 mb-1">
                      Psychology & Strategy Description (EN)
                    </label>
                    <textarea
                      rows={3}
                      value={form.description_en}
                      onChange={(e) => setForm((p) => ({ ...p, description_en: e.target.value }))}
                      className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white focus:outline-none focus:border-[#D50000] resize-none"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block font-mono uppercase text-neutral-400 mb-1">
                      الشارة (بالعربية)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={form.badge_ar}
                      onChange={(e) => setForm((p) => ({ ...p, badge_ar: e.target.value }))}
                      placeholder="ستوريتلينج"
                      className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white font-ar text-right focus:outline-none focus:border-[#D50000]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-neutral-400 mb-1">
                      عنوان الفورمات (بالعربية)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      required
                      value={form.title_ar}
                      onChange={(e) => setForm((p) => ({ ...p, title_ar: e.target.value }))}
                      placeholder="السرد القصصي السريع والمشوق"
                      className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white font-ar text-right focus:outline-none focus:border-[#D50000]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-neutral-400 mb-1">
                      الشعار الفرعي (بالعربية)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={form.tagline_ar}
                      onChange={(e) => setForm((p) => ({ ...p, tagline_ar: e.target.value }))}
                      placeholder="قصة البراند // سينما سريعة"
                      className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white font-ar text-right focus:outline-none focus:border-[#D50000]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-neutral-400 mb-1">
                      شرح سيكولوجية الفورمات (بالعربية)
                    </label>
                    <textarea
                      rows={3}
                      dir="rtl"
                      value={form.description_ar}
                      onChange={(e) => setForm((p) => ({ ...p, description_ar: e.target.value }))}
                      className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white font-ar text-right focus:outline-none focus:border-[#D50000] resize-none"
                    />
                  </div>
                </>
              )}

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
                  Save Video Format
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
