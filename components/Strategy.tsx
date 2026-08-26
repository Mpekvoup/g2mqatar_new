
import React from 'react';
import { Language } from '../types';

interface StrategyProps {
  lang: Language;
}

const Strategy: React.FC<StrategyProps> = ({ lang }) => {
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
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="bg-gradient-to-br from-qatar-maroon to-[#5d1428] rounded-[60px] p-12 lg:p-24 relative overflow-hidden flex flex-col lg:flex-row items-center gap-16 shadow-2xl">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white opacity-5 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white opacity-[0.03] rounded-full blur-[100px] pointer-events-none"></div>

          <div className="lg:w-3/5 text-white space-y-8 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              {lang === 'en' ? (
                <>Your partner for <span className="text-white/90">business in Qatar</span></>
              ) : (
                <>Ваш партнёр по <span className="text-white/90">бизнесу в Катаре</span></>
              )}
            </h2>
            <h3 className="text-2xl text-white/80 font-medium">
              {lang === 'en' ? 'Qatar as a gateway to GCC markets' : 'Катар как путь к рынкам GCC'}
            </h3>
            <div className="space-y-4 text-lg text-white/70">
              <p>
                {lang === 'en'
                  ? "We work with startups, SMEs, and enterprises that want to establish presence in Qatar."
                  : 'Работаем со стартапами, МСБ и корпорациями, которые хотят присутствия в Катаре.'}
              </p>
              <p>
                {lang === 'en'
                  ? 'Company registration, investor connections, market expansion - practical help at every step.'
                  : 'Регистрация компаний, контакты с инвесторами, выход на рынок - практическая помощь на каждом шаге.'}
              </p>
            </div>
            <a
              href="#contacts"
              onClick={(e) => scrollToSection(e, 'contacts')}
              className="block w-full lg:inline-block lg:w-auto bg-white text-qatar-maroon px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/90 hover:scale-105 transition-premium shadow-xl text-center"
            >
              {lang === 'en' ? 'Get in Touch' : 'Связаться'}
            </a>
          </div>

          <div className="hidden lg:flex lg:w-2/5 justify-center relative z-10">
            <img src="/images/strategy/earth.png" alt="Earth" width="900" height="900" loading="lazy" decoding="async" />
          </div>
          </div>
        </div>
    </section>
  );
};

export default Strategy;
