// Mentoring: every price, link and line of copy lives here, in English and Albanian.
// Components only render this data, so a price change is a one-line edit in
// `mentoringPrices`: cards, FAQ answers, meta descriptions and JSON-LD offers follow.

import type { FaqItem, Identity } from '../types';
import { contact, profiles } from './contact';
import { azureCertificationName, university } from './education';
import { contractCountriesText, experienceYearsLabel } from './experience';
import { NO_BREAK_SPACE, type Lang } from './lang';
import { menteeTestimonial } from './testimonials';

/* ============================================
   PRICES (single source)
   ============================================ */
export type Money = { amount: number; currency: 'EUR' | 'ALL' };
export type PriceId = 'mock' | 'training';
type PriceSet = { main: Money; local: Money; perHour: boolean };

export const mentoringPrices: Record<PriceId, PriceSet> = {
  mock: { main: { amount: 15, currency: 'EUR' }, local: { amount: 1500, currency: 'ALL' }, perHour: false },
  training: { main: { amount: 22, currency: 'EUR' }, local: { amount: 2000, currency: 'ALL' }, perHour: true },
};

/** Mock interview length. */
export const MOCK_MINUTES = 45;
/** Lessons after which the mock interview price is credited back. */
export const LESSONS_FOR_CREDIT = 4;

const CURRENCY_LABEL: Record<Money['currency'], string> = { EUR: 'EUR', ALL: 'lekë' };

/** "15 EUR", "1500 lekë". */
export const formatMoney = ({ amount, currency }: Money) => `${amount} ${CURRENCY_LABEL[currency]}`;

const PER_HOUR: Record<Lang, { main: string; local: string }> = {
  en: { main: ' / h', local: ' / hour' },
  sq: { main: ' / orë', local: ' / orë' },
};

/** Price as printed on an offer card: "22 EUR / h", "2000 lekë / hour". */
export const priceLabel = (id: PriceId, which: 'main' | 'local', lang: Lang) => {
  const price = mentoringPrices[id];
  return formatMoney(price[which]) + (price.perHour ? PER_HOUR[lang][which] : '');
};

const mockEur = formatMoney(mentoringPrices.mock.main);
const mockLek = formatMoney(mentoringPrices.mock.local);
const trainingEur = formatMoney(mentoringPrices.training.main);
const trainingLek = formatMoney(mentoringPrices.training.local);

/* ============================================
   COPY
   ============================================ */
export type Offer = {
  id: PriceId;
  label: string;
  title: string;
  bullets?: string[];
  text?: string;
  topics?: { name: string; highlight?: boolean }[];
  cta: { label: string; href: string; variant: 'gold' | 'ghost' };
  featured?: boolean;
};

export type Channel = {
  name: string;
  href: string;
  /** External links open in a new tab; mailto stays a plain link. */
  external: boolean;
};

const SUPERPROF =
  'https://www.superprof.al/meso-java-nje-zhvillues-backend-mesime-java-spring-boot-sql-hibernate-dhe-bazat-mikroserviseve-online-meso-programim.html';

const bookingChannels = (emailSubject: string): Channel[] => [
  { name: 'Email', href: `mailto:${contact.email}?subject=${encodeURIComponent(emailSubject)}`, external: false },
  { name: 'LinkedIn', href: profiles.linkedin, external: true },
  { name: 'Superprof', href: SUPERPROF, external: true },
  { name: 'WhatsApp', href: contact.whatsapp.href, external: true },
];

export type MentoringCopy = {
  /** Home page section. */
  label: string;
  heading: { before: string; highlight: string; after: string };
  sub: string;
  homeLinks: { details: string; albanian: string };
  topicsLabel: string;
  offers: Offer[];
  steps: { title: string; text: string }[];
  book: { id: string; heading: string; channels: Channel[] };
  /** /mentoring/ and /sq/mentorim-java/. */
  page: {
    languageSwitch: string;
    eyebrow: string;
    h1: (person: Identity) => string;
    lede: string;
    whoHeading: string;
    who: string[];
    offersHeading: string;
    mockHeading: string;
    mockText: string;
    trainingHeading: string;
    trainingText: string[];
    bookHeading: string;
    mentorHeading: string;
    mentorText: (person: Identity) => string[];
    quote?: { text: string; cite: string };
    links: { home: string; freelance: string };
    faqHeading: string;
    faq: FaqItem[];
    /** Service name in the JSON-LD. */
    serviceName: string;
  };
};

