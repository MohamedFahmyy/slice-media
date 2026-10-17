import React, { useState } from 'react';
import { ArrowUpRight, Play, Pause, Volume2, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';
import type { SiteContent } from '../data/content';

interface HeroProps {
  content: SiteContent;
  onExploreWork: () => void;
  onStartProject: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  content,
  onExploreWork,
  onStartProject,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);

  const tickerKeywords = [
    "VIRAL SHORT-FORM VIDEO",
    "PERFORMANCE MEDIA BUYING",
    "UGC CREATOR NETWORK",
    "BRANDING & VISUAL IDENTITY",
    "FULL-FUNNEL CONVERSION",
    "CREATIVE CAMPAIGNS",
    "CAIRO",
    "DUBAI",
    "RIYADH"
  ];

  return (
    <section id="home" className="relative pt-28 xs:pt-32 sm:pt-44 md:pt-52 pb-14 sm:pb-20 md:pb-28 overflow-hidden bg-[#050505]">
      {/* Ambient Red Atmospheric Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[550px] md:w-[750px] h-[250px] sm:h-[350px] md:h-[450px] bg-[#D50000]/15 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-10 right-0 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-[#D50000]/10 blur-[90px] pointer-events-none rounded-full" />
      
      {/* Background Subtle Grid Texture */}
      <div className="absolute inset-0 bg-grid-subtle opacity-40 pointer-events-none" />

      <div className="site-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Column: Bold Editorial Typography & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left rtl:text-right">
            
            {/* Top Subhead Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D50000]/10 border border-[#D50000]/30 text-[#FF3333] text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-5 sm:mb-8 w-fit shadow-[0_0_12px_rgba(213,0,0,0.2)]">
              <span className="pulse-dot" />
              <span>{content.hero.badge}</span>
            </div>

            {/* Massive Editorial Headline */}
            <h1 className="font-headline text-3xl xs:text-4xl sm:text-6xl md:text-7xl xl:text-8xl text-white leading-[0.98] rtl:leading-[1.18] tracking-tight mb-5 sm:mb-8">
              {content.hero.headlinePart1}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D50000] via-[#FF2B2B] to-[#FF6B6B] italic font-black relative inline-block">
                {content.hero.headlineHighlight}
                <span className="absolute left-0 bottom-0.5 w-full h-[3px] bg-[#D50000] rounded-full opacity-80" />
              </span>{' '}
              {content.hero.headlinePart2}
            </h1>

            {/* Supporting Text */}
            <p className="text-sm xs:text-base sm:text-lg md:text-xl text-neutral-300 leading-relaxed max-w-2xl mb-8 sm:mb-10 font-normal">
              {content.hero.supportingText}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5 mb-10 sm:mb-12">
              <button
                onClick={onStartProject}
                className="btn-primary w-full sm:w-auto py-3.5 px-6 sm:py-4 sm:px-8 text-center justify-center group"
              >
                <span>{content.hero.primaryCta}</span>
                <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <button
                onClick={onExploreWork}
                className="btn-secondary w-full sm:w-auto py-3.5 px-6 sm:py-4 sm:px-8 text-center justify-center group"
              >
                <span>{content.hero.secondaryCta}</span>
                <span className="w-2 h-2 rounded-full bg-[#D50000] transition-transform duration-300 group-hover:scale-150" />
              </button>
            </div>

            {/* Credibility Indicator Bars */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div>
                <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-1">
                  Target Markets
                </div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D50000]" />
                  <span>Egypt & GCC (Gulf)</span>
                </div>
              </div>

              <div>
                <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-1">
                  Creative Standard
                </div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#D50000]" />
                  <span>Senior Lead Direction</span>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-1">
                  Optimization Pace
                </div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#D50000]" />
                  <span>Daily Iteration</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Video Reel Composition */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[340px] sm:max-w-[380px]">
              
              {/* Decorative Frame Glow */}
              <div className="absolute -inset-1 bg-gradient-to-b from-[#D50000] to-transparent rounded-3xl opacity-35 blur-xl -z-10" />

              {/* Mobile Phone / Reel Aspect Ratio Card */}
              <div className="relative rounded-[28px] overflow-hidden border-2 border-white/15 bg-[#141414] shadow-2xl shadow-black/80 aspect-[9/16]">
                
                {/* Background Image */}
                <img
                  src="/assets/hero-reel.jpg"
                  alt="Slice Creative Studio Shoot"
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    isPlaying ? 'scale-105' : 'scale-100'
                  }`}
                />

                {/* Subtle Cinematic Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 pointer-events-none" />

                {/* Top Overlay Header */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[11px] font-bold text-white tracking-wide">
                    <span className="w-2 h-2 rounded-full bg-[#D50000] animate-pulse" />
                    <span>REC // SLICE STUDIO</span>
                  </div>

                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:text-[#D50000] transition-colors"
                    aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                  </button>
                </div>

                {/* Floating Retaining Hook Pill */}
                <div className="absolute top-16 left-4 right-4 z-20">
                  <div className="bg-[#121212]/85 backdrop-blur-md border border-[#D50000]/40 p-3 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between text-[11px] font-bold text-neutral-300 mb-1">
                      <span className="text-[#FF3333] uppercase flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {content.hero.viralHookBadge}
                      </span>
                      <span>96% Retention</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#D50000] h-full w-[94%]" />
                    </div>
                  </div>
                </div>

                {/* Bottom Card Information */}
                <div className="absolute bottom-4 left-4 right-4 z-20 space-y-3">
                  
                  {/* Audio Equalizer & Title */}
                  <div className="flex items-center justify-between bg-black/70 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-2.5">
                      <Volume2 className="w-4 h-4 text-[#D50000]" />
                      <div className="text-left rtl:text-right">
                        <div className="text-[11px] font-bold text-white leading-tight">
                          Original Sound • Viral Hook Architecture
                        </div>
                        <div className="text-[10px] text-neutral-400">
                          {content.hero.reelLabel}
                        </div>
                      </div>
                    </div>

                    {/* Equalizer Wave simulation */}
                    <div className="flex items-end gap-0.5 h-4">
                      <span className={`w-1 bg-[#D50000] rounded-full transition-all duration-300 ${isPlaying ? 'h-3 animate-pulse' : 'h-1'}`} />
                      <span className={`w-1 bg-[#D50000] rounded-full transition-all duration-300 ${isPlaying ? 'h-4 animate-bounce' : 'h-1.5'}`} />
                      <span className={`w-1 bg-white rounded-full transition-all duration-300 ${isPlaying ? 'h-2 animate-pulse' : 'h-1'}`} />
                      <span className={`w-1 bg-[#D50000] rounded-full transition-all duration-300 ${isPlaying ? 'h-3.5 animate-bounce' : 'h-2'}`} />
                    </div>
                  </div>

                  {/* Core Value Pill */}
                  <div className="bg-[#D50000] text-white text-[11px] font-bold text-center py-2 px-3 rounded-xl tracking-wider uppercase shadow-md shadow-[#D50000]/30">
                    {content.hero.viewsTicker}
                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Infinite Marquee Ticker */}
      <div className="mt-16 sm:mt-24 border-y border-white/10 bg-[#0A0A0A] py-3.5 overflow-hidden">
        <div className="marquee-container">
          <div className="marquee-content flex items-center gap-8">
            {tickerKeywords.concat(tickerKeywords).map((word, idx) => (
              <div key={idx} className="flex items-center gap-8 flex-shrink-0">
                <span className="font-headline text-lg sm:text-xl text-neutral-400 tracking-wider hover:text-white transition-colors">
                  {word}
                </span>
                <span className="w-2 h-2 rounded-full bg-[#D50000]" />
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};
