import React from 'react';
import { Language } from '../types';

interface BusinessGoalsProps {
  lang: Language;
}

const BusinessGoals: React.FC<BusinessGoalsProps> = ({ lang }) => {
  const content = {
    title: {
      en: 'Our goal is simple: to be your long-term partner in financial clarity, compliance, and growth. So you can focus on your business vision while we handle the rest.',
      ru: 'Наша цель проста: быть вашим долгосрочным партнером в финансовой ясности, соблюдении требований и росте. Чтобы вы могли сосредоточиться на своем бизнесе, пока мы занимаемся остальным.'
    },
    industries: [
      {
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        ),
        label: { en: 'Real Estate', ru: 'Недвижимость' }
      },
      {
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        ),
        label: { en: 'Education', ru: 'Образование' }
      },
      {
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
        label: { en: 'Construction', ru: 'Строительство' }
      },
      {
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        ),
        label: { en: 'Trading', ru: 'Торговля' }
      },
      {
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
        label: { en: 'Diversification', ru: 'Диверсификация' }
      },
      {
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        ),
        label: { en: 'Oil & Gas', ru: 'Нефть и газ' }
      }
    ]
  };

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      {/* Background decorative element */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.02]">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-qatar-maroon rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side: Image */}
          <div className="relative">
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl">
              <img
                src="/images/about/office_imgg.jpg"
                alt={lang === 'en' ? 'Business meeting' : 'Деловая встреча'}
                className="w-full aspect-[4/3] object-cover object-[center_35%]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 bg-qatar-maroon text-white px-8 py-6 rounded-3xl shadow-2xl">
              <div className="text-4xl font-black">20+</div>
              <div className="text-sm font-semibold opacity-90 mt-1">
                {lang === 'en' ? 'Industries Served' : 'Отраслей обслужено'}
              </div>
            </div>
          </div>

          {/* Right side: Text and buttons */}
          <div className="space-y-10">
            <p className="text-xl md:text-2xl text-slate-700 leading-relaxed font-medium">
              {content.title[lang]}
            </p>

            {/* Industry buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {content.industries.map((industry, idx) => (
                <button
                  key={idx}
                  className="group flex items-center gap-3 bg-[#8D1B3D] hover:bg-[#6d1530] text-white px-6 py-4 rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-xl text-left min-w-0"
                >
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                    {industry.icon}
                  </div>
                  <span className="font-bold text-sm truncate">
                    {industry.label[lang]}
                  </span>
                  <svg
                    className="w-4 h-4 ml-auto flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessGoals;
