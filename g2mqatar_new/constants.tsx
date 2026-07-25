import { NavLink, Service, Principle, Step, Partner } from './types';
import sidrTechLogo from './src/assets/clients/sidr-tech-logo.webp';
import caringHandsLogo from './src/assets/clients/caring_hands.webp';
import chopaLogo from './src/assets/clients/chopa.webp';

export const NAV_LINKS: NavLink[] = [
  { id: 'about', label: { en: 'About us', ru: 'О нас' } },
  { id: 'services', label: { en: 'Our services', ru: 'Что мы делаем' } },
  { id: 'case-studies', label: { en: 'Case Studies', ru: 'Кейсы' }, href: '/case-studies' },
  { id: 'contacts', label: { en: 'Contacts', ru: 'Контакты' } },
];

export const SERVICES: Service[] = [
  {
    title: { en: 'Business Intelligence', ru: 'Бизнес-аналитика' },
    desc: {
      en: 'Market research, regulatory analysis, financial projections and a launch plan so you know exactly what you are getting into.',
      ru: 'Исследование рынка, регуляторный анализ, финансовые прогнозы и план запуска, чтобы вы понимали, что вас ждёт.'
    },
    steps: [
      { title: { en: 'Discovery Call', ru: 'Знакомство' }, desc: { en: 'We talk through your goals, target market and what is standing in the way.', ru: 'Разбираемся в ваших целях, рынке и том, что мешает двигаться вперёд.' } },
      { title: { en: 'Feasibility Study', ru: 'Исследование рынка' }, desc: { en: 'Market size, demand check and the regulatory requirements you need to know.', ru: 'Объём рынка, проверка спроса и требования по регуляторике.' } },
      { title: { en: 'Competitive Analysis', ru: 'Конкурентный анализ' }, desc: { en: 'Who is already there, where the gaps are and how you position yourself.', ru: 'Кто уже на рынке, где пробелы и как вы выглядите на их фоне.' } },
      { title: { en: 'Financial Projections', ru: 'Финансовые прогнозы' }, desc: { en: 'Revenue model, cost breakdown and a P&L forecast for the first years.', ru: 'Модель доходов, разбивка расходов и прогноз прибыли на первые годы.' } },
      { title: { en: 'Launch Plan', ru: 'План запуска' }, desc: { en: 'A practical market entry plan with dates and who does what.', ru: 'Конкретный план выхода на рынок с датами и ответственными.' } },
    ]
  },
  {
    title: { en: 'Incorporation', ru: 'Регистрация компании' },
    desc: {
      en: 'Company setup through QFC, Madayn or Kuwait free zones. We handle the paperwork, licensing and residency so you do not have to.',
      ru: 'Открываем компанию через QFC, Madayn или свободные зоны Кувейта. Берём на себя документы, лицензии и резидентство.'
    },
    steps: [
      { title: { en: 'First Call', ru: 'Первый звонок' }, desc: { en: 'You tell us your plans and we tell you what actually works in Qatar.', ru: 'Вы рассказываете о планах, мы говорим, что реально работает в Катаре.' } },
      { title: { en: 'Legal Structure', ru: 'Юридическая форма' }, desc: { en: 'LLC, branch or rep office? We help you pick what fits.', ru: 'LLC, филиал или представительство? Помогаем выбрать подходящее.' } },
      { title: { en: 'License', ru: 'Лицензия' }, desc: { en: 'We collect the documents, file everything and chase approvals until it is done.', ru: 'Собираем документы, подаём заявки и добиваемся одобрения.' } },
      { title: { en: 'Visa', ru: 'Виза' }, desc: { en: 'Residency visa paperwork handled on your behalf.', ru: 'Оформляем резидентскую визу за вас.' } },
      { title: { en: 'Bank Account', ru: 'Банковский счёт' }, desc: { en: 'Local or international bank. We make the intro and help you open the account.', ru: 'Местный или международный банк. Познакомим и поможем открыть счёт.' } },
    ]
  },
  {
    title: { en: 'Business Matchmaking', ru: 'Бизнес-матчмейкинг' },
    desc: {
      en: 'We find the right partners and investors in the GCC, make the introduction and only charge when there is a result.',
      ru: 'Находим нужных партнёров и инвесторов в регионе, знакомим вас с ними и берём комиссию только по результату.'
    },
    steps: [
      { title: { en: 'Getting to Know You', ru: 'Знакомство' }, desc: { en: 'We look at your business and figure out what kind of partner or investor you actually need.', ru: 'Изучаем ваш бизнес и понимаем, какой партнёр или инвестор вам нужен.' } },
      { title: { en: 'Search', ru: 'Поиск' }, desc: { en: 'We go through our network and look for people who match.', ru: 'Перебираем нашу сеть и ищем тех, кто подходит.' } },
      { title: { en: 'Shortlist', ru: 'Список кандидатов' }, desc: { en: 'We filter the options and pick the ones worth talking to.', ru: 'Отбираем тех, с кем стоит говорить.' } },
      { title: { en: 'Introduction', ru: 'Знакомство' }, desc: { en: 'We set up the first meeting and make the intro.', ru: 'Организуем первую встречу и представляем вас.' } },
      { title: { en: 'Deal Support', ru: 'Поддержка сделки' }, desc: { en: 'We stay in the loop and help move things forward until the deal is done.', ru: 'Остаёмся в процессе и помогаем довести дело до конца.' } },
    ]
  },
  {
    title: { en: 'Fundraising', ru: 'Привлечение инвестиций' },
    desc: {
      en: 'Pitch decks, financial models and introductions to investors in the GCC. We know who is actively writing checks.',
      ru: 'Питч-деки, финансовые модели и знакомство с инвесторами в регионе. Мы знаем, кто сейчас активно инвестирует.'
    },
    steps: [
      { title: { en: 'Where You Stand', ru: 'Стартовая точка' }, desc: { en: 'We look at your stage, docs and how ready you are to talk to investors.', ru: 'Смотрим на вашу стадию, документы и насколько вы готовы к разговору с инвесторами.' } },
      { title: { en: 'Pitch Deck', ru: 'Питч-дек' }, desc: { en: 'We put together a presentation that gets to the point.', ru: 'Делаем презентацию, которая говорит по делу.' } },
      { title: { en: 'Financial Model', ru: 'Финансовая модель' }, desc: { en: 'Numbers, projections and what the company is worth.', ru: 'Цифры, прогнозы и оценка стоимости компании.' } },
      { title: { en: 'Investor List', ru: 'Список инвесторов' }, desc: { en: 'We pick GCC investors who invest in your stage and sector.', ru: 'Подбираем инвесторов GCC под вашу стадию и сферу.' } },
      { title: { en: 'Meetings and Close', ru: 'Встречи и сделка' }, desc: { en: 'Direct intros, meetings and help getting to a signed term sheet.', ru: 'Прямые знакомства, встречи и помощь до подписания.' } },
    ]
  }
];

