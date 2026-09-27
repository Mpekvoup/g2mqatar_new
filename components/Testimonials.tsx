import React from 'react';
import { Link } from 'react-router-dom';
import { Language } from '../types';
import { CASE_STUDIES } from '../caseStudiesData';

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
      logo: '/images/clients/caring_hands.webp',
      slug: CASE_STUDIES[0].slug,
      highlight: { metric: CASE_STUDIES[0].results[lang][0].metric, label: CASE_STUDIES[0].results[lang][0].label },
    },
    {
      quote: CASE_STUDIES[1].quote[lang],
      author: CASE_STUDIES[1].quotee[lang],
      company: CASE_STUDIES[1].company[lang],
      industry: CASE_STUDIES[1].industry[lang],
      logo: '/images/clients/sidr-tech-logo.webp',
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
    <section className="py-32 bg-slate-50 dark:bg-qatar-night transition-colors duration-200">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-16">
          <div className="space-y-4">
            <h2 className="text-xs font-black text-qatar-maroon dark:text-[#d85b7d] uppercase tracking-[0.4em]">
              {lang === 'en' ? 'Client Stories' : 'Истории клиентов'}
            </h2>
            <p className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {lang === 'en' ? 'Results that speak' : 'Реальные результаты'}
            </p>
          </div>
          <Link
            to="/case-studies"
            className="flex-shrink-0 self-end lg:self-auto flex items-center gap-2 text-qatar-maroon dark:text-[#d85b7d] font-bold hover:underline"
          >
            {lang === 'en' ? 'All case studies' : 'Все кейсы'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, idx) => (
            <Link
              key={idx}
              to={`/case-studies/${item.slug}`}
              className="group flex flex-col bg-white dark:bg-slate-900 rounded-3xl p-10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] dark:shadow-lg dark:shadow-black/20 border border-slate-200/60 dark:border-slate-700/50 hover:shadow-[0_20px_60px_-15px_rgba(114,28,36,0.15)] dark:hover:shadow-xl dark:hover:shadow-black/30 hover:border-qatar-maroon/20 dark:hover:border-qatar-maroon/40 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden"
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-qatar-maroon/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-qatar-maroon via-qatar-maroon/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

              <div className="relative z-10">
                {/* Logo + industry */}
                <div className="flex items-center justify-between mb-8">
                  <div className="p-3 bg-slate-50 dark:bg-white/95 rounded-2xl group-hover:bg-white group-hover:shadow-sm transition-all duration-300">
                    <img
                      src={item.logo}
                      alt={`${item.company} - ${lang === 'en' ? 'Client testimonial for G2M International Qatar consulting services' : 'Отзыв клиента о консалтинговых услугах G2M International Qatar'}`}
                      className="h-10 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-800/80 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest border border-slate-200/50 dark:border-slate-700 group-hover:border-qatar-maroon/20 dark:group-hover:border-qatar-maroon/40 transition-colors">
                    <span className="w-1 h-1 rounded-full bg-qatar-maroon"></span>
                    {item.industry}
                  </span>
                </div>

                {/* Key metric - Enhanced */}
                <div className="bg-gradient-to-br from-qatar-maroon/10 via-qatar-maroon/5 to-transparent dark:from-qatar-maroon/20 dark:via-qatar-maroon/10 dark:to-transparent rounded-2xl px-6 py-5 mb-8 border border-qatar-maroon/10 dark:border-qatar-maroon/30 group-hover:border-qatar-maroon/20 dark:group-hover:border-qatar-maroon/50 group-hover:shadow-sm transition-all duration-300">
                  <div className="text-3xl md:text-4xl font-black bg-gradient-to-br from-qatar-maroon to-qatar-maroon/70 dark:from-[#d85b7d] dark:to-[#d85b7d]/70 bg-clip-text text-transparent leading-none mb-2">
                    {item.highlight.metric}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wide">
                    {item.highlight.label}
                  </div>
                </div>

                {/* Quote - Enhanced */}
                <div className="relative mb-8">
                  <div className="absolute -left-2 -top-1 text-6xl text-qatar-maroon/10 dark:text-qatar-maroon/20 leading-none">"</div>
                  <blockquote className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed flex-grow text-base pl-6 italic">
                    {item.quote}
                  </blockquote>
                </div>

                {/* Author - Enhanced */}
                <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-700/50 group-hover:border-qatar-maroon/10 dark:group-hover:border-qatar-maroon/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-qatar-maroon dark:group-hover:text-[#d85b7d] transition-colors">{item.author}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">{item.company}</div>
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-slate-200 dark:border-slate-600 flex items-center justify-center group-hover:border-qatar-maroon group-hover:bg-qatar-maroon group-hover:scale-110 transition-all duration-300">
                      <svg className="w-4 h-4 text-slate-400 group-hover:text-white transition-all duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
