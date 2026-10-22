import { ArrowUp } from 'lucide-react';
import type { SiteContent } from '../data/content';

interface FooterProps {
  content: SiteContent;
  onNavigate: (href: string) => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ content, onNavigate, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { label: content.nav.home, href: '#home' },
    { label: content.nav.about, href: '#about' },
    { label: content.nav.services, href: '#services' },
    { label: content.nav.work, href: '#work' },
    { label: content.nav.whyUs, href: '#why-us' },
    { label: content.nav.process, href: '#process' },
    { label: content.nav.contact, href: '#contact' },
  ];

  const servicesList = [
    "Social Media Management",
    "Content Strategy & Creation",
    "Paid Ads & Performance",
    "Branding & Visual Identity",
    "UGC & Short-Form Video",
    "Influencer Marketing",
    "Creative Campaigns",
    "Digital Marketing Consulting"
  ];

  return (
    <footer className="bg-[#050505] text-neutral-400 pt-14 pb-8 sm:pt-20 sm:pb-12 border-t border-white/10 relative">
      <div className="site-container">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-12 mb-10 sm:mb-16 text-left rtl:text-right">
          
          {/* Brand & Agency Bio */}
          <div className="lg:col-span-5 space-y-6">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollToTop();
              }}
              className="inline-flex items-center gap-3 group"
            >
              <div className="p-1 rounded-xl bg-white/5 border border-white/10 group-hover:border-[#D50000]/60 transition-colors">
                <img
                  src="/assets/slice-logo-badge.png"
                  alt="Slice Marketing Agency"
                  className="h-10 sm:h-12 w-auto object-contain"
                />
              </div>
              <div className="flex flex-col text-left rtl:text-right">
                <span className="text-sm font-black tracking-wider text-white uppercase group-hover:text-[#FF3333] transition-colors">
                  Slice Agency
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF3333]">
                  {content.brandMeta?.tagline || "The Missing Slice Of Your Business"}
                </span>
              </div>
            </a>

            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
              {content.footer.description}
            </p>

            {/* Social Channels with Facebook prominently highlighted */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Official Facebook Link */}
              <a
                href={content.brandMeta?.facebookUrl || "https://www.facebook.com/share/1AJhc9aHwe/"}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 px-4 rounded-full bg-[#1877F2]/15 hover:bg-[#1877F2]/25 border border-[#1877F2]/40 flex items-center gap-2 text-white transition-all duration-200 group/fb shadow-[0_0_15px_rgba(24,119,242,0.2)]"
                title="Follow Slice on Facebook"
              >
                <svg className="w-4 h-4 fill-[#1877F2] group-hover/fb:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-xs font-bold">Facebook (3K+)</span>
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:text-[#D50000] hover:border-[#D50000] transition-colors"
                title="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:text-[#D50000] hover:border-[#D50000] transition-colors"
                title="TikTok (Agency Profile Placeholder)"
              >
                <span className="font-bold text-xs tracking-tighter">TT</span>
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:text-[#D50000] hover:border-[#D50000] transition-colors"
                title="LinkedIn (Agency Profile Placeholder)"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>

            <div className="text-[11px] text-neutral-400">
              Official Facebook Page: <a href="https://www.facebook.com/share/1AJhc9aHwe/" target="_blank" rel="noopener noreferrer" className="text-[#1877F2] hover:underline font-bold">Slice Marketing Agency</a> (3K+ Followers)
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2 space-y-4">
            <div className="text-xs font-bold uppercase tracking-widest text-white">
              {content.footer.quickLinks}
            </div>
            <ul className="space-y-2.5 text-sm">
              {navItems.map((item, idx) => (
                <li key={idx}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(item.href);
                    }}
                    className="hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div className="lg:col-span-3 space-y-4">
            <div className="text-xs font-bold uppercase tracking-widest text-white">
              {content.footer.servicesTitle}
            </div>
            <ul className="space-y-2 text-xs">
              {servicesList.map((srv, idx) => (
                <li key={idx}>
                  <a
                    href="#services"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate('#services');
                    }}
                    className="hover:text-[#FF3333] transition-colors"
                  >
                    {srv}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Regional Hubs & Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="text-xs font-bold uppercase tracking-widest text-white">
              {content.footer.locationsTitle}
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <div className="text-white font-semibold">Cairo Hub</div>
                <div className="text-neutral-400">New Cairo / Production Lab</div>
              </div>
              <div>
                <div className="text-white font-semibold">Dubai Hub</div>
                <div className="text-neutral-400">Business Bay / Client Desk</div>
              </div>
              <div>
                <div className="text-white font-semibold">Riyadh Hub</div>
                <div className="text-neutral-400">Olaya / Growth Relations</div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-neutral-400 text-center md:text-left rtl:md:text-right">
            {content.footer.copyright}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer text-[11px] font-mono uppercase tracking-wider"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#D50000] animate-pulse" />
                Staff Portal
              </button>
            )}

            <div className="text-neutral-400 text-center md:text-right rtl:md:text-left max-w-xs sm:max-w-md">
              {content.footer.disclaimer}
            </div>
          </div>

          <button
            onClick={scrollToTop}
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#D50000] hover:border-[#D50000] transition-all flex-shrink-0 cursor-pointer"
            aria-label="Back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
};
