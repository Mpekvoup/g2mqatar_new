import React, { useState } from 'react';
import { Language } from '../types';

interface TeamProps {
  lang: Language;
}

interface TeamMember {
  name: {
    en: string;
    ru: string;
  };
  role: {
    en: string;
    ru: string;
  };
  location: {
    en: string;
    ru: string;
  };
  areasOfFocus: {
    en: string[];
    ru: string[];
  };
  education: {
    en: string;
    ru: string;
  };
  bio: {
    en: string;
    ru: string;
  };
  image: string;
  linkedin?: string;
  email?: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: {
      en: 'Begarys Otarov',
      ru: 'Бегарыс Отаров',
    },
    role: {
      en: 'Managing Partner',
      ru: 'Управляющий партнер',
    },
    location: {
      en: 'Doha',
      ru: 'Доха',
    },
    areasOfFocus: {
      en: [
        'Market Entry Strategy',
        'Legal & Regulatory Structuring',
        'Investment Advisory',
        'Cross-Border Business Development',
        'GCC Market Expansion',
      ],
      ru: [
        'Стратегия выхода на рынок',
        'Юридическое и нормативное структурирование',
        'Инвестиционный консалтинг',
        'Трансграничное развитие бизнеса',
        'Расширение на рынке GCC',
      ],
    },
    education: {
      en: 'Business Development / International Markets background',
      ru: 'Развитие бизнеса / Международные рынки',
    },
    bio: {
      en: "Begarys Otarov leads G2M International Consulting's market entry and investment advisory practice across the Gulf region. He oversees the firm's strategic partnerships with regulatory and financial institutions, including the Qatar Financial Centre, Qatar Development Bank, and Qatar Science & Technology Park. His work focuses on legal structuring, regulatory compliance, and investment matchmaking for companies entering the Qatar and broader GCC market, with engagements spanning the IT, fintech, healthtech, and e-commerce sectors. Before his current role, Begarys worked in business development, helping scale a firm's operations across multiple international markets. He is fluent in Arabic, Kazakh, Russian, and English.",
      ru: 'Бегарыс Отаров возглавляет практику G2M International Consulting по выходу на рынок и инвестиционному консалтингу в регионе Персидского залива. Он курирует стратегические партнерства фирмы с регулирующими и финансовыми институтами, включая Qatar Financial Centre, Qatar Development Bank и Qatar Science & Technology Park. Его работа сосредоточена на юридическом структурировании, соблюдении нормативных требований и подборе инвестиций для компаний, выходящих на рынок Катара и более широкого региона GCC, с проектами в секторах IT, fintech, healthtech и электронной коммерции. До нынешней роли Бегарыс работал в области развития бизнеса, помогая масштабировать операции компании на множественных международных рынках. Свободно владеет арабским, казахским, русским и английским языками.',
    },
    image: '/images/about/about.jpg',
    email: 'beqarys.otarov@go2market.qa',
    linkedin: 'https://www.linkedin.com/in/begarys-otarov',
  },
  {
    name: {
      en: 'Alisher S.',
      ru: 'Алишер С.',
    },
    role: {
      en: 'Head of Operations & Agricultural Trade',
      ru: 'Руководитель операций и агроторговли',
    },
    location: {
      en: 'Astana',
      ru: 'Астана',
    },
    areasOfFocus: {
      en: [
        'Agricultural Trade & Export',
        'Contract Execution',
        'Grain Procurement',
        'Supply Chain & Logistics',
        'Client Onboarding & Project Management',
      ],
      ru: [
        'Агроторговля и экспорт',
        'Исполнение контрактов',
        'Закупка зерна',
        'Цепочки поставок и логистика',
        'Онбординг клиентов и управление проектами',
      ],
    },
    education: {
      en: 'Mechanical Engineering background',
      ru: 'Машиностроительное образование',
    },
    bio: {
      en: "Alisher S. leads operational execution and agricultural trade at G2M International Consulting. He manages end-to-end contract execution, from grain procurement to delivery in target markets, with a track record including 37,000+ MT of feed meal exported to China and 7,000+ MT of flaxseed exported to Belgium. His work spans sourcing through a network of 3,000+ registered grain producers, coordinating DAP delivery logistics, and overseeing client onboarding and project management to ensure execution moves from pipeline to completion with full transparency. Before his current role, Alisher worked as a Mechanical Design Engineer at ERG Kazakhstan, giving him practical insight into equipment and process constraints relevant to commodity and industrial trade operations.",
      ru: "Алишер С. возглавляет операционное выполнение и агроторговлю в G2M International Consulting. Он управляет исполнением контрактов от начала до конца, от закупки зерна до доставки на целевые рынки, с послужным списком, включающим экспорт более 37 000 тонн кормовой муки в Китай и более 7 000 тонн льна в Бельгию. Его работа охватывает поиск поставщиков через сеть из более чем 3 000 зарегистрированных производителей зерна, координацию логистики поставок DAP и надзор за онбордингом клиентов и управлением проектами для обеспечения выполнения от этапа планирования до завершения с полной прозрачностью. До нынешней роли Алишер работал инженером-конструктором в ERG Kazakhstan, что дало ему практическое понимание ограничений оборудования и процессов, актуальных для товарных и промышленных торговых операций.",
    },
    image: '/images/about/new_person_to_add/5323599173439396172.jpg',
    email: 'a.sabitov@go2market.qa',
    linkedin: 'https://www.linkedin.com/in/alisher-sabitov-473642224',
  },
];

