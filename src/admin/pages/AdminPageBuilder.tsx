import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  CheckCircle,
  Eye,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Layers,
  Copy,
  Sliders,
  History,
  RotateCcw,
  Smartphone,
  Tablet,
  Monitor,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import type { Page, PageRevision, PageSection } from '../../types/api';
import { api } from '../../services/api';
import { useAdmin } from '../AdminContext';

interface AdminPageBuilderProps {
  pageId: number;
  onBack: () => void;
}

export const AdminPageBuilder: React.FC<AdminPageBuilderProps> = ({ pageId, onBack }) => {
  const { hasPermission, showToast } = useAdmin();
  const [page, setPage] = useState<Page | null>(null);
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [selectedSectionIdx, setSelectedSectionIdx] = useState<number | null>(null);
  const [activeLangTab, setActiveLangTab] = useState<'en' | 'ar'>('en');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewMode, setPreviewMode] = useState(false);

  const availableSectionTemplates = [
    {
      type: 'hero',
      name: 'Hero Section',
      desc: 'High-impact editorial headline, subheadline, badge, and CTA buttons',
      defaultContent: {
        badge_en: 'Viral Content Agency // Cairo • Dubai • Riyadh',
        badge_ar: 'وكالة المحتوى الفيروسي والنمو // القاهرة • دبي • الرياض',
        headline_en: 'WE MAKE BRANDS IMPOSSIBLE TO IGNORE.',
        headline_ar: 'نجعل علامتك التجارية مستحيلة التجاوز.',
        subheadline_en: 'We engineer scroll-stopping short-form content and full-funnel performance campaigns.',
        subheadline_ar: 'نصنع محتوى مرئي يخطف الأنظار في أول ثوانٍ وحملات ممولة ذكية تحول المشاهدات إلى مبيعات.',
        primary_cta_en: 'Produce Your Campaign',
        primary_cta_ar: 'ابدأ حملتك القادمة',
        secondary_cta_en: 'Explore Vault',
        secondary_cta_ar: 'استكشف أعمالنا',
      },
    },
    {
      type: 'brand_intro',
      name: 'Brand Storytelling & Intro',
      desc: 'Two-column editorial vision statement and core narrative cards',
      defaultContent: {
        tagline_en: 'Strategic Art Direction // Organic Retention',
        tagline_ar: 'رؤية إبداعية مدروسة // انتشار عضوي حقيقي',
        title_en: 'Stop burning ad budget on videos people skip in 2 seconds.',
        title_ar: 'توقف عن إهدار ميزانيتك على إعلانات يتخطاها الجمهور في ثانيتين.',
        description_en: 'Attention is the rarest currency in digital business today. We craft videos that dominate user feeds.',
        description_ar: 'الانتباه هو أثمن عملة في العالم الرقمي اليوم. نصنع مقاطع فيديو تجبر المتابع على التوقف واستكمال المشاهدة.',
      },
    },
    {
      type: 'services',
      name: 'Core Services Grid',
      desc: 'Connects to database services with custom headline and subheadline',
      defaultContent: {
        badge_en: 'Integrated Capabilities',
        badge_ar: 'خدماتنا وقدراتنا',
        headline_en: 'FULL-STACK DIGITAL GROWTH ENGINES',
        headline_ar: 'منظومة متكاملة لصناعة الهيمنة الرقمية',
        subheadline_en: 'From viral concept creation to technical ad arbitrage and creator management.',
        subheadline_ar: 'من الفكرة وكتابة السيناريو إلى التصوير السينمائي وإدارة الإعلانات.',
      },
    },
    {
      type: 'video_strip',
      name: '3D Video Strip Showcase',
      desc: 'Interactive 3D vertical reel deck with audio control and Vimeo embeds',
      defaultContent: {
        badge_en: '3D Video Strip // Proprietary Formats',
        badge_ar: 'مختبر الفورمات // ابتكار المحتوى',
        headline_en: 'THE FORMULA BEHIND OUR RETENTION',
        headline_ar: 'المعادلة السرية لاحتفاظ المشاهدين',
        subheadline_en: 'Every second is mapped to cognitive retention triggers and pacing.',
        subheadline_ar: 'كل ثانية مدروسة بمحفزات نفسية وإيقاع تصاعدي يجعل علامتك بطل القصة الدائم.',
      },
    },
    {
      type: 'portfolio',
      name: 'Portfolio Case Studies',
      desc: 'Connects to database projects with custom headline and intro',
      defaultContent: {
        badge_en: 'Selected Concept Cases',
        badge_ar: 'نماذج من أعمالنا',
        headline_en: 'HIGH-IMPACT CAMPAIGN BLUEPRINTS',
        headline_ar: 'حملات رقمية حققت أرقاماً استثنائية',
        subheadline_en: 'Real strategic playbooks executed with surgical precision.',
        subheadline_ar: 'خطط واستراتيجيات مبتكرة تم تنفيذها بدقة لعلامات رائدة.',
      },
    },
    {
      type: 'why_slice',
      name: 'Why Slice Methodology',
      desc: '4 strategic operating pillars and agency differentiators',
      defaultContent: {
        badge_en: 'Agency Architecture',
        badge_ar: 'منهجية سلايس',
        headline_en: 'WHY AMBITIOUS BRANDS PARTNER WITH US',
        headline_ar: 'لماذا تختار العلامات الطموحة سلايس',
      },
    },
    {
      type: 'our_process',
      name: '4-Step Process Timeline',
      desc: 'Workflow from Hook Mining to Concept, Production, and Distribution',
      defaultContent: {
        badge_en: 'Execution Roadmap',
        badge_ar: 'خارطة طريق التنفيذ',
        headline_en: 'FROM RAW CONCEPT TO VIRAL DOMINANCE',
        headline_ar: 'من الفكرة الأولية إلى تصدر التريند',
      },
    },
    {
      type: 'contact',
      name: 'Partnership Contact Section',
      desc: 'Lead intake section with agency hubs in Cairo, Dubai, and Riyadh',
      defaultContent: {
        badge_en: 'Partnership Inquiry',
        badge_ar: 'ابدأ التعاون معنا',
        headline_en: 'READY TO MAKE YOUR BRAND IMPOSSIBLE TO IGNORE?',
        headline_ar: 'جاهز لجعل علامتك التجارية مستحيلة التجاوز؟',
        subheadline_en: 'Tell us about your brand and growth goals. We review briefs within 24 hours.',
        subheadline_ar: 'شاركنا تفاصيل علامتك وأهدافك. سيقوم فريقنا بدراسة طلبك والرد خلال 24 ساعة.',
      },
    },
    {
      type: 'cta_banner',
      name: 'High-Impact Call To Action',
      desc: 'Full-width cinematic banner driving visitors to initiate inquiries',
      defaultContent: {
        headline_en: 'SCALE YOUR BRAND WITH PROVEN RETENTION VIDEOS',
        headline_ar: 'ضاعف مبيعاتك وأرباحك بمحتوى فيديو فائق الاحتفاظ',
        subheadline_en: 'Book your strategic creative brief consultation today.',
        subheadline_ar: 'احجز جلستك الاستشارية الإبداعية الآن مع خبرائنا.',
        button_text_en: 'Book Strategic Brief',
        button_text_ar: 'احجز استشارتك الآن',
      },
    },
  ];

  const fetchPage = async () => {
    setLoading(true);
    try {
      const data = await api.getPageAdmin(pageId);
      setPage(data);
      setSections(data.sections || []);
      if ((data.sections || []).length > 0 && selectedSectionIdx === null) {
        setSelectedSectionIdx(0);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch page data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage();
  }, [pageId]);

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[index - 1];
    newSections[index - 1] = temp;
    // update order numbers
    newSections.forEach((s, idx) => (s.order = idx + 1));
    setSections(newSections);
    setSelectedSectionIdx(index - 1);
  };

  const handleMoveDown = (index: number) => {
    if (index >= sections.length - 1) return;
    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[index + 1];
    newSections[index + 1] = temp;
    newSections.forEach((s, idx) => (s.order = idx + 1));
    setSections(newSections);
    setSelectedSectionIdx(index + 1);
  };

  const handleToggleEnabled = (index: number) => {
    const newSections = [...sections];
    newSections[index].is_enabled = !newSections[index].is_enabled;
    setSections(newSections);
  };

  const handleDeleteSection = (index: number) => {
    const newSections = sections.filter((_, idx) => idx !== index);
    newSections.forEach((s, idx) => (s.order = idx + 1));
    setSections(newSections);
    setSelectedSectionIdx(newSections.length > 0 ? Math.max(0, index - 1) : null);
    showToast('Section removed.');
  };

  const handleDuplicateSection = (index: number) => {
    const sec = sections[index];
    const duplicate: PageSection = {
      section_type: sec.section_type,
      order: sec.order + 1,
      is_enabled: true,
      layout_variant: sec.layout_variant,
      content: JSON.parse(JSON.stringify(sec.content)),
      background_settings: sec.background_settings ? JSON.parse(JSON.stringify(sec.background_settings)) : null,
    };
    const newSections = [...sections];
    newSections.splice(index + 1, 0, duplicate);
    newSections.forEach((s, idx) => (s.order = idx + 1));
    setSections(newSections);
    setSelectedSectionIdx(index + 1);
    showToast('Section duplicated.');
  };

  const handleAddSection = (template: typeof availableSectionTemplates[0]) => {
    const newSec: PageSection = {
      section_type: template.type,
      order: sections.length + 1,
      is_enabled: true,
      layout_variant: 'default',
      content: JSON.parse(JSON.stringify(template.defaultContent)),
      background_settings: { theme: 'dark' },
    };
    setSections([...sections, newSec]);
    setSelectedSectionIdx(sections.length);
    setShowAddModal(false);
    showToast(`Added ${template.name}`);
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const res = await api.savePageSections(pageId, sections, 'Updated sections in Visual Builder');
      showToast(`Draft Revision v${res.version} saved successfully.`);
      fetchPage();
    } catch (err: any) {
      showToast(err.message || 'Failed to save draft sections', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await api.savePageSections(pageId, sections, 'Published version commit');
      await api.publishPage(pageId);
      showToast(`Page "/${page?.slug}" is now published LIVE to production!`);
      fetchPage();
    } catch (err: any) {
      showToast(err.message || 'Failed to publish page', 'error');
    } finally {
      setPublishing(false);
    }
  };

  const handleRestoreRevision = async (revisionId: number) => {
    try {
      const restored = await api.restoreRevision(pageId, revisionId);
      setPage(restored);
      setSections(restored.sections || []);
      setShowRevisionModal(false);
      showToast('Revision restored successfully!');
    } catch (err: any) {
      showToast(err.message || 'Failed to restore revision', 'error');
    }
  };

  const updateSelectedField = (key: string, value: any) => {
    if (selectedSectionIdx === null) return;
    const newSections = [...sections];
    newSections[selectedSectionIdx].content = {
      ...newSections[selectedSectionIdx].content,
      [key]: value,
    };
    setSections(newSections);
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-neutral-400 font-mono text-sm">
        Loading Visual Section Page Builder...
      </div>
    );
  }

  const selectedSection = selectedSectionIdx !== null ? sections[selectedSectionIdx] : null;

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Top Builder Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#0A0A0A] border border-white/10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-headline text-lg sm:text-xl text-white">
                Page Builder: /{page?.slug}
              </span>
              <span
                className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold border ${
                  page?.is_published
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                }`}
              >
                {page?.is_published ? 'LIVE' : 'DRAFT'}
              </span>
            </div>
            <div className="text-[11px] text-neutral-400">
              {sections.length} active section blocks configured
            </div>
          </div>
        </div>

        {/* Viewport Frame Mode Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#141414] border border-white/10 mx-auto lg:mx-0">
          <button
            onClick={() => setPreviewDevice('desktop')}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors ${
              previewDevice === 'desktop' ? 'bg-[#D50000] text-white font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            onClick={() => setPreviewDevice('tablet')}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors ${
              previewDevice === 'tablet' ? 'bg-[#D50000] text-white font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            onClick={() => setPreviewDevice('mobile')}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors ${
              previewDevice === 'mobile' ? 'bg-[#D50000] text-white font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Save Draft & Publish Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowRevisionModal(true)}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 text-xs font-semibold transition-colors flex items-center gap-1.5"
            title="Revision History & Rollback"
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Revisions</span>
          </button>

          <button
            onClick={handleSaveDraft}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Draft'}</span>
          </button>

          {hasPermission('pages.publish') && (
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="px-4 py-2 rounded-xl bg-[#D50000] hover:bg-[#b00000] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_0_20px_rgba(213,0,0,0.4)] disabled:opacity-50"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{publishing ? 'Publishing...' : 'Publish Live'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Builder Two-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Section Stack & Sequence List (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-2xl bg-[#0F0F0F] border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#D50000]" />
              <h3 className="font-headline text-sm text-white">Section Stack & Order</h3>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-2.5 py-1.5 rounded-lg bg-[#D50000] hover:bg-[#b00000] text-white text-[11px] font-bold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Section</span>
            </button>
          </div>

          <div className="space-y-2">
            {sections.map((sec, idx) => {
              const isSelected = selectedSectionIdx === idx;

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedSectionIdx(idx)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#181818] border-[#D50000] shadow-[0_0_15px_rgba(213,0,0,0.2)]'
                      : sec.is_enabled
                      ? 'bg-[#0F0F0F] border-white/10 hover:border-white/20'
                      : 'bg-[#080808] border-white/5 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-neutral-500 font-bold">
                      0{idx + 1}
                    </span>

                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white capitalize">
                        {sec.section_type.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {sec.is_enabled ? 'Active block' : 'Disabled'}
                      </span>
                    </div>
                  </div>

                  {/* Reorder and State Action Buttons */}
                  <div
                    className="flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      disabled={idx === 0}
                      onClick={() => handleMoveUp(idx)}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 text-neutral-300"
                      title="Move section up"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      disabled={idx === sections.length - 1}
                      onClick={() => handleMoveDown(idx)}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 text-neutral-300"
                      title="Move section down"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDuplicateSection(idx)}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-neutral-300"
                      title="Duplicate section"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleToggleEnabled(idx)}
                      className={`p-1 rounded text-xs font-mono font-bold ${
                        sec.is_enabled ? 'text-emerald-400 bg-emerald-500/10' : 'text-neutral-500 bg-white/5'
                      }`}
                      title={sec.is_enabled ? 'Disable section' : 'Enable section'}
                    >
                      {sec.is_enabled ? 'ON' : 'OFF'}
                    </button>

                    <button
                      onClick={() => handleDeleteSection(idx)}
                      className="p-1 rounded bg-white/5 hover:bg-red-500/20 text-neutral-500 hover:text-red-400"
                      title="Delete section"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Section Field Config & Live Bilingual Editor (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {selectedSection ? (
            <div className="p-6 rounded-3xl bg-[#0F0F0F] border border-white/10 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <div className="text-[10px] font-mono uppercase text-[#FF3333] mb-0.5">
                    Section Type // {selectedSection.section_type}
                  </div>
                  <h2 className="font-headline text-xl text-white capitalize">
                    {selectedSection.section_type.replace('_', ' ')} Configuration
                  </h2>
                </div>

                {/* English / Arabic Tab Switcher */}
                <div className="flex items-center rounded-xl bg-[#141414] border border-white/10 p-1">
                  <button
                    onClick={() => setActiveLangTab('en')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      activeLangTab === 'en'
                        ? 'bg-[#D50000] text-white'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    English (LTR)
                  </button>
                  <button
                    onClick={() => setActiveLangTab('ar')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors font-ar ${
                      activeLangTab === 'ar'
                        ? 'bg-[#D50000] text-white'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    العربية (RTL)
                  </button>
                </div>
              </div>

              {/* Dynamic Field Form according to Section Type */}
              <div className="space-y-4">
                {/* Badge Field */}
                {(selectedSection.content.badge_en !== undefined ||
                  selectedSection.content.tagline_en !== undefined) && (
                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                      Header Pill Badge / Tagline ({activeLangTab.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'}
                      value={
                        selectedSection.content[
                          selectedSection.content.badge_en !== undefined
                            ? `badge_${activeLangTab}`
                            : `tagline_${activeLangTab}`
                        ] || ''
                      }
                      onChange={(e) =>
                        updateSelectedField(
                          selectedSection.content.badge_en !== undefined
                            ? `badge_${activeLangTab}`
                            : `tagline_${activeLangTab}`,
                          e.target.value
                        )
                      }
                      className={`w-full p-3 rounded-xl bg-[#141414] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D50000] ${
                        activeLangTab === 'ar' ? 'font-ar text-right' : ''
                      }`}
                    />
                  </div>
                )}

                {/* Headline / Title Field */}
                {(selectedSection.content.headline_en !== undefined ||
                  selectedSection.content.title_en !== undefined) && (
                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                      Main Section Headline ({activeLangTab.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'}
                      value={
                        selectedSection.content[
                          selectedSection.content.headline_en !== undefined
                            ? `headline_${activeLangTab}`
                            : `title_${activeLangTab}`
                        ] || ''
                      }
                      onChange={(e) =>
                        updateSelectedField(
                          selectedSection.content.headline_en !== undefined
                            ? `headline_${activeLangTab}`
                            : `title_${activeLangTab}`,
                          e.target.value
                        )
                      }
                      className={`w-full p-3 rounded-xl bg-[#141414] border border-white/10 text-sm font-bold text-white focus:outline-none focus:border-[#D50000] ${
                        activeLangTab === 'ar' ? 'font-ar text-right' : ''
                      }`}
                    />
                  </div>
                )}

                {/* Subheadline / Description Field */}
                {(selectedSection.content.subheadline_en !== undefined ||
                  selectedSection.content.description_en !== undefined) && (
                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                      Subheadline / Supporting Body Text ({activeLangTab.toUpperCase()})
                    </label>
                    <textarea
                      rows={3}
                      dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'}
                      value={
                        selectedSection.content[
                          selectedSection.content.subheadline_en !== undefined
                            ? `subheadline_${activeLangTab}`
                            : `description_${activeLangTab}`
                        ] || ''
                      }
                      onChange={(e) =>
                        updateSelectedField(
                          selectedSection.content.subheadline_en !== undefined
                            ? `subheadline_${activeLangTab}`
                            : `description_${activeLangTab}`,
                          e.target.value
                        )
                      }
                      className={`w-full p-3 rounded-xl bg-[#141414] border border-white/10 text-xs text-neutral-200 leading-relaxed focus:outline-none focus:border-[#D50000] resize-none ${
                        activeLangTab === 'ar' ? 'font-ar text-right' : ''
                      }`}
                    />
                  </div>
                )}

                {/* CTA Buttons */}
                {selectedSection.content.primary_cta_en !== undefined && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                        Primary CTA Label ({activeLangTab.toUpperCase()})
                      </label>
                      <input
                        type="text"
                        dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'}
                        value={selectedSection.content[`primary_cta_${activeLangTab}`] || ''}
                        onChange={(e) =>
                          updateSelectedField(`primary_cta_${activeLangTab}`, e.target.value)
                        }
                        className={`w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D50000] ${
                          activeLangTab === 'ar' ? 'font-ar text-right' : ''
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                        Secondary CTA Label ({activeLangTab.toUpperCase()})
                      </label>
                      <input
                        type="text"
                        dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'}
                        value={selectedSection.content[`secondary_cta_${activeLangTab}`] || ''}
                        onChange={(e) =>
                          updateSelectedField(`secondary_cta_${activeLangTab}`, e.target.value)
                        }
                        className={`w-full p-2.5 rounded-xl bg-[#141414] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D50000] ${
                          activeLangTab === 'ar' ? 'font-ar text-right' : ''
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Live Preview of Section in Device Viewport */}
              <div className="pt-6 border-t border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono uppercase text-neutral-400 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Live Section Preview ({previewDevice.toUpperCase()})</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">
                    Real-time reactive canvas
                  </span>
                </div>

                <div
                  className={`mx-auto p-6 rounded-2xl bg-[#050505] border border-white/15 shadow-inner transition-all ${
                    previewDevice === 'mobile'
                      ? 'max-w-sm'
                      : previewDevice === 'tablet'
                      ? 'max-w-xl'
                      : 'w-full'
                  }`}
                  dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'}
                >
                  <div className="text-center py-6">
                    {/* Badge */}
                    <div className="inline-block px-3 py-1 rounded-full bg-[#D50000]/10 border border-[#D50000]/30 text-[#FF3333] text-[10px] font-bold uppercase tracking-wider mb-4">
                      {selectedSection.content[`badge_${activeLangTab}`] ||
                        selectedSection.content[`tagline_${activeLangTab}`] ||
                        'SLICE CAMPAIGN'}
                    </div>

                    {/* Headline */}
                    <h2 className="font-headline text-2xl sm:text-3xl text-white tracking-tight leading-tight mb-3">
                      {selectedSection.content[`headline_${activeLangTab}`] ||
                        selectedSection.content[`title_${activeLangTab}`] ||
                        'Section Headline'}
                    </h2>

                    {/* Subheadline */}
                    <p className="text-xs text-neutral-300 max-w-md mx-auto leading-relaxed mb-6">
                      {selectedSection.content[`subheadline_${activeLangTab}`] ||
                        selectedSection.content[`description_${activeLangTab}`] ||
                        'Supporting descriptive copy for the campaign.'}
                    </p>

                    {/* Buttons */}
                    {selectedSection.content.primary_cta_en !== undefined && (
                      <div className="flex items-center justify-center gap-3">
                        <button className="px-5 py-2 rounded-full bg-[#D50000] text-white text-xs font-bold">
                          {selectedSection.content[`primary_cta_${activeLangTab}`] || 'Primary CTA'}
                        </button>
                        <button className="px-5 py-2 rounded-full bg-white/10 text-white text-xs font-bold border border-white/10">
                          {selectedSection.content[`secondary_cta_${activeLangTab}`] || 'Secondary'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-[#0F0F0F] border border-white/10 text-center text-neutral-400">
              <Sliders className="w-12 h-12 mx-auto text-neutral-600 mb-3" />
              <h3 className="font-headline text-lg text-white mb-1">Select a Section to Edit</h3>
              <p className="text-xs max-w-md mx-auto">
                Choose a section block from the sequence stack on the left or add a new section.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Section Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0F0F0F] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl animate-scale-up max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline text-xl text-white">Add New Content Section</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-400 mb-6">
              Select an approved architectural section block from the Slice design system.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableSectionTemplates.map((template) => (
                <div
                  key={template.type}
                  onClick={() => handleAddSection(template)}
                  className="p-4 rounded-2xl bg-[#141414] hover:bg-[#1C1C1C] border border-white/10 hover:border-[#D50000] cursor-pointer transition-all group flex flex-col justify-between"
                >
                  <div>
                    <h4 className="font-bold text-xs text-white group-hover:text-[#FF3333] transition-colors mb-1">
                      {template.name}
                    </h4>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      {template.desc}
                    </p>
                  </div>
                  <div className="mt-3 text-[10px] font-mono text-neutral-500 group-hover:text-white flex items-center gap-1">
                    <span>Insert block</span>
                    <Plus className="w-3 h-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Revision History & Rollback Modal */}
      {showRevisionModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0F0F0F] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-[#D50000]" />
                <h3 className="font-headline text-xl text-white">Revision History</h3>
              </div>
              <button
                onClick={() => setShowRevisionModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-400 mb-6">
              Rollback to previous saved draft snapshots or restore previous versions safely.
            </p>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {page?.revisions && page.revisions.length > 0 ? (
                page.revisions.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3.5 rounded-xl bg-[#141414] border border-white/10 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span className="font-mono text-[#FF3333]">v{rev.version}</span>
                        <span>{rev.notes || 'Automated snapshot'}</span>
                      </div>
                      <div className="text-[10px] font-mono text-neutral-500 mt-0.5">
                        {new Date(rev.created_at).toLocaleString()}
                      </div>
                    </div>

                    <button
                      onClick={() => handleRestoreRevision(rev.id)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#D50000] text-white text-[11px] font-bold transition-colors flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Rollback</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-neutral-500 font-mono">
                  No previous revisions logged yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
