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
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          mobileMenuOpen ? 'hidden' : 'block'
        } ${isScrolled ? 'py-3' : 'py-5'}`}
      >
        <div className="site-container">
          <nav className="nav-capsule flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3">
            {/* Logo */}
            <a
              href="#home"
              onClick={(e) => handleLinkClick(e, '#home')}
              className="flex items-center gap-3 group focus:outline-none"
              aria-label="Slice Marketing Agency"
            >
              <img
                src="/assets/slice-logo-full.png"
                alt="Slice Marketing Agency Logo"
                className="h-9 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-7">
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

            {/* Actions: Language Toggle & CTA */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Language Switcher */}
              <button
                onClick={onToggleLang}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-white/10 hover:border-white/30 text-neutral-300 hover:text-white transition-all duration-200 bg-white/5"
                title={lang === 'en' ? 'التبديل إلى العربية' : 'Switch to English'}
                aria-label="Toggle Language"
              >
                <Globe className="w-3.5 h-3.5 text-[#D50000]" />
                <span>{content.nav.languageToggle}</span>
              </button>

              {/* Primary CTA */}
              <button
                onClick={() => onOpenContact()}
                className="hidden sm:inline-flex items-center gap-2 bg-[#D50000] hover:bg-[#E50914] text-white text-xs uppercase font-bold tracking-wider px-5 py-2.5 rounded-full transition-all duration-200 shadow-[0_0_15px_rgba(213,0,0,0.4)] hover:shadow-[0_0_22px_rgba(213,0,0,0.65)] hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{content.nav.ctaButton}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-full text-neutral-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
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
        <div className="fixed inset-0 z-50 bg-black/98 backdrop-blur-2xl lg:hidden flex flex-col justify-between p-6 sm:p-8 animate-in fade-in duration-200">
          <div>
            {/* Drawer Top Bar */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
              <img
                src="/assets/slice-logo-full.png"
                alt="Slice Marketing Agency Logo"
                className="h-9 w-auto object-contain"
              />
              <div className="flex items-center gap-3">
                <button
                  onClick={onToggleLang}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-white/10 text-neutral-200 bg-white/5"
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