const TOPICS_EN = [
  { name: 'Java' },
  { name: 'OOP' },
  { name: 'Spring Boot' },
  { name: 'SQL' },
  { name: 'Hibernate' },
  { name: 'Microservices basics', highlight: true },
];

const TOPICS_SQ = [...TOPICS_EN.slice(0, -1), { name: 'Bazat e mikroshërbimeve', highlight: true }];

export const mentoringCopy: Record<Lang, MentoringCopy> = {
  en: {
    label: 'Mentoring',
    heading: { before: 'Mock interviews and ', highlight: 'Java training', after: ', 1:1.' },
    sub: `For students and junior developers getting ready for their first Java role. Taught from ${experienceYearsLabel('en')} years of real production work. 100% online.`,
    homeLinks: { details: 'Session format, prices and FAQ', albanian: 'Mentorim Java në shqip' },
    topicsLabel: 'Topics',
    offers: [
      {
        id: 'mock',
        label: `Start here · ${MOCK_MINUTES} min`,
        title: 'Mock interview',
        bullets: [
          'A realistic Java and Spring Boot technical interview',
          'Also for junior developers preparing for a mid-level role',
          'A written summary of your strengths and gaps after the session',
          `The price is credited back if you continue with ${LESSONS_FOR_CREDIT}+ lessons`,
        ],
        cta: { label: 'Book a mock interview', href: '#book', variant: 'gold' },
        featured: true,
      },
      {
        id: 'training',
        label: 'First session free',
        title: '1:1 training',
        text: 'The free first session covers your goals, background and current knowledge, and ends with a study plan built for you.',
        topics: TOPICS_EN,
        cta: { label: 'Book your free first session', href: '#book', variant: 'ghost' },
      },
    ],
    steps: [
      { title: 'Message me', text: 'On whichever channel below suits you.' },
      { title: 'Pick a time', text: 'Mock interview or the free first session.' },
      { title: 'Leave with a plan', text: 'A written summary or a study plan.' },
    ],
    book: { id: 'book', heading: 'Book on the channel you prefer', channels: bookingChannels('Mock interview') },
    page: {
      languageSwitch: 'Lexo në shqip',
      eyebrow: 'Mentoring · 100% online',
      h1: (person) => `Java Mentor${NO_BREAK_SPACE}· ${person.countryName}`,
      lede: `Mock interviews and 1:1 Java training for students and junior developers getting ready for their first Java role. Taught from ${experienceYearsLabel('en')} years of real production work. 100% online, in Albanian or English.`,
      whoHeading: 'Who it is for',
      who: [
        'Students getting ready for their first technical interview for a Java role.',
        'Junior developers preparing for a mid-level role who want a clear written read on their strengths and gaps.',
        'Students in Albania and Kosovo: sessions are 100% online and priced in both lekë and EUR.',
      ],
      offersHeading: 'Two ways to work together',
      mockHeading: 'Java mock interview: what the session looks like',
      mockText: `The mock interview is a realistic ${MOCK_MINUTES}-minute Java and Spring Boot technical interview. It works for a first job and for a junior developer aiming at a mid-level role. After the session you get a written summary of your strengths and gaps, so you know exactly what to work on next. If you continue with ${LESSONS_FOR_CREDIT}+ lessons, the ${mockEur} is credited back.`,
      trainingHeading: 'Spring Boot training and Java lessons, 1:1',
      trainingText: [
        `Training is one to one and built around you. The first session is free: we go through your goals, background and current knowledge, and you leave with a study plan built for you. Lessons after that are ${trainingEur} per hour and cover Java, OOP, Spring Boot, SQL, Hibernate and the basics of microservices.`,
      ],
      bookHeading: 'How to book',
      mentorHeading: 'Your mentor',
      mentorText: (person) => [
        `I'm ${person.name}, a backend-focused full-stack developer from ${person.city}, ${person.countryName}, with ${experienceYearsLabel('en')} years of professional Java, Kotlin and Spring Boot work on banking, trading and SaaS products, as a contractor for companies in ${contractCountriesText('en')}. At Candidatis, besides being the sole backend engineer, I mentored a junior developer.`,
        `I hold a BSc and an MSc in Computer Science from the ${university.name} and the ${azureCertificationName} certification.`,
      ],
      quote: menteeTestimonial.pullQuote
        ? { text: menteeTestimonial.pullQuote, cite: `${menteeTestimonial.name}, ${menteeTestimonial.role}, mentored at Candidatis` }
        : undefined,
      links: {
        home: 'See my projects, experience and certifications',
        freelance: 'Hiring for a company instead? How I work as a freelance Java developer on remote B2B contracts',
      },
      faqHeading: 'Frequently asked questions',
      faq: [
        {
          q: 'How much does it cost?',
          a: `The mock interview is ${mockEur} (${mockLek}) for ${MOCK_MINUTES} minutes. 1:1 training is ${trainingEur} per hour (${trainingLek} per hour), and the first training session is free.`,
        },
        {
          q: 'Is the first session really free?',
          a: 'Yes. The first 1:1 training session is free. It covers your goals, background and current knowledge, and ends with a study plan built for you.',
        },
        {
          q: 'What happens to the mock interview fee if I continue?',
          a: `If you continue with ${LESSONS_FOR_CREDIT}+ lessons, the ${mockEur} is credited back.`,
        },
        {
          q: 'Are sessions online?',
          a: 'Yes, 100% online, in Albanian or English.',
        },
        {
          q: "I'm already a junior developer. Is this for me?",
          a: 'Yes. The mock interview also works for junior developers preparing for a mid-level role, and the written summary shows which gaps to close first.',
        },
        {
          q: 'How do I book?',
          a: 'Message me by email, LinkedIn, Superprof or WhatsApp, then pick a time for the mock interview or the free first session.',
        },
      ],
      serviceName: 'Java mentoring: mock interviews and 1:1 training',
    },
  },

  sq: {
    label: 'Mentorim',
    heading: { before: 'Intervista provë dhe ', highlight: 'trajnim Java', after: ', një me një.' },
    sub: `Për studentë dhe zhvillues junior që përgatiten për punën e parë me Java. Mësimet bazohen në ${experienceYearsLabel('sq')} vite punë reale. 100% online.`,
    homeLinks: { details: 'Formati, çmimet dhe pyetjet', albanian: 'Mentorim Java në shqip' },
    topicsLabel: 'Temat',
    offers: [
      {
        id: 'mock',
        label: `Fillo këtu · ${MOCK_MINUTES} min`,
        title: 'Intervistë pune provë',
        bullets: [
          'Një intervistë teknike realiste për Java dhe Spring Boot',
          'Edhe për zhvillues junior që përgatiten për një pozicion mid-level',
          'Pas seancës, një përmbledhje me shkrim e pikave të forta dhe të mangësive',
          `Çmimi të zbritet nëse vazhdon me ${LESSONS_FOR_CREDIT}+ mësime`,
        ],
        cta: { label: 'Rezervo intervistën provë', href: '#book', variant: 'gold' },
        featured: true,
      },
      {
        id: 'training',
        label: 'Seanca e parë falas',
        title: 'Trajnim 1:1',
        text: 'Seanca e parë falas mbulon qëllimet, përvojën dhe njohuritë e tua, dhe mbyllet me një plan studimi të ndërtuar për ty.',
        topics: TOPICS_SQ,
        cta: { label: 'Rezervo seancën e parë falas', href: '#book', variant: 'ghost' },
      },
    ],
    steps: [
      { title: 'Më shkruaj', text: 'Në kanalin që të përshtatet, më poshtë.' },
      { title: 'Zgjidh orarin', text: 'Për intervistën provë ose për seancën e parë falas.' },
      { title: 'Merr planin', text: 'Një përmbledhje me shkrim ose një plan studimi.' },
    ],
    book: { id: 'book', heading: 'Rezervo në kanalin që preferon', channels: bookingChannels('Intervistë provë') },
    page: {
      languageSwitch: 'Read in English',
      eyebrow: 'Mentorim · 100% online',
      h1: () => 'Mentor Java në Shqipëri',
      lede: `Intervista pune provë dhe trajnim 1:1 në Java dhe Spring Boot, për studentë dhe zhvillues junior në Shqipëri dhe Kosovë që po përgatiten për punën e parë me Java. Mësimet bazohen në ${experienceYearsLabel('sq')} vite përvojë profesionale si zhvillues backend. 100% online, në shqip ose në anglisht.`,
      whoHeading: 'Për kë është',
      who: [
        'Studentë që duan të jenë gati për intervistën e parë teknike për një punë me Java.',
        'Zhvillues junior që përgatiten për një pozicion mid-level dhe duan një vlerësim të qartë, me shkrim, të pikave të forta dhe të mangësive.',
        'Studentë nga Shqipëria dhe Kosova: seancat janë 100% online, me çmime në lekë dhe në euro.',
      ],
      offersHeading: 'Dy mënyra për të punuar bashkë',
      mockHeading: 'Intervistë pune Java: si zhvillohet',
      mockText: `Intervista provë është një intervistë teknike realiste për Java dhe Spring Boot, ${MOCK_MINUTES} minuta e gjatë. Vlen për punën e parë, por edhe për zhvillues junior që synojnë një pozicion mid-level. Pas seancës merr me shkrim pikat e forta dhe mangësitë e tua, që të dish saktë ku të fokusohesh. Nëse vazhdon me ${LESSONS_FOR_CREDIT} ose më shumë mësime, pagesa e intervistës (${mockLek} ose ${mockEur}) të zbritet nga mësimet.`,
      trainingHeading: 'Trajnim Spring Boot dhe Java, një me një',
      trainingText: [
        `Trajnimi bëhet një me një dhe ndërtohet rreth teje. Seanca e parë është falas: flasim për qëllimet, përvojën dhe njohuritë që ke, dhe në fund merr një plan studimi të ndërtuar vetëm për ty. Pas saj, mësimet kushtojnë ${trainingLek} (${trainingEur}) në orë dhe mbulojnë Java, OOP, Spring Boot, SQL, Hibernate dhe bazat e mikroshërbimeve.`,
        'Nëse po kërkon një kurs Java online, ky është alternativa një me një: punojmë bashkë live, sipas planit tënd, jo sipas një programi të njëjtë për të gjithë.',
      ],
      bookHeading: 'Si rezervon',
      mentorHeading: 'Kush jam',
      mentorText: (person) => [
        `Jam ${person.name}, zhvillues full-stack me fokus te backend-i, me bazë në ${person.city}. Kam ${experienceYearsLabel('sq')} vite përvojë profesionale me Java, Kotlin dhe Spring Boot, në projekte për banka, trading dhe SaaS, si kontraktor për kompani në ${contractCountriesText('sq')}. Te Candidatis, përveç punës si i vetmi inxhinier backend, kam qenë mentor i një zhvilluesi junior.`,
        `Kam diplomë Bachelor dhe Master Shkencor në Informatikë nga Universiteti i Tiranës, si dhe certifikimin ${azureCertificationName}.`,
      ],
      links: {
        home: 'Shiko projektet dhe përvojën time (në anglisht)',
        freelance: 'Për kompani: si punoj si zhvillues Java freelance (në anglisht)',
      },
      faqHeading: 'Pyetje të shpeshta',
      faq: [
        {
          q: 'Sa kushton?',
          a: `Intervista provë kushton ${mockLek} (${mockEur}) për ${MOCK_MINUTES} minuta. Trajnimi 1:1 kushton ${trainingLek} (${trainingEur}) në orë, dhe seanca e parë e trajnimit është falas.`,
        },
        {
          q: 'A është vërtet falas seanca e parë?',
          a: 'Po. Seanca e parë e trajnimit 1:1 është falas. Flasim për qëllimet, përvojën dhe njohuritë e tua, dhe në fund merr një plan studimi të ndërtuar për ty.',
        },
        {
          q: 'Jam nga Kosova. A mund të marr pjesë?',
          a: `Po. Seancat janë 100% online, në shqip ose në anglisht, dhe çmimet janë edhe në euro: ${mockEur} për intervistën provë dhe ${trainingEur} në orë për trajnimin.`,
        },
        {
          q: 'Çfarë ndodh me pagesën e intervistës nëse vazhdoj?',
          a: `Nëse vazhdon me ${LESSONS_FOR_CREDIT} ose më shumë mësime, pagesa e intervistës provë (${mockLek} ose ${mockEur}) të zbritet.`,
        },
        {
          q: 'Jam tashmë zhvillues junior. A më vlen?',
          a: 'Po. Intervista provë është edhe për zhvillues junior që përgatiten për një pozicion mid-level, dhe përmbledhja me shkrim të tregon cilat mangësi të plotësosh të parat.',
        },
        {
          q: 'Si rezervoj?',
          a: 'Më shkruaj me email, në LinkedIn, Superprof ose WhatsApp, pastaj zgjidh një orar për intervistën provë ose për seancën e parë falas.',
        },
      ],
      serviceName: 'Mentorim Java: intervista provë dhe trajnim 1:1',
    },
  },
};

/** The home page section is English. */
export const mentoring = mentoringCopy.en;