const Team: React.FC<TeamProps> = ({ lang }) => {
  const [expandedMember, setExpandedMember] = useState<number | null>(null);

  const toggleMember = (idx: number) => {
    setExpandedMember(expandedMember === idx ? null : idx);
  };

  return (
    <section id="team" className="py-32 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-qatar-maroon opacity-[0.02] rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-20">
          <div className="max-w-2xl space-y-5">
            <h2 className="text-xs font-black text-qatar-maroon uppercase tracking-[0.4em]">
              {lang === 'en' ? 'Leadership' : 'Руководство'}
            </h2>
            <p className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              {lang === 'en' ? 'Meet our team' : 'Наша команда'}
            </p>
          </div>
          <p className="text-lg text-slate-500 font-medium max-w-md leading-relaxed">
            {lang === 'en'
              ? 'Experienced professionals helping businesses navigate the GCC market with local expertise and international connections.'
              : 'Опытные специалисты помогают бизнесу ориентироваться на рынке GCC с местным опытом и международными связями.'}
          </p>
        </div>

        {/* Team List */}
        <div className="max-w-4xl mx-auto space-y-6">
          {TEAM_MEMBERS.map((member, idx) => (
            <div key={idx}>
              {/* Compact Card */}
              <button
                onClick={() => toggleMember(idx)}
                className={`w-full flex items-center gap-6 bg-white p-6 md:p-8 rounded-[2rem] border transition-all duration-300 ${
                  expandedMember === idx
                    ? 'border-qatar-maroon shadow-xl'
                    : 'border-slate-100 hover:border-qatar-maroon/30 hover:shadow-lg'
                }`}
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <img
                    src={member.image}
                    alt={`${member.name[lang]} - ${member.role[lang]} ${lang === 'en' ? 'at G2M International Consulting Qatar' : 'в G2M International Consulting Qatar'}`}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover object-[center_5%] md:object-[center_10%] border-4 border-slate-50"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {/* Name & Role */}
                <div className="flex-grow text-left">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">
                    {member.name[lang]}
                  </h3>
                  <p className="text-sm md:text-base text-slate-600 font-medium">
                    {member.role[lang]}
                  </p>
                  <p className="text-xs md:text-sm text-slate-400 font-medium mt-1">
                    {member.location[lang]}
                  </p>
                </div>

                {/* Expand Icon */}
                <div className="flex-shrink-0">
                  <svg
                    className={`w-6 h-6 text-qatar-maroon transition-transform duration-300 ${
                      expandedMember === idx ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Expanded Details */}
              {expandedMember === idx && (
                <div className="mt-6 bg-white rounded-[2rem] p-8 md:p-12 border border-qatar-maroon/10 shadow-lg animate-in">
                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left: Photo & Contact */}
                    <div className="lg:col-span-1 space-y-6">
                      <img
                        src={member.image}
                        alt={`${member.name[lang]} - ${member.role[lang]} ${lang === 'en' ? 'at G2M International Consulting Qatar' : 'в G2M International Consulting Qatar'}`}
                        className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover object-[center_5%] md:object-[center_10%] mx-auto lg:mx-0 border-8 border-slate-50 shadow-xl"
                        loading="lazy"
                        decoding="async"
                      />

                      {/* Contact */}
                      <div className="space-y-3">
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-qatar-maroon text-white rounded-xl hover:bg-qatar-maroon/90 transition-colors font-medium text-sm shadow-md"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {lang === 'en' ? 'Email' : 'Почта'}
                          </a>
                        )}
                        {member.linkedin && member.linkedin.length > 0 && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium text-sm"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                            LinkedIn
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Right: Details */}
                    <div className="lg:col-span-2 space-y-8">
                      {/* Name, Role, Location */}
                      <div>
                        <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                          {member.name[lang]}
                        </h3>
                        <p className="text-lg text-slate-700 font-semibold mb-1">
                          {member.role[lang]}
                        </p>
                        <p className="text-sm text-slate-500 font-medium">
                          {member.location[lang]}
                        </p>
                      </div>

                      {/* Areas of Focus */}
                      <div>
                        <h4 className="text-xs font-black text-qatar-maroon uppercase tracking-widest mb-4">
                          {lang === 'en' ? 'Areas of Focus' : 'Области фокуса'}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {member.areasOfFocus[lang].map((area, areaIdx) => (
                            <span
                              key={areaIdx}
                              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs font-semibold text-slate-700 hover:bg-qatar-maroon hover:text-white hover:border-qatar-maroon transition-colors"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Education */}
                      <div>
                        <h4 className="text-xs font-black text-qatar-maroon uppercase tracking-widest mb-3">
                          {lang === 'en' ? 'Education' : 'Образование'}
                        </h4>
                        <p className="text-sm text-slate-700 font-medium leading-relaxed">
                          {member.education[lang]}
                        </p>
                      </div>

                      {/* Biography */}
                      <div>
                        <h4 className="text-xs font-black text-qatar-maroon uppercase tracking-widest mb-4">
                          {lang === 'en' ? 'Biography' : 'Биография'}
                        </h4>
                        <p className="text-base text-slate-600 leading-relaxed">
                          {member.bio[lang]}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
