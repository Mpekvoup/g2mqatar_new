import React from 'react';
import { Language } from '../types';

interface ServicesConsultationPanelProps {
  lang: Language;
}

const LANGUAGES = ['KZ', 'RU', 'EN', 'AR', 'TR'];

const ServicesConsultationPanel: React.FC<ServicesConsultationPanelProps> = ({ lang }) => {
  const steps = [
    {
      title: { en: 'Pick a time & format', ru: 'Выберите время и формат' },
      desc: {
        en: 'Choose whatever works for you: video call, WhatsApp, or a phone call.',
        ru: 'Как вам удобно: видеозвонок, WhatsApp или обычный телефонный звонок.',
      },
    },
    {
      title: { en: '1 - hour call', ru: 'Часовой созвон' },
      desc: {
        en: 'A direct conversation about your situation — market entry, registration, or a trading deal.',
        ru: 'Прямой разговор о вашей задаче — выход на рынок, регистрация или сделка.',
      },
    },
    {
      title: { en: 'Written action plan', ru: 'Письменный план действий' },
      desc: {
        en: 'You leave with concrete next steps in writing, not just notes from a call.',
        ru: 'На выходе — конкретные следующие шаги в письменном виде, а не просто заметки после звонка.',
      },
    },
  ];

  return (
    <div className="max-w-6xl mx-auto rounded-[2.5rem] overflow-hidden shadow-[0_24px_80px_-16px_rgba(141,27,61,0.25)] border border-qatar-maroon/10 flex flex-col lg:flex-row">
      {/* Left: who you're talking to + price + CTA */}
      <div className="lg:w-[36%] bg-gradient-to-br from-qatar-maroon to-[#5e1128] p-10 md:p-12 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative space-y-6">
          {/* Adjust the path below to wherever the photo actually lives in /public/images */}
          <img
            src="/images/about/about.jpg"
            alt={lang === 'en'
              ? "Begarys Otarov - Managing Partner at G2M International Consulting, Qatar business registration expert"
              : "Бегарыс Отаров - Управляющий партнер G2M International Consulting, эксперт по регистрации бизнеса в Катаре"}
            className="w-80 h-80 rounded-2xl object-cover object-[center_30%] lg:object-[center_25%] flex-shrink-0 border border-white/20"
            width="800"
            height="909"
            loading="lazy"
            decoding="async"
          />
          <div>
            <h3 className="text-xl font-extrabold text-white leading-tight">
              Begarys Otarov
            </h3>
            <p className="text-white/60 text-xs font-bold uppercase tracking-wider mt-1">
              {lang === 'en' ? 'Managing Partner' : 'Управляющий партнёр'}
            </p>
            <p className="text-white/70 text-sm leading-relaxed mt-4">
              {lang === 'en'
                ? "You'll speak directly with the managing partner — not a call center or a junior associate."
                : 'Вы говорите напрямую с управляющим партнёром — не с колл-центром и не с младшим сотрудником.'}
            </p>
          </div>

          {/* Languages */}
          <div className="flex items-center gap-2 pt-1">
            {LANGUAGES.map((code) => (
              <span
                key={code}
                className="text-[10px] font-bold text-white/70 bg-white/10 border border-white/15 rounded-md px-2 py-1"
              >
                {code}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mt-10">
          <div className="flex items-baseline gap-2 mb-5">
            <span className="text-4xl font-black text-white">$100</span>
            <span className="text-white/50 text-xs font-semibold">
              · 1 {lang === 'en' ? 'hour' : 'час'}
            </span>
          </div>
          <a
            href="#contacts"
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById('contacts');
              if (element) {
                const offset = 80;
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = element.getBoundingClientRect().top;
                const offsetPosition = elementRect - bodyRect - offset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
              }
            }}
            className="group inline-flex w-full items-center justify-center gap-2 bg-white text-qatar-maroon font-black text-sm px-7 py-4 rounded-2xl shadow-[0_10px_28px_rgba(0,0,0,0.22)] hover:shadow-[0_14px_34px_rgba(0,0,0,0.28)] hover:-translate-y-0.5 transition-all duration-200"
          >
            {lang === 'en' ? 'Book Now' : 'Записаться'}
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <p className="text-white/45 text-[11px] font-semibold mt-3 text-center">
            {lang === 'en' ? 'Typically responds within 24 hours' : 'Обычно отвечаем в течение 24 часов'}
          </p>
        </div>
      </div>

      {/* Right: how it works + trust stats + FAQ */}
      <div className="flex-1 bg-white p-10 md:p-12">
        <p className="text-[10px] font-black text-qatar-maroon uppercase tracking-[0.4em] mb-7">
          {lang === 'en' ? 'How it works' : 'Как это проходит'}
        </p>
        <div>
          {steps.map((step, idx) => (
            <div key={idx} className="flex gap-5">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-9 h-9 bg-qatar-maroon text-white rounded-xl flex items-center justify-center text-xs font-black shadow-sm">
                  {idx + 1}
                </div>
                {idx < steps.length - 1 && (
                  <div className="w-px flex-1 bg-qatar-maroon/12 my-1.5" />
                )}
              </div>
              <div className={idx < steps.length - 1 ? 'pb-6' : ''}>
                <h5 className="font-bold text-slate-900 text-sm mb-1 pt-1.5 leading-tight">
                  {step.title[lang]}
                </h5>
                <p className="text-slate-500 text-xs leading-relaxed">
                  {step.desc[lang]}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust stats */}
        <div className="grid grid-cols-3 gap-4 py-7 my-8 border-y border-slate-100">
          {[
            { value: '20+', label: { en: 'Companies helped', ru: 'Компаний\u00A0сопроводили' } },
            { value: 'QFC', label: { en: 'Licensed in Qatar', ru: 'Лицензия\u00A0в\u00A0Катаре' } },
            { value: '1:1', label: { en: 'Direct, no hand-offs', ru: 'Без\u00A0передачи\u00A0менеджеру' } },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl font-black text-qatar-maroon leading-none">{stat.value}</p>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mt-2 leading-tight">
                {stat.label[lang]}
              </p>
            </div>
          ))}
        </div>

        {/* Mini FAQ */}
        <div>
          <p className="text-[10px] font-black text-qatar-maroon uppercase tracking-[0.4em] mb-5">
            {lang === 'en' ? 'FAQ' : 'Частые вопросы'}
          </p>
          <div className="space-y-5">
            {[
              {
                q: { en: 'Is the first call free?', ru: 'Первая консультация бесплатна?' },
                a: {
                  en: 'No — every session is paid from the start, including the first one. That keeps the time focused on your case, not a generic sales pitch.',
                  ru: 'Нет — каждая консультация платная с самого начала, включая первую. Это гарантирует, что время идёт на вашу задачу, а не на общую презентацию.',
                },
              },
              {
                q: { en: "What's included in the $100?", ru: 'Что входит в $100?' },
                a: {
                  en: 'A 1-hour call plus a written action plan afterward — not just notes.',
                  ru: 'Часовой созвон и письменный план действий после него — не просто заметки.',
                },
              },
              {
                q: { en: 'Can I reschedule?', ru: 'Можно перенести время?' },
                a: {
                  en: 'Yes — just message beforehand and we\u2019ll find a new slot.',
                  ru: 'Да — просто напишите заранее, подберём новое время.',
                },
              },
            ].map((item, i) => (
              <div key={i}>
                <p className="text-sm font-bold text-slate-900 mb-1">{item.q[lang]}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{item.a[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesConsultationPanel;
