import React from 'react';
import { Target, Compass, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { SiteContent } from '../data/content';

interface BrandIntroProps {
  content: SiteContent;
  onLearnMoreServices: () => void;
}

export const BrandIntro: React.FC<BrandIntroProps> = ({
  content,
  onLearnMoreServices,
}) => {
  const icons = [Target, Compass, Zap];

  return (
    <section id="about" className="py-14 sm:py-24 md:py-36 lg:py-44 bg-[#0A0A0A] relative border-b border-white/5">
      <div className="site-container">
        
        {/* Section Header */}
        <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-20 md:mb-28">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-4 sm:mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D50000]" />
            <span>{content.intro.badge}</span>
          </div>

          <h2 className="font-headline text-3xl sm:text-5xl md:text-6xl text-white tracking-tight mb-4 sm:mb-8 leading-tight">
            {content.intro.headline}
          </h2>

          <p className="text-sm sm:text-lg md:text-xl text-neutral-300 font-normal leading-relaxed max-w-3xl mx-auto">
            {content.intro.subheadline}
          </p>
        </div>

        {/* Narrative Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20 items-center mb-14 sm:mb-28">
          
          <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-neutral-300 text-sm sm:text-base md:text-lg leading-relaxed text-left rtl:text-right">
            <p className="border-l-2 rtl:border-l-0 rtl:border-r-2 border-[#D50000] pl-4 rtl:pl-0 rtl:pr-4 text-white font-semibold">
              {content.intro.body1}
            </p>
            <p>
              {content.intro.body2}
            </p>
            <div className="pt-2 sm:pt-4">
              <button
                onClick={onLearnMoreServices}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white hover:text-[#D50000] transition-colors uppercase tracking-wider group"
              >
                <span>Explore Agency Capabilities</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </button>
            </div>
          </div>

          {/* Visual Editorial Box: The Missing Slice Concept */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl p-6 sm:p-9 bg-gradient-to-br from-[#141414] via-[#0E0E0E] to-[#080808] border border-white/10 shadow-2xl overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#D50000]/15 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center justify-between mb-4">
                <div className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#FF3333] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D50000] animate-pulse" />
                  <span>The Missing Slice Philosophy</span>
                </div>
                <div className="text-[10px] font-mono text-neutral-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                  EST. GIZA // EG
                </div>
              </div>

              {/* Graphic Representation: 4 Quarters */}
              <div className="my-5 p-4 rounded-xl bg-black/50 border border-white/10 grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5 text-left rtl:text-right">
                  <span className="text-[10px] text-neutral-400 block font-mono">01 // PRODUCT</span>
                  <span className="text-xs font-bold text-neutral-300">Your Core Offering</span>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5 text-left rtl:text-right">
                  <span className="text-[10px] text-neutral-400 block font-mono">02 // OPERATIONS</span>
                  <span className="text-xs font-bold text-neutral-300">Your Internal Drive</span>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5 text-left rtl:text-right">
                  <span className="text-[10px] text-neutral-400 block font-mono">03 // VISION</span>
                  <span className="text-xs font-bold text-neutral-300">Your Market Goals</span>
                </div>
                <div className="p-3 rounded-lg bg-[#D50000]/15 border-2 border-[#D50000] text-left rtl:text-right shadow-[0_0_20px_rgba(213,0,0,0.3)] relative overflow-hidden group-hover:bg-[#D50000]/25 transition-all">
                  <span className="text-[10px] text-[#FF4D4D] block font-mono font-bold">04 // THE MISSING SLICE</span>
                  <span className="text-xs font-black text-white flex items-center gap-1">
                    SLICE Agency <span className="text-[#FF4D4D]">★</span>
                  </span>
                  <span className="text-[9px] text-neutral-300 block mt-0.5">Viral Retention & Paid ROAS</span>
                </div>
              </div>

              <div className="font-headline text-lg sm:text-2xl text-white mb-4 leading-snug">
                WE DO NOT PRODUCE CONTENT FOR THE ALGORITHM ALONE. WE ENGINEER FOR HUMAN DESIRE.
              </div>

              <div className="space-y-2.5 pt-4 border-t border-white/10">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-[#D50000] flex-shrink-0" />
                  <span>High-retention hooks engineered for MENA consumer attention</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-[#D50000] flex-shrink-0" />
                  <span>Full-funnel media buying tuned for blended profitability and sales</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-[#D50000] flex-shrink-0" />
                  <span>Official partner network across Cairo, Giza, and the Gulf</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 3 Core Value Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10">
          {content.intro.coreValues.map((value, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <div
                key={idx}
                className="slice-card p-6 sm:p-9 md:p-11 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-[#D50000] group-hover:text-white transition-all duration-300 mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-headline text-xl text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
