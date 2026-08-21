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
  },
  {
    name: { en: 'Oman', ru: 'Омане' },
    image: '/images/hero/oman.jpg',
    avif: '/images/hero/oman.avif',
  },
  {
    name: { en: 'Kuwait', ru: 'Кувейте' },
    image: '/images/hero/kuwait.jpg',
    avif: '/images/hero/kuwait.avif',
  },
  {
    name: { en: 'UAE', ru: 'ОАЭ' },
    image: '/images/hero/UAE.jpeg',
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
    <section className="relative min-h-[90vh] flex items-center pt-24 pb-12 overflow-hidden bg-white">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50/50 -skew-x-6 transform translate-x-1/4 z-0"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 to-transparent z-0"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-3/5 space-y-10">
            <div className="inline-flex items-center space-x-2 py-1.5 px-4 bg-qatar-maroon/5 rounded-full border border-qatar-maroon/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-qatar-maroon opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-qatar-maroon"></span>
              </span>
              <span className="text-qatar-maroon text-[11px] font-extrabold uppercase tracking-[0.2em]">
                {lang === 'en' ? 'GCC Market Entry' : 'Выход на рынок GCC'}
              </span>
            </div>
            
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
            
            <div className="flex flex-col sm:flex-row gap-5 pt-4">
              <a
                href={`https://wa.me/97450910893?text=${lang === 'en' ? 'Hello! I would like to discuss market entry in Qatar.' : 'Здравствуйте! Хотел бы обсудить выход на рынок Катара.'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-green-500/30 transition-premium hover:scale-[1.02] active:scale-95 text-center flex items-center justify-center gap-3"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current flex-shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {lang === 'en' ? 'Chat on WhatsApp' : 'Написать в WhatsApp'}
              </a>
              <a
                href="#contacts"
                onClick={(e) => scrollToSection(e, 'contacts')}
                className="bg-white border-2 border-slate-100 hover:border-slate-200 text-slate-600 px-10 py-5 rounded-2xl font-bold text-lg transition-premium text-center flex items-center justify-center gap-2 group"
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
                    <img src={client.logo} className="w-full h-full object-contain" alt={client.name} loading="lazy" decoding="async" />
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
                  alt={`${countries[currentCountryIndex].name.en} Business District`}
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