import React, { useState } from 'react';
import { ArrowUpRight, Sparkles, Layers, CheckCircle2, X } from 'lucide-react';
import type { PortfolioItem, SiteContent } from '../data/content';

interface PortfolioProps {
  content: SiteContent;
  onInquireSimilar: (brandName: string) => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({
  content,
  onInquireSimilar,
}) => {
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);

  return (
    <section id="work" className="py-14 sm:py-24 md:py-36 lg:py-44 bg-[#0A0A0A] relative border-b border-white/5">
      {/* Glow */}
      <div className="absolute top-1/3 right-0 w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] bg-[#D50000]/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="site-container relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-20 md:mb-24 text-left rtl:text-right">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#D50000]/10 border border-[#D50000]/30 text-[#FF3333] text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-4 sm:mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{content.portfolioSection.badge}</span>
          </div>

          <h2 className="font-headline text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-none mb-4 sm:mb-7">
            {content.portfolioSection.headline}
          </h2>

          <p className="text-sm sm:text-lg text-neutral-300 leading-relaxed mb-4 sm:mb-6">
            {content.portfolioSection.subheadline}
          </p>

          <div className="p-3.5 sm:p-4 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-neutral-300 flex items-center gap-2.5 sm:gap-3">
            <Layers className="w-4 h-4 text-[#D50000] flex-shrink-0" />
            <span>{content.portfolioSection.conceptNote}</span>
          </div>
        </div>

        {/* Portfolio Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {content.portfolioSection.items.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group slice-card flex flex-col justify-between cursor-pointer border border-white/10 hover:border-[#D50000]/70 transition-all duration-300"
            >
              <div>
                {/* Visual Image Banner */}
                <div className="relative aspect-[4/5] overflow-hidden bg-[#181818]">
                  <img
                    src={project.image}
                    alt={project.brandName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Concept Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="badge-red shadow-md">
                      {project.conceptBadgeText}
                    </span>
                  </div>

                  {/* Arrow Floating Button */}
                  <div className="absolute bottom-4 right-4 z-10 w-11 h-11 rounded-full bg-black/75 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-[#D50000] group-hover:border-[#D50000] transition-all duration-300">
                    <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-6 sm:p-7">
                  <div className="text-xs uppercase font-bold text-[#FF3333] tracking-widest mb-1.5">
                    {project.industry}
                  </div>

                  <h3 className="font-headline text-2xl sm:text-3xl text-white mb-3 group-hover:text-[#FF3333] transition-colors">
                    {project.brandName}
                  </h3>

                  <p className="text-sm text-neutral-400 leading-relaxed mb-6">
                    {project.summary}
                  </p>

                  {/* Services Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {project.services.map((srv, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-semibold text-neutral-300 bg-white/5 px-2.5 py-1 rounded-md border border-white/5"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="px-6 sm:px-7 pb-6 pt-0 border-t border-white/5 mt-2">
                <span className="text-xs font-bold text-white group-hover:text-[#D50000] transition-colors inline-flex items-center gap-1">
                  <span>{content.portfolioSection.viewCaseStudy}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Case Blueprint Modal */}
      {selectedProject && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-[#121212] border border-white/15 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-10 relative shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <span className="badge-red text-xs">
                {selectedProject.conceptBadgeText}
              </span>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-neutral-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-8">
              <div className="md:col-span-5 rounded-xl overflow-hidden border border-white/10 aspect-[4/5] bg-black">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.brandName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="md:col-span-7 space-y-6 text-left rtl:text-right">
                <div>
                  <div className="text-xs uppercase tracking-widest text-[#FF3333] font-bold mb-1">
                    {selectedProject.industry}
                  </div>
                  <h3 className="font-headline text-3xl sm:text-4xl text-white">
                    {selectedProject.brandName}
                  </h3>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wider text-neutral-400 font-bold mb-2">
                    The Strategic Challenge:
                  </div>
                  <p className="text-sm text-neutral-300 leading-relaxed bg-white/5 p-3.5 rounded-xl border border-white/5">
                    {selectedProject.challenge}
                  </p>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wider text-neutral-400 font-bold mb-2">
                    The Slice Solution:
                  </div>
                  <p className="text-sm text-neutral-300 leading-relaxed bg-white/5 p-3.5 rounded-xl border border-white/5">
                    {selectedProject.solution}
                  </p>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wider text-neutral-400 font-bold mb-2">
                    Deliverables & Creative Assets:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedProject.deliverables.map((d, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-neutral-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#D50000] flex-shrink-0" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 bg-[#D50000]/10 border border-[#D50000]/30 rounded-xl">
                  <div className="text-xs font-bold uppercase text-[#FF3333] mb-1">
                    Commercial Focus:
                  </div>
                  <div className="text-xs text-white">
                    {selectedProject.keyOutcome}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setSelectedProject(null)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-bold text-neutral-400 hover:text-white transition-colors"
              >
                Close Blueprint
              </button>
              <button
                onClick={() => {
                  const bName = selectedProject.brandName;
                  setSelectedProject(null);
                  onInquireSimilar(bName);
                }}
                className="w-full sm:w-auto btn-primary py-2.5 px-7 text-xs"
              >
                Discuss Similar Strategy For My Brand
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
