import React from 'react';
import { Language } from '../types';
import { PRINCIPLES } from '../constants';

interface PrinciplesProps {
  lang: Language;
}

const Principles: React.FC<PrinciplesProps> = ({ lang }) => {
  return (
    <section className="py-32 bg-white text-qatar-maroon relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-qatar-maroon opacity-5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-qatar-maroon opacity-[0.03] rounded-full blur-[80px]"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-24">
          <div className="max-w-2xl space-y-6">
            <h2 className="text-xs font-black text-qatar-maroon uppercase tracking-[0.4em]">
              {lang === 'en' ? 'How we work' : 'Как мы работаем'}
            </h2>
            <p className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-qatar-maroon">
              {lang === 'en' ? 'Simple principles' : 'Простые принципы'}
            </p>
          </div>
          <p className="text-qatar-maroon/70 max-w-sm text-lg font-medium leading-relaxed pt-2">
            {lang === 'en'
              ? 'Three things that matter most when working with clients.'
              : 'Три вещи, которые важнее всего в работе с клиентами.'}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {PRINCIPLES.map((p, idx) => (
            <div key={idx} className="group bg-qatar-maroon p-12 rounded-[2.5rem] border border-qatar-maroon hover:shadow-2xl transition-premium">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-premium">
                {idx === 0 && (
                  <picture>
                    <source srcSet="/images/icons/handshake.webp" type="image/webp" />
                    <img src="/images/icons/handshake.png" alt="Integrity" className="w-8 h-8" width="32" height="32" style={{filter: 'invert(18%) sepia(60%) saturate(3000%) hue-rotate(325deg) brightness(80%)'}} />
                  </picture>
                )}
                {idx === 1 && (
                  <picture>
                    <source srcSet="/images/icons/target.webp" type="image/webp" />
                    <img src="/images/icons/target.png" alt="Personalized Approach" className="w-8 h-8" width="32" height="32" style={{filter: 'invert(18%) sepia(60%) saturate(3000%) hue-rotate(325deg) brightness(80%)'}} />
                  </picture>
                )}
                {idx === 2 && (
                  <svg className="w-8 h-8 text-qatar-maroon" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M0 0h1v15h15v1H0zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07"/>
                  </svg>
                )}
              </div>
              <h3 className="text-2xl font-bold mb-5 tracking-tight text-white">{p.title[lang]}</h3>
              <p className="text-white/80 leading-relaxed text-lg font-medium">{p.desc[lang]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Principles;