export const PRINCIPLES: Principle[] = [
  {
    title: { en: 'Integrity', ru: 'Честность' },
    desc: {
      en: 'No hidden fees, no surprises. You know exactly what you pay for and when.',
      ru: 'Никаких скрытых платежей, никаких сюрпризов. Вы точно знаете, за что платите и когда.'
    }
  },
  {
    title: { en: 'Personalized Approach', ru: 'Индивидуальный подход' },
    desc: {
      en: 'Every business is different. We take time to understand yours before offering solutions.',
      ru: 'Каждый бизнес уникален. Мы сначала разбираемся в вашем, а потом предлагаем решения.'
    }
  },
  {
    title: { en: 'Results-driven', ru: 'Ориентация на результат' },
    desc: {
      en: 'Companies registered, visas approved, funds raised - we count what matters.',
      ru: 'Компании зарегистрированы, визы получены, инвестиции привлечены - считаем то, что важно.'
    }
  }
];

export const REGISTRATION_STEPS: Step[] = [
  {
    title: { en: 'Initial Consultation', ru: 'Первая консультация' },
    desc: {
      en: "Tell us about your plans. We'll explain what works in Qatar and what doesn't.",
      ru: 'Расскажите о планах. Мы объясним, что работает в Катаре, а что - нет.'
    }
  },
  {
    title: { en: 'Legal Form Selection', ru: 'Выбор юридической формы' },
    desc: {
      en: "LLC, branch, or rep office? We'll help pick the structure that fits your goals.",
      ru: 'LLC, филиал или представительство? Поможем выбрать то, что подходит вашим целям.'
    }
  },
  {
    title: { en: 'License Procurement', ru: 'Получение лицензии' },
    desc: {
      en: 'We collect documents, file applications, and follow up until you get the license.',
      ru: 'Собираем документы, подаём заявки и следим за процессом до получения лицензии.'
    }
  },
  {
    title: { en: 'Visa Processing', ru: 'Оформление визы' },
    desc: {
      en: 'Resident visa paperwork and approvals - we handle the bureaucracy.',
      ru: 'Документы на резидентскую визу и согласования - берём бюрократию на себя.'
    }
  },
  {
    title: { en: 'Corporate Bank Account', ru: 'Открытие счета' },
    desc: {
      en: "Local or international bank? We'll introduce you and help set up the account.",
      ru: 'Местный или международный банк? Познакомим и поможем открыть счёт.'
    }
  }
];

