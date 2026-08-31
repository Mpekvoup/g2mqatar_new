import React from 'react';
import { Language } from '../types';
import {
  Settings,
  Landmark,
  FileText,
  Gavel,
  MapPin,
  FileCheck,
  Network,
  CreditCard
} from 'lucide-react';

interface QatarBenefitsProps {
  lang: Language;
}

const QatarBenefits: React.FC<QatarBenefitsProps> = ({ lang }) => {
  const benefits = [
    {
      image: '/images/benefits/handshake.webp',
      title: {
        en: 'Easy Filing of Corporate Tax',
        ru: 'Простая подача корпоративного налога'
      }
    },
    {
      image: '/images/benefits/phone_locked.jpg',
      title: {
        en: 'No Income Tax or Social Security Deductions',
        ru: 'Нет подоходного налога или отчислений в социальное страхование'
      }
    },
    {
      image: '/images/benefits/ship.webp',
      title: {
        en: 'No Taxation on Exports',
        ru: 'Нет налогообложения экспорта'
      }
    },
    {
      image: '/images/benefits/labor_worker.jpg',
      title: {
        en: 'Inexpensive Labor Force',
        ru: 'Недорогая рабочая сила'
      }
    },
    {
      image: '/images/benefits/venue.avif',
      title: {
        en: 'Best International Exhibitions and Conference Venues',
        ru: 'Лучшие международные выставки и конференц-залы'
      }
    },
    {
      image: '/images/benefits/infrastructure.jpg',
      title: {
        en: 'Excellent Infrastructure',
        ru: 'Отличная инфраструктура'
      }
    }
  ];

  const additionalServices = [
    {
      icon: <Settings className="w-16 h-16 text-qatar-maroon" />,
      title: {
        en: 'Company Setup',
        ru: 'Регистрация компании'
      },
      items: [
        {
          en: 'Local specialist advice',
          ru: 'Консультация местных специалистов'
        },
        {
          en: 'We help foreign investors to set up different types of companies in Qatar',
          ru: 'Мы помогаем иностранным инвесторам регистрировать различные типы компаний в Катаре'
        }
      ]
    },
    {
      icon: <Landmark className="w-16 h-16 text-qatar-maroon" />,
      title: {
        en: 'Bank Account Opening',
        ru: 'Открытие банковского счета'
      },
      items: [
        {
          en: 'Banking solutions',
          ru: 'Банковские решения'
        },
        {
          en: 'Our banking experts will help you in opening a corporate bank account',
          ru: 'Наши банковские эксперты помогут вам открыть корпоративный банковский счет'
        }
      ]
    },
    {
      icon: <FileText className="w-16 h-16 text-qatar-maroon" />,
      title: {
        en: 'Tax & Accounting Services',
        ru: 'Налоговые и бухгалтерские услуги'
      },
      items: [
        {
          en: 'Our tax and accounting professionals will give you free consultation &',
          ru: 'Наши налоговые и бухгалтерские специалисты предоставят вам бесплатную консультацию и'
        },
        {
          en: 'high-quality services without hidden cost.',
          ru: 'высококачественные услуги без скрытых затрат.'
        }
      ]
    },
    {
      icon: <Gavel className="w-16 h-16 text-qatar-maroon" />,
      title: {
        en: 'Regulation and Compliance',
        ru: 'Регулирование и соответствие требованиям'
      },
      items: [
        {
          en: 'With our assistance your company will always be compliant to all',
          ru: 'С нашей помощью ваша компания всегда будет соответствовать всем'
        },
        {
          en: 'government regulations and remain up-to-date.',
          ru: 'государственным требованиям и оставаться в курсе изменений.'
        }
      ]
    }
  ];

  const steps = [
    {
      icon: <MapPin className="w-12 h-12 text-white" />,
      number: 'Step-1',
      title: {
        en: 'Get Commercial Residence (CR)',
        ru: 'Получение коммерческой регистрации (CR)'
      }
    },
    {
      icon: <FileCheck className="w-12 h-12 text-white" />,
      number: 'Step-2',
      title: {
        en: 'Trade Name Reservation',
        ru: 'Резервирование торгового наименования'
      }
    },
    {
      icon: <Network className="w-12 h-12 text-white" />,
      number: 'Step-3',
      title: {
        en: 'Article of Association',
        ru: 'Устав компании'
      }
    },
    {
      icon: <FileText className="w-12 h-12 text-white" />,
      number: 'Step-4',
      title: {
        en: 'CR Issuance',
        ru: 'Выдача CR'
      }
    },
    {
      icon: <FileCheck className="w-12 h-12 text-white" />,
      number: 'Step-5',
      title: {
        en: 'Trade License',
        ru: 'Торговая лицензия'
      }
    },
    {
      icon: <CreditCard className="w-12 h-12 text-white" />,
      number: 'Step-6',
      title: {
        en: 'Computer Card',
        ru: 'Компьютерная карта'
      }
    }
  ];

  return (
    <div className="bg-white">
      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-qatar-maroon to-[#6B1F3D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">
            {lang === 'en'
              ? 'Benefits of Setting Up a Company in Qatar'
              : 'Преимущества открытия компании в Катаре'
            }
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center group"
              >
                <div className="mb-4 w-28 h-28 overflow-hidden rounded-2xl group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <img
                    src={benefit.image}
                    alt={benefit.title[lang]}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-sm font-semibold text-white px-2">
                  {benefit.title[lang]}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/businessman_big_page.webp"
            alt={lang === 'en' ? 'Business consultant' : 'Бизнес-консультант'}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-qatar-maroon">
              {lang === 'en'
                ? 'Additional Services Offered'
                : 'Дополнительные предлагаемые услуги'
              }
            </h2>

            <div className="space-y-8">
              {additionalServices.map((service, idx) => (
                <div key={idx} className="flex gap-6">
                  <div className="flex-shrink-0">
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {idx + 1}. {service.title[lang]}
                    </h3>
                    <ul className="space-y-1">
                      {service.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="text-gray-700 flex items-start">
                          <span className="mr-2">•</span>
                          <span>{item[lang]}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-gradient-to-br from-qatar-maroon to-[#6B1F3D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">
            {lang === 'en'
              ? 'Steps to Start a Company in Qatar'
              : 'Этапы открытия компании в Катаре'
            }
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center group"
              >
                <div className="mb-3 w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                  {React.cloneElement(step.icon as React.ReactElement, { className: "w-10 h-10 text-white" })}
                </div>
                <p className="text-xs font-semibold text-white/80 mb-2">
                  {step.number}
                </p>
                <h3 className="text-sm font-semibold text-white px-2">
                  {step.title[lang]}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default QatarBenefits;
