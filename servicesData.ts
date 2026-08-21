import { Language } from './types';

export interface ServiceExample {
  title: { en: string; ru: string };
  description: { en: string; ru: string };
  result: { en: string; ru: string };
}

export interface ServicePricing {
  title: { en: string; ru: string };
  price: { en: string; ru: string };
  features: Array<{ en: string; ru: string }>;
  timeline: { en: string; ru: string };
}

export interface ServiceDetail {
  slug: string;
  title: { en: string; ru: string };
  subtitle: { en: string; ru: string };
  description: { en: string; ru: string };
  benefits: Array<{ en: string; ru: string }>;
  steps: Array<{
    title: { en: string; ru: string };
    desc: { en: string; ru: string };
  }>;
  examples: ServiceExample[];
  pricing: ServicePricing[];
  faqs: Array<{
    question: { en: string; ru: string };
    answer: { en: string; ru: string };
  }>;
}

export const SERVICES_DETAIL: ServiceDetail[] = [
  {
    slug: 'business-intelligence',
    title: { en: 'Business Intelligence', ru: 'Бизнес-аналитика' },
    subtitle: {
      en: 'Make informed market entry decisions with comprehensive research and analysis',
      ru: 'Принимайте взвешенные решения о выходе на рынок на основе глубокого анализа'
    },
    description: {
      en: 'Before you invest time and money into a new market, you need to know what you are getting into. Our Business Intelligence service gives you market research, regulatory analysis, financial projections and a clear launch plan. No fluff, just the data and insights you need to make a confident decision about entering the GCC market.',
      ru: 'Прежде чем вкладывать время и деньги в новый рынок, нужно понимать, во что вы ввязываетесь. Наша услуга бизнес-аналитики даёт вам исследование рынка, регуляторный анализ, финансовые прогнозы и чёткий план запуска. Никакой воды — только данные и инсайты для уверенного решения о выходе на рынок GCC.'
    },
    benefits: [
      { en: 'Reduce market entry risks with data-driven insights', ru: 'Снижаете риски выхода на рынок благодаря данным' },
      { en: 'Understand competitive landscape before launch', ru: 'Понимаете конкурентную среду до запуска' },
      { en: 'Get clear financial projections for investor presentations', ru: 'Получаете чёткие финансовые прогнозы для инвесторов' },
      { en: 'Navigate GCC regulations with confidence', ru: 'Уверенно ориентируетесь в регуляторике GCC' },
      { en: 'Launch with a tested go-to-market strategy', ru: 'Запускаетесь с проверенной стратегией' }
    ],
    steps: [
      {
        title: { en: 'Discovery Call', ru: 'Знакомство' },
        desc: { en: 'We talk through your goals, target market and what is standing in the way.', ru: 'Разбираемся в ваших целях, рынке и том, что мешает двигаться вперёд.' }
      },
      {
        title: { en: 'Feasibility Study', ru: 'Исследование рынка' },
        desc: { en: 'Market size, demand check and the regulatory requirements you need to know.', ru: 'Объём рынка, проверка спроса и требования по регуляторике.' }
      },
      {
        title: { en: 'Competitive Analysis', ru: 'Конкурентный анализ' },
        desc: { en: 'Who is already there, where the gaps are and how you position yourself.', ru: 'Кто уже на рынке, где пробелы и как вы выглядите на их фоне.' }
      },
      {
        title: { en: 'Financial Projections', ru: 'Финансовые прогнозы' },
        desc: { en: 'Revenue model, cost breakdown and a P&L forecast for the first years.', ru: 'Модель доходов, разбивка расходов и прогноз прибыли на первые годы.' }
      },
      {
        title: { en: 'Launch Plan', ru: 'План запуска' },
        desc: { en: 'A practical market entry plan with dates and who does what.', ru: 'Конкретный план выхода на рынок с датами и ответственными.' }
      },
    ],
    examples: [
      {
        title: { en: 'EdTech Platform Market Entry', ru: 'Выход EdTech платформы на рынок' },
        description: {
          en: 'A European online education platform wanted to expand to Qatar and UAE. They needed to understand market size, regulatory requirements for educational content, and competition.',
          ru: 'Европейская онлайн-платформа образования хотела выйти в Катар и ОАЭ. Им нужно было понять размер рынка, требования к образовательному контенту и конкуренцию.'
        },
        result: {
          en: 'Delivered feasibility study showing $12M addressable market, identified 3 key regulatory approvals needed, and created 18-month launch roadmap. Client secured $2M seed round based on our research.',
          ru: 'Предоставили исследование с адресным рынком $12M, определили 3 ключевых разрешения и создали 18-месячный план. Клиент привлёк $2M посевных инвестиций на основе нашего исследования.'
        }
      },
      {
        title: { en: 'F&B Brand Expansion Analysis', ru: 'Анализ расширения F&B бренда' },
        description: {
          en: 'A specialty coffee chain from Central Asia wanted to test Qatar market viability before committing to physical locations.',
          ru: 'Сеть кофеен из Центральной Азии хотела проверить жизнеспособность рынка Катара перед открытием точек.'
        },
        result: {
          en: 'Market analysis revealed oversaturated premium coffee segment but untapped opportunity in office catering. Client pivoted strategy and opened B2B division instead, generating 40% higher margins.',
          ru: 'Анализ показал перенасыщение премиального кофе, но нишу в офисном кейтеринге. Клиент изменил стратегию на B2B, получив на 40% больше маржи.'
        }
      }
    ],
    pricing: [
      {
        title: { en: 'Feasibility Study', ru: 'Исследование рынка' },
        price: { en: '$2,500', ru: '$2,500' },
        features: [
          { en: 'Market size & demand analysis', ru: 'Анализ размера рынка и спроса' },
          { en: 'Regulatory requirements overview', ru: 'Обзор регуляторных требований' },
          { en: 'Competitive landscape report', ru: 'Отчёт о конкурентной среде' },
          { en: '2-week delivery', ru: 'Поставка за 2 недели' }
        ],
        timeline: { en: '2 weeks', ru: '2 недели' }
      },
      {
        title: { en: 'Full Market Entry Package', ru: 'Полный пакет выхода на рынок' },
        price: { en: '$8,500', ru: '$8,500' },
        features: [
          { en: 'Everything in Feasibility Study', ru: 'Всё из исследования рынка' },
          { en: 'Financial model & projections (3 years)', ru: 'Финансовая модель и прогнозы (3 года)' },
          { en: 'Go-to-market strategy & timeline', ru: 'Стратегия выхода на рынок и таймлайн' },
          { en: 'Investor-ready presentation deck', ru: 'Презентация для инвесторов' },
          { en: '4-6 weeks delivery', ru: 'Поставка за 4-6 недель' }
        ],
        timeline: { en: '4-6 weeks', ru: '4-6 недель' }
      }
    ],
    faqs: [
      {
        question: { en: 'How long does a feasibility study take?', ru: 'Сколько времени занимает исследование?' },
        answer: { en: 'Typically 2-3 weeks from kickoff to final report delivery. Timeline depends on market complexity and data availability.', ru: 'Обычно 2-3 недели от старта до финального отчёта. Срок зависит от сложности рынка и доступности данных.' }
      },
      {
        question: { en: 'What sources do you use for market data?', ru: 'Какие источники данных вы используете?' },
        answer: { en: 'We combine official government statistics, industry reports, interviews with market participants, and proprietary research. All sources are cited in the final report.', ru: 'Комбинируем официальную статистику, отраслевые отчёты, интервью с участниками рынка и собственные исследования. Все источники указаны в отчёте.' }
      },
      {
        question: { en: 'Can I use this for investor presentations?', ru: 'Можно использовать для презентаций инвесторам?' },
        answer: { en: 'Yes. The Full Market Entry Package includes an investor-ready deck. Feasibility Study clients can upgrade to add presentation materials.', ru: 'Да. Полный пакет включает презентацию для инвесторов. Клиенты базового исследования могут доплатить за презентационные материалы.' }
      }
    ]
  },
  {
    slug: 'incorporation',
    title: { en: 'Company Incorporation', ru: 'Регистрация компании' },
    subtitle: {
      en: 'Register your business in Qatar, Oman, or Kuwait with full legal and visa support',
      ru: 'Регистрируйте бизнес в Катаре, Омане или Кувейте с полной юридической поддержкой и визами'
    },
    description: {
      en: 'Setting up a company in the GCC involves paperwork, licenses, approvals, and residency permits. We handle the entire incorporation process through QFC, Madayn, or Kuwait free zones. You get a registered entity, commercial license, visas for your team, and a corporate bank account — without dealing with bureaucracy yourself.',
      ru: 'Открытие компании в GCC — это документы, лицензии, согласования и резидентство. Мы ведём весь процесс регистрации через QFC, Madayn или свободные зоны Кувейта. Вы получаете зарегистрированную компанию, коммерческую лицензию, визы для команды и корпоративный счёт — без бюрократии.'
    },
    benefits: [
      { en: '0% corporate tax in free zones', ru: '0% налог на прибыль в свободных зонах' },
      { en: '100% foreign ownership', ru: '100% иностранное владение' },
      { en: 'Residency visas for founders and employees', ru: 'Резидентские визы для основателей и сотрудников' },
      { en: 'Access to GCC markets', ru: 'Доступ к рынкам GCC' },
      { en: 'Fast-track bank account opening', ru: 'Ускоренное открытие банковского счёта' }
    ],
    steps: [
      {
        title: { en: 'First Call', ru: 'Первый звонок' },
        desc: { en: 'You tell us your plans and we tell you what actually works in Qatar.', ru: 'Вы рассказываете о планах, мы говорим, что реально работает в Катаре.' }
      },
      {
        title: { en: 'Legal Structure', ru: 'Юридическая форма' },
        desc: { en: 'LLC, branch or rep office? We help you pick what fits.', ru: 'LLC, филиал или представительство? Помогаем выбрать подходящее.' }
      },
      {
        title: { en: 'License', ru: 'Лицензия' },
        desc: { en: 'We collect the documents, file everything and chase approvals until it is done.', ru: 'Собираем документы, подаём заявки и добиваемся одобрения.' }
      },
      {
        title: { en: 'Visa', ru: 'Виза' },
        desc: { en: 'Residency visa paperwork handled on your behalf.', ru: 'Оформляем резидентскую визу за вас.' }
      },
      {
        title: { en: 'Bank Account', ru: 'Банковский счёт' },
        desc: { en: 'Local or international bank. We make the intro and help you open the account.', ru: 'Местный или международный банк. Познакомим и поможем открыть счёт.' }
      },
    ],
    examples: [
      {
        title: { en: 'SaaS Company QFC Setup', ru: 'Регистрация SaaS компании в QFC' },
        description: {
          en: 'A SaaS startup from Kazakhstan wanted Qatar entity to serve GCC clients and access regional payment processors.',
          ru: 'SaaS-стартап из Казахстана хотел компанию в Катаре для обслуживания клиентов GCC и доступа к региональным платёжным системам.'
        },
        result: {
          en: 'Registered QFC entity in 3 weeks, secured 2 founder visas, opened USD/QAR accounts with local bank. Company now processes $50K+ monthly through regional payment gateways.',
          ru: 'Зарегистрировали компанию в QFC за 3 недели, получили 2 визы основателей, открыли счета в USD/QAR. Компания обрабатывает $50K+ ежемесячно через региональные платёжные системы.'
        }
      },
      {
        title: { en: 'Trading Company in Madayn', ru: 'Торговая компания в Madayn' },
        description: {
          en: 'Russian trading company needed Omani entity for import/export operations with preferential GCC trade agreements.',
          ru: 'Российская торговая компания нуждалась в оманской компании для импорта/экспорта с преференциальными соглашениями GCC.'
        },
        result: {
          en: 'Set up Madayn free zone company with import/export license, arranged office space, secured 4 employee visas. First shipment cleared customs within 30 days of incorporation.',
          ru: 'Открыли компанию в свободной зоне Madayn с лицензией на импорт/экспорт, арендовали офис, получили 4 визы сотрудникам. Первая партия прошла таможню через 30 дней после регистрации.'
        }
      }
    ],
    pricing: [
      {
        title: { en: 'QFC Registration', ru: 'Регистрация в QFC' },
        price: { en: 'from $4,500', ru: 'от $4,500' },
        features: [
          { en: 'Company registration & license', ru: 'Регистрация компании и лицензия' },
          { en: 'Legal documents & filing', ru: 'Юридические документы и подача' },
          { en: '1 founder residency visa', ru: '1 резидентская виза основателя' },
          { en: 'Government fees included', ru: 'Госпошлины включены' },
          { en: '2-4 weeks timeline', ru: 'Срок 2-4 недели' }
        ],
        timeline: { en: '2-4 weeks', ru: '2-4 недели' }
      },
      {
        title: { en: 'Full Setup Package', ru: 'Полный пакет открытия' },
        price: { en: 'from $8,500', ru: 'от $8,500' },
        features: [
          { en: 'Everything in QFC Registration', ru: 'Всё из регистрации QFC' },
          { en: 'Up to 3 employee visas', ru: 'До 3 виз сотрудникам' },
          { en: 'Corporate bank account setup', ru: 'Открытие корпоративного счёта' },
          { en: 'Virtual office (12 months)', ru: 'Виртуальный офис (12 месяцев)' },
          { en: 'Compliance support (first year)', ru: 'Поддержка по compliance (первый год)' }
        ],
        timeline: { en: '4-6 weeks', ru: '4-6 недель' }
      }
    ],
    faqs: [
      {
        question: { en: 'What documents do I need to provide?', ru: 'Какие документы нужно предоставить?' },
        answer: { en: 'Passport copies of shareholders/directors, proof of address, business plan summary, and source of funds declaration. We provide a detailed checklist after the first call.', ru: 'Копии паспортов акционеров/директоров, подтверждение адреса, краткий бизнес-план и декларация источника средств. Даём детальный чек-лист после первого звонка.' }
      },
      {
        question: { en: 'How long does the full process take?', ru: 'Сколько занимает весь процесс?' },
        answer: { en: 'Company registration: 2-4 weeks. Visas: additional 2-3 weeks. Bank account: 2-4 weeks after company registration. Total: 6-10 weeks for complete setup.', ru: 'Регистрация компании: 2-4 недели. Визы: ещё 2-3 недели. Банковский счёт: 2-4 недели после регистрации. Итого: 6-10 недель полный цикл.' }
      },
      {
        question: { en: 'Can I manage this remotely?', ru: 'Можно всё сделать удалённо?' },
        answer: { en: 'Most of the process can be handled remotely with notarized documents. You may need to visit once for bank account opening (some banks allow video KYC) and visa stamping.', ru: 'Большую часть можно сделать удалённо с нотариально заверенными документами. Может потребоваться один визит для открытия счёта (некоторые банки делают KYC по видео) и проставления визы.' }
      }
    ]
  },
  {
    slug: 'business-matchmaking',
    title: { en: 'Business Matchmaking', ru: 'Бизнес-матчмейкинг' },
    subtitle: {
      en: 'Connect with the right partners and distributors in the GCC market',
      ru: 'Связываем с правильными партнёрами и дистрибьюторами на рынке GCC'
    },
    description: {
      en: 'Finding the right business partners in an unfamiliar market is hard. We leverage our network in Qatar, UAE, Kuwait, and Oman to connect you with distributors, joint venture partners, or strategic allies. We make the introduction, facilitate meetings, and only charge when there is a signed agreement.',
      ru: 'Найти правильных бизнес-партнёров на незнакомом рынке сложно. Используем нашу сеть в Катаре, ОАЭ, Кувейте и Омане, чтобы связать вас с дистрибьюторами, партнёрами для JV или стратегическими союзниками. Делаем знакомство, организуем встречи и берём комиссию только при подписанном соглашении.'
    },
    benefits: [
      { en: 'Access to vetted partners across GCC', ru: 'Доступ к проверенным партнёрам по всему GCC' },
      { en: 'No upfront fees - pay only on success', ru: 'Без авансов — платите только за результат' },
      { en: 'Direct introductions to decision-makers', ru: 'Прямые знакомства с лицами, принимающими решения' },
      { en: 'Negotiation support throughout the process', ru: 'Поддержка в переговорах на всех этапах' },
      { en: 'Cultural and business practice guidance', ru: 'Помощь в понимании культуры и бизнес-практик' }
    ],
    steps: [
      {
        title: { en: 'Getting to Know You', ru: 'Знакомство' },
        desc: { en: 'We look at your business and figure out what kind of partner or investor you actually need.', ru: 'Изучаем ваш бизнес и понимаем, какой партнёр или инвестор вам нужен.' }
      },
      {
        title: { en: 'Search', ru: 'Поиск' },
        desc: { en: 'We go through our network and look for people who match.', ru: 'Перебираем нашу сеть и ищем тех, кто подходит.' }
      },
      {
        title: { en: 'Shortlist', ru: 'Список кандидатов' },
        desc: { en: 'We filter the options and pick the ones worth talking to.', ru: 'Отбираем тех, с кем стоит говорить.' }
      },
      {
        title: { en: 'Introduction', ru: 'Знакомство' },
        desc: { en: 'We set up the first meeting and make the intro.', ru: 'Организуем первую встречу и представляем вас.' }
      },
      {
        title: { en: 'Deal Support', ru: 'Поддержка сделки' },
        desc: { en: 'We stay in the loop and help move things forward until the deal is done.', ru: 'Остаёмся в процессе и помогаем довести дело до конца.' }
      },
    ],
    examples: [
      {
        title: { en: 'F&B Distribution Partnership', ru: 'Партнёрство по дистрибуции F&B' },
        description: {
          en: 'European specialty food producer needed distribution partner in Qatar for hotel and restaurant supply.',
          ru: 'Европейский производитель специализированных продуктов искал дистрибьютора в Катаре для поставок в отели и рестораны.'
        },
        result: {
          en: 'Connected with established HORECA distributor. Signed exclusive distribution agreement covering Qatar and Oman. First order placed within 45 days, $120K annual contract value.',
          ru: 'Связали с проверенным HORECA дистрибьютором. Подписали эксклюзивное соглашение по Катару и Оману. Первый заказ через 45 дней, $120K годовой контракт.'
        }
      },
      {
        title: { en: 'Tech JV in Kuwait', ru: 'Tech JV в Кувейте' },
        description: {
          en: 'Central Asian IT company sought local partner for government IT contracts in Kuwait, which require local partnership.',
          ru: 'IT-компания из Центральной Азии искала местного партнёра для госконтрактов в Кувейте, требующих локального партнёрства.'
        },
        result: {
          en: 'Matched with Kuwait-based systems integrator with government connections. Structured 50/50 JV, won first tender within 6 months ($2.3M contract).',
          ru: 'Связали с кувейтским системным интегратором с госсвязями. Оформили JV 50/50, выиграли первый тендер через 6 месяцев (контракт $2.3M).'
        }
      }
    ],
    pricing: [
      {
        title: { en: 'Success-Based Fee', ru: 'Комиссия за результат' },
        price: { en: '5-10%', ru: '5-10%' },
        features: [
          { en: 'No upfront payment required', ru: 'Без предоплаты' },
          { en: 'Fee based on deal value', ru: 'Комиссия от суммы сделки' },
          { en: 'Unlimited partner introductions', ru: 'Неограниченные знакомства с партнёрами' },
          { en: 'Negotiation support included', ru: 'Поддержка переговоров включена' },
          { en: 'Pay only when deal closes', ru: 'Платите только при закрытии сделки' }
        ],
        timeline: { en: '2-6 months', ru: '2-6 месяцев' }
      },
      {
        title: { en: 'Retainer + Success Fee', ru: 'Ретейнер + комиссия' },
        price: { en: '$3,000/mo + 3-5%', ru: '$3,000/мес + 3-5%' },
        features: [
          { en: 'Monthly retainer for active search', ru: 'Месячный ретейнер за активный поиск' },
          { en: 'Dedicated account manager', ru: 'Выделенный менеджер аккаунта' },
          { en: 'Priority access to network', ru: 'Приоритетный доступ к сети' },
          { en: 'Market intelligence reports', ru: 'Отчёты о рыночной аналитике' },
          { en: 'Lower success fee on closing', ru: 'Меньшая комиссия при закрытии' }
        ],
        timeline: { en: '3-6 month engagement', ru: 'Контракт 3-6 месяцев' }
      }
    ],
    faqs: [
      {
        question: { en: 'How do you calculate the success fee?', ru: 'Как рассчитывается комиссия за успех?' },
        answer: { en: 'Fee is 5-10% of first-year contract value or deal size, depending on complexity. We agree on the exact percentage before starting the search.', ru: 'Комиссия 5-10% от суммы контракта первого года или размера сделки, в зависимости от сложности. Точный процент согласовываем до начала поиска.' }
      },
      {
        question: { en: 'What if no suitable partner is found?', ru: 'Что если подходящий партнёр не найдётся?' },
        answer: { en: 'On success-based model, you pay nothing. On retainer model, you pay monthly fee but can cancel anytime with 30 days notice.', ru: 'На модели за результат вы не платите ничего. На ретейнере платите месячный взнос, но можете отменить в любой момент с уведомлением за 30 дней.' }
      },
      {
        question: { en: 'How long does it typically take?', ru: 'Сколько обычно занимает процесс?' },
        answer: { en: 'First introductions: 2-4 weeks. Deal negotiation and closing: 2-6 months depending on complexity. Simpler distribution deals close faster than JV structures.', ru: 'Первые знакомства: 2-4 недели. Переговоры и закрытие: 2-6 месяцев в зависимости от сложности. Простые дистрибуторские сделки закрываются быстрее, чем JV.' }
      }
    ]
  },
  {
    slug: 'fundraising',
    title: { en: 'Fundraising Support', ru: 'Привлечение инвестиций' },
    subtitle: {
      en: 'Raise capital from GCC investors with pitch decks, financial models, and warm introductions',
      ru: 'Привлекайте капитал от инвесторов GCC с питч-деками, финансовыми моделями и тёплыми знакомствами'
    },
    description: {
      en: 'Raising money in the GCC requires more than a good idea. You need a compelling pitch deck, investor-grade financials, and direct access to the right investors. We help you prepare materials, identify active investors in your sector and stage, and make warm introductions. We know who is actually writing checks in Qatar, UAE, Kuwait, and Saudi Arabia.',
      ru: 'Привлечение денег в GCC требует большего, чем хорошая идея. Нужен убедительный питч-дек, финансовая модель инвесторского уровня и прямой доступ к правильным инвесторам. Помогаем подготовить материалы, находим активных инвесторов в вашей отрасли и на вашей стадии, делаем тёплые знакомства. Знаем, кто реально инвестирует в Катаре, ОАЭ, Кувейте и Саудовской Аравии.'
    },
    benefits: [
      { en: 'Investor-ready pitch deck and financial model', ru: 'Питч-дек и финансовая модель для инвесторов' },
      { en: 'Direct access to active GCC investors', ru: 'Прямой доступ к активным инвесторам GCC' },
      { en: 'Warm introductions, not cold emails', ru: 'Тёплые знакомства, а не холодные письма' },
      { en: 'Preparation for due diligence process', ru: 'Подготовка к процессу due diligence' },
      { en: 'Term sheet negotiation support', ru: 'Поддержка в переговорах по term sheet' }
    ],
    steps: [
      {
        title: { en: 'Where You Stand', ru: 'Стартовая точка' },
        desc: { en: 'We look at your stage, docs and how ready you are to talk to investors.', ru: 'Смотрим на вашу стадию, документы и насколько вы готовы к разговору с инвесторами.' }
      },
      {
        title: { en: 'Pitch Deck', ru: 'Питч-дек' },
        desc: { en: 'We put together a presentation that gets to the point.', ru: 'Делаем презентацию, которая говорит по делу.' }
      },
      {
        title: { en: 'Financial Model', ru: 'Финансовая модель' },
        desc: { en: 'Numbers, projections and what the company is worth.', ru: 'Цифры, прогнозы и оценка стоимости компании.' }
      },
      {
        title: { en: 'Investor List', ru: 'Список инвесторов' },
        desc: { en: 'We pick GCC investors who invest in your stage and sector.', ru: 'Подбираем инвесторов GCC под вашу стадию и сферу.' }
      },
      {
        title: { en: 'Meetings and Close', ru: 'Встречи и сделка' },
        desc: { en: 'Direct intros, meetings and help getting to a signed term sheet.', ru: 'Прямые знакомства, встречи и помощь до подписания.' }
      },
    ],
    examples: [
      {
        title: { en: 'Seed Round for AI Startup', ru: 'Посевной раунд AI-стартапа' },
        description: {
          en: 'Kazakhstan-based AI startup needed $500K seed round to expand to GCC markets. Had MVP and first paying customers but no investor materials.',
          ru: 'AI-стартап из Казахстана нуждался в $500K посевного раунда для выхода на рынки GCC. Был MVP и первые платящие клиенты, но не было материалов для инвесторов.'
        },
        result: {
          en: 'Created pitch deck and 3-year financial model. Introduced to 8 Qatar/UAE investors. Closed $650K round led by Doha-based VC in 4 months.',
          ru: 'Создали питч-дек и 3-летнюю финмодель. Познакомили с 8 инвесторами Катара/ОАЭ. Закрыли раунд $650K с ведущим инвестором из Дохи за 4 месяца.'
        }
      },
      {
        title: { en: 'Series A for HealthTech', ru: 'Раунд Series A для HealthTech' },
        description: {
          en: 'Healthcare technology company with $1.2M ARR sought $3M Series A to scale across GCC hospitals.',
          ru: 'HealthTech компания с $1.2M ARR искала $3M Series A для масштабирования в госпиталях GCC.'
        },
        result: {
          en: 'Refined pitch deck for healthcare investors, built detailed unit economics model. Secured meetings with 5 healthcare-focused funds. Closed $3.5M led by UAE family office.',
          ru: 'Доработали питч-дек под healthcare инвесторов, построили детальную модель unit economics. Организовали встречи с 5 healthcare-фондами. Закрыли $3.5M с ведущим family office из ОАЭ.'
        }
      }
    ],
    pricing: [
      {
        title: { en: 'Materials Package', ru: 'Пакет материалов' },
        price: { en: '$5,000', ru: '$5,000' },
        features: [
          { en: 'Investor pitch deck (15-20 slides)', ru: 'Питч-дек для инвесторов (15-20 слайдов)' },
          { en: 'Financial model (3-year projections)', ru: 'Финансовая модель (прогнозы на 3 года)' },
          { en: 'Executive summary (2 pages)', ru: 'Executive summary (2 страницы)' },
          { en: 'Up to 3 revision rounds', ru: 'До 3 раундов правок' },
          { en: '3-4 weeks delivery', ru: 'Поставка за 3-4 недели' }
        ],
        timeline: { en: '3-4 weeks', ru: '3-4 недели' }
      },
      {
        title: { en: 'Full Fundraising Support', ru: 'Полная поддержка фандрейзинга' },
        price: { en: '$10,000 + 3-5%', ru: '$10,000 + 3-5%' },
        features: [
          { en: 'Everything in Materials Package', ru: 'Всё из пакета материалов' },
          { en: 'Investor targeting & outreach', ru: 'Таргетинг инвесторов и охват' },
          { en: 'Warm introductions to investors', ru: 'Тёплые знакомства с инвесторами' },
          { en: 'Pitch practice & feedback', ru: 'Тренировка питча и обратная связь' },
          { en: '3-5% success fee on closing', ru: '3-5% комиссия при закрытии' }
        ],
        timeline: { en: '3-6 months', ru: '3-6 месяцев' }
      }
    ],
    faqs: [
      {
        question: { en: 'What stage companies do you work with?', ru: 'С какими стадиями компаний вы работаете?' },
        answer: { en: 'Primarily seed to Series A ($250K - $5M rounds). We occasionally work with pre-seed if there is strong traction, and Series B+ for GCC market expansion specifically.', ru: 'Преимущественно seed до Series A (раунды $250K - $5M). Иногда работаем с pre-seed при сильной тракции, и Series B+ конкретно для расширения на рынок GCC.' }
      },
      {
        question: { en: 'How is the success fee calculated?', ru: 'Как рассчитывается комиссия за успех?' },
        answer: { en: 'Success fee is 3-5% of capital raised, paid at closing. Exact percentage depends on round size (larger rounds = lower %) and if you choose Materials-only or Full Support package.', ru: 'Комиссия 3-5% от привлечённого капитала, выплата при закрытии. Точный процент зависит от размера раунда (больше раунд = меньше %) и выбранного пакета.' }
      },
      {
        question: { en: 'Do you invest yourselves?', ru: 'Вы сами инвестируете?' },
        answer: { en: 'No, we are advisors and intermediaries, not investors. This keeps us focused on your success rather than our own investment returns.', ru: 'Нет, мы консультанты и посредники, не инвесторы. Это позволяет нам фокусироваться на вашем успехе, а не на собственной доходности.' }
      }
    ]
  }
];

export function getServiceBySlug(slug: string): ServiceDetail | undefined {
  return SERVICES_DETAIL.find(service => service.slug === slug);
}
