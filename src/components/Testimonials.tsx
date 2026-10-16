import React from 'react';
import { ShieldCheck, Award, MessageSquare } from 'lucide-react';
import type { SiteContent } from '../data/content';

interface TestimonialsProps {
  content: SiteContent;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ content }) => {
  return (
    <section className="py-14 sm:py-24 md:py-36 lg:py-44 bg-[#0A0A0A] relative border-b border-white/5">
      <div className="site-container">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-20 md:mb-24 text-left rtl:text-right">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#D50000]/10 border border-[#D50000]/30 text-[#FF3333] text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-4 sm:mb-5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{content.testimonialsSection.badge}</span>
          </div>

          <h2 className="font-headline text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-none mb-4 sm:mb-7">
            {content.testimonialsSection.headline}
          </h2>

          <p className="text-sm sm:text-lg text-neutral-300 leading-relaxed mb-3 sm:mb-4">
            {content.testimonialsSection.subheadline}
          </p>

          <p className="text-xs sm:text-sm text-neutral-400 italic">
            {content.testimonialsSection.note}
          </p>
        </div>

        {/* 3 Partnership Principles Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 lg:gap-10">
          {content.testimonialsSection.items.map((item, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-8 md:p-11 rounded-2xl bg-[#121212] border border-white/10 hover:border-[#D50000]/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#D50000]">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF3333] bg-[#D50000]/10 px-2.5 py-1 rounded-full border border-[#D50000]/20">
                    {item.verifiedLabel}
                  </span>
                </div>

                <h3 className="font-headline text-xl text-white mb-4">
                  {item.title}
                </h3>

                <blockquote className="text-sm text-neutral-300 leading-relaxed italic mb-6">
                  "{item.quote}"
                </blockquote>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-neutral-400">
                <MessageSquare className="w-3.5 h-3.5 text-[#D50000]" />
                <span>{item.authorTitle}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
