import React from 'react';
import { Language } from '../types';

interface OurInsightsProps {
  lang: Language;
}

interface Article {
  image: string;
  category: { en: string; ru: string };
  date: string;
  readTime: string;
  title: { en: string; ru: string };
  author: { en: string; ru: string };
}

const OurInsights: React.FC<OurInsightsProps> = ({ lang }) => {
  const content = {
    subtitle: {
      en: 'Our Insights',
      ru: 'Наши статьи'
    },
    title: {
      en: 'Stay informed with expert articles and updates from Newoon, bringing you fresh perspectives on business, finance, and innovation.',
      ru: 'Будьте в курсе экспертных статей и обновлений от Newoon, предлагающих свежие взгляды на бизнес, финансы и инновации.'
    },
    cta: {
      en: 'Read More on Our Blog',
      ru: 'Читать больше в нашем блоге'
    }
  };

  const articles: Article[] = [
    {
      image: '/images/strategy/strategy1.jpg',
      category: { en: 'Newoon Team', ru: 'Команда Newoon' },
      date: lang === 'en' ? 'June 23, 2025' : '23 июня 2025',
      readTime: lang === 'en' ? '8 min read' : '8 мин чтения',
      title: {
        en: 'Signs Your Business Needs Strategic Finance Support and How to Act Before It\'s Too Late',
        ru: 'Признаки того, что вашему бизнесу нужна стратегическая финансовая поддержка и как действовать до того, как станет слишком поздно'
      },
      author: { en: 'Newoon Articles', ru: 'Статьи Newoon' }
    },
    {
      image: '/images/strategy/strategy2.jpg',
      category: { en: 'Newoon Team', ru: 'Команда Newoon' },
      date: lang === 'en' ? 'June 4, 2025' : '4 июня 2025',
      readTime: lang === 'en' ? '10 min read' : '10 мин чтения',
      title: {
        en: 'Fractional CFO Services in Qatar: What Growing SMEs Need to Know',
        ru: 'Услуги частичного CFO в Катаре: что нужно знать растущим малым и средним предприятиям'
      },
      author: { en: 'Newoon Articles', ru: 'Статьи Newoon' }
    },
    {
      image: '/images/strategy/strategy3.jpg',
      category: { en: 'Newoon Team', ru: 'Команда Newoon' },
      date: lang === 'en' ? 'June 1, 2025' : '1 июня 2025',
      readTime: lang === 'en' ? '13 min read' : '13 мин чтения',
      title: {
        en: 'The Business Mistakes to Avoid That Are Costing Companies Everything',
        ru: 'Бизнес-ошибки, которых следует избегать и которые обходятся компаниям очень дорого'
      },
      author: { en: 'Newoon Articles', ru: 'Статьи Newoon' }
    }
  ];

  return (
    <section className="py-32 bg-slate-50 relative">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16">
          <div className="max-w-3xl space-y-5">
            <h2 className="text-xs font-black text-qatar-maroon uppercase tracking-[0.4em]">
              {content.subtitle[lang]}
            </h2>
            <p className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
              {content.title[lang]}
            </p>
          </div>
          <a
            href="#blog"
            className="group flex items-center gap-2 text-qatar-maroon font-bold hover:underline whitespace-nowrap"
          >
            {content.cta[lang]}
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article, idx) => (
            <article
              key={idx}
              className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={article.image}
                  alt={article.title[lang]}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/95 backdrop-blur-sm text-slate-700 text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                    {article.category[lang]}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-4">
                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold">
                  <time>{article.date}</time>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 leading-tight line-clamp-3 group-hover:text-qatar-maroon transition-colors">
                  {article.title[lang]}
                </h3>

                {/* Author */}
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-sm text-slate-500 font-medium">
                    {article.author[lang]}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurInsights;
