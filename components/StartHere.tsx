import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Language } from '../types';
import { buildUrlWithAttribution } from '../src/lead-context';
import { Building2, Users, TrendingUp, ArrowRight } from 'lucide-react';

interface StartHereProps {
  lang: Language;
  onOpenInvestModal: () => void;
}

const content = {
  eyebrow: {
    en: 'START HERE',
    ru: 'НАЧНИТЕ ОТСЮДА',
  },
  title: {
    en: 'Three Ways to Enter Qatar',
    ru: 'Три пути на рынок Катара',
  },
  description: {
    en: 'Choose your goal: establish a company, reach clients, or evaluate an investment opportunity.',
    ru: 'Выберите цель: открыть компанию, найти клиентов или оценить инвестиционные возможности.',
  },
  cards: {
    companyFormation: {
      number: '01',
      category: { en: 'ESTABLISH', ru: 'ОТКРЫТЬ' },
      title: { en: 'Company Formation', ru: 'Регистрация компании' },
      description: {
        en: 'Company registration and support — from choosing the right structure to entering the market.',
        ru: 'Регистрация и сопровождение компании — от выбора структуры до выхода на рынок.',
      },
      benefits: {
        en: [
          'Business structure guidance',
          'Licensing and registration support',
          'Local market entry assistance',
        ],
        ru: [
          'Выбор подходящей структуры',
          'Лицензирование и регистрация',
          'Сопровождение выхода на рынок',
        ],
      },
      cta: { en: 'Start Your Company', ru: 'Открыть компанию' },
    },
    reachClients: {
      number: '02',
      category: { en: 'GROW', ru: 'РАЗВИВАТЬ' },
      title: { en: 'Reach Clients in Qatar', ru: 'Найдите клиентов в Катаре' },
      description: {
        en: 'Reach B2B clients, partners, and decision-makers in Qatar.',
        ru: 'Поиск B2B-клиентов, партнёров и лиц, принимающих решения в Катаре.',
      },
      benefits: {
        en: [
          'B2B lead generation',
          'Partner and client research',
          'Business matchmaking',
        ],
        ru: [
          'Генерация B2B-лидов',
          'Поиск клиентов и партнёров',
          'Организация деловых контактов',
        ],
      },
      cta: { en: 'Find Clients in Qatar', ru: 'Найти клиентов' },
    },
    investQatar: {
      number: '03',
      category: { en: 'INVEST', ru: 'ИНВЕСТИРОВАТЬ' },
      title: { en: 'Invest in Qatar', ru: 'Инвестируйте в Катар' },
      description: {
        en: 'Evaluate sectors, opportunities, and your investment market-entry strategy.',
        ru: 'Оценка отраслей, возможностей и стратегии инвестиционного выхода на рынок.',
      },
      benefits: {
        en: [
          'Opportunity assessment',
          'Market and sector research',
          'Investment entry roadmap',
        ],
        ru: [
          'Оценка возможностей',
          'Исследование рынка и отрасли',
          'План выхода на рынок',
        ],
      },
      cta: { en: 'Explore Investment Options', ru: 'Изучить варианты инвестиций' },
    },
  },
};

