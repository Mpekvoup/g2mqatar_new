
import React from 'react';
import { Language } from '../types';

interface AboutProps {
  lang: Language;
}

const About: React.FC<AboutProps> = ({ lang }) => {
  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-qatar-maroon opacity-[0.02] rounded-full blur-3xl"></div>
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <picture>
                <source srcSet="/images/about/about.avif" type="image/avif" />
                <img src="/images/about/office_imgg.jpg" alt="Founder" className="rounded-2xl shadow-lg" width="600" height="900" loading="lazy" decoding="async" />
              </picture>
              <picture>
                <source srcSet="/images/about/about2.webp" type="image/webp" />
                <img src="/images/about/about2.png" alt="Qatar Investment Forum 2025" className="rounded-2xl shadow-lg" width="702" height="1280" loading="lazy" decoding="async" />
              </picture>
              <picture>
                <img src="/images/about/new_person_to_add/5323599173439396172.jpg" alt="Alisher S. - Head of Operations" className="rounded-2xl shadow-lg" width="600" height="900" loading="lazy" decoding="async" />
              </picture>
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white p-8 rounded-3xl shadow-2xl z-20 hidden md:block border border-slate-50">
              <div className="text-xs font-bold text-qatar-maroon uppercase tracking-widest mb-2">QFC & Madayn</div>
              <div className="text-sm font-bold text-slate-900">
                {lang === 'en' ? 'Official Partner' : 'Официальный партнёр'}
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-sm font-black text-qatar-maroon uppercase tracking-[0.3em]">
              {lang === 'en' ? 'Who We Are' : 'Кто мы'}
            </h2>
            <h3 className="text-4xl font-bold text-slate-900 leading-tight">
              {lang === 'en'
                ? 'Helping businesses enter the Qatar market'
                : 'Помогаем бизнесу выходить на рынок Катара'}
            </h3>
            <div className="space-y-4 text-lg text-slate-600 leading-relaxed">
              <p>
                {lang === 'en'
                  ? 'We work with companies from Central Asia, Russia, and CIS who want to register and operate in Qatar. Based in Doha, we know the local market and have the right connections.'
                  : 'Работаем с компаниями из Центральной Азии, России и СНГ, которые хотят регистрироваться и работать в Катаре. Находимся в Дохе, знаем местный рынок и нужных людей.'}
              </p>
              <p>
                {lang === 'en'
                  ? 'Company registration, investor introductions, market entry - we help at every step. No corporate speak, just practical support.'
                  : 'Регистрация компаний, знакомство с инвесторами, выход на рынок - помогаем на каждом шаге. Без корпоративной лексики, только практическая поддержка.'}
              </p>
            </div>
            
            <div className="pt-6 grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-slate-900 tracking-tight">100%</div>
                <div className="text-sm text-slate-500 font-medium">
                  {lang === 'en' ? 'Clear pricing' : 'Прозрачные цены'}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-slate-900 tracking-tight">24/7</div>
                <div className="text-sm text-slate-500 font-medium">
                  {lang === 'en' ? 'Available to talk' : 'На связи'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
