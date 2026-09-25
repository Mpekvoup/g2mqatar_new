import React from 'react';
import { Language } from '../types';
import { useReveal } from '../src/hooks/useInViewOnce';
import {
  Percent,
  Globe,
  Building2,
  Users,
  TrendingUp,
  Shield,
  Settings,
  Landmark,
  FileText,
  Gavel,
  MapPin,
  FileCheck,
  Network,
  CreditCard
} from 'lucide-react';

interface QatarBenefitsProps {
  lang: Language;
}

const QatarBenefits: React.FC<QatarBenefitsProps> = ({ lang }) => {
  // Why Qatar - 6 benefits
  const benefits = [
    {
      icon: Percent,
      title: { en: 'Business-friendly taxation', ru: 'Выгодное налогообложение' },
      desc: { en: 'No personal income tax and competitive corporate rates', ru: 'Нет НДФЛ и конкурентные корпоративные ставки' }
    },
    {
      icon: Globe,
      title: { en: 'Strategic global location', ru: 'Стратегическое расположение' },
      desc: { en: 'Gateway between East and West with world-class connectivity', ru: 'Мост между Востоком и Западом с отличной логистикой' }
    },
    {
      icon: Building2,
      title: { en: 'World-class infrastructure', ru: 'Инфраструктура мирового класса' },
      desc: { en: 'Modern airports, ports, and business facilities', ru: 'Современные аэропорты, порты и бизнес-центры' }
    },
    {
      icon: Users,
      title: { en: 'Access to GCC markets', ru: 'Доступ к рынкам GCC' },
      desc: { en: 'Direct entry to 50+ million consumers in the Gulf region', ru: 'Прямой выход на 50+ млн потребителей Персидского залива' }
    },
    {
      icon: TrendingUp,
      title: { en: 'Growing investment ecosystem', ru: 'Растущая инвестиционная экосистема' },
      desc: { en: 'Active sovereign funds and startup-friendly policies', ru: 'Активные суверенные фонды и поддержка стартапов' }
    },
    {
      icon: Shield,
      title: { en: 'Stable business environment', ru: 'Стабильная бизнес-среда' },
      desc: { en: 'Strong rule of law and transparent regulations', ru: 'Верховенство права и прозрачное регулирование' }
    }
  ];

  // How We Support - 4 services
  const supportServices = [
    {
      icon: Settings,
      number: '01',
      title: { en: 'Company Setup', ru: 'Регистрация компании' },
      desc: { en: 'Full support from structure selection to market entry', ru: 'Полное сопровождение от выбора структуры до выхода на рынок' }
    },
    {
      icon: Landmark,
      number: '02',
      title: { en: 'Bank Account Opening', ru: 'Открытие банковского счёта' },
      desc: { en: 'Corporate banking solutions with local expertise', ru: 'Корпоративные банковские решения с локальной экспертизой' }
    },
    {
      icon: FileText,
      number: '03',
      title: { en: 'Tax & Accounting', ru: 'Налоги и бухгалтерия' },
      desc: { en: 'Transparent financial services without hidden costs', ru: 'Прозрачные финансовые услуги без скрытых затрат' }
    },
    {
      icon: Gavel,
      number: '04',
      title: { en: 'Regulation & Compliance', ru: 'Регулирование и комплаенс' },
      desc: { en: 'Stay compliant with all government requirements', ru: 'Соответствие всем государственным требованиям' }
    }
  ];

  // From Plan to Market - 6 steps
  const steps = [
    {
      icon: MapPin,
      number: '01',
      title: { en: 'Commercial Registration', ru: 'Коммерческая регистрация' }
    },
    {
      icon: FileCheck,
      number: '02',
      title: { en: 'Trade Name Reservation', ru: 'Резервирование названия' }
    },
    {
      icon: Network,
      number: '03',
      title: { en: 'Article of Association', ru: 'Устав компании' }
    },
    {
      icon: FileText,
      number: '04',
      title: { en: 'CR Issuance', ru: 'Выдача CR' }
    },
    {
      icon: FileCheck,
      number: '05',
      title: { en: 'Trade License', ru: 'Торговая лицензия' }
    },
    {
      icon: CreditCard,
      number: '06',
      title: { en: 'Computer Card', ru: 'Компьютерная карта' }
    }
  ];

  // Scroll reveal hooks - using shared implementation
  const [headerRef, headerVisible] = useReveal<HTMLDivElement>();
  const [imageRef, imageVisible] = useReveal<HTMLDivElement>();
  const [cardsRef, cardsVisible] = useReveal<HTMLDivElement>();
  const [supportHeaderRef, supportHeaderVisible] = useReveal<HTMLDivElement>();
  const [supportImageRef, supportImageVisible] = useReveal<HTMLDivElement>();
  const [supportCardsRef, supportCardsVisible] = useReveal<HTMLDivElement>();
  const [timelineHeaderRef, timelineHeaderVisible] = useReveal<HTMLDivElement>();
  // Single ref for timeline container (visible on both mobile and desktop)
  const [timelineContainerRef, timelineVisible] = useReveal<HTMLDivElement>();

  return (
    <div className="bg-white">
      {/* Section 1: Why Qatar */}
      <section className="py-12 md:py-16 lg:py-20 bg-slate-50">
        <div className="container mx-auto px-6 xl:px-8">
          {/* max-w-6xl prevents overlap with fixed WhatsApp widget at 1365-1440px */}
          <div className="max-w-6xl mx-auto">
          {/* Header + Image: two-column on desktop */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-10 lg:mb-12">
            {/* Left: Header */}
            <div
              ref={headerRef}
              className={`transition-all duration-500 motion-reduce:transition-none ${
                headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              <p className="text-xs font-black text-qatar-maroon uppercase tracking-[0.3em] mb-3">
                {lang === 'en' ? 'Why Qatar' : 'Почему Катар'}
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
                {lang === 'en' ? 'Why Build Your Business in Qatar' : 'Почему стоит развивать бизнес в Катаре'}
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                {lang === 'en'
                  ? 'A strategic hub with tax advantages, world-class infrastructure, and direct access to growing markets.'
                  : 'Стратегический хаб с налоговыми преимуществами, инфраструктурой мирового класса и доступом к растущим рынкам.'}
              </p>
            </div>

            {/* Right: Image */}
            <div
              ref={imageRef}
              className={`relative transition-all duration-600 motion-reduce:transition-none ${
                imageVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
              style={{ transitionDelay: headerVisible ? '100ms' : '0ms' }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 group">
                <img
                  src="/images/home/why-qatar.webp"
                  alt={lang === 'en'
                    ? 'Doha business district and modern infrastructure'
                    : 'Деловой район Дохи и современная инфраструктура'}
                  className="w-full aspect-[16/9] object-cover object-center transition-transform duration-700 group-hover:scale-[1.025]"
                  width={1376}
                  height={768}
                  loading="lazy"
                  decoding="async"
                />
                {/* Decorative caption */}
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm">
                  <span className="text-xs font-semibold text-slate-700">
                    {lang === 'en' ? 'Qatar Business Environment' : 'Деловая среда Катара'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Grid: 3x2 on desktop, 2x3 on tablet, 1 col on mobile */}
          <div
            ref={cardsRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6"
          >
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                // Outer wrapper: reveal animation with stagger delay
                <div
                  key={idx}
                  className={`transition-all duration-500 motion-reduce:transition-none ${
                    cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                  }`}
                  style={{ transitionDelay: cardsVisible ? `${idx * 70}ms` : '0ms' }}
                >
                  {/* Inner card: hover effects only, no inline delay */}
                  <div className="group h-full bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-qatar-maroon/30 hover:-translate-y-1 motion-reduce:hover:translate-y-0 transition-all duration-200">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-lg border border-qatar-maroon/20 bg-qatar-maroon/5 flex items-center justify-center flex-shrink-0 group-hover:bg-qatar-maroon/10 group-hover:scale-105 transition-all duration-200">
                        <Icon className="w-5 h-5 text-qatar-maroon" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 text-sm mb-1 leading-tight">
                          {benefit.title[lang]}
                        </h3>
                        <p className="text-slate-500 text-xs leading-relaxed">
                          {benefit.desc[lang]}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          </div>
        </div>
      </section>

      {/* Section 2: How We Support Your Entry */}
      <section className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-6 xl:px-8">
          {/* max-w-6xl prevents overlap with fixed WhatsApp widget at 1365-1440px */}
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left: Header, description, and image */}
            <div>
              <div
                ref={supportHeaderRef}
                className={`transition-all duration-500 motion-reduce:transition-none ${
                  supportHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}
              >
                <p className="text-xs font-black text-qatar-maroon uppercase tracking-[0.3em] mb-3">
                  {lang === 'en' ? 'Our Support' : 'Наша поддержка'}
                </p>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
                  {lang === 'en' ? 'How We Support Your Entry' : 'Как мы поддерживаем ваш выход на рынок'}
                </h2>
                <p className="text-base text-slate-600 leading-relaxed mb-6">
                  {lang === 'en'
                    ? 'End-to-end assistance from company formation to ongoing compliance — so you can focus on growth.'
                    : 'Комплексное сопровождение от регистрации до постоянного комплаенса — чтобы вы могли сосредоточиться на росте.'}
                </p>
              </div>

              {/* Image */}
              <div
                ref={supportImageRef}
                className={`relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 group transition-all duration-600 motion-reduce:transition-none ${
                  supportImageVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'
                }`}
                style={{ transitionDelay: supportHeaderVisible ? '150ms' : '0ms' }}
              >
                {/* Aspect ratio wrapper to prevent CLS */}
                <div className="relative aspect-[4/3]">
                  <img
                    src="/images/home/market-entry-consultation.webp"
                    alt={lang === 'en'
                      ? 'Business consultation about entering the Qatar market'
                      : 'Деловая консультация по выходу на рынок Катара'}
                    className="absolute inset-0 w-full h-full object-cover object-[58%_center] sm:object-center transition-transform duration-700 group-hover:scale-[1.025]"
                    width={1400}
                    height={953}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                {/* Decorative caption */}
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm">
                  <span className="text-xs font-semibold text-slate-700">
                    {lang === 'en' ? 'End-to-end market support' : 'Комплексное сопровождение выхода на рынок'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: 2x2 cards */}
            <div
              ref={supportCardsRef}
              className="grid grid-cols-1 sm:grid-cols-2 gap-5"
            >
              {supportServices.map((service, idx) => {
                const Icon = service.icon;
                return (
                  // Outer wrapper: reveal animation with stagger delay
                  <div
                    key={idx}
                    className={`transition-all duration-500 motion-reduce:transition-none ${
                      supportCardsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'
                    }`}
                    style={{ transitionDelay: supportCardsVisible ? `${idx * 70}ms` : '0ms' }}
                  >
                    {/* Inner card: hover effects only, no inline delay */}
                    <div className="group h-full bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-qatar-maroon/40 hover:-translate-y-1 motion-reduce:hover:translate-y-0 transition-all duration-200">
                      {/* Top: Icon + Number */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-11 h-11 rounded-lg border border-qatar-maroon/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                          <Icon className="w-5 h-5 text-qatar-maroon" />
                        </div>
                        <span className="text-2xl font-bold text-slate-200 leading-none">
                          {service.number}
                        </span>
                      </div>
                      {/* Title + Description */}
                      <h3 className="font-bold text-slate-900 text-sm mb-2 leading-tight">
                        {service.title[lang]}
                      </h3>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        {service.desc[lang]}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: From Plan to Market */}
      <section className="py-12 md:py-16 lg:py-20 bg-slate-50">
        <div className="container mx-auto px-6 xl:px-8">
          {/* max-w-6xl prevents overlap with fixed WhatsApp widget at 1365-1440px */}
          <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div
            ref={timelineHeaderRef}
            className={`grid items-end gap-4 lg:gap-8 lg:grid-cols-[1.1fr_0.9fr] mb-10 lg:mb-12 transition-all duration-500 motion-reduce:transition-none ${
              timelineHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <div>
              <p className="text-xs font-black text-qatar-maroon uppercase tracking-[0.3em] mb-3">
                {lang === 'en' ? 'The Process' : 'Процесс'}
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
                {lang === 'en' ? 'From Plan to Market' : 'От плана до выхода на рынок'}
              </h2>
            </div>
            <p className="text-base text-slate-600 leading-relaxed lg:pb-1">
              {lang === 'en'
                ? 'G2M guides you through every stage of registration and launch in Qatar.'
                : 'G2M сопровождает вас на каждом этапе регистрации и запуска в Катаре.'}
            </p>
          </div>

          {/* Timeline container - single ref for both mobile and desktop */}
          <div ref={timelineContainerRef}>
            {/* Desktop Timeline (horizontal) */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Connector line with animation */}
                <div
                  className={`absolute top-6 left-0 right-0 h-px bg-qatar-maroon/20 origin-left transition-transform duration-1000 motion-reduce:transition-none ${
                    timelineVisible ? 'scale-x-100' : 'scale-x-0'
                  }`}
                  aria-hidden="true"
                />

                {/* Steps */}
                <div className="grid grid-cols-6 gap-4">
                  {steps.map((step, idx) => {
                    const Icon = step.icon;
                    return (
                      <div
                        key={idx}
                        className={`relative flex flex-col items-center text-center transition-all duration-500 motion-reduce:transition-none ${
                          timelineVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}
                        style={{ transitionDelay: timelineVisible ? `${200 + idx * 100}ms` : '0ms' }}
                      >
                        {/* Circle with number */}
                        <div className="w-12 h-12 rounded-full bg-qatar-maroon text-white flex items-center justify-center text-sm font-bold shadow-md relative z-10">
                          {step.number}
                        </div>
                        {/* Icon */}
                        <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center mt-4 shadow-sm">
                          <Icon className="w-4 h-4 text-qatar-maroon" />
                        </div>
                        {/* Title */}
                        <p className="mt-3 text-xs font-semibold text-slate-700 leading-tight px-1">
                          {step.title[lang]}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile/Tablet Timeline (vertical) */}
            <div className="lg:hidden">
              <div className="space-y-0">
                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  const isLast = idx === steps.length - 1;
                  return (
                    <div
                      key={idx}
                      className={`flex gap-4 transition-all duration-500 motion-reduce:transition-none ${
                        timelineVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                      }`}
                      style={{ transitionDelay: timelineVisible ? `${idx * 80}ms` : '0ms' }}
                    >
                      {/* Left: number + connector */}
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-qatar-maroon text-white flex items-center justify-center text-xs font-bold shadow-md flex-shrink-0">
                          {step.number}
                        </div>
                        {!isLast && (
                          <div
                            className={`w-px flex-1 bg-qatar-maroon/20 my-2 origin-top transition-transform duration-500 motion-reduce:transition-none ${
                              timelineVisible ? 'scale-y-100' : 'scale-y-0'
                            }`}
                            style={{ transitionDelay: timelineVisible ? `${(idx + 1) * 80}ms` : '0ms' }}
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      {/* Right: content */}
                      <div className={`flex items-start gap-3 ${isLast ? 'pb-0' : 'pb-6'}`}>
                        <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm flex-shrink-0 mt-0.5">
                          <Icon className="w-4 h-4 text-qatar-maroon" />
                        </div>
                        <p className="text-sm font-semibold text-slate-700 leading-tight pt-2">
                          {step.title[lang]}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default QatarBenefits;
