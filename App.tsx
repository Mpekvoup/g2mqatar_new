import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Language } from './types';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Team from './components/Team';
import Principles from './components/Principles';
import Strategy from './components/Strategy';
import ContactForm from './components/ContactForm';
import Partners from './components/Partners';
import CaseStudiesPage from './components/CaseStudies';
import CaseStudyDetail from './components/CaseStudyDetail';
import ServiceDetailPage from './components/ServiceDetailPage';
import PrivacyPage from './components/PrivacyPage';
import TermsPage from './components/TermsPage';
import NotFoundPage from './components/NotFoundPage';
import Footer from './components/Footer';
import Testimonials from './components/Testimonials';
import BusinessGoals from './components/BusinessGoals';
import OurInsights from './components/OurInsights';
import WhatsAppWidget from './components/WhatsAppWidget';
import ScrollToTopOnNavigate from './components/ScrollToTopOnNavigate';

const HomePage: React.FC<{ lang: Language; setLang: (l: Language) => void }> = ({ lang, setLang }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header lang={lang} setLang={setLang} />
      <main className="flex-grow">
        <Hero lang={lang} />
        <Services lang={lang} />
        <BusinessGoals lang={lang} />
        <Team lang={lang} />
        <Testimonials lang={lang} />
        {/* <OurInsights lang={lang} /> */}
        <Principles lang={lang} />
        <Strategy lang={lang} />
        <ContactForm lang={lang} />
        <Partners lang={lang} />
      </main>
      <Footer lang={lang} />
      <WhatsAppWidget lang={lang} photoUrl="/images/about/avatar.jpg" />
    </div>
  );
};

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll(); // Check initial scroll position
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Don't render anything during SSR or before hydration
  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
      className={`fixed bottom-32 right-10 z-50 w-12 h-12 bg-white border border-slate-200 text-slate-700 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-qatar-maroon hover:text-white hover:border-qatar-maroon hover:scale-110 active:scale-95 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');

  return (
    <>
      <ScrollToTop />
      <ScrollToTopOnNavigate />
      <Routes>
        <Route path="/" element={<HomePage lang={lang} setLang={setLang} />} />
        <Route path="/case-studies" element={<CaseStudiesPage lang={lang} setLang={setLang} />} />
        <Route path="/case-studies/:slug" element={<CaseStudyDetail lang={lang} setLang={setLang} />} />
        <Route path="/services/:slug" element={<ServiceDetailPage lang={lang} setLang={setLang} />} />
        <Route path="/privacy" element={<PrivacyPage lang={lang} setLang={setLang} />} />
        <Route path="/terms" element={<TermsPage lang={lang} setLang={setLang} />} />
        <Route path="*" element={<NotFoundPage lang={lang} setLang={setLang} />} />
      </Routes>
    </>
  );
};

export default App;