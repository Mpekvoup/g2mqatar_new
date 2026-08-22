import React from 'react';
import { Link } from 'react-router-dom';
import { Language } from '../types';
import { CASE_STUDIES } from '../caseStudiesData';
import sidrTechLogo from '../src/assets/clients/sidr-tech-logo.webp';
import caringHandsLogo from '../src/assets/clients/caring_hands.webp';

interface TestimonialsProps {
  lang: Language;
}

const Testimonials: React.FC<TestimonialsProps> = ({ lang }) => {
  const items = [
    {
      quote: CASE_STUDIES[0].quote[lang],
      author: CASE_STUDIES[0].quotee[lang],
      company: CASE_STUDIES[0].company[lang],
      industry: CASE_STUDIES[0].industry[lang],
      logo: caringHandsLogo,
      slug: CASE_STUDIES[0].slug,
      highlight: { metric: CASE_STUDIES[0].results[lang][0].metric, label: CASE_STUDIES[0].results[lang][0].label },
    },
    {
      quote: CASE_STUDIES[1].quote[lang],
      author: CASE_STUDIES[1].quotee[lang],
      company: CASE_STUDIES[1].company[lang],
      industry: CASE_STUDIES[1].industry[lang],
      logo: sidrTechLogo,
      slug: CASE_STUDIES[1].slug,
      highlight: { metric: CASE_STUDIES[1].results[lang][0].metric, label: CASE_STUDIES[1].results[lang][0].label },
    },
    {
      quote: CASE_STUDIES[2].quote[lang],
      author: CASE_STUDIES[2].quotee[lang],
      company: CASE_STUDIES[2].company[lang],
      industry: CASE_STUDIES[2].industry[lang],
      logo: '/images/clients/qalan.webp',
      slug: CASE_STUDIES[2].slug,
      highlight: { metric: CASE_STUDIES[2].results[lang][0].metric, label: CASE_STUDIES[2].results[lang][0].label },
    },
  ];

  return (
    <section className="py-32 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-16">
          <div className="space-y-4">
            <h2 className="text-xs font-black text-qatar-maroon uppercase tracking-[0.4em]">
              {lang === 'en' ? 'Client Stories' : 'Истории клиентов'}
            </h2>
            <p className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              {lang === 'en' ? 'Results that speak' : 'Результаты говорят'}
            </p>
          </div>
          <Link
            to="/case-studies"
            className="flex-shrink-0 self-end lg:self-auto flex items-center gap-2 text-qatar-maroon font-bold hover:underline"
          >
            {lang === 'en' ? 'All case studies' : 'Все кейсы'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <Link
              key={idx}
              to={`/case-studies/${item.slug}`}
              className="group flex flex-col bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:border-qatar-maroon/10 transition-all duration-300"
            >
              {/* Logo + industry */}
              <div className="flex items-center justify-between mb-6">
                <img
                  src={item.logo}
                  alt={`${item.company} - ${lang === 'en' ? 'Client testimonial for G2M International Qatar consulting services' : 'Отзыв клиента о консалтинговых услугах G2M International Qatar'}`}
                  className="h-8 object-contain grayscale group-hover:grayscale-0 transition-all"
                  loading="lazy"
                  decoding="async"
                />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.industry}</span>
              </div>

              {/* Key metric */}
              <div className="bg-qatar-maroon/5 rounded-2xl px-5 py-4 mb-6 flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="text-xl sm:text-2xl md:text-3xl font-black text-qatar-maroon leading-none flex-shrink-0 break-words">{item.highlight.metric}</div>
                <div className="text-xs text-slate-500 font-semibold leading-tight min-w-0">{item.highlight.label}</div>
              </div>

              {/* Quote */}
              <blockquote className="text-slate-700 font-medium leading-relaxed flex-grow text-sm">
                {item.quote}
              </blockquote>

              {/* Author */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="text-sm font-bold text-slate-900">{item.author}</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">{item.company}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
