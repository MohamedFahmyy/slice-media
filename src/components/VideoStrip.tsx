import React, { useState } from 'react';
import { Sparkles, Volume2, VolumeX, ArrowUpRight } from 'lucide-react';
import type { SiteContent } from '../data/content';

interface VideoStripProps {
  content: SiteContent;
  onStartCampaign: () => void;
}

export const VideoStrip: React.FC<VideoStripProps> = ({
  content,
  onStartCampaign,
}) => {
  const [activeIndex, setActiveIndex] = useState(1); // default active is center
  const [isMuted, setIsMuted] = useState(true);

  const formats = content.videoStripSection.formats;
  const count = formats.length;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + count) % count);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % count);
  };

  const getCardStyle = (index: number) => {
    // Calculate circular relative offset
    let diff = (index - activeIndex + count) % count;
    if (diff > count / 2) diff -= count;

    if (diff === 0) {
      // Active center card
      return {
        className: 'video-wrap cards-ready card-active z-30',
        style: {
          opacity: 1,
          filter: 'blur(0px)',
          transform: 'translateX(0%) scale(1) rotate(0deg)',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        },
      };
    } else if (diff === -1 || (diff === count - 1 && count <= 3)) {
      // Prev left card
      return {
        className: 'video-wrap cards-ready card-prev z-20 cursor-pointer',
        style: {
          opacity: 0.75,
          filter: 'blur(4px)',
          transform: 'translateX(-52%) scale(0.86) rotate(-4deg)',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        },
      };
    } else if (diff === 1 || (diff === -(count - 1) && count <= 3)) {
      // Next right card
      return {
        className: 'video-wrap cards-ready card-next z-20 cursor-pointer',
        style: {
          opacity: 0.75,
          filter: 'blur(4px)',
          transform: 'translateX(52%) scale(0.86) rotate(4deg)',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        },
      };
    } else {
      // Hidden behind
      return {
        className: 'video-wrap cards-ready card-hidden z-10 pointer-events-none',
        style: {
          opacity: 0,
          filter: 'blur(8px)',
          transform: `translateX(${diff > 0 ? '70%' : '-70%'}) scale(0.7) rotate(0deg)`,
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        },
      };
    }
  };

  const activeFormat = formats[activeIndex];

  return (
    <section className="py-14 sm:py-24 md:py-36 lg:py-44 bg-[#070707] relative overflow-hidden border-b border-white/5">
      {/* Ambient Red Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[700px] h-[350px] sm:h-[500px] bg-[#D50000]/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-grid-subtle opacity-30 pointer-events-none" />

      <div className="site-container relative z-10">
        
        {/* Section Header with Generous Negative Space */}
        <div className="max-w-4xl mx-auto text-center mb-10 sm:mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#D50000]/10 border border-[#D50000]/30 text-[#FF3333] text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-4 sm:mb-6 shadow-[0_0_15px_rgba(213,0,0,0.15)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{content.videoStripSection.badge}</span>
          </div>

          <h2 className="font-headline text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-tight leading-[0.98] rtl:leading-[1.18] mb-4 sm:mb-8">
            {content.videoStripSection.headline}
          </h2>

          <p className="text-sm sm:text-lg md:text-xl text-neutral-300 font-normal leading-relaxed max-w-2xl mx-auto">
            {content.videoStripSection.subheadline}
          </p>
        </div>

        {/* Format Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 mb-8 sm:mb-16 px-2">
          {formats.map((fmt, idx) => {
            const isSelected = activeIndex === idx;
            return (
              <button
                key={fmt.id}
                onClick={() => setActiveIndex(idx)}
                className={`px-3 py-1.5 sm:px-6 sm:py-2.5 rounded-full text-[11px] sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                  isSelected
                    ? 'bg-[#D50000] text-white shadow-[0_0_20px_rgba(213,0,0,0.4)] border border-[#D50000]'
                    : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                {fmt.name}
              </button>
            );
          })}
        </div>

        {/* 3D Video Strip Deck Component */}
        <div className="video-strip-wrap relative max-w-[980px] mx-auto py-4 sm:py-8 px-1 sm:px-6 overflow-hidden">
          
          {/* Audio toggle overlay */}
          <div className="absolute top-2 right-2 sm:right-10 z-40">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[11px] sm:text-xs text-neutral-300 hover:text-white hover:border-[#D50000] transition-colors"
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-[#D50000]" />
                  <span>Unmute Video</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-white" />
                  <span>Mute Audio</span>
                </>
              )}
            </button>
          </div>

          {/* Video Strip Stage */}
          <div className="video-strip relative h-[400px] xs:h-[460px] sm:h-[530px] md:h-[600px] flex items-center justify-center">
            {formats.map((format, idx) => {
              const card = getCardStyle(idx);
              const isActive = activeIndex === idx;

              return (
                <div
                  key={format.id}
                  onClick={() => !isActive && setActiveIndex(idx)}
                  className={`absolute top-0 bottom-0 w-[210px] xs:w-[245px] sm:w-[290px] md:w-[330px] rounded-[20px] sm:rounded-[28px] overflow-hidden border-2 ${
                    isActive
                      ? 'border-[#D50000] shadow-[0_15px_45px_rgba(213,0,0,0.35)]'
                      : 'border-white/10 shadow-2xl hover:border-white/30'
                  } bg-[#111111] ${card.className}`}
                  style={card.style}
                >
                  {/* Top Badge Overlay */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full text-white border border-white/10 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D50000] animate-pulse" />
                      {format.badge}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400 bg-black/60 px-2 py-0.5 rounded-md">
                      0{idx + 1}
                    </span>
                  </div>

                  {/* Vimeo Lazy Frame */}
                  <div className="w-full h-full relative bg-black">
                    <iframe
                      loading="lazy"
                      src={`https://player.vimeo.com/video/${format.vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479&loop=1&muted=${
                        isMuted ? '1' : '0'
                      }&title=0&byline=0&portrait=0`}
                      className="w-full h-full object-cover"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      title={format.name}
                      data-ready="true"
                    />
                  </div>

                  {/* Gradient Footer Info Overlay */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 sm:p-5 z-20 text-left rtl:text-right">
                    <div className="text-[10px] sm:text-xs uppercase font-bold text-[#FF3333] tracking-widest mb-1">
                      {format.tagline}
                    </div>
                    <div className="font-headline text-lg sm:text-xl text-white leading-tight">
                      {format.name}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Arrows with User's Exact SVGs */}
          <button
            onClick={handlePrev}
            className="vs-arrow vs-arrow--prev absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-13 sm:h-13 rounded-full bg-black/80 backdrop-blur-md border border-white/15 hover:border-[#D50000] flex items-center justify-center text-white hover:text-[#D50000] hover:bg-black transition-all shadow-xl"
            aria-label="Previous video"
          >
            <svg width="14" height="14" className="sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5"></path>
              <path d="m12 19-7-7 7-7"></path>
            </svg>
          </button>

          <button
            onClick={handleNext}
            className="vs-arrow vs-arrow--next absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-13 sm:h-13 rounded-full bg-black/80 backdrop-blur-md border border-white/15 hover:border-[#D50000] flex items-center justify-center text-white hover:text-[#D50000] hover:bg-black transition-all shadow-xl"
            aria-label="Next video"
          >
            <svg width="14" height="14" className="sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </button>

          {/* Video Dots Indicator */}
          <div className="video-dots flex items-center justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8 z-40">
            {formats.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setActiveIndex(dotIdx)}
                className={`video-dot transition-all duration-300 rounded-full ${
                  activeIndex === dotIdx
                    ? 'active w-6 sm:w-8 h-1.5 sm:h-2 bg-[#D50000]'
                    : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to slide ${dotIdx + 1}`}
              />
            ))}
          </div>

        </div>

        {/* Active Format Editorial Context Card */}
        <div className="max-w-2xl mx-auto mt-8 sm:mt-12 p-5 sm:p-8 rounded-2xl bg-[#0F0F0F] border border-white/10 text-center relative shadow-xl">
          <div className="text-[11px] sm:text-xs uppercase font-bold text-[#FF3333] tracking-widest mb-1.5 sm:mb-2">
            Format Psychology // {activeFormat.tagline}
          </div>
          <h3 className="font-headline text-xl sm:text-3xl text-white mb-2 sm:mb-3">
            {activeFormat.name}
          </h3>
          <p className="text-xs sm:text-base text-neutral-300 leading-relaxed mb-5 sm:mb-6">
            {activeFormat.description}
          </p>
          <button
            onClick={onStartCampaign}
            className="btn-primary w-full sm:w-auto text-xs py-3 px-6 inline-flex items-center justify-center gap-2"
          >
            <span>Produce {activeFormat.name} Campaign</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
