import React, { useCallback } from 'react';
import { Language } from '../types';
import { buildUrlWithAttribution } from '../src/lead-context';

interface HeroProps {
  lang: Language;
}

const content = {
  badge: {
    en: 'Business in Qatar',
    ru: 'Бизнес в Катаре',
  },
  title: {
    en: 'Your Gateway to Business in Qatar',
    ru: 'Ваш выход на рынок Катара',
  },
  description: {
    en: 'Set up your company, reach the right clients and explore investment opportunities with local expertise in Qatar.',
    ru: 'Откройте компанию, найдите подходящих клиентов и изучите инвестиционные возможности при поддержке местных экспертов в Катаре.',
  },
  primaryCta: {
    en: 'Start Your Business',
    ru: 'Открыть компанию',
  },
  secondaryCta: {
    en: 'Book a Consultation',
    ru: 'Получить консультацию',
  },
};

const Hero: React.FC<HeroProps> = ({ lang }) => {
  /**
   * Handle CTA click: forward attribution params to subdomain.
   * Only intercepts standard left-clicks; middle-click and context menu use static href.
   */
  const handleCtaClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
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
    <section className="relative min-h-[520px] md:min-h-[560px] lg:min-h-[600px] flex items-center overflow-hidden pt-16 md:pt-20 lg:pt-24">
      {/* Background image */}
      <picture className="absolute inset-0 w-full h-full">
        <img
          src="/images/hero/hero-main.jpeg"
          alt=""
          className="w-full h-full object-cover object-[75%_center] md:object-[70%_center] lg:object-center"
          width="1920"
          height="1080"
          fetchPriority="high"
          decoding="async"
        />
      </picture>

      {/* Dark overlay - base layer */}
      <div
        className="absolute inset-0 bg-slate-900/40"
        aria-hidden="true"
      />

      {/* Gradient overlay - stronger on left, enhanced for mobile */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-900/20 md:from-slate-900/85 md:via-slate-900/50 md:to-slate-900/15"
        aria-hidden="true"
      />
      {/* Additional top gradient for mobile text readability */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-transparent md:hidden"
        aria-hidden="true"
      />

      {/* Content container */}
      <div className="container mx-auto px-6 relative z-10 py-16 md:py-20 lg:py-24">
        <div className="max-w-[640px] lg:max-w-[720px]">
          {/* Badge */}
          <div className="inline-block mb-5 md:mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-semibold tracking-wide shadow-sm">
              {content.badge[lang]}
            </span>
          </div>

          {/* H1 */}
          <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] lg:text-5xl xl:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-5 md:mb-6">
            {content.title[lang]}
          </h1>

          {/* Description */}
          <p className="text-[15px] sm:text-lg md:text-xl text-white/90 leading-[1.55] sm:leading-normal mb-14 md:mb-12 max-w-[540px]">
            {content.description[lang]}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://registration.go2market.qa/"
              onClick={handleCtaClick}
              className="inline-flex items-center justify-center px-7 py-4 bg-qatar-maroon hover:bg-qatar-maroon-dark text-white font-bold text-base rounded-xl shadow-lg shadow-qatar-maroon/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 min-h-[48px]"
            >
              {content.primaryCta[lang]}
            </a>
            <a
              href="https://consulting.go2market.qa/"
              onClick={handleCtaClick}
              className="inline-flex items-center justify-center px-7 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold text-base rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 min-h-[48px]"
            >
              {content.secondaryCta[lang]}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
