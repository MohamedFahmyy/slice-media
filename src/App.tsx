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
    // Update HTML dir and lang attributes
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.querySelector(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
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
