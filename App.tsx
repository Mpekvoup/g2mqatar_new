import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Language } from './types';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Footer from './components/Footer';
import WhatsAppWidget from './components/WhatsAppWidget';
import ScrollToTopOnNavigate from './components/ScrollToTopOnNavigate';

// Lazy load components below the fold for better performance
const Team = lazy(() => import('./components/Team'));
const Principles = lazy(() => import('./components/Principles'));
const Strategy = lazy(() => import('./components/Strategy'));
const ContactForm = lazy(() => import('./components/ContactForm'));
const Partners = lazy(() => import('./components/Partners'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const BusinessGoals = lazy(() => import('./components/BusinessGoals'));
const CaseStudiesPage = lazy(() => import('./components/CaseStudies'));
const CaseStudyDetail = lazy(() => import('./components/CaseStudyDetail'));
const ServiceDetailPage = lazy(() => import('./components/ServiceDetailPage'));
const PrivacyPage = lazy(() => import('./components/PrivacyPage'));
const TermsPage = lazy(() => import('./components/TermsPage'));
const NotFoundPage = lazy(() => import('./components/NotFoundPage'));

const HomePage: React.FC<{ lang: Language; setLang: (l: Language) => void }> = ({ lang, setLang }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header lang={lang} setLang={setLang} />
      <main className="flex-grow">
        <Hero lang={lang} />
        <Services lang={lang} />
        <Suspense fallback={<div className="min-h-screen" />}>
          <BusinessGoals lang={lang} />
          <Team lang={lang} />
          <Testimonials lang={lang} />
          {/* <OurInsights lang={lang} /> */}
          <Principles lang={lang} />
          <Strategy lang={lang} />
          <ContactForm lang={lang} />
          <Partners lang={lang} />
        </Suspense>
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

  // Initialize Meta Pixel
  useEffect(() => {
    // Load Meta Pixel script
    (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    // Initialize pixel and track PageView
    if (window.fbq) {
      window.fbq('init', '2384562945644423');
      window.fbq('track', 'PageView');
    }
  }, []);

  return (
    <>
      <ScrollToTop />
      <ScrollToTopOnNavigate />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-qatar-maroon border-t-transparent rounded-full animate-spin"></div></div>}>
        <Routes>
          <Route path="/" element={<HomePage lang={lang} setLang={setLang} />} />
          <Route path="/case-studies" element={<CaseStudiesPage lang={lang} setLang={setLang} />} />
          <Route path="/case-studies/:slug" element={<CaseStudyDetail lang={lang} setLang={setLang} />} />
          <Route path="/services/:slug" element={<ServiceDetailPage lang={lang} setLang={setLang} />} />
          <Route path="/privacy" element={<PrivacyPage lang={lang} setLang={setLang} />} />
          <Route path="/terms" element={<TermsPage lang={lang} setLang={setLang} />} />
          <Route path="*" element={<NotFoundPage lang={lang} setLang={setLang} />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;