import React, { useState, useEffect } from 'react';
import { CheckCircle2, MessageCircle, Mail, MapPin, Sparkles, Send, RefreshCw, AlertCircle } from 'lucide-react';
import type { SiteContent } from '../data/content';
import { api } from '../services/api';

interface ContactProps {
  content: SiteContent;
  preselectedService?: string;
}

export const Contact: React.FC<ContactProps> = ({
  content,
  preselectedService,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    service: '',
    budget: '',
    details: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRefId, setSubmittedRefId] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedService) {
      setFormData((prev) => ({ ...prev, service: preselectedService }));
    }
  }, [preselectedService]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) {
      errs.fullName = 'Full name is required';
    }
    if (!formData.email.trim()) {
      errs.email = 'Business email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.company.trim()) {
      errs.company = 'Company or brand name is required';
    }
    if (!formData.service) {
      errs.service = 'Please choose a primary service of interest';
    }
    if (!formData.details.trim() || formData.details.trim().length < 15) {
      errs.details = 'Please provide at least a brief summary of your project (min 15 characters)';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    let assignedCode = `SLC-${Math.floor(10000 + Math.random() * 90000)}`;

    try {
      const res = await api.submitLead({
        full_name: formData.fullName,
        email: formData.email,
        company: formData.company,
        requested_service: formData.service,
        budget_range: formData.budget,
        project_description: formData.details,
        preferred_language: (document.documentElement.lang === 'ar' ? 'ar' : 'en') as 'en' | 'ar',
        referring_page: window.location.pathname,
      });
      if (res && res.reference_code) {
        assignedCode = res.reference_code;
      }
    } catch (err) {
      console.warn('API submission fallback to local storage:', err);
    } finally {
      setIsSubmitting(false);
      setSubmittedRefId(assignedCode);

      // Store in localStorage for frontend persistence/intake inspection
      try {
        const existingInquiries = JSON.parse(localStorage.getItem('slice_inquiries') || '[]');
        existingInquiries.push({
          id: assignedCode,
          timestamp: new Date().toISOString(),
          ...formData,
        });
        localStorage.setItem('slice_inquiries', JSON.stringify(existingInquiries));
      } catch (e) {
        console.warn('LocalStorage error', e);
      }
    }
  };

  const handleReset = () => {
    setSubmittedRefId(null);
    setFormData({
      fullName: '',
      email: '',
      company: '',
      service: '',
      budget: '',
      details: '',
    });
    setErrors({});
  };

  const whatsAppNumber = "201000000000"; // clearly marked agency partnership desk placeholder
  const whatsAppMessage = encodeURIComponent(
    `Hello Slice Marketing Agency, I submitted project inquiry #${submittedRefId || 'NEW'} for brand: ${formData.company || 'My Brand'}.`
  );

  return (
    <section id="contact" className="py-14 sm:py-24 md:py-36 lg:py-44 bg-[#050505] relative border-b border-white/5">
      {/* Glow */}
      <div className="absolute top-1/2 right-10 w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] bg-[#D50000]/12 blur-[150px] pointer-events-none rounded-full" />

      <div className="site-container relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-20 md:mb-24 text-left rtl:text-right">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#D50000]/10 border border-[#D50000]/30 text-[#FF3333] text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-4 sm:mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{content.contactSection.badge}</span>
          </div>

          <h2 className="font-headline text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-none mb-4 sm:mb-7">
            {content.contactSection.headline}
          </h2>

          <p className="text-sm sm:text-lg text-neutral-300 leading-relaxed">
            {content.contactSection.subheadline}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            {submittedRefId ? (
              /* Success / Acknowledgment State */
              <div className="p-6 sm:p-12 rounded-2xl bg-[#0F0F0F] border border-[#D50000]/50 shadow-2xl animate-in fade-in duration-300 text-left rtl:text-right">
                <div className="w-14 h-14 rounded-2xl bg-[#D50000]/20 border border-[#D50000]/40 flex items-center justify-center text-[#D50000] mb-6">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-bold text-neutral-300 mb-3">
                  {content.contactSection.form.referenceIdLabel}: <span className="text-[#FF3333]">{submittedRefId}</span>
                </div>

                <h3 className="font-headline text-3xl text-white mb-4">
                  {content.contactSection.form.successTitle}
                </h3>

                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed mb-8">
                  {content.contactSection.form.successMsg}
                </p>

                {/* Submitted Brief Summary */}
                <div className="p-5 rounded-xl bg-black/60 border border-white/10 space-y-2 text-xs mb-8">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-neutral-400">Brand / Entity:</span>
                    <span className="font-bold text-white">{formData.company}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-neutral-400">Contact Person:</span>
                    <span className="font-bold text-white">{formData.fullName} ({formData.email})</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-neutral-400">Selected Capability:</span>
                    <span className="font-bold text-[#FF3333]">{formData.service}</span>
                  </div>
                  {formData.budget && (
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Monthly Budget Tier:</span>
                      <span className="font-bold text-white">{formData.budget}</span>
                    </div>
                  )}
                </div>

                {/* Direct WhatsApp Followup */}
                <div className="space-y-4">
                  <p className="text-xs text-neutral-400">
                    {content.contactSection.form.directChat}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={`https://wa.me/${whatsAppNumber}?text=${whatsAppMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat on WhatsApp</span>
                    </a>

                    <button
                      onClick={handleReset}
                      className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs px-6 py-3 rounded-full border border-white/15 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{content.contactSection.form.sendAnother}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Contact Form */
              <form
                onSubmit={handleSubmit}
                noValidate
                className="p-5 sm:p-9 md:p-12 rounded-2xl bg-[#0E0E0E] border border-white/10 shadow-xl space-y-5 sm:space-y-7 text-left rtl:text-right"
              >
                {/* Full Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                      {content.contactSection.form.fullName} <span className="text-[#D50000]">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-input ${errors.fullName ? 'border-[#D50000]' : ''}`}
                      placeholder={content.contactSection.form.fullNamePlaceholder}
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                    {errors.fullName && (
                      <span className="text-[11px] text-[#FF3333] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.fullName}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                      {content.contactSection.form.email} <span className="text-[#D50000]">*</span>
                    </label>
                    <input
                      type="email"
                      className={`form-input ${errors.email ? 'border-[#D50000]' : ''}`}
                      placeholder={content.contactSection.form.emailPlaceholder}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    {errors.email && (
                      <span className="text-[11px] text-[#FF3333] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.email}
                      </span>
                    )}
                  </div>
                </div>

                {/* Company Name & Budget */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                      {content.contactSection.form.company} <span className="text-[#D50000]">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-input ${errors.company ? 'border-[#D50000]' : ''}`}
                      placeholder={content.contactSection.form.companyPlaceholder}
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                    {errors.company && (
                      <span className="text-[11px] text-[#FF3333] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.company}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                      {content.contactSection.form.budget}
                    </label>
                    <select
                      className="form-input bg-[#0F0F0F] cursor-pointer"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    >
                      <option value="">{content.contactSection.form.budgetPlaceholder}</option>
                      {content.contactSection.budgetOptions.map((opt, idx) => (
                        <option key={idx} value={opt.label}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Service Selection Chips */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2.5">
                    {content.contactSection.form.service} <span className="text-[#D50000]">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {content.contactSection.serviceOptions.map((opt) => {
                      const isSelected = formData.service === opt.label;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, service: opt.label })}
                          className={`text-xs px-3.5 py-2 rounded-xl border transition-all ${
                            isSelected
                              ? 'bg-[#D50000] text-white border-[#D50000] shadow-md shadow-[#D50000]/30 font-bold'
                              : 'bg-white/5 text-neutral-300 border-white/10 hover:border-white/20'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                  {errors.service && (
                    <span className="text-[11px] text-[#FF3333] mt-2 block flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.service}
                    </span>
                  )}
                </div>

                {/* Project Details */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                    {content.contactSection.form.details} <span className="text-[#D50000]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    className={`form-input resize-y ${errors.details ? 'border-[#D50000]' : ''}`}
                    placeholder={content.contactSection.form.detailsPlaceholder}
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  />
                  {errors.details && (
                    <span className="text-[11px] text-[#FF3333] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.details}
                    </span>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary py-4 text-sm font-bold flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{content.contactSection.form.submittingBtn}</span>
                      </>
                    ) : (
                      <>
                        <span>{content.contactSection.form.submitBtn}</span>
                        <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Agency Hubs & Direct Channels */}
          <div className="lg:col-span-5 space-y-8 text-left rtl:text-right">
            
            {/* Direct Contact Card */}
            <div className="p-8 rounded-2xl bg-[#0E0E0E] border border-white/10 shadow-lg">
              <h3 className="font-headline text-2xl text-white mb-6">
                DIRECT INTAKE CHANNELS
              </h3>

              <div className="space-y-5">
                <a
                  href="mailto:partnerships@slicemedia.agency"
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#D50000]/10 border border-[#D50000]/30 flex items-center justify-center text-[#D50000] group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase font-bold text-neutral-400">Email Inquiries</div>
                    <div className="text-sm font-semibold text-white">partnerships@slicemedia.agency</div>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${whatsAppNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center text-[#25D366] group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase font-bold text-neutral-400">WhatsApp Partnership Desk</div>
                    <div className="text-sm font-semibold text-white">+20 (100) 000-0000 (Placeholder)</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Regional Production & Strategy Hubs */}
            <div className="p-8 rounded-2xl bg-[#0E0E0E] border border-white/10 shadow-lg">
              <div className="text-xs font-bold uppercase tracking-widest text-[#FF3333] mb-2">
                Operational Reach
              </div>

              <h3 className="font-headline text-2xl text-white mb-6">
                REGIONAL AGENCY HUBS
              </h3>

              <div className="space-y-4">
                {content.contactSection.agencyHubs.map((hub, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-[#D50000] flex-shrink-0" />
                      <div>
                        <div className="text-sm font-bold text-white">{hub.city}</div>
                        <div className="text-xs text-neutral-400">{hub.region}</div>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-[#D50000]/10 border border-[#D50000]/30 text-[#FF3333]">
                      {hub.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
