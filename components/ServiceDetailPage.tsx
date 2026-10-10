import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Language } from '../types';
import { getServiceBySlug } from '../servicesData';
import Header from './Header';
import Footer from './Footer';
import ContactForm from './ContactForm';
import WhatsAppWidget from './WhatsAppWidget';

interface ServiceDetailPageProps {
  lang: Language;
  setLang: (l: Language) => void;
}

const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ lang, setLang }) => {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? getServiceBySlug(slug) : undefined;

  if (!service) {
    return <Navigate to="/404" replace />;
  }

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 40;
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
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 transition-colors duration-200">
      <Header lang={lang} setLang={setLang} />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-gradient-to-br from-qatar-maroon to-[#5d1428] text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white opacity-5 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white opacity-[0.03] rounded-full blur-[100px] pointer-events-none"></div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center space-x-2 py-1.5 px-4 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm">
                <span className="text-white/90 text-[11px] font-extrabold uppercase tracking-[0.2em]">
                  {lang === 'en' ? 'Specialized Service' : 'Специализированная услуга'}
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.1]">
                {service.title[lang]}
              </h1>

              <p className="text-xl md:text-2xl text-white/80 font-medium max-w-3xl mx-auto">
                {service.subtitle[lang]}
              </p>

              <div className="pt-6">
                <a
                  href="#contacts"
                  onClick={(e) => scrollToSection(e, 'contacts')}
                  className="inline-flex items-center gap-2 bg-white text-qatar-maroon px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/90 hover:scale-105 transition-all shadow-2xl"
                >
                  {service.slug === 'incorporation'
                    ? (lang === 'en' ? 'Discuss Your Company Setup' : 'Обсудить открытие компании')
                    : service.heroCta?.[lang] ?? (lang === 'en' ? 'Get Started' : 'Начать')}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Description & Benefits */}
        <section className="py-24 bg-white dark:bg-slate-950 transition-colors duration-200">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-16 items-start">
                <div className="space-y-6">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
                    {service.descriptionTitle?.[lang] ?? (lang === 'en' ? 'What You Get' : 'Что вы получаете')}
                  </h2>
                  <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                    {service.description[lang]}
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 lg:p-10 border border-transparent dark:border-white/10">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                    {service.benefitsTitle?.[lang] ?? (service.slug === 'incorporation'
                      ? (lang === 'en' ? 'Who It\'s For' : 'Кому подходит')
                      : (lang === 'en' ? 'Key Benefits' : 'Основные преимущества'))}
                  </h3>
                  <div className="space-y-4">
                    {service.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-qatar-maroon/10 dark:bg-[#d85b7d]/15 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-4 h-4 text-qatar-maroon dark:text-[#d85b7d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{benefit[lang]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Optional service scope */}
        {service.scope && service.scope.items.length > 0 && (
        <section className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="max-w-3xl mx-auto text-center mb-14">
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-5">
                  {service.scope.title[lang]}
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                  {service.scope.subtitle[lang]}
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {service.scope.items.map((item, index) => (
                  <div key={index} className="p-7 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-white/10">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title[lang]}</h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{item.desc[lang]}</p>
                  </div>
                ))}
              </div>
              <p className="mt-8 max-w-4xl mx-auto text-center text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {service.scope.note[lang]}
              </p>
            </div>
          </div>
        </section>
        )}

        {/* Optional audience */}
        {service.audience && service.audience.groups.length > 0 && (
        <section className="py-24 bg-white dark:bg-slate-950 transition-colors duration-200">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-5">{service.audience.title[lang]}</h2>
                <p className="text-lg text-slate-600 dark:text-slate-300">{service.audience.intro[lang]}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {service.audience.groups.map((group, index) => (
                  <div key={index} className="flex items-start gap-3 p-5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-white/10">
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-qatar-maroon dark:bg-[#d85b7d] flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{group[lang]}</span>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-center text-slate-600 dark:text-slate-300 leading-relaxed">{service.audience.industries[lang]}</p>
            </div>
          </div>
        </section>
        )}

        {/* Process Steps */}
        <section className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
                  {service.processTitle?.[lang] ?? (lang === 'en' ? 'How It Works' : 'Как это работает')}
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  {service.processSubtitle?.[lang] ?? (lang === 'en' ? 'Our proven step-by-step process' : 'Наш проверенный пошаговый процесс')}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-3xl p-10 lg:p-12 shadow-xl dark:shadow-none dark:border dark:border-white/10">
                {service.steps.map((step, index) => (
                  <div key={index} className="flex gap-6">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-12 h-12 bg-qatar-maroon dark:bg-[#d85b7d] text-white rounded-2xl flex items-center justify-center text-lg font-black shadow-lg">
                        {index + 1}
                      </div>
                      {index < service.steps.length - 1 && (
                        <div className="w-0.5 flex-1 bg-qatar-maroon/20 dark:bg-[#d85b7d]/30 my-2" />
                      )}
                    </div>
                    <div className={index < service.steps.length - 1 ? 'pb-8' : ''}>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 pt-2">
                        {step.title[lang]}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        {step.desc[lang]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Examples / Case Studies - hidden if empty */}
        {service.examples.length > 0 && (
        <section className="py-24 bg-white dark:bg-slate-950 transition-colors duration-200">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
                  {lang === 'en' ? 'Success Stories' : 'Истории успеха'}
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  {lang === 'en' ? 'Real results from real clients' : 'Реальные результаты реальных клиентов'}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {service.examples.map((example, index) => (
                  <div key={index} className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 lg:p-10 hover:shadow-xl dark:hover:shadow-none transition-all border border-slate-100 dark:border-white/10 dark:hover:border-[#d85b7d]/30">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                      {example.title[lang]}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-bold text-qatar-maroon dark:text-[#d85b7d] uppercase tracking-wider mb-2">
                          {lang === 'en' ? 'Challenge' : 'Задача'}
                        </p>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                          {example.description[lang]}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-qatar-maroon dark:text-[#d85b7d] uppercase tracking-wider mb-2">
                          {lang === 'en' ? 'Result' : 'Результат'}
                        </p>
                        <p className="text-slate-900 dark:text-white font-semibold leading-relaxed">
                          {example.result[lang]}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        )}

        {/* Pricing - hidden if empty */}
        {service.pricing.length > 0 && (
        <section className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
                  {lang === 'en' ? 'Pricing' : 'Цены'}
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  {lang === 'en' ? 'Transparent pricing with no hidden fees' : 'Прозрачные цены без скрытых платежей'}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {service.pricing.map((pricing, index) => (
                  <div
                    key={index}
                    className={`bg-white dark:bg-slate-800 rounded-3xl p-10 border-2 transition-all hover:shadow-2xl dark:hover:shadow-none hover:-translate-y-1 ${
                      index === service.pricing.length - 1
                        ? 'border-qatar-maroon dark:border-[#d85b7d] shadow-xl dark:shadow-none'
                        : 'border-slate-200 dark:border-white/10'
                    }`}
                  >
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                        {pricing.title[lang]}
                      </h3>
                      <div className="text-5xl font-black text-qatar-maroon dark:text-[#d85b7d] mb-2">
                        {pricing.price[lang]}
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">
                        {pricing.timeline[lang]}
                      </p>
                    </div>

                    <div className="space-y-4 mb-8">
                      {pricing.features.map((feature, fIndex) => (
                        <div key={fIndex} className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-qatar-maroon dark:text-[#d85b7d] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-slate-700 dark:text-slate-300 font-medium">{feature[lang]}</span>
                        </div>
                      ))}
                    </div>

                    <a
                      href="#contacts"
                      onClick={(e) => scrollToSection(e, 'contacts')}
                      className={`block text-center py-4 rounded-2xl font-bold text-lg transition-all ${
                        index === service.pricing.length - 1
                          ? 'bg-qatar-maroon dark:bg-[#d85b7d] text-white hover:bg-qatar-maroon/90 dark:hover:bg-[#d85b7d]/90 shadow-lg'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {lang === 'en' ? 'Get Started' : 'Начать'}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        )}

        {/* FAQ */}
        {service.faqs.length > 0 && (
        <section className="py-24 bg-white dark:bg-slate-950 transition-colors duration-200">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
                  {lang === 'en' ? 'Frequently Asked Questions' : 'Часто задаваемые вопросы'}
                </h2>
              </div>

              <div className="space-y-6">
                {service.faqs.map((faq, index) => (
                  <div key={index} className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-transparent dark:border-white/10">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                      {faq.question[lang]}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {faq.answer[lang]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        )}

        {/* Trusted By - only for incorporation */}
        {service.slug === 'incorporation' && (
        <section className="py-16 bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
                {lang === 'en' ? 'Trusted By' : 'Нам доверяют'}
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Transforma Travel Group • Wings AI • Qalan Group
              </p>
            </div>
          </div>
        </section>
        )}

        {/* Optional pre-form context */}
        {service.preForm && (
        <section className="py-20 bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-5">{service.preForm.title[lang]}</h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">{service.preForm.text[lang]}</p>
              <a
                href="#contacts"
                onClick={(e) => scrollToSection(e, 'contacts')}
                className="inline-flex items-center justify-center bg-qatar-maroon dark:bg-[#d85b7d] text-white px-8 py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity"
              >
                {service.preForm.cta[lang]}
              </a>
            </div>
          </div>
        </section>
        )}

        {/* Contact Form */}
        <ContactForm lang={lang} />
      </main>

      <Footer lang={lang} />
      <WhatsAppWidget lang={lang} photoUrl="/images/about/avatar.jpg" />
    </div>
  );
};

export default ServiceDetailPage;