const StartHere: React.FC<StartHereProps> = ({ lang, onOpenInvestModal }) => {
  /**
   * Handle Company Formation CTA click: forward attribution params to subdomain.
   * Only intercepts standard left-clicks; middle-click and context menu use static href.
   */
  const handleCompanyFormationClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    // Don't intercept modified clicks (ctrl, meta, shift, middle-click)
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) {
      return;
    }

    const href = e.currentTarget.href;
    const urlWithAttribution = buildUrlWithAttribution(href);

    // If URL unchanged (no attribution params), let default behavior work
    if (urlWithAttribution === href) {
      return;
    }

    // Navigate with attribution params
    e.preventDefault();
    window.location.href = urlWithAttribution;
  }, []);

  return (
    <section id="start-here" className="py-12 md:py-16 lg:py-20 bg-slate-50">
      <div className="container mx-auto px-6">
        {/* Header - Asymmetric two-column on desktop */}
        <div className="grid items-end gap-4 lg:gap-8 lg:grid-cols-[1.1fr_0.9fr] mb-10 lg:mb-12">
          <div>
            <p className="text-xs font-black text-qatar-maroon uppercase tracking-[0.3em] mb-3">
              {content.eyebrow[lang]}
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
              {content.title[lang]}
            </h2>
          </div>
          <p className="text-base text-slate-600 leading-relaxed lg:pb-1">
            {content.description[lang]}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {/* Card 1: Company Formation */}
          <div className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-qatar-maroon/40 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 transition-all duration-200 flex flex-col h-full overflow-hidden">
            {/* Top maroon line */}
            <div className="h-0.5 bg-qatar-maroon/30 group-hover:bg-qatar-maroon transition-colors duration-200" />

            <div className="p-6 lg:p-7 flex flex-col h-full">
              {/* Header row: Icon + Number/Category */}
              <div className="flex items-start justify-between mb-5">
                {/* Icon - outline style */}
                <div className="w-11 h-11 rounded-lg border border-qatar-maroon/30 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-qatar-maroon" aria-hidden="true" />
                </div>

                {/* Number + Category */}
                <div className="text-right">
                  <span className="block text-2xl font-bold text-slate-200 leading-none">
                    {content.cards.companyFormation.number}
                  </span>
                  <span className="text-[10px] font-bold text-qatar-maroon uppercase tracking-[0.15em]">
                    {content.cards.companyFormation.category[lang]}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {content.cards.companyFormation.title[lang]}
              </h3>

              {/* Description */}
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {content.cards.companyFormation.description[lang]}
              </p>

              {/* Benefits */}
              <ul className="space-y-1.5 mb-6 flex-grow">
                {content.cards.companyFormation.benefits[lang].map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <svg
                      className="w-3.5 h-3.5 text-qatar-maroon flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-600 text-[13px] leading-snug">{benefit}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="https://registration.go2market.qa/"
                onClick={handleCompanyFormationClick}
                className="group/cta relative inline-flex items-center justify-center bg-qatar-maroon hover:bg-qatar-maroon-dark active:bg-qatar-maroon-dark text-white font-semibold text-sm pl-5 pr-14 py-2.5 rounded-lg shadow-md hover:shadow-lg active:shadow-md transition-[background-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-qatar-maroon focus-visible:ring-offset-2 mt-auto min-h-[44px] cursor-pointer overflow-hidden motion-reduce:transform-none"
              >
                <span className="transition-transform duration-300 ease-out group-hover/cta:-translate-x-1 group-focus-visible/cta:-translate-x-1 motion-reduce:transform-none">
                  {content.cards.companyFormation.cta[lang]}
                </span>
                <span
                  aria-hidden="true"
                  className="absolute right-2.5 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-white/10 transition-[transform,background-color,border-color] duration-300 ease-out group-hover/cta:translate-x-0.5 group-hover/cta:bg-white/20 group-hover/cta:border-white/30 group-focus-visible/cta:translate-x-0.5 group-focus-visible/cta:bg-white/20 group-active/cta:scale-90 motion-reduce:transform-none motion-reduce:transition-none"
                >
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover/cta:translate-x-0.5 motion-reduce:transform-none" />
                </span>
              </a>
            </div>
          </div>

          {/* Card 2: Reach Clients in Qatar */}
          <div className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-qatar-maroon/40 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 transition-all duration-200 flex flex-col h-full overflow-hidden">
            {/* Top maroon line */}
            <div className="h-0.5 bg-qatar-maroon/30 group-hover:bg-qatar-maroon transition-colors duration-200" />

            <div className="p-6 lg:p-7 flex flex-col h-full">
              {/* Header row: Icon + Number/Category */}
              <div className="flex items-start justify-between mb-5">
                {/* Icon - outline style */}
                <div className="w-11 h-11 rounded-lg border border-qatar-maroon/30 flex items-center justify-center">
                  <Users className="w-5 h-5 text-qatar-maroon" aria-hidden="true" />
                </div>

                {/* Number + Category */}
                <div className="text-right">
                  <span className="block text-2xl font-bold text-slate-200 leading-none">
                    {content.cards.reachClients.number}
                  </span>
                  <span className="text-[10px] font-bold text-qatar-maroon uppercase tracking-[0.15em]">
                    {content.cards.reachClients.category[lang]}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {content.cards.reachClients.title[lang]}
              </h3>

              {/* Description */}
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {content.cards.reachClients.description[lang]}
              </p>

              {/* Benefits */}
              <ul className="space-y-1.5 mb-6 flex-grow">
                {content.cards.reachClients.benefits[lang].map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <svg
                      className="w-3.5 h-3.5 text-qatar-maroon flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-600 text-[13px] leading-snug">{benefit}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                to="/services/b2b-lead-generation"
                className="group/cta relative inline-flex items-center justify-center bg-qatar-maroon hover:bg-qatar-maroon-dark active:bg-qatar-maroon-dark text-white font-semibold text-sm pl-5 pr-14 py-2.5 rounded-lg shadow-md hover:shadow-lg active:shadow-md transition-[background-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-qatar-maroon focus-visible:ring-offset-2 mt-auto min-h-[44px] cursor-pointer overflow-hidden motion-reduce:transform-none"
              >
                <span className="transition-transform duration-300 ease-out group-hover/cta:-translate-x-1 group-focus-visible/cta:-translate-x-1 motion-reduce:transform-none">
                  {content.cards.reachClients.cta[lang]}
                </span>
                <span
                  aria-hidden="true"
                  className="absolute right-2.5 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-white/10 transition-[transform,background-color,border-color] duration-300 ease-out group-hover/cta:translate-x-0.5 group-hover/cta:bg-white/20 group-hover/cta:border-white/30 group-focus-visible/cta:translate-x-0.5 group-focus-visible/cta:bg-white/20 group-active/cta:scale-90 motion-reduce:transform-none motion-reduce:transition-none"
                >
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover/cta:translate-x-0.5 motion-reduce:transform-none" />
                </span>
              </Link>
            </div>
          </div>

          {/* Card 3: Invest in Qatar */}
          <div className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-qatar-maroon/40 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 transition-all duration-200 flex flex-col h-full overflow-hidden md:col-span-2 lg:col-span-1">
            {/* Top maroon line */}
            <div className="h-0.5 bg-qatar-maroon/30 group-hover:bg-qatar-maroon transition-colors duration-200" />

            <div className="p-6 lg:p-7 flex flex-col h-full">
              {/* Header row: Icon + Number/Category */}
              <div className="flex items-start justify-between mb-5">
                {/* Icon - outline style */}
                <div className="w-11 h-11 rounded-lg border border-qatar-maroon/30 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-qatar-maroon" aria-hidden="true" />
                </div>

                {/* Number + Category */}
                <div className="text-right">
                  <span className="block text-2xl font-bold text-slate-200 leading-none">
                    {content.cards.investQatar.number}
                  </span>
                  <span className="text-[10px] font-bold text-qatar-maroon uppercase tracking-[0.15em]">
                    {content.cards.investQatar.category[lang]}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {content.cards.investQatar.title[lang]}
              </h3>

              {/* Description */}
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {content.cards.investQatar.description[lang]}
              </p>

              {/* Benefits */}
              <ul className="space-y-1.5 mb-6 flex-grow">
                {content.cards.investQatar.benefits[lang].map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <svg
                      className="w-3.5 h-3.5 text-qatar-maroon flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-600 text-[13px] leading-snug">{benefit}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                type="button"
                onClick={onOpenInvestModal}
                className="group/cta relative inline-flex items-center justify-center bg-qatar-maroon hover:bg-qatar-maroon-dark active:bg-qatar-maroon-dark text-white font-semibold text-sm pl-5 pr-14 py-2.5 rounded-lg shadow-md hover:shadow-lg active:shadow-md transition-[background-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-qatar-maroon focus-visible:ring-offset-2 mt-auto min-h-[44px] cursor-pointer overflow-hidden motion-reduce:transform-none"
              >
                <span className="transition-transform duration-300 ease-out group-hover/cta:-translate-x-1 group-focus-visible/cta:-translate-x-1 motion-reduce:transform-none">
                  {content.cards.investQatar.cta[lang]}
                </span>
                <span
                  aria-hidden="true"
                  className="absolute right-2.5 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-white/10 transition-[transform,background-color,border-color] duration-300 ease-out group-hover/cta:translate-x-0.5 group-hover/cta:bg-white/20 group-hover/cta:border-white/30 group-focus-visible/cta:translate-x-0.5 group-focus-visible/cta:bg-white/20 group-active/cta:scale-90 motion-reduce:transform-none motion-reduce:transition-none"
                >
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover/cta:translate-x-0.5 motion-reduce:transform-none" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StartHere;
