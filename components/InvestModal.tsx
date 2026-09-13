import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Language } from '../types';

interface InvestModalProps {
  lang: Language;
}

export interface InvestModalRef {
  open: () => void;
  close: () => void;
}

const COOLDOWN_SECONDS = 120;
const MAX_DAILY_SUBMISSIONS = 5;
const STORAGE_KEY_LAST_SUBMIT = 'g2m_invest_last_submit';
const STORAGE_KEY_DAILY_COUNT = 'g2m_invest_daily_count';
const STORAGE_KEY_DAILY_DATE = 'g2m_invest_daily_date';

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

const InvestModal = forwardRef<InvestModalRef, InvestModalProps>(({ lang }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'limited'>('idle');
  const [cooldown, setCooldown] = useState(0);
  const [confirmName, setConfirmName] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    contact: '',
    budget: '',
    sector: '',
    intent: ''
  });
  const cooldownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const content = {
    trigger: {
      title: {
        en: 'Invest in Qatar 🇶🇦',
        ru: 'Инвестиции в Катар 🇶🇦'
      },
      description: {
        en: 'Not sure which opportunity, industry, or business model fits you? We help you find out before you commit capital.',
        ru: 'Не знаете, какая возможность, отрасль или бизнес-модель вам подходит? Мы поможем разобраться до того, как вы вложите капитал.'
      },
      cta: {
        en: 'Invest in Qatar 🇶🇦',
        ru: 'Инвестиции в Катар 🇶🇦'
      }
    },
    modal: {
      title: {
        en: 'Looking to invest or start a business in Qatar?',
        ru: 'Хотите инвестировать или открыть бизнес в Катаре?'
      },
      description1: {
        en: 'G2M helps investors understand the Qatar market, identify suitable business opportunities, evaluate potential directions, and guide you through the process of entering the market.',
        ru: 'G2M помогает инвесторам понять рынок Катара, выявить подходящие бизнес-возможности, оценить потенциальные направления и провести вас через процесс выхода на рынок.'
      },
      description2: {
        en: 'This is a market-entry advisory engagement, not a company formation service. We help you decide where to invest before you register anything.',
        ru: 'Это консультация по выходу на рынок, а не услуга по регистрации компании. Мы помогаем решить, куда инвестировать, прежде чем что-либо регистрировать.'
      },
      license: {
        en: 'QFC License No. 035533',
        ru: 'Лицензия QFC № 035533'
      }
    },
    form: {
      name: { en: 'Name', ru: 'Имя' },
      country: { en: 'Country', ru: 'Страна' },
      countryPlaceholder: { en: 'e.g. Kazakhstan', ru: 'например, Казахстан' },
      contact: { en: 'WhatsApp / Email', ru: 'WhatsApp / Email' },
      contactPlaceholder: { en: 'Number or email address', ru: 'Номер или email адрес' },
      budget: { en: 'Investment budget', ru: 'Инвестиционный бюджет' },
      budgetPlaceholder: { en: 'Select a range', ru: 'Выберите диапазон' },
      sector: { en: 'Preferred sector', ru: 'Предпочтительный сектор' },
      sectorPlaceholder: { en: 'Select a sector', ru: 'Выберите сектор' },
      intent: { en: 'What are you looking for?', ru: 'Что вы ищете?' },
      submit: { en: 'Explore Investment Opportunities', ru: 'Исследовать инвестиционные возможности' },
      fineprint: { en: 'We respond personally, usually within one business day.', ru: 'Мы отвечаем лично, обычно в течение одного рабочего дня.' }
    },
    budgetOptions: [
      { value: 'under-50k', label: { en: 'Under $50,000', ru: 'До $50,000' } },
      { value: '50k-150k', label: { en: '$50,000 – $150,000', ru: '$50,000 – $150,000' } },
      { value: '150k-500k', label: { en: '$150,000 – $500,000', ru: '$150,000 – $500,000' } },
      { value: '500k-1m', label: { en: '$500,000 – $1,000,000', ru: '$500,000 – $1,000,000' } },
      { value: 'over-1m', label: { en: '$1,000,000+', ru: '$1,000,000+' } }
    ],
    sectorOptions: [
      { value: 'real-estate', label: { en: 'Real estate', ru: 'Недвижимость' } },
      { value: 'retail-fnb', label: { en: 'Retail & F&B', ru: 'Розница и общепит' } },
      { value: 'logistics', label: { en: 'Logistics & trade', ru: 'Логистика и торговля' } },
      { value: 'technology', label: { en: 'Technology', ru: 'Технологии' } },
      { value: 'healthcare', label: { en: 'Healthcare', ru: 'Здравоохранение' } },
      { value: 'education', label: { en: 'Education', ru: 'Образование' } },
      { value: 'financial', label: { en: 'Financial services', ru: 'Финансовые услуги' } },
      { value: 'manufacturing', label: { en: 'Manufacturing & industry', ru: 'Производство и промышленность' } },
      { value: 'tourism', label: { en: 'Tourism & hospitality', ru: 'Туризм и гостиничный бизнес' } },
      { value: 'not-sure', label: { en: 'Not sure yet', ru: 'Пока не уверен' } }
    ],
    intentOptions: [
      { value: 'invest-existing', label: { en: 'Invest in an existing business', ru: 'Инвестировать в существующий бизнес' } },
      { value: 'start-new', label: { en: 'Start a new business in Qatar', ru: 'Начать новый бизнес в Катаре' } },
      { value: 'buy-company', label: { en: 'Buy or open a company', ru: 'Купить или открыть компанию' } },
      { value: 'not-sure', label: { en: 'Not sure yet', ru: 'Пока не уверен' } }
    ],
    confirm: {
      success: {
        title: { en: 'Request Received!', ru: 'Заявка получена!' },
        message: {
          en: "Our investment advisory team will reach out within 24 hours to discuss opportunities that match your criteria.",
          ru: 'Наша команда по инвестиционному консалтингу свяжется с вами в течение 24 часов, чтобы обсудить возможности, соответствующие вашим критериям.'
        }
      },
      error: {
        title: { en: 'Error Occurred', ru: 'Произошла ошибка' },
        message: { en: 'Please try again later.', ru: 'Пожалуйста, попробуйте позже.' }
      },
      limited: {
        title: { en: 'Daily Limit Reached', ru: 'Дневной лимит достигнут' },
        message: {
          en: 'You have reached the maximum number of requests for today. Please try again tomorrow.',
          ru: 'Вы достигли максимального количества заявок на сегодня. Попробуйте завтра.'
        }
      },
      close: { en: 'Close', ru: 'Закрыть' },
      tryAgain: { en: 'Try Again', ru: 'Попробовать снова' },
      sendAnother: { en: 'Submit another request', ru: 'Отправить ещё одну заявку' }
    }
  };

  // Restore cooldown on mount
  useEffect(() => {
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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    setStatus('idle');
  };

  const handleClose = () => {
    setIsOpen(false);
    setStatus('idle');
    setFormData({
      name: '',
      country: '',
      contact: '',
      budget: '',
      sector: '',
      intent: ''
    });
  };

  // Expose open/close methods via ref
  useImperativeHandle(ref, () => ({
    open: handleOpen,
    close: handleClose
  }));

  const sendFormData = async (data: typeof formData) => {
    const apiUrl = import.meta.env.DEV
      ? 'http://localhost:3002/api/contact'
      : '/api/contact';

    const budgetLabel = content.budgetOptions.find(opt => opt.value === data.budget)?.label[lang] || data.budget;
    const sectorLabel = content.sectorOptions.find(opt => opt.value === data.sector)?.label[lang] || data.sector;
    const intentLabel = content.intentOptions.find(opt => opt.value === data.intent)?.label[lang] || data.intent;

    // Format as message to match the API structure
    const message = [
      `${content.form.country[lang]}: ${data.country}`,
      `${content.form.budget[lang]}: ${budgetLabel}`,
      `${content.form.sector[lang]}: ${sectorLabel}`,
      `${content.form.intent[lang]}: ${intentLabel}`,
    ].join('\n');

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        contact: data.contact,
        region: 'qatar',
        message: message,
        source: 'Invest in Qatar Form'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error:', errorData);
      throw new Error(errorData.error || 'Failed to send message');
    }

    return response.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.country || !formData.contact || !formData.budget || !formData.sector || !formData.intent) {
      console.error('Not all required fields are filled');
      return;
    }

    if (cooldown > 0) return;

    if (getDailyCount() >= MAX_DAILY_SUBMISSIONS) {
      setStatus('limited');
      return;
    }

    setStatus('loading');

    try {
      const result = await sendFormData(formData);
      console.log('Form submitted successfully:', result);

      setStatus('success');

      // Google Analytics
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', { event_category: 'investment', event_label: 'form_submit' });
      }

      // Facebook Pixel Lead event
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Lead', {
          content_name: 'Invest in Qatar Form',
          content_category: 'Investment',
          value: 200,
          currency: 'USD'
        });
      }

      const firstName = formData.name.split(' ')[0] || (lang === 'en' ? 'there' : 'друг');
      setConfirmName(firstName);

      // Clear form
      setFormData({
        name: '',
        country: '',
        contact: '',
        budget: '',
        sector: '',
        intent: ''
      });

      // Save timestamp and counter
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

    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error');
    }
  };

  return (
    <>
      {/* Trigger Section */}
      <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="relative bg-gradient-to-br from-[#101B27] to-[#182636] rounded-2xl p-12 lg:p-16 overflow-hidden border-l-4 border-qatar-maroon">
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
                {content.trigger.title[lang]}
              </h2>
              <p className="text-lg text-white/70 mb-8 leading-relaxed max-w-xl">
                {content.trigger.description[lang]}
              </p>
              <button
                onClick={handleOpen}
                className="inline-flex items-center gap-2 bg-qatar-maroon hover:bg-qatar-maroon/90 text-white font-bold px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg"
              >
                {content.trigger.cta[lang]}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <div className="w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-[#F7F4EE] rounded-xl grid lg:grid-cols-2 relative">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full border border-slate-900/10 hover:bg-black/5 flex items-center justify-center text-slate-900 z-10"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Left Column - Editorial */}
            <div className="bg-gradient-to-br from-[#101B27] to-[#182636] text-white p-12 lg:p-14 flex flex-col justify-center">
              <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight mb-6">
                {content.modal.title[lang]}
              </h1>
              <p className="text-white/75 leading-relaxed mb-4 text-sm">
                {content.modal.description1[lang]}
              </p>
              <p className="text-white/75 leading-relaxed text-sm">
                {content.modal.description2[lang]}
              </p>
              <div className="inline-flex items-center gap-2 mt-8 px-4 py-2 border border-white/15 rounded w-fit text-sm text-[#C9A15A]">
                {content.modal.license[lang]}
              </div>
            </div>

            {/* Right Column - Form or Status */}
            <div className="p-12 lg:p-14">
              {status === 'success' ? (
                <div className="py-12">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    {lang === 'en' ? `Thank you, ${confirmName}!` : `Спасибо, ${confirmName}!`}
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    {content.confirm.success.message[lang]}
                  </p>
                  <button
                    onClick={handleClose}
                    className="bg-qatar-maroon hover:bg-qatar-maroon/90 text-white font-bold px-6 py-3 rounded-lg transition-all"
                  >
                    {content.confirm.close[lang]}
                  </button>
                </div>
              ) : status === 'error' ? (
                <div className="py-12">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    {content.confirm.error.title[lang]}
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    {content.confirm.error.message[lang]}
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="bg-qatar-maroon hover:bg-qatar-maroon/90 text-white font-bold px-6 py-3 rounded-lg transition-all"
                  >
                    {content.confirm.tryAgain[lang]}
                  </button>
                </div>
              ) : status === 'limited' ? (
                <div className="py-12">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    {content.confirm.limited.title[lang]}
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    {content.confirm.limited.message[lang]}
                  </p>
                  <button
                    onClick={handleClose}
                    className="bg-qatar-maroon hover:bg-qatar-maroon/90 text-white font-bold px-6 py-3 rounded-lg transition-all"
                  >
                    {content.confirm.close[lang]}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="invest-name" className="block text-sm text-slate-600 mb-2">
                      {content.form.name[lang]}
                    </label>
                    <input
                      id="invest-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-900/10 rounded text-slate-900 focus:border-qatar-maroon focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="invest-country" className="block text-sm text-slate-600 mb-2">
                      {content.form.country[lang]}
                    </label>
                    <input
                      id="invest-country"
                      type="text"
                      required
                      placeholder={content.form.countryPlaceholder[lang]}
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-900/10 rounded text-slate-900 focus:border-qatar-maroon focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="invest-contact" className="block text-sm text-slate-600 mb-2">
                      {content.form.contact[lang]}
                    </label>
                    <input
                      id="invest-contact"
                      type="text"
                      required
                      placeholder={content.form.contactPlaceholder[lang]}
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-900/10 rounded text-slate-900 focus:border-qatar-maroon focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="invest-budget" className="block text-sm text-slate-600 mb-2">
                      {content.form.budget[lang]}
                    </label>
                    <select
                      id="invest-budget"
                      required
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-900/10 rounded text-slate-900 focus:border-qatar-maroon focus:outline-none appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMSAxbDUgNSA1LTUiIHN0cm9rZT0iIzcyNkE2MSIgc3Ryb2tlLXdpZHRoPSIxLjUiIGZpbGw9Im5vbmUiLz48L3N2Zz4=')] bg-no-repeat bg-[right_12px_center] pr-10"
                    >
                      <option value="" disabled>
                        {content.form.budgetPlaceholder[lang]}
                      </option>
                      {content.budgetOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label[lang]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="invest-sector" className="block text-sm text-slate-600 mb-2">
                      {content.form.sector[lang]}
                    </label>
                    <select
                      id="invest-sector"
                      required
                      value={formData.sector}
                      onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-900/10 rounded text-slate-900 focus:border-qatar-maroon focus:outline-none appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMSAxbDUgNSA1LTUiIHN0cm9rZT0iIzcyNkE2MSIgc3Ryb2tlLXdpZHRoPSIxLjUiIGZpbGw9Im5vbmUiLz48L3N2Zz4=')] bg-no-repeat bg-[right_12px_center] pr-10"
                    >
                      <option value="" disabled>
                        {content.form.sectorPlaceholder[lang]}
                      </option>
                      {content.sectorOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label[lang]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-600 mb-3">
                      {content.form.intent[lang]}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {content.intentOptions.map((opt) => (
                        <label key={opt.value} className="cursor-pointer">
                          <input
                            type="radio"
                            name="intent"
                            value={opt.value}
                            required
                            checked={formData.intent === opt.value}
                            onChange={(e) => setFormData({ ...formData, intent: e.target.value })}
                            className="sr-only peer"
                          />
                          <span className="inline-block px-4 py-2 text-sm border border-slate-900/10 rounded-full text-slate-900 peer-checked:bg-qatar-maroon peer-checked:border-qatar-maroon peer-checked:text-white transition-all">
                            {opt.label[lang]}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading' || cooldown > 0 || !formData.intent}
                    className="w-full bg-qatar-maroon hover:bg-qatar-maroon/90 text-white font-bold px-6 py-4 rounded-lg mt-2 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {status === 'loading' ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {lang === 'en' ? 'Sending...' : 'Отправка...'}
                      </>
                    ) : (
                      content.form.submit[lang]
                    )}
                  </button>

                  {cooldown > 0 && (
                    <p className="text-xs text-slate-500 text-center mt-3 font-semibold">
                      {lang === 'en' ? `Please wait ${cooldown}s before sending another request.` : `Подождите ${cooldown}с перед повторной отправкой.`}
                    </p>
                  )}

                  <p className="text-xs text-slate-500 text-center mt-3">
                    {content.form.fineprint[lang]}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
});

InvestModal.displayName = 'InvestModal';

export default InvestModal;
