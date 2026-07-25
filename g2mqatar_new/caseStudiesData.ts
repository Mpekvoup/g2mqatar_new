
import sidrTechLogo from './src/assets/clients/sidr-tech-logo.webp';
import caringHandsLogo from './src/assets/clients/caring_hands.webp';

export interface CaseStudy {
  id: number;
  slug: string;
  logo?: string;
  industry: { en: string; ru: string };
  company: { en: string; ru: string };
  subtitle: { en: string; ru: string };
  year: string;
  context: { en: string; ru: string };
  challenges: { en: string[]; ru: string[] };
  solution: { en: string; ru: string };
  results: { en: { metric: string; label: string }[]; ru: { metric: string; label: string }[] };
  quote: { en: string; ru: string };
  quotee: { en: string; ru: string };
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 1,
    slug: 'caring-hands',
    logo: caringHandsLogo,
    industry: { en: 'Healthcare', ru: 'Здравоохранение' },
    company: { en: 'Caring Hands', ru: 'Caring Hands' },
    subtitle: { en: 'Premium Home Nursing Operator in Qatar', ru: 'Премиальный оператор домашнего ухода в Катаре' },
    year: '2025',
    context: {
      en: 'A healthcare venture founded by an expert with international experience in community health. The company entered the Qatar market to launch a licensed home nursing model amid growing demand for post-hospital, elderly, and newborn care. The project required full regulatory navigation through MoPH and building a scalable operational model from the ground up.',
      ru: 'Healthcare-проект, основанный экспертом с международным опытом в community health. Компания вышла на рынок Катара для запуска лицензированной модели домашнего ухода на фоне роста спроса на постгоспитальный, пожилой и newborn care. Требовалась полная регуляторная навигация через MoPH и построение масштабируемой операционной модели.'
    },
    challenges: {
      en: [
        'Obtaining MoPH Facility License through the full FLI Step A–C process',
        'Building a DHP-compliant operational structure from scratch',
        'Constructing a financial model with breakeven target within 6 months'
      ],
      ru: [
        'Получение MoPH Facility License — прохождение полного цикла FLI Step A–C',
        'Формирование DHP-compliant операционной структуры с нуля',
        'Построение финансовой модели с выходом на безубыточность в пределах 6 месяцев'
      ]
    },
    solution: {
      en: 'We structured a Home Nursing Agency model with phased licensing and appointed a DHP-licensed Clinical Director ahead of the application. We developed full SOPs and a compliance framework aligned with MoPH requirements, built an international recruitment pipeline from the Philippines, and designed a unit-economics scaling model targeting 4–5 registered nurses per month.',
      ru: 'Мы структурировали модель Home Nursing Agency с поэтапным лицензированием и назначили DHP-licensed Clinical Director до подачи заявки. Разработали полный пакет SOPs и compliance framework в соответствии с требованиями MoPH, построили международный recruitment pipeline из Филиппин и сформировали unit-economics модель масштабирования с целевым показателем 4–5 медсестёр в месяц.'
    },
    results: {
      en: [
        { metric: '5 weeks', label: 'License obtained' },
        { metric: 'Month 5', label: 'Breakeven reached' },
        { metric: '129K QAR', label: 'Net profit by Month 6' },
        { metric: '20 RN', label: 'Staff by Month 6' },
        { metric: '35–40', label: 'Active clients Year-End target' }
      ],
      ru: [
        { metric: '5 недель', label: 'Получение лицензии' },
        { metric: 'Месяц 5', label: 'Выход на безубыточность' },
        { metric: '129K QAR', label: 'Чистая прибыль к месяцу 6' },
        { metric: '20 RN', label: 'Штат к месяцу 6' },
        { metric: '35–40', label: 'Активных клиентов — план Year-End' }
      ]
    },
    quote: {
      en: '"G2M built a fully compliant and scalable healthcare platform, not just a licensed entity."',
      ru: '«G2M построили полностью комплаентную и масштабируемую healthcare-платформу, а не просто лицензированную компанию.»'
    },
    quotee: { en: 'Dalya Alminawi, CEO', ru: 'Dalya Alminawi, CEO' }
  },
  {
    id: 2,
    slug: 'sidr-technology',
    logo: sidrTechLogo,
    industry: { en: 'Technology', ru: 'Технологии' },
    company: { en: 'Sidr Technology', ru: 'Sidr Technology' },
    subtitle: { en: 'UK Software Consultancy Entering Qatar Tech Market', ru: 'Британская software-компания выходит на рынок Катара' },
    year: '2025',
    context: {
      en: 'A UK-based software consultancy with 9+ years of expertise in React Native and React development. The company identified Qatar\'s rapidly growing tech sector as a strategic opportunity but lacked local knowledge to navigate entity registration, market entry mechanics, and client acquisition on the ground.',
      ru: 'Британская software-консалтинговая компания с более чем 9-летним опытом в React Native и React разработке. Компания увидела стратегическую возможность на быстрорастущем tech-рынке Катара, однако не имела локальной экспертизы для навигации по процессу регистрации юридического лица, входа на рынок и построения клиентской базы.'
    },
    challenges: {
      en: [
        'No knowledge of local company registration procedures and requirements in Qatar',
        'Developing a viable market entry strategy for a foreign tech consultancy',
        'Establishing a physical presence and attracting initial clients from scratch'
      ],
      ru: [
        'Отсутствие понимания локальных процедур и требований для регистрации компании в Катаре',
        'Разработка жизнеспособной стратегии выхода на рынок для иностранной tech-консалтинговой компании',
        'Создание физического присутствия и привлечение первых клиентов с нуля'
      ]
    },
    solution: {
      en: 'G2M provided end-to-end company registration support, guiding Sidr through every step of the local incorporation process. We developed a tailored business plan and market entry strategy aligned with Qatar\'s tech ecosystem. Our team assisted with securing and setting up an office on D Ring Road in Doha, and leveraged our local network to facilitate introductions and support the acquisition of their first clients.',
      ru: 'G2M обеспечила полное сопровождение регистрации компании, проведя Sidr через каждый этап процесса локальной инкорпорации. Мы разработали адаптированный бизнес-план и стратегию выхода на рынок с учётом специфики tech-экосистемы Катара. Наша команда помогла с поиском и организацией офиса на D Ring Road в Дохе, а также использовала локальную сеть контактов для установления первичных связей и привлечения первых клиентов.'
    },
    results: {
      en: [
        { metric: '<1 month', label: 'Company registration completed' },
        { metric: 'D Ring Road', label: 'Office opened in Doha' },
        { metric: '10–20', label: 'First clients acquired' }
      ],
      ru: [
        { metric: '<1 месяца', label: 'Регистрация компании завершена' },
        { metric: 'D Ring Road', label: 'Офис открыт в Дохе' },
        { metric: '10–20', label: 'Первых клиентов привлечено' }
      ]
    },
    quote: {
      en: '"G2M removed every barrier to entry — from registration to our first clients — in under a month."',
      ru: '«G2M устранила все барьеры для входа на рынок — от регистрации до первых клиентов — менее чем за месяц.»'
    },
    quotee: { en: 'Abbas Farid, Founder', ru: 'Abbas Farid, Основатель' }
  },
  {
    id: 3,
    slug: 'qalan',
    logo: '/images/clients/qalan_case.png',
    industry: { en: 'EdTech', ru: 'EdTech' },
    company: { en: 'Qalan', ru: 'Qalan' },
    subtitle: { en: 'Kazakhstani EdTech Platform Scaling Across GCC & MENA', ru: 'Казахстанская EdTech-платформа масштабируется в GCC и MENA' },
    year: '2025',
    context: {
      en: 'A Kazakhstani EdTech platform with a unique gamification and cashback system for students in grades 0–11. Having built a base of hundreds of thousands of users in Kazakhstan, the founders decided to scale internationally, targeting the GCC and MENA markets simultaneously across four countries.',
      ru: 'Казахстанская EdTech-платформа с уникальной системой геймификации и кэшбэка для школьников 0–11 классов. Имея сотни тысяч пользователей в Казахстане, основатели приняли решение о международной экспансии с одновременным выходом на рынки четырёх стран GCC и MENA.'
    },
    challenges: {
      en: [
        'Simultaneous market entry across 4 countries: Qatar, Jordan, Azerbaijan, and Egypt',
        'Registering legal entities in each jurisdiction with different regulatory frameworks',
        'Finding reliable local partners and attracting investors in each target market'
      ],
      ru: [
        'Одновременный выход на 4 рынка: Катар, Иордания, Азербайджан и Египет',
        'Регистрация юридических лиц в каждой юрисдикции с различными регуляторными требованиями',
        'Поиск надёжных локальных партнёров и привлечение инвесторов в каждой из целевых стран'
      ]
    },
    solution: {
      en: 'G2M developed a tailored market entry strategy for each of the four target countries, accounting for local regulatory, cultural, and competitive specifics. We managed the full company registration process in all jurisdictions in parallel, identified and established partnerships with key local players in each market, and ran an investor-matching process connecting Qalan with relevant investors across the target regions.',
      ru: 'G2M разработала адаптированную стратегию выхода на рынок для каждой из четырёх целевых стран с учётом локальной регуляторной, культурной и конкурентной специфики. Мы параллельно вели полный процесс регистрации компаний во всех юрисдикциях, выявляли и устанавливали партнёрства с ключевыми локальными игроками в каждом рынке, а также провели investor-matching, соединив Qalan с профильными инвесторами в целевых регионах.'
    },
    results: {
      en: [
        { metric: '4 markets', label: 'Entered simultaneously' },
        { metric: '100K+', label: 'Users acquired per country' },
        { metric: '4 countries', label: 'Local partners secured' },
        { metric: 'Investors', label: 'Attracted in target markets' }
      ],
      ru: [
        { metric: '4 рынка', label: 'Вышли одновременно' },
        { metric: '100K+', label: 'Пользователей в каждой стране' },
        { metric: '4 страны', label: 'Локальные партнёры найдены' },
        { metric: 'Инвесторы', label: 'Привлечены в целевых рынках' }
      ]
    },
    quote: {
      en: '"G2M made it possible to enter four completely different markets at once — with the right partners and investors already in place."',
      ru: '«G2M позволила нам войти в четыре абсолютно разных рынка одновременно — с уже готовыми партнёрами и инвесторами на местах.»'
    },
    quotee: { en: 'Askar Bolat, Founder', ru: 'Аскар Болат, Основатель' }
  }
];
