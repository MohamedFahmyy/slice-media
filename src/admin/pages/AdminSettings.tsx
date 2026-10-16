import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  RefreshCw,
  Palette,
  MapPin,
  Share2,
  Globe,
} from 'lucide-react';
import { api } from '../../services/api';
import { useAdmin } from '../AdminContext';

export const AdminSettings: React.FC = () => {
  const { hasPermission, showToast } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [branding, setBranding] = useState({
    agency_name: '',
    tagline_en: '',
    tagline_ar: '',
    primary_color: '#D50000',
    background_color: '#050505',
    logo_white_url: '/assets/slice-logo-full.png',
    logo_dark_url: '/assets/slice-logo.png',
  });

  const [contact, setContact] = useState({
    email: '',
    phone: '',
    whatsapp: '',
    cairo_office: '',
    dubai_office: '',
    riyadh_office: '',
  });

  const [social, setSocial] = useState({
    instagram: '',
    tiktok: '',
    linkedin: '',
    youtube: '',
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await api.getSettings();
      if (data.settings?.branding) setBranding(data.settings.branding);
      if (data.settings?.contact_info) setContact(data.settings.contact_info);
      if (data.settings?.social_links) setSocial(data.settings.social_links);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateSettings({
        branding,
        contact_info: contact,
        social_links: social,
      });
      showToast('Settings saved successfully.');
    } catch (err: any) {
      showToast(err.message || 'Failed to update settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-neutral-400 font-mono text-xs">
        Loading site settings...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-[#FF3333] mb-1">
            Global Configuration
          </div>
          <h1 className="font-headline text-2xl sm:text-3xl text-white tracking-tight">
            Site & Brand Settings
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage agency branding tokens, contact hubs, social profiles, and SEO metadata
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary text-xs py-2 px-5 inline-flex items-center gap-2 self-start sm:self-auto disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Branding & Visual Identity */}
        <div className="p-6 rounded-3xl bg-[#0F0F0F] border border-white/10 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/5">
            <Palette className="w-4 h-4 text-[#D50000]" />
            <h3 className="font-headline text-base text-white">Visual Brand Tokens & Logos</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono uppercase text-neutral-400 mb-1">
                Agency Name
              </label>
              <input
                type="text"
                value={branding.agency_name}
                onChange={(e) => setBranding((p) => ({ ...p, agency_name: e.target.value }))}
                className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white focus:outline-none focus:border-[#D50000]"
              />
            </div>

            <div>
              <label className="block font-mono uppercase text-neutral-400 mb-1">
                Primary Brand Color (Hex)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={branding.primary_color}
                  onChange={(e) => setBranding((p) => ({ ...p, primary_color: e.target.value }))}
                  className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={branding.primary_color}
                  onChange={(e) => setBranding((p) => ({ ...p, primary_color: e.target.value }))}
                  className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white font-mono focus:outline-none focus:border-[#D50000]"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono uppercase text-neutral-400 mb-1">
                Tagline (English)
              </label>
              <input
                type="text"
                value={branding.tagline_en}
                onChange={(e) => setBranding((p) => ({ ...p, tagline_en: e.target.value }))}
                className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white focus:outline-none focus:border-[#D50000]"
              />
            </div>

            <div>
              <label className="block font-mono uppercase text-neutral-400 mb-1">
                الشعار اللفظي (بالعربية)
              </label>
              <input
                type="text"
                dir="rtl"
                value={branding.tagline_ar}
                onChange={(e) => setBranding((p) => ({ ...p, tagline_ar: e.target.value }))}
                className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white font-ar text-right focus:outline-none focus:border-[#D50000]"
              />
            </div>

            <div>
              <label className="block font-mono uppercase text-neutral-400 mb-1">
                Logo URL (Light on Dark)
              </label>
              <input
                type="text"
                value={branding.logo_white_url}
                onChange={(e) => setBranding((p) => ({ ...p, logo_white_url: e.target.value }))}
                className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white focus:outline-none focus:border-[#D50000]"
              />
            </div>

            <div>
              <label className="block font-mono uppercase text-neutral-400 mb-1">
                Logo URL (Dark on Light)
              </label>
              <input
                type="text"
                value={branding.logo_dark_url}
                onChange={(e) => setBranding((p) => ({ ...p, logo_dark_url: e.target.value }))}
                className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white focus:outline-none focus:border-[#D50000]"
              />
            </div>
          </div>
        </div>

        {/* Agency Desks & Contact Hubs */}
        <div className="p-6 rounded-3xl bg-[#0F0F0F] border border-white/10 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/5">
            <MapPin className="w-4 h-4 text-[#D50000]" />
            <h3 className="font-headline text-base text-white">Agency Desks & Regional Contact Hubs</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono uppercase text-neutral-400 mb-1">
                Partnership Email
              </label>
              <input
                type="email"
                value={contact.email}
                onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))}
                className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white focus:outline-none focus:border-[#D50000]"
              />
            </div>

            <div>
              <label className="block font-mono uppercase text-neutral-400 mb-1">
                Direct Phone
              </label>
              <input
                type="text"
                value={contact.phone}
                onChange={(e) => setContact((p) => ({ ...p, phone: e.target.value }))}
                className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white focus:outline-none focus:border-[#D50000]"
              />
            </div>

            <div>
              <label className="block font-mono uppercase text-neutral-400 mb-1">
                WhatsApp Hotline Number
              </label>
              <input
                type="text"
                value={contact.whatsapp}
                onChange={(e) => setContact((p) => ({ ...p, whatsapp: e.target.value }))}
                placeholder="+201000000000"
                className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white focus:outline-none focus:border-[#D50000]"
              />
            </div>

            <div>
              <label className="block font-mono uppercase text-neutral-400 mb-1">
                Cairo Hub Location
              </label>
              <input
                type="text"
                value={contact.cairo_office}
                onChange={(e) => setContact((p) => ({ ...p, cairo_office: e.target.value }))}
                className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white focus:outline-none focus:border-[#D50000]"
              />
            </div>

            <div>
              <label className="block font-mono uppercase text-neutral-400 mb-1">
                Dubai Media City Desk
              </label>
              <input
                type="text"
                value={contact.dubai_office}
                onChange={(e) => setContact((p) => ({ ...p, dubai_office: e.target.value }))}
                className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white focus:outline-none focus:border-[#D50000]"
              />
            </div>

            <div>
              <label className="block font-mono uppercase text-neutral-400 mb-1">
                Riyadh Desk
              </label>
              <input
                type="text"
                value={contact.riyadh_office}
                onChange={(e) => setContact((p) => ({ ...p, riyadh_office: e.target.value }))}
                className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white focus:outline-none focus:border-[#D50000]"
              />
            </div>
          </div>
        </div>

        {/* Social Profiles */}
        <div className="p-6 rounded-3xl bg-[#0F0F0F] border border-white/10 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/5">
            <Share2 className="w-4 h-4 text-[#D50000]" />
            <h3 className="font-headline text-base text-white">Social Channel Links</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono uppercase text-neutral-400 mb-1">
                Instagram URL
              </label>
              <input
                type="text"
                value={social.instagram}
                onChange={(e) => setSocial((p) => ({ ...p, instagram: e.target.value }))}
                className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white focus:outline-none focus:border-[#D50000]"
              />
            </div>

            <div>
              <label className="block font-mono uppercase text-neutral-400 mb-1">
                TikTok URL
              </label>
              <input
                type="text"
                value={social.tiktok}
                onChange={(e) => setSocial((p) => ({ ...p, tiktok: e.target.value }))}
                className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white focus:outline-none focus:border-[#D50000]"
              />
            </div>

            <div>
              <label className="block font-mono uppercase text-neutral-400 mb-1">
                LinkedIn URL
              </label>
              <input
                type="text"
                value={social.linkedin}
                onChange={(e) => setSocial((p) => ({ ...p, linkedin: e.target.value }))}
                className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white focus:outline-none focus:border-[#D50000]"
              />
            </div>

            <div>
              <label className="block font-mono uppercase text-neutral-400 mb-1">
                YouTube URL
              </label>
              <input
                type="text"
                value={social.youtube}
                onChange={(e) => setSocial((p) => ({ ...p, youtube: e.target.value }))}
                className="w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-white focus:outline-none focus:border-[#D50000]"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
