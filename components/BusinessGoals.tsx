import React from 'react';
import { Language } from '../types';
import { useReveal } from '../src/hooks/useInViewOnce';
import {
  Building2,
  GraduationCap,
  HardHat,
  TrendingUp,
  Layers,
  Fuel
} from 'lucide-react';

interface BusinessGoalsProps {
  lang: Language;
}

const BusinessGoals: React.FC<BusinessGoalsProps> = ({ lang }) => {
  const industries = [
    { icon: Building2, label: { en: 'Real Estate', ru: 'Недвижимость' } },
    { icon: GraduationCap, label: { en: 'Education', ru: 'Образование' } },
    { icon: HardHat, label: { en: 'Construction', ru: 'Строительство' } },
    { icon: TrendingUp, label: { en: 'Trading', ru: 'Торговля' } },
    { icon: Layers, label: { en: 'Diversification', ru: 'Диверсификация' } },
    { icon: Fuel, label: { en: 'Oil & Gas', ru: 'Нефть и газ' } }
  ];

  // Scroll reveal hooks - using shared implementation
  const [imageRef, imageVisible] = useReveal<HTMLDivElement>();
  const [contentRef, contentVisible] = useReveal<HTMLDivElement>();
  const [tagsRef, tagsVisible] = useReveal<HTMLDivElement>();

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-6 xl:px-8">
        {/* max-w-6xl prevents overlap with fixed WhatsApp widget at 1365-1440px */}
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Image */}
          <div
            ref={imageRef}
            className={`relative order-1 transition-all duration-600 motion-reduce:transition-none ${
              imageVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'
            }`}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 group">
              <img
                src="/images/about/office_imgg.jpg"
                alt={lang === 'en' ? 'Business meeting in Qatar' : 'Деловая встреча в Катаре'}
                className="w-full aspect-[4/3] object-cover object-[center_35%] transition-transform duration-700 group-hover:scale-[1.025]"
                width={800}
                height={600}
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent" aria-hidden="true" />
            </div>

            {/* Badge */}
            <div
              className={`absolute -bottom-4 -right-4 sm:-bottom-5 sm:-right-5 bg-qatar-maroon text-white px-6 py-4 sm:px-8 sm:py-5 rounded-2xl shadow-xl transition-all duration-500 motion-reduce:transition-none ${
                imageVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: imageVisible ? '300ms' : '0ms' }}
            >
              <div className="text-3xl sm:text-4xl font-black leading-none">20+</div>
              <div className="text-xs sm:text-sm font-semibold opacity-90 mt-1">
                {lang === 'en' ? 'Industries Served' : 'Отраслей'}
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="order-2">
            <div
              ref={contentRef}
              className={`transition-all duration-500 motion-reduce:transition-none ${
                contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              <p className="text-xs font-black text-qatar-maroon uppercase tracking-[0.3em] mb-3">
                {lang === 'en' ? 'Expertise' : 'Экспертиза'}
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
                {lang === 'en' ? 'Industries We Support' : 'Отрасли, с которыми мы работаем'}
              </h2>
              <p className="text-base text-slate-600 leading-relaxed mb-8">
                {lang === 'en'
                  ? 'Our goal is simple: to be your long-term partner in financial clarity, compliance, and growth. So you can focus on your business vision while we handle the rest.'
                  : 'Наша цель проста: быть вашим долгосрочным партнером в финансовой ясности, соблюдении требований и росте. Чтобы вы могли сосредоточиться на своём бизнесе, пока мы занимаемся остальным.'}
              </p>
            </div>

            {/* Industry Tags */}
            <div ref={tagsRef} className="flex flex-wrap gap-2">
              {industries.map((industry, idx) => {
                const Icon = industry.icon;
                return (
                  // Outer wrapper: reveal animation with stagger delay
                  <div
                    key={idx}
                    className={`transition-all duration-400 motion-reduce:transition-none ${
                      tagsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                    }`}
                    style={{ transitionDelay: tagsVisible ? `${idx * 60}ms` : '0ms' }}
                  >
                    {/* Inner tag: hover effects only, no inline delay */}
                    <div className="group inline-flex items-center gap-2 bg-slate-50 hover:bg-qatar-maroon/5 border border-slate-200 hover:border-qatar-maroon/30 px-3 py-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0">
                      <Icon className="w-4 h-4 text-qatar-maroon flex-shrink-0 group-hover:scale-105 transition-transform duration-200" />
                      <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">
                        {industry.label[lang]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessGoals;
