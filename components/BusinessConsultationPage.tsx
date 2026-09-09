import React, { lazy, Suspense } from 'react';
import { Language } from '../types';
import Header from './Header';
import Hero from './Hero';
import Footer from './Footer';
import WhatsAppWidget from './WhatsAppWidget';

// Lazy load components from HomePage
const BusinessGoals = lazy(() => import('./BusinessGoals'));
const Team = lazy(() => import('./Team'));
const Testimonials = lazy(() => import('./Testimonials'));
const ContactForm = lazy(() => import('./ContactForm'));
const Partners = lazy(() => import('./Partners'));

interface BusinessConsultationPageProps {
  lang: Language;
  setLang: (lang: Language) => void;
}

const BusinessConsultationPage: React.FC<BusinessConsultationPageProps> = ({ lang, setLang }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header lang={lang} setLang={setLang} />

      <main className="flex-grow">
        {/* Custom Hero for Business Consultation */}
        <section className="relative pt-28 pb-20 md:pt-44 md:pb-32 bg-gradient-to-br from-slate-50 to-white overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl">
              <div className="inline-block mb-6 px-4 py-2 bg-qatar-maroon/10 text-qatar-maroon rounded-full">
                <span className="text-xs font-black uppercase tracking-[0.3em]">
                  {lang === 'en' ? 'Business Consultation' : 'Бизнес-консультация'}
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-8">
                {lang === 'en'
                  ? 'Business Consultation in GCC'
                  : 'Бизнес-консультация в GCC'}
              </h1>

              <p className="text-xl md:text-2xl text-slate-600 font-medium leading-relaxed mb-12">
                {lang === 'en'
                  ? 'Get expert guidance before making important decisions about establishing or expanding your business in GCC.'
                  : 'Получите экспертную поддержку перед принятием важных решений о создании или расширении вашего бизнеса в GCC.'}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#contacts"
                  className="inline-flex items-center justify-center px-8 py-4 bg-qatar-maroon hover:bg-qatar-maroon/90 text-white rounded-2xl font-bold text-lg shadow-lg transition-all hover:scale-105 active:scale-95"
                >
                  {lang === 'en' ? 'Book a Consultation' : 'Записаться на консультацию'}
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Use same sections as HomePage */}
        <Suspense fallback={<div className="min-h-screen" />}>
          <BusinessGoals lang={lang} />
          <Team lang={lang} />
          <Testimonials lang={lang} />
          <ContactForm lang={lang} />
          <Partners lang={lang} />
        </Suspense>
      </main>

      <Footer lang={lang} />
      <WhatsAppWidget lang={lang} photoUrl="/images/about/avatar.jpg" />
    </div>
  );
};

export default BusinessConsultationPage;
