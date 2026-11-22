// /freelance-java-developer-albania/: page copy. Numbers, countries, company
// names and the email address are read from the other data files.

import type { FaqItem, Identity } from '../types';
import { contact } from './contact';
import { azureCertificationName } from './education';
import { companyName, contractCountriesText, contractRoles, experienceYearsLabel } from './experience';
import { NO_BREAK_SPACE, joinList } from './lang';

const years = experienceYearsLabel('en');
/** "ADUS Technologies s.r.o (Slovakia), Noema Consulting (Qatar) and Candidatis GmbH (Austria)". */
const contractsWithCountries = joinList(
  contractRoles.map((role) => `${companyName(role)} (${role.country})`),
  'en'
);
const contractCompanies = joinList(contractRoles.map(companyName), 'en');

export const freelance = {
  eyebrow: 'Remote B2B contracts · CET',
  // No-break space: the dot stays at the end of the first line when the title wraps.
  h1: (person: Identity) => `Freelance Java Developer${NO_BREAK_SPACE}· ${person.countryName}`,
  lede: (person: Identity) =>
    `I'm ${person.name}, a backend-focused full-stack developer in ${person.city}, ${person.countryName}. For ${years} years I have shipped Java, Kotlin and Spring Boot systems for banking, trading and SaaS products, most recently as a remote contractor for companies in ${contractCountriesText('en')}.`,

  servicesHeading: 'What I build for companies',
  servicesIntro:
    'Most of my contract work is backend-heavy: APIs, event-driven services and the data layer behind them. When a product needs it, I own the React frontend too.',

  domainsHeading: 'Fintech and banking work',
  domains: [
    {
      title: 'Enterprise banking',
      text: 'At Noema Consulting I worked in a 10+ person Agile team on a 240+ microservice banking platform: REST and GraphQL APIs in Kotlin and Spring Boot, event-driven integrations with Kafka, and 50+ OpenFGA authorization tests.',
    },
    {
      title: 'Real-time trading alerts',
      text: 'For ADUS Technologies I engineered the signal-detection and alerting pipeline behind xBratAI, which delivers sub-second alerts to 10,000+ day traders, and launched Stripe subscription billing.',
    },
    {
      title: 'SaaS and billing',
      text: 'I designed, built and run a personal finance SaaS on my own: Supabase and PostgreSQL with 28 Row-Level Security policies, and the full Paddle billing lifecycle.',
    },
  ],

  stackHeading: 'Stack and certifications',
  stackIntro: 'Java and Kotlin on Spring Boot are my default for services, on monoliths and on microservice architectures.',
  certificationsLabel: 'Certifications',

  termsHeading: 'Hiring a contractor in Albania: how it works',
  terms: [
    { term: 'Contract', text: `Independent contractor. My last three engagements (${contractCompanies}) were remote contracts.` },
    { term: 'Time zone', text: 'Central European Time (CET, UTC+1; CEST, UTC+2 in summer), the same time zone as most EU teams.' },
    { term: 'Ownership', text: 'I own features end to end: requirements analysis, API design, testing and deployment.' },
    { term: 'Team fit', text: 'Comfortable in a 10+ person Agile team and as the sole backend engineer on a platform.' },
    { term: 'Language', text: 'I work in English (proficient).' },
  ],

  projectsHeading: 'Selected projects',

  faqHeading: 'Questions companies ask',
  faq: [
    {
      q: 'Do you work as a B2B contractor?',
      a: `Yes. ${contact.statement.replace(/^Available/, 'I am available')} My last three engagements, with ${contractsWithCountries}, were remote contracts.`,
    },
    {
      q: 'Which time zone do you work in?',
      a: 'Central European Time. I am based in Elbasan, Albania (CET, UTC+1, and CEST, UTC+2, in summer), the same time zone as most EU teams.',
    },
    {
      q: 'Do you have fintech or banking experience?',
      a: 'Yes. I built APIs on a 240+ microservice enterprise banking platform at Noema Consulting, the real-time alerting pipeline behind xBratAI for 10,000+ day traders at ADUS Technologies, and a personal finance SaaS with Paddle billing.',
    },
    {
      q: 'What is your stack?',
      a: `Java, Kotlin and Spring Boot for services, Kafka and RabbitMQ for messaging, PostgreSQL and MongoDB for data, React and TypeScript on the frontend, and Docker and Azure for deployment. I am a ${azureCertificationName}.`,
    },
    {
      q: 'Which languages do you work in?',
      a: 'English, at a proficient level, and Albanian. I also speak Italian at a conversational level.',
    },
    {
      q: 'How do we start?',
      a: `Email me at ${contact.email} or message me on WhatsApp with a short description of the project and the team.`,
    },
  ] satisfies FaqItem[],

  links: {
    mentoring: 'Looking for Java mentoring instead? Mock interviews and 1:1 training',
    home: 'My projects, experience and certifications',
  },
};
