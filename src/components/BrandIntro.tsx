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

          {/* Visual Editorial Box */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl p-6 sm:p-10 bg-gradient-to-br from-[#141414] to-[#0A0A0A] border border-white/10 shadow-xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D50000]/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#FF3333] mb-2 sm:mb-3">
                The Slice Standard
              </div>

              <div className="font-headline text-lg sm:text-2xl md:text-3xl text-white mb-5 sm:mb-6 leading-snug">
                WE DO NOT PRODUCE CONTENT FOR THE ALGORITHM ALONE. WE ENGINEER FOR HUMAN DESIRE.
              </div>

              <div className="space-y-2.5 sm:space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-[#D50000] flex-shrink-0" />
                  <span>High-retention hooks engineered for MENA attention spans</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-[#D50000] flex-shrink-0" />
                  <span>Full-funnel media buying tuned for blended profitability</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-[#D50000] flex-shrink-0" />
                  <span>Senior creative leadership actively directing every sprint</span>
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
