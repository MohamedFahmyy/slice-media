import React, { useState } from 'react';
import { Sparkles, Calendar, CheckCircle2 } from 'lucide-react';
import type { SiteContent } from '../data/content';

interface OurProcessProps {
  content: SiteContent;
}

export const OurProcess: React.FC<OurProcessProps> = ({ content }) => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="process" className="py-28 md:py-36 lg:py-44 bg-[#0A0A0A] relative border-b border-white/5">
      <div className="site-container">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-20 md:mb-24 text-left rtl:text-right">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D50000]/10 border border-[#D50000]/30 text-[#FF3333] text-xs font-bold uppercase tracking-wider mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{content.processSection.badge}</span>
          </div>

          <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-none mb-7">
            {content.processSection.headline}
          </h2>

          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
            {content.processSection.subheadline}
          </p>
        </div>

        {/* Process Horizontal Navigation & Interactive Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16">
          {content.processSection.steps.map((step, idx) => {
            const isSelected = activeStep === idx;
            return (
              <div
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`cursor-pointer rounded-2xl p-8 sm:p-9 border transition-all duration-300 relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#181818] border-[#D50000] shadow-[0_10px_30px_rgba(213,0,0,0.18)]'
                    : 'bg-[#101010] border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`font-headline text-3xl sm:text-4xl transition-colors ${
                        isSelected ? 'text-[#D50000]' : 'text-neutral-600'
                      }`}
                    >
                      {step.step}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                      <Calendar className="w-3 h-3 text-[#D50000]" />
                      {step.timeline}
                    </span>
                  </div>

                  <h3 className="font-headline text-xl text-white mb-3">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Bottom Step Indicator */}
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                    Phase {step.step}
                  </span>
                  <div
                    className={`w-2 h-2 rounded-full transition-all ${
                      isSelected ? 'bg-[#D50000] scale-125' : 'bg-white/20'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Highlight Focus Card for Active Step */}
        <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-[#141414] via-[#111111] to-[#141414] border border-[#D50000]/30 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 text-left rtl:text-right">
              <div className="text-xs font-bold uppercase tracking-widest text-[#FF3333] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D50000]" />
                Active Focus: Stage {content.processSection.steps[activeStep].step} — {content.processSection.steps[activeStep].title}
              </div>
              <p className="text-sm md:text-base text-neutral-300 max-w-2xl">
                {content.processSection.steps[activeStep].description}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-neutral-400">Duration:</span>
              <span className="px-3 py-1.5 rounded-lg bg-[#D50000]/10 border border-[#D50000]/40 text-[#FF3333] text-xs font-bold">
                {content.processSection.steps[activeStep].timeline}
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
