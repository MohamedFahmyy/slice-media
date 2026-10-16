import React from 'react';
import { Sparkles, TrendingUp, Check } from 'lucide-react';
import type { SiteContent } from '../data/content';

interface ValuePropositionProps {
  content: SiteContent;
  onConsultationClick: () => void;
}

export const ValueProposition: React.FC<ValuePropositionProps> = ({
  content,
  onConsultationClick,
}) => {
  return (
    <section className="py-28 md:py-36 lg:py-44 bg-[#050505] relative border-b border-white/5">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/3 w-[550px] h-[550px] bg-[#D50000]/10 blur-[160px] pointer-events-none rounded-full" />

      <div className="site-container relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-20 md:mb-24 text-left rtl:text-right">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D50000]/10 border border-[#D50000]/30 text-[#FF3333] text-xs font-bold uppercase tracking-wider mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{content.valueSection.badge}</span>
          </div>

          <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-none mb-7">
            {content.valueSection.headline}
          </h2>

          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
            {content.valueSection.subheadline}
          </p>
        </div>

        {/* 5 Business Value Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-20">
          {content.valueSection.items.map((item, idx) => (
            <div
              key={idx}
              className={`slice-card p-9 sm:p-11 flex flex-col justify-between group ${
                idx === 0 ? 'lg:col-span-2 bg-gradient-to-br from-[#181818] to-[#101010]' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="badge-red text-[11px]">
                    {item.highlight}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 group-hover:text-white group-hover:bg-[#D50000] transition-colors">
                    <Check className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="font-headline text-2xl text-white mb-3 group-hover:text-[#FF3333] transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-neutral-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                Direct Commercial Return
              </div>
            </div>
          ))}

          {/* Call to action mini card */}
          <div className="slice-card p-8 flex flex-col justify-between bg-gradient-to-br from-[#D50000]/20 via-[#181818] to-[#101010] border-[#D50000]/40">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#D50000] text-white flex items-center justify-center mb-6 shadow-lg shadow-[#D50000]/40">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-headline text-2xl text-white mb-3">
                READY FOR STRATEGIC CLARITY?
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed">
                Schedule a diagnostic audit of your brand's digital presence and short-form video pipeline.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <button
                onClick={onConsultationClick}
                className="w-full btn-primary py-2.5 text-xs font-bold"
              >
                Schedule Brand Audit
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
