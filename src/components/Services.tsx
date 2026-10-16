import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import type { ServiceItem, SiteContent } from '../data/content';

interface ServicesProps {
  content: SiteContent;
  onSelectService: (serviceTitle: string) => void;
}

export const Services: React.FC<ServicesProps> = ({
  content,
  onSelectService,
}) => {
  const [activeServiceModal, setActiveServiceModal] = useState<ServiceItem | null>(null);

  return (
    <section id="services" className="py-28 md:py-36 lg:py-44 bg-[#050505] relative border-b border-white/5">
      {/* Background Accent */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#D50000]/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="site-container relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 md:mb-24 gap-8">
          <div className="max-w-2xl text-left rtl:text-right">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D50000]/10 border border-[#D50000]/30 text-[#FF3333] text-xs font-bold uppercase tracking-wider mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{content.servicesSection.badge}</span>
            </div>
            
            <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-none">
              {content.servicesSection.headline}
            </h2>
          </div>

          <p className="text-base sm:text-lg text-neutral-300 max-w-md text-left rtl:text-right leading-relaxed">
            {content.servicesSection.subheadline}
          </p>
        </div>

        {/* 8 Services Grid — Spacious 2-Column Editorial Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {content.servicesSection.items.map((service) => (
            <div
              key={service.id}
              onClick={() => setActiveServiceModal(service)}
              className="slice-card p-9 sm:p-11 flex flex-col justify-between group cursor-pointer border border-white/10 hover:border-[#D50000]/60 transition-all duration-300"
            >
              <div>
                {/* Header with Number & Arrow */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-headline text-3xl sm:text-4xl text-neutral-600 group-hover:text-[#D50000] transition-colors duration-300">
                    {service.number}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 group-hover:text-white group-hover:bg-[#D50000] group-hover:border-[#D50000] transition-all duration-300">
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-headline text-xl sm:text-2xl text-white mb-3 group-hover:text-[#FF3333] transition-colors">
                  {service.title}
                </h3>

                {/* Tagline */}
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">
                  {service.tagline}
                </p>

                {/* Description */}
                <p className="text-sm text-neutral-400 leading-relaxed mb-6 line-clamp-3">
                  {service.description}
                </p>
              </div>

              {/* Bottom Deliverables Peek */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400 group-hover:text-neutral-200">
                <span>{service.metricsPreview}</span>
                <span className="text-[#D50000] font-bold group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform inline-flex items-center gap-0.5">
                  Details <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Service Detail Modal */}
      {activeServiceModal && (
        <div
          className="modal-overlay"
          onClick={() => setActiveServiceModal(null)}
        >
          <div
            className="bg-[#121212] border border-white/15 rounded-2xl max-w-xl w-full p-8 md:p-10 relative shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="font-headline text-4xl text-[#D50000]">
                {activeServiceModal.number}
              </span>
              <button
                onClick={() => setActiveServiceModal(null)}
                className="text-neutral-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <h3 className="font-headline text-3xl text-white mb-2">
              {activeServiceModal.title}
            </h3>

            <p className="text-sm text-[#FF3333] font-semibold uppercase tracking-wider mb-6">
              {activeServiceModal.tagline}
            </p>

            <p className="text-neutral-300 text-sm md:text-base leading-relaxed mb-8">
              {activeServiceModal.description}
            </p>

            {/* Deliverables List */}
            <div className="mb-8">
              <div className="text-xs uppercase font-bold text-neutral-400 tracking-wider mb-3">
                Key Production Deliverables:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeServiceModal.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-neutral-300 bg-white/5 p-2.5 rounded-lg border border-white/5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D50000] flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setActiveServiceModal(null)}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const serviceName = activeServiceModal.title;
                  setActiveServiceModal(null);
                  onSelectService(serviceName);
                }}
                className="btn-primary py-2.5 px-6 text-xs"
              >
                Inquire For This Capability
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
