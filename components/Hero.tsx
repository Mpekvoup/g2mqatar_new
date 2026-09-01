import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { CLIENTS } from '../constants';

interface HeroProps {
  lang: Language;
}

// Moved outside the component: a literal defined inside the component body is a new
// object reference on every render, which was needlessly re-triggering the effect below
// (it's in the effect's dependency array) and could desync the country/image cycle.
const countries = [
  {
    name: { en: 'Qatar', ru: 'Катаре' },
    image: '/images/hero/qatar.jpg',
    avif: '/images/hero/qatar.avif',
    altText: {
      en: 'Qatar skyline - Modern business district in Doha for company registration and business setup',
      ru: 'Панорама Катара - Современный бизнес-район в Дохе для регистрации компаний и открытия бизнеса'
    }
  },
  {
    name: { en: 'Oman', ru: 'Омане' },
    image: '/images/hero/oman.jpg',
    avif: '/images/hero/oman.avif',
    altText: {
      en: 'Oman business district - GCC market entry opportunities with G2M International',
      ru: 'Бизнес-район Омана - Возможности выхода на рынок GCC с G2M International'
    }
  },
  {
    name: { en: 'Kuwait', ru: 'Кувейте' },
    image: '/images/hero/kuwait.jpg',
    avif: '/images/hero/kuwait.avif',
    altText: {
      en: 'Kuwait City skyline - Business expansion and company formation in GCC region',
      ru: 'Панорама Кувейта - Расширение бизнеса и регистрация компаний в регионе GCC'
    }
  },
  {
    name: { en: 'UAE', ru: 'ОАЭ' },
    image: '/images/hero/UAE.jpeg',
    altText: {
      en: 'UAE Dubai Marina - Gulf region business opportunities and market entry services',
      ru: 'ОАЭ Дубай Марина - Бизнес-возможности в регионе Залива и услуги выхода на рынок'
    }
    // No avif field yet — until an /images/hero/UAE.avif file actually exists,
    // don't reference one (see <picture> below for why).
  },
];

const Hero: React.FC<HeroProps> = ({ lang }) => {
  const [currentCountryIndex, setCurrentCountryIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [imageFade, setImageFade] = useState(true);


  useEffect(() => {
    const currentCountry = countries[currentCountryIndex].name[lang];

    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, 750); // 3.5 seconds pause
      return () => clearTimeout(pauseTimer);
    }

    const typingSpeed = isDeleting ? 50 : 100; // Faster deletion, slower typing

    const timer = setTimeout(() => {
      if (isDeleting) {
        // Deleting characters
        if (displayedText.length > 0) {
          setDisplayedText(currentCountry.substring(0, displayedText.length - 1));
        } else {
          // Finished deleting, fade out image and move to next country
          setImageFade(false);
          setTimeout(() => {
            setIsDeleting(false);
            setCurrentCountryIndex((prev) => (prev + 1) % countries.length);
            setImageFade(true);
          }, 300);
        }
      } else {
        // Typing characters
        if (displayedText.length < currentCountry.length) {
          setDisplayedText(currentCountry.substring(0, displayedText.length + 1));
        } else {
          // Finished typing, pause before deleting
          setIsPaused(true);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, isPaused, currentCountryIndex, lang]);

  const content = {
    titlePrefix: {
      en: "Launch Your Business in ",
      ru: "Запустите бизнес в "
    },
    subtitle: {
      en: "We help companies register, find investors, and enter the GCC market. Based in Doha, working with businesses from around the world.",
      ru: "Помогаем компаниям регистрироваться, находить инвесторов и выходить на рынок GCC. Работаем из Дохи с бизнесом со всего мира."
    },
    cta: {
      en: "Start Consultation",
      ru: "Начать консультацию"
    }
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center pt-32 pb-12 overflow-hidden bg-white">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50/50 -skew-x-6 transform translate-x-1/4 z-0"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 to-transparent z-0"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-3/5 space-y-10">
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.05] tracking-tight text-balance">
              {content.titlePrefix[lang]}
              <span className="inline-block min-w-[200px] md:min-w-[300px] text-qatar-maroon">
                {displayedText}
                <span className="animate-pulse">_</span>
              </span>
            </h1>
            
            <p className="text-xl text-slate-500 max-w-xl leading-relaxed font-medium">
              {content.subtitle[lang]}
            </p>
            
            <div className="pt-4">
              <a
                href="#contacts"
                onClick={(e) => scrollToSection(e, 'contacts')}
                className="inline-flex items-center justify-center gap-2 bg-qatar-maroon hover:bg-qatar-maroon/90 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-qatar-maroon/30 transition-premium hover:scale-[1.02] active:scale-95"
              >
                {lang === 'en' ? 'Send Request' : 'Оставить заявку'}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>

            <div className="flex items-center gap-8 pt-6 border-t border-slate-100">
              <div className="flex -space-x-3">
                {[CLIENTS[0], CLIENTS[1], CLIENTS[3], CLIENTS[5]].map((client, i) => (
                  <div key={i} className="w-[67px] h-[67px] rounded-full border-2 border-slate-200 bg-white p-2 flex items-center justify-center shadow-lg">
                    <img src={client.logo} className="w-full h-full object-contain" alt={client.altText?.[lang] || client.name} loading="eager" decoding="async" />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <span className="font-bold text-slate-900">20+</span>
                <span className="text-slate-500 ml-1 font-medium">
                  {lang === 'en' ? 'Companies registered' : 'Компаний зарегистрировано'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="lg:w-2/5 relative hidden lg:block">
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border-8 border-white">
              <picture>
                {countries[currentCountryIndex].avif && (
                  <source
                    srcSet={countries[currentCountryIndex].avif}
                    type="image/avif"
                  />
                )}
                <img
                  src={countries[currentCountryIndex].image}
                  alt={countries[currentCountryIndex].altText?.[lang] || `${countries[currentCountryIndex].name.en} Business District`}
                  className="w-full aspect-[4/5] object-cover"
                  fetchPriority={currentCountryIndex === 0 ? 'high' : 'low'}
                  loading="eager"
                  decoding="async"
                  width="800"
                  height="1000"
                  style={{
                    opacity: imageFade ? 1 : 0,
                    transition: 'opacity 300ms ease-in-out'
                  }}
                />
              </picture>
            </div>
            {/* Floating stats card */}
            <div className="absolute -bottom-6 -left-12 glass p-6 rounded-3xl shadow-xl z-20 border border-white/50 backdrop-blur-xl animate-bounce-subtle hidden xl:block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-600">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{lang === 'en' ? 'Tax Rate' : 'Налоговая ставка'}</div>
                  <div className="text-2xl font-black text-slate-900">0% <span className="text-sm font-bold text-slate-400">Income</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;