
import React, { useState } from 'react';
import { Language } from '../types';
import { SERVICES, OTHER_SERVICES } from '../constants';

interface ServicesProps {
  lang: Language;
}

const ICONS = [
  // Business Intelligence — bar chart
  <svg key="bi" className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  // Incorporation — building
  <svg key="inc" className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  // Business Matchmaking — people
  <svg key="mm" className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  // Fundraising — money
  <svg key="fr" className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
];

const Services: React.FC<ServicesProps> = ({ lang }) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const handleCardClick = (idx: number) => {
    setActiveIdx(activeIdx === idx ? null : idx);
  };

  return (
    <section id="services" className="py-32 bg-[#FCFCFD] relative">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl space-y-5">
            <h2 className="text-xs font-black text-qatar-maroon uppercase tracking-[0.4em]">
              {lang === 'en' ? 'Our services' : 'Что мы делаем'}
            </h2>
            <p className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              {lang === 'en' ? 'Our main services' : 'Наши сервисы'}
            </p>
          </div>
          <p className="text-lg text-slate-500 font-medium max-w-sm">
            {lang === 'en'
              ? 'Click on a service to see how it works step by step.'
              : 'Нажмите на услугу, чтобы увидеть этапы работы.'}
          </p>
        </div>

        {/* Main Services Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service, idx) => (
            <button
              key={idx}
              onClick={() => handleCardClick(idx)}
              className={`group text-left bg-white p-10 rounded-[2.5rem] border transition-all duration-200 flex flex-col h-full cursor-pointer active:scale-[0.98] ${
                activeIdx === idx
                  ? 'shadow-[0_24px_64px_-10px_rgba(141,27,61,0.22)] border-qatar-maroon -translate-y-2'
                  : 'shadow-[0_4px_24px_rgba(0,0,0,0.06)] border-slate-100 hover:shadow-[0_24px_48px_-10px_rgba(0,0,0,0.13)] hover:-translate-y-2 hover:border-qatar-maroon/30'
              }`}
            >
              <div className="flex items-start justify-between mb-8">
                <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center transition-all duration-300 ${
                  activeIdx === idx
                    ? 'bg-qatar-maroon text-white'
                    : 'bg-slate-50 text-slate-900 group-hover:bg-qatar-maroon group-hover:text-white'
                }`}>
                  {ICONS[idx]}
                </div>
                <span className={`text-3xl font-black tabular-nums leading-none transition-colors duration-300 ${
                  activeIdx === idx ? 'text-qatar-maroon/30' : 'text-slate-100 group-hover:text-qatar-maroon/20'
                }`}>
                  {String(idx + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className={`text-xl font-bold mb-4 transition-colors leading-tight ${
                activeIdx === idx ? 'text-qatar-maroon' : 'text-slate-900 group-hover:text-qatar-maroon'
              }`}>
                {service.title[lang]}
              </h3>
              <p className="text-slate-500 leading-relaxed font-medium flex-grow text-sm">
                {service.desc[lang]}
              </p>
              <div className={`mt-6 self-start flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full border transition-all duration-200 ${
                activeIdx === idx
                  ? 'bg-qatar-maroon text-white border-qatar-maroon'
                  : 'bg-slate-50 text-slate-600 border-slate-200 group-hover:bg-qatar-maroon group-hover:text-white group-hover:border-qatar-maroon'
              }`}>
                <span>
                  {activeIdx === idx
                    ? (lang === 'en' ? 'Hide steps' : 'Скрыть шаги')
                    : (lang === 'en' ? 'View steps' : 'Показать шаги')}
                </span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-300 ${activeIdx === idx ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Mobile-only: steps inside the card */}
              {activeIdx === idx && (
                <div className="lg:hidden mt-6 pt-6 border-t border-qatar-maroon/10 animate-steps-in">
                  {service.steps.map((step, stepIdx) => (
                    <div key={stepIdx} className="flex gap-4">
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className="w-8 h-8 bg-qatar-maroon text-white rounded-xl flex items-center justify-center text-xs font-black shadow-sm">
                          {stepIdx + 1}
                        </div>
                        {stepIdx < service.steps.length - 1 && (
                          <div className="w-px flex-1 bg-qatar-maroon/12 my-1.5" />
                        )}
                      </div>
                      <div className={`text-left ${stepIdx < service.steps.length - 1 ? 'pb-5' : ''}`}>
                        <h5 className="font-bold text-slate-900 mb-1 text-sm pt-1 leading-tight">{step.title[lang]}</h5>
                        <p className="text-slate-500 text-xs leading-relaxed">{step.desc[lang]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Steps Panel — desktop only */}
        {activeIdx !== null && (
          <div className="hidden lg:flex mt-8 rounded-[2.5rem] overflow-hidden shadow-[0_16px_64px_rgba(141,27,61,0.13)] animate-steps-in border border-qatar-maroon/10">
            {/* Left: service info */}
            <div className="w-80 flex-shrink-0 bg-gradient-to-br from-qatar-maroon to-[#5e1128] p-10 flex flex-col">
              <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center text-white mb-8">
                {ICONS[activeIdx]}
              </div>
              <p className="text-white/50 text-[10px] font-black uppercase tracking-[0.4em] mb-3">
                {lang === 'en' ? 'Service' : 'Услуга'}
              </p>
              <h4 className="text-2xl font-extrabold text-white mb-5 leading-snug">
                {SERVICES[activeIdx].title[lang]}
              </h4>
              <p className="text-white/65 text-sm leading-relaxed flex-grow">
                {SERVICES[activeIdx].desc[lang]}
              </p>
              <div className="mt-10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white/40" />
                <span className="text-white/50 text-xs font-semibold">
                  {SERVICES[activeIdx].steps.length}{' '}
                  {lang === 'en' ? 'steps' : 'шага'}
                </span>
              </div>
            </div>

            {/* Right: steps timeline */}
            <div className="flex-1 bg-white p-10">
              <p className="text-[10px] font-black text-qatar-maroon uppercase tracking-[0.4em] mb-8">
                {lang === 'en' ? 'How it works' : 'Как это работает'}
              </p>
              <div>
                {SERVICES[activeIdx].steps.map((step, stepIdx) => (
                  <div key={stepIdx} className="flex gap-5">
                    {/* Number + connector */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-9 h-9 bg-qatar-maroon text-white rounded-xl flex items-center justify-center text-xs font-black shadow-sm">
                        {stepIdx + 1}
                      </div>
                      {stepIdx < SERVICES[activeIdx].steps.length - 1 && (
                        <div className="w-px flex-1 bg-qatar-maroon/12 my-1.5" />
                      )}
                    </div>
                    {/* Text */}
                    <div className={stepIdx < SERVICES[activeIdx].steps.length - 1 ? 'pb-6' : ''}>
                      <h5 className="font-bold text-slate-900 text-sm mb-1 pt-1.5 leading-tight">
                        {step.title[lang]}
                      </h5>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        {step.desc[lang]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;
