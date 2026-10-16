import React from 'react';
import { Sparkles, ArrowDownRight } from 'lucide-react';
import type { SiteContent } from '../data/content';

interface WhySliceProps {
  content: SiteContent;
}

export const WhySlice: React.FC<WhySliceProps> = ({ content }) => {
  return (
    <section id="why-us" className="py-28 md:py-36 lg:py-44 bg-[#050505] relative border-b border-white/5">
      {/* Background Subtle Gradient */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-[#D50000]/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="site-container relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-20 md:mb-28 text-left rtl:text-right">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D50000]/10 border border-[#D50000]/30 text-[#FF3333] text-xs font-bold uppercase tracking-wider mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{content.whySection.badge}</span>
          </div>

          <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-none mb-7">
            {content.whySection.headline}
          </h2>

          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
            {content.whySection.subheadline}
          </p>
        </div>

        {/* 4 Pillars - Editorial Asymmetrical Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
          {content.whySection.pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="relative p-10 sm:p-12 rounded-2xl bg-[#0F0F0F] border border-white/10 hover:border-[#D50000]/50 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="font-headline text-5xl sm:text-6xl text-neutral-700 group-hover:text-[#D50000] transition-colors duration-300">
                    {pillar.number}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-500 group-hover:text-white group-hover:bg-[#D50000] transition-all">
                    <ArrowDownRight className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="font-headline text-2xl sm:text-3xl text-white mb-2 group-hover:text-[#FF3333] transition-colors">
                  {pillar.title}
                </h3>

                <div className="text-sm font-semibold text-[#FF3333] mb-4">
                  {pillar.subtitle}
                </div>

                <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              {/* Progress Bar Accent */}
              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400">
                <span className="uppercase tracking-widest font-bold text-[10px]">Slice Pillar {pillar.number}</span>
                <span className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                  <span className="block h-full bg-[#D50000] w-2/3 group-hover:w-full transition-all duration-500" />
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
