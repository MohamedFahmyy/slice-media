import React, { useState, useEffect } from 'react';
import { contentMap, type Language } from './data/content';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BrandIntro } from './components/BrandIntro';
import { Services } from './components/Services';
import { VideoStrip } from './components/VideoStrip';
import { Portfolio } from './components/Portfolio';
import { WhySlice } from './components/WhySlice';
import { OurProcess } from './components/OurProcess';
import { ValueProposition } from './components/ValueProposition';
import { Testimonials } from './components/Testimonials';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AdminProvider } from './admin/AdminContext';
import { AdminRoot } from './admin/AdminRoot';

const PublicSite: React.FC<{
  onOpenAdmin: () => void;
}> = ({ onOpenAdmin }) => {
  const [lang, setLang] = useState<Language>('en');
  const [preselectedService, setPreselectedService] = useState<string>('');

  const content = contentMap[lang];

  useEffect(() => {
    // Reset scroll position on load
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    // Update HTML dir and lang attributes
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const scrollToSection = (sectionId: string) => {
    if (sectionId === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.querySelector(sectionId);
    if (el) {
      const navOffset = window.innerWidth < 640 ? 70 : 90;
      const targetPos = el.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({ top: Math.max(0, targetPos), behavior: 'smooth' });
    }
  };

  const handleOpenContactWithService = (serviceName?: string) => {
    if (serviceName) {
      setPreselectedService(serviceName);
    }
    scrollToSection('#contact');
  };

  return (
    <div className={`min-h-screen bg-[#050505] text-[#FFFFFF] ${lang === 'ar' ? 'font-ar' : 'font-sans'}`}>
      {/* Top Capsule Navigation */}
      <Navbar
        content={content}
        lang={lang}
        onToggleLang={handleToggleLang}
        onOpenContact={handleOpenContactWithService}
      />

      <main>
        {/* Hero Section */}
        <Hero
          content={content}
          onExploreWork={() => scrollToSection('#work')}
          onStartProject={() => handleOpenContactWithService()}
        />

        {/* Brand Introduction */}
        <BrandIntro
          content={content}
          onLearnMoreServices={() => scrollToSection('#services')}
        />

        {/* Core Capabilities / Services */}
        <Services
          content={content}
          onSelectService={handleOpenContactWithService}
        />

        {/* 3D Video Strip / Content Formats Showcase */}
        <VideoStrip
          content={content}
          onStartCampaign={() => handleOpenContactWithService('Viral Content Creation & Video Strip')}
        />

        {/* Featured Work / Portfolio */}
        <Portfolio
          content={content}
          onInquireSimilar={(brandName) => handleOpenContactWithService(`Strategy blueprint inspired by ${brandName}`)}
        />

        {/* Why Slice Methodology */}
        <WhySlice content={content} />

        {/* 4-Step Agency Process */}
        <OurProcess content={content} />

        {/* Results & Value Proposition */}
        <ValueProposition
          content={content}
          onConsultationClick={() => handleOpenContactWithService('Strategic Brand Audit')}
        />

        {/* Collaboration Standard / Partnership Pledge */}
        <Testimonials content={content} />

        {/* Contact & Project Intake Form */}
        <Contact
          content={content}
          preselectedService={preselectedService}
        />
      </main>

      {/* Footer */}
      <Footer
        content={content}
        onNavigate={scrollToSection}
        onOpenAdmin={onOpenAdmin}
      />

      {/* Floating Fast Action Pill (Facebook & Contact) */}
      <aside aria-label="Quick Communication" className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5">
        <a
          href={content.brandMeta?.facebookUrl || "https://www.facebook.com/share/1AJhc9aHwe/"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#1877F2] text-white text-xs font-bold shadow-[0_4px_20px_rgba(24,119,242,0.5)] hover:bg-[#166fe5] hover:scale-105 active:scale-95 transition-all"
          title="Visit Slice Marketing Agency on Facebook"
        >
          <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span className="hidden sm:inline">Facebook</span>
        </a>

        <button
          onClick={() => scrollToSection('#contact')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#D50000] text-white text-xs font-bold shadow-[0_4px_20px_rgba(213,0,0,0.5)] hover:bg-[#e50914] hover:scale-105 active:scale-95 transition-all uppercase tracking-wider"
        >
          <span>{lang === 'ar' ? 'ابدأ مشروعك' : "Let's Talk"}</span>
        </button>
      </aside>
    </div>
  );
};

export const App: React.FC = () => {
  const [isAdminView, setIsAdminView] = useState<boolean>(() => {
    return (
      window.location.pathname.startsWith('/admin') ||
      window.location.hash.startsWith('#admin')
    );
  });

  useEffect(() => {
    const handleUrlChange = () => {
      const isNowAdmin =
        window.location.pathname.startsWith('/admin') ||
        window.location.hash.startsWith('#admin');
      setIsAdminView(isNowAdmin);
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const navigateToAdmin = () => {
    window.history.pushState(null, '', '#admin');
    setIsAdminView(true);
  };

  const navigateToSite = () => {
    window.history.pushState(null, '', '#');
    setIsAdminView(false);
  };

  return (
    <AdminProvider>
      {isAdminView ? (
        <AdminRoot onBackToSite={navigateToSite} />
      ) : (
        <PublicSite onOpenAdmin={navigateToAdmin} />
      )}
    </AdminProvider>
  );
};

export default App;