export const PARTNERS: Partner[] = [
  { name: 'MOCI', logo: '/images/partners/Ministry_OCI.png', url: 'https://www.moci.gov.qa/en/' },
  { name: 'QSTP', logo: '/images/partners/qatar_science.png', url: 'https://qstp.org.qa/' },
  { name: 'QFZ', logo: '/images/partners/qfz.png', url: 'https://qfz.gov.qa/' },
  { name: 'QFC', logo: '/images/partners/QFC.png', url: 'https://www.qfc.qa/en' },
];

export const CLIENTS = [
  { name: 'Qalan', logo: '/images/clients/qalan.webp', url: 'https://qalan.kz/' },
  { name: 'MUSA', logo: '/images/clients/musa_h.webp', url: 'https://musa.kz/' },
  { name: 'Caring Hands', logo: caringHandsLogo, url: '#' },
  { name: 'Sidr Technology', logo: sidrTechLogo, url: '#' },
  { name: 'ChopA', logo: chopaLogo, url: '#' },
  { name: 'IdealFin', logo: '/images/clients/IdealFin.webp', url: '#' },
  { name: 'Newoon', logo: '/images/clients/newoon.webp', url: '#' },
];

// Additional services grouped by categories
export const OTHER_SERVICES = [
  {
    title: { en: 'PRO Services', ru: 'PRO-услуги' },
    desc: {
      en: 'Government relations and public administration support for your business operations in Qatar.',
      ru: 'Взаимодействие с государственными органами и поддержка административных процессов для вашего бизнеса в Катаре.'
    }
  },
  {
    title: { en: 'NOC from Authorities', ru: 'NOC от госорганов' },
    desc: {
      en: 'No Objection Certificate processing from relevant government authorities.',
      ru: 'Оформление сертификата об отсутствии возражений от соответствующих государственных органов.'
    }
  },
  {
    title: { en: 'Cancellation of Legal Documents', ru: 'Аннулирование юридических документов' },
    desc: {
      en: 'Professional handling of legal document cancellation and related procedures.',
      ru: 'Профессиональное оформление аннулирования юридических документов и связанных процедур.'
    }
  },
  {
    title: { en: 'Website Development', ru: 'Разработка сайтов' },
    desc: {
      en: 'Modern, responsive websites tailored to your business needs and local market requirements.',
      ru: 'Современные адаптивные сайты, соответствующие потребностям вашего бизнеса и требованиям местного рынка.'
    }
  },
  {
    title: { en: 'ISO Certification assistance', ru: 'Помощь в сертификации ISO' },
    desc: {
      en: 'Complete support in obtaining ISO certifications for your business.',
      ru: 'Полная поддержка в получении сертификатов ISO для вашего бизнеса.'
    }
  },
  {
    title: { en: 'ICV Support Services', ru: 'Поддержка ICV' },
    desc: {
      en: 'In-Country Value certification and compliance services for government tenders.',
      ru: 'Сертификация местной добавленной стоимости и услуги по соответствию для государственных тендеров.'
    }
  }
];
