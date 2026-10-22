import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Globe, Sparkles } from 'lucide-react';
import type { Language, SiteContent } from '../data/content';

interface NavbarProps {
  content: SiteContent;
  lang: Language;
  onToggleLang: () => void;
  onOpenContact: (serviceId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  content,
  lang,
  onToggleLang,
  onOpenContact,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: content.nav.about, href: '#about' },
    { label: content.nav.services, href: '#services' },
    { label: content.nav.work, href: '#work' },
    { label: content.nav.whyUs, href: '#why-us' },
    { label: content.nav.process, href: '#process' },
    { label: content.nav.contact, href: '#contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (href === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = document.querySelector(href);
    if (target) {
      const navOffset = window.innerWidth < 640 ? 70 : 90;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({ top: Math.max(0, targetPos), behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 pt-[env(safe-area-inset-top,0px)] ${
          mobileMenuOpen ? 'hidden' : 'block'
        } ${
          isScrolled
            ? 'bg-[#050505]/92 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.85)] py-2.5 sm:py-3'
            : 'bg-gradient-to-b from-[#050505]/95 via-[#050505]/80 to-transparent backdrop-blur-sm border-b border-white/5 py-3 sm:py-4'
        }`}
      >
        <div className="w-full site-container px-4 sm:px-6 md:px-8">
          <nav className="flex items-center justify-between">
            {/* Logo & Tagline */}
            <a
              href="#home"
              onClick={(e) => handleLinkClick(e, '#home')}
              className="flex items-center gap-2.5 sm:gap-3.5 group focus:outline-none"
              aria-label="Slice Marketing Agency"
            >
              <div className="relative flex items-center justify-center p-1 rounded-xl bg-black/40 border border-white/10 group-hover:border-[#D50000]/60 transition-all duration-300 shadow-[0_0_15px_rgba(213,0,0,0.15)] group-hover:shadow-[0_0_20px_rgba(213,0,0,0.4)]">
                <img
                  src="/assets/slice-logo-badge.png"
                  alt="Slice Marketing Agency"
                  className="h-8 sm:h-10 md:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="hidden sm:flex flex-col text-left rtl:text-right border-l rtl:border-l-0 rtl:border-r border-white/15 pl-3 rtl:pl-0 rtl:pr-3 py-0.5">
                <span className="text-[11px] font-black tracking-wider text-white uppercase group-hover:text-[#FF3333] transition-colors leading-tight">
                  Slice Agency
                </span>
                <span className="text-[9px] uppercase font-bold tracking-widest text-[#FF3333] leading-tight">
                  {content.brandMeta?.tagline || "The Missing Slice Of Your Business"}
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8 bg-white/[0.03] border border-white/10 px-6 py-2 rounded-full backdrop-blur-md shadow-inner">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="text-xs uppercase tracking-wider font-semibold text-neutral-300 hover:text-white transition-colors duration-200 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#D50000] hover:after:w-full after:transition-all after:duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Actions: Facebook, Language Toggle, CTA & Mobile Menu */}
            <div className="flex items-center gap-2 sm:gap-3.5">
              {/* Official Facebook Link Pill */}
              <a
                href={content.brandMeta?.facebookUrl || "https://www.facebook.com/share/1AJhc9aHwe/"}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-white/15 hover:border-[#1877F2]/60 text-neutral-200 hover:text-white transition-all duration-200 bg-white/5 hover:bg-[#1877F2]/15 active:scale-95"
                title="Follow Slice Marketing Agency on Facebook"
                aria-label="Facebook Page"
              >
                <svg className="w-3.5 h-3.5 fill-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-[11px] font-semibold">3K+</span>
              </a>

              {/* Language Switcher */}
              <button
                onClick={onToggleLang}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-white/15 hover:border-white/30 text-neutral-200 hover:text-white transition-all duration-200 bg-white/5 active:bg-white/10"
                title={lang === 'en' ? 'التبديل إلى العربية' : 'Switch to English'}
                aria-label="Toggle Language"
              >
                <Globe className="w-3.5 h-3.5 text-[#D50000]" />
                <span>{content.nav.languageToggle}</span>
              </button>

              {/* Primary CTA */}
              <button
                onClick={() => onOpenContact()}
                className="hidden sm:inline-flex items-center gap-2 bg-[#D50000] hover:bg-[#E50914] text-white text-xs uppercase font-bold tracking-wider px-5 py-2.5 rounded-full transition-all duration-200 shadow-[0_0_15px_rgba(213,0,0,0.4)] hover:shadow-[0_0_24px_rgba(213,0,0,0.7)] hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{content.nav.ctaButton}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg text-neutral-200 hover:text-white hover:bg-white/10 active:bg-white/15 transition-colors focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-[#050505]/98 backdrop-blur-2xl lg:hidden flex flex-col justify-between p-6 sm:p-8 pt-[calc(env(safe-area-inset-top,0px)+1.25rem)] animate-in fade-in duration-200">
          <div>
            {/* Drawer Top Bar */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
              <div className="flex items-center gap-2">
                <img
                  src="/assets/slice-logo-badge.png"
                  alt="Slice Marketing Agency"
                  className="h-9 w-auto object-contain"
                />
                <span className="text-xs uppercase font-black text-white">Slice Agency</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={onToggleLang}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-white/15 text-neutral-200 bg-white/5"
                >
                  <Globe className="w-3.5 h-3.5 text-[#D50000]" />
                  <span>{content.nav.languageToggle}</span>
                </button>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:text-[#D50000] transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="space-y-4 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D50000]/10 border border-[#D50000]/30 text-[#FF3333] text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3" />
                <span>Slice Agency Navigation</span>
              </div>

              <div className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="font-headline text-2xl text-white hover:text-[#D50000] tracking-wide transition-colors py-2.5 border-b border-white/5"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-white/10">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="w-full btn-primary py-3.5 text-sm"
            >
              <span>{content.nav.ctaButton}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <div className="text-center text-xs text-neutral-500">
              Cairo • Dubai • Riyadh
            </div>
          </div>
        </div>
      )}
    </>
  );
};
