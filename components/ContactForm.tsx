import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { Language } from '../types';

interface ContactFormProps {
  lang: Language;
}

const COOLDOWN_SECONDS = 120;
const MAX_DAILY_SUBMISSIONS = 5;
const STORAGE_KEY_LAST_SUBMIT = 'g2m_last_submit';
const STORAGE_KEY_DAILY_COUNT = 'g2m_daily_count';
const STORAGE_KEY_DAILY_DATE = 'g2m_daily_date';

function getRemainingCooldown(): number {
  if (typeof window === 'undefined') return 0;
  const last = localStorage.getItem(STORAGE_KEY_LAST_SUBMIT);
  if (!last) return 0;
  const elapsed = Math.floor((Date.now() - Number(last)) / 1000);
  return Math.max(0, COOLDOWN_SECONDS - elapsed);
}

function getDailyCount(): number {
  if (typeof window === 'undefined') return 0;
  const today = new Date().toDateString();
  const storedDate = localStorage.getItem(STORAGE_KEY_DAILY_DATE);
  if (storedDate !== today) return 0;
  return Number(localStorage.getItem(STORAGE_KEY_DAILY_COUNT) || 0);
}

const ContactForm: React.FC<ContactFormProps> = ({ lang }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'limited'>('idle');
  const [cooldown, setCooldown] = useState(() => getRemainingCooldown());
  const formRef = useRef<HTMLFormElement>(null);
  const cooldownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Инициализация Emailjs один раз при загрузке компонента
  React.useEffect(() => {
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  }, []);

  // Восстановление cooldown при загрузке
  React.useEffect(() => {
    const remaining = getRemainingCooldown();
    if (remaining > 0) {
      setCooldown(remaining);
      cooldownIntervalRef.current = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            if (cooldownIntervalRef.current) clearInterval(cooldownIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (cooldownIntervalRef.current) clearInterval(cooldownIntervalRef.current);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (cooldown > 0) return;

    if (getDailyCount() >= MAX_DAILY_SUBMISSIONS) {
      setStatus('limited');
      return;
    }

    setStatus('loading');

    try {
      if (!formRef.current) return;

      // Отправляем форму через Emailjs
      const result = await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setStatus('success');
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', { event_category: 'contact', event_label: 'form_submit' });
      }

      // Добавляем параметр success=true в URL для отслеживания конверсий
      const url = new URL(window.location.href);
      url.searchParams.set('success', 'true');
      window.history.pushState({}, '', url.toString());

      // Очищаем форму после успешной отправки
      if (formRef.current) {
        formRef.current.reset();
      }

      // Сохраняем timestamp и счётчик в localStorage
      localStorage.setItem(STORAGE_KEY_LAST_SUBMIT, String(Date.now()));
      const today = new Date().toDateString();
      const storedDate = localStorage.getItem(STORAGE_KEY_DAILY_DATE);
      const count = storedDate === today ? getDailyCount() + 1 : 1;
      localStorage.setItem(STORAGE_KEY_DAILY_DATE, today);
      localStorage.setItem(STORAGE_KEY_DAILY_COUNT, String(count));

      setCooldown(COOLDOWN_SECONDS);

      if (cooldownIntervalRef.current) clearInterval(cooldownIntervalRef.current);

      cooldownIntervalRef.current = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            if (cooldownIntervalRef.current) clearInterval(cooldownIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch {
      setStatus('error');
    }
  };

  const countries = [
    { value: 'qatar', label: { en: 'Qatar', ru: 'Катар' } },
    { value: 'uae', label: { en: 'UAE', ru: 'ОАЭ' } },
    { value: 'kazakhstan', label: { en: 'Kazakhstan', ru: 'Казахстан' } },
    { value: 'russia', label: { en: 'Russia', ru: 'Россия' } },
    { value: 'uzbekistan', label: { en: 'Uzbekistan', ru: 'Узбекистан' } },
    { value: 'other', label: { en: 'Other', ru: 'Другая страна' } },
  ];

  return (
    <section id="contacts" className="py-32 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row bg-[#0F172A] rounded-[3rem] shadow-2xl overflow-hidden min-h-[700px]">
          <div className="lg:w-[45%] p-12 lg:p-20 bg-qatar-maroon text-white flex flex-col relative overflow-hidden">

            <div className="relative z-10 space-y-8 flex-grow">
              <h2 className="text-4xl lg:text-4xl font-extrabold leading-[1.1]">
                {lang === 'en' ? "Let's Talk About Your Plans" : 'Расскажите о ваших планах'}
              </h2>
              <p className="text-white/70 text-lg leading-relaxed font-medium">
                {lang === 'en'
                  ? "Book a call with our team. We'll discuss your goals and explain how we can help."
                  : 'Запишитесь на звонок с нашей командой. Обсудим ваши цели и объясним, как можем помочь.'}
              </p>
              
              <div className="space-y-8 pt-10">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-md">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <div>
                    <div className="text-[10px] font-black opacity-80 uppercase tracking-[0.2em] mb-1">{lang === 'en' ? 'Phone' : 'Телефон'}</div>
                    <div className="text-lg sm:text-2xl font-bold tracking-tight">+974 5091 0893</div>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-md">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 012 2H3a2 2 0 012-2z" /></svg>
                  </div>
                  <div>
                    <div className="text-[10px] font-black opacity-80 uppercase tracking-[0.2em] mb-1">{lang === 'en' ? 'Email' : 'Email'}</div>
                    <div className="text-base sm:text-2xl font-bold tracking-tight break-all sm:break-normal">Info@go2market.qa</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative z-10 pt-12 flex items-center gap-4 text-sm font-bold">
               <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
               <span className="text-white/70 tracking-wide uppercase">
                 {lang === 'en' ? 'Reply within 2 hours' : 'Отвечаем в течение 2 часов'}
               </span>
            </div>
          </div>
          
          <div className="lg:w-[55%] p-12 lg:p-20 bg-white">
            {status === 'success' ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-500">
                <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center border-4 border-green-100/50">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-extrabold text-slate-900">
                    {lang === 'en' ? 'Got it!' : 'Получили!'}
                  </h3>
                  <p className="text-slate-500 font-medium text-lg">
                    {lang === 'en' ? "We'll get back to you within 24 hours." : 'Ответим в течение 24 часов.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setStatus('idle');
                    // Очищаем параметр success из URL
                    const url = new URL(window.location.href);
                    url.searchParams.delete('success');
                    window.history.pushState({}, '', url.toString());
                  }}
                  className="bg-slate-50 text-slate-400 px-8 py-3 rounded-xl font-bold text-sm hover:bg-slate-100 hover:text-slate-600 transition-all"
                >
                  {lang === 'en' ? 'Send another request' : 'Отправить заново'}
                </button>
              </div>
            ) : status === 'limited' ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
                <div className="w-24 h-24 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center border-4 border-amber-100/50">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-extrabold text-slate-900">
                    {lang === 'en' ? 'Daily Limit Reached' : 'Дневной лимит достигнут'}
                  </h3>
                  <p className="text-slate-500 font-medium text-lg">
                    {lang === 'en' ? 'You have reached the maximum number of requests for today. Please try again tomorrow.' : 'Вы достигли максимального количества заявок на сегодня. Попробуйте завтра.'}
                  </p>
                </div>
              </div>
            ) : status === 'error' ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
                <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center border-4 border-red-100/50">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-extrabold text-slate-900">
                    {lang === 'en' ? 'Error Occurred' : 'Произошла ошибка'}
                  </h3>
                  <p className="text-slate-500 font-medium text-lg">
                    {lang === 'en' ? 'Please try again later.' : 'Пожалуйста, попробуйте позже.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setStatus('idle');
                    // Очищаем параметр success из URL
                    const url = new URL(window.location.href);
                    url.searchParams.delete('success');
                    window.history.pushState({}, '', url.toString());
                  }}
                  className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-black transition-all"
                >
                  {lang === 'en' ? 'Try Again' : 'Попробовать снова'}
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
                {/* Скрытое поле для email получателя (для Emailjs) */}
                <input type="hidden" name="to_email" value={import.meta.env.VITE_EMAILJS_TO_EMAIL} />
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] px-1">{lang === 'en' ? 'Full Name' : 'Полное имя'}</label>
                    <input 
                      type="text" 
                      name="name"
                      required 
                      className="w-full px-6 py-4 bg-slate-100 border-2 border-slate-200 focus:border-qatar-maroon/30 focus:bg-white rounded-[1.25rem] outline-none transition-premium font-medium"
                      placeholder="Jane Cooper"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] px-1">{lang === 'en' ? 'Target Region' : 'Целевой регион'}</label>
                    <select 
                      name="region"
                      aria-label={lang === 'en' ? 'Target Region' : 'Целевой регион'} 
                      className="w-full px-6 py-4 bg-slate-100 border-2 border-slate-200 focus:border-qatar-maroon/30 focus:bg-white rounded-[1.25rem] outline-none transition-premium font-medium appearance-none cursor-pointer">
                      {countries.map(c => <option key={c.value} value={c.value}>{c.label[lang]}</option>)}
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] px-1">{lang === 'en' ? 'Phone or Email' : 'Телефон или Email'}</label>
                  <input 
                    type="tel" 
                    name="contact"
                    required 
                    className="w-full px-6 py-4 bg-slate-100 border-2 border-slate-200 focus:border-qatar-maroon/30 focus:bg-white rounded-[1.25rem] outline-none transition-premium font-medium"
                    placeholder="+974 0000 0000 / email@address.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] px-1">{lang === 'en' ? 'What you need' : 'Что вам нужно'}</label>
                  <textarea
                    name="message"
                    rows={4}
                    className="w-full px-6 py-4 bg-slate-100 border-2 border-slate-200 focus:border-qatar-maroon/30 focus:bg-white rounded-[1.25rem] outline-none transition-premium font-medium resize-none"
                    placeholder={lang === 'en' ? 'Tell us what you need help with...' : 'Расскажите, с чем нужна помощь...'}
                  ></textarea>
                </div>
                
                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={status === 'loading' || cooldown > 0}
                    className="w-full bg-slate-900 hover:bg-black text-white py-5 rounded-[1.25rem] font-bold text-lg shadow-xl shadow-slate-900/10 transition-premium hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {status === 'loading' ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        {lang === 'en' ? 'Processing...' : 'Обработка...'}
                      </>
                    ) : (
                      lang === 'en' ? 'Send Request' : 'Отправить заявку'
                    )}
                  </button>
                  {cooldown > 0 && (
                    <p className="text-center text-[10px] text-slate-400 mt-6 font-bold uppercase tracking-widest">
                      {lang === 'en' ? `Please wait ${cooldown} seconds before sending another request.` : `Пожалуйста, подождите ${cooldown} секунд перед повторной отправкой.`}
                    </p>
                  )}
                  <p className="text-center text-[10px] text-slate-400 mt-6 font-bold uppercase tracking-widest">
                    {lang === 'en' ? 'Your data stays private' : 'Ваши данные остаются приватными'}
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;