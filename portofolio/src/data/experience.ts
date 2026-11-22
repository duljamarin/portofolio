// Work history, newest first. `start`/`end` are 'YYYY-MM'; `end: null` means current.
// Duration, date labels, and tenure-bar scale are all computed from these two fields:
// do not add a redundant year/period field here.
// `country` is where the company is based (from the CV), used for "companies in ...".

import { joinList, COUNTRY_SQ, type Lang } from './lang';

export type Role = {
  start: string;
  end: string | null;
  role: string;
  company: string;
  country: string;
  stack: string[];
  summary: string;
};

export const roles: Role[] = [
  {
    start: '2025-12',
    end: null,
    role: 'Full-Stack Developer, Self-Employed',
    company: 'Independent · Elbasan, Albania',
    country: 'Albania',
    stack: ['React 19', 'Vite', 'Supabase', 'PostgreSQL'],
    summary: 'Sole architect and engineer of a production subscription SaaS: 100+ component React frontend on Supabase (PostgreSQL, Auth, Edge Functions), a 15-table schema across 52 versioned migrations, 28 Row-Level Security policies, and 16 Postgres triggers enforcing plan limits and data integrity. Built the full Paddle billing lifecycle and ran a structured market-validation process (98 prospect conversations, 36 priced offers) before concluding there was no willingness to pay and halting further investment. The product remains live.',
  },
  {
    start: '2025-04',
    end: '2025-11',
    role: 'Backend Software Engineer (Contractor)',
    company: 'ADUS Technologies s.r.o · Remote (Slovakia)',
    country: 'Slovakia',
    stack: ['Java', 'Spring Boot', 'RabbitMQ', 'WebSockets'],
    summary: 'Engineered the real-time signal-detection and alerting pipeline for xBratAI, an AI-driven alerts platform delivering sub-second alerts to 10,000+ day traders across crypto, forex, and futures. Launched Stripe subscription billing, community chat, and push notifications via OneSignal. Delivered 70+ end-to-end tasks in 7 months while cutting post-deployment regressions by 40% through targeted integration test coverage.',
  },
  {
    start: '2024-08',
    end: '2025-03',
    role: 'Backend Software Engineer (Contractor)',
    company: 'Noema Consulting · Remote (Qatar)',
    country: 'Qatar',
    stack: ['Kotlin', 'Spring Boot', 'Kafka', 'GraphQL'],
    summary: 'Designed and evolved REST and GraphQL APIs in Kotlin and Spring Boot within a 240+ microservice enterprise banking platform, working in a 10+ person Agile team. Strengthened access-control reliability with 50+ OpenFGA authorization tests, built event-driven integrations with Apache Kafka on Spring Boot 3, and shipped 80+ tickets across 10+ services. Earned the Microsoft Certified: Azure Developer Associate (AZ-204) certification during the engagement.',
  },
  {
    start: '2023-05',
    end: '2023-12',
    role: 'Backend Java Developer (Contractor)',
    company: 'Candidatis GmbH · Remote (Austria)',
    country: 'Austria',
    stack: ['Java', 'Spring Boot', 'REST', 'GraphQL'],
    summary: 'Sole backend engineer for a job-advertisement platform serving Austria and Germany, owning REST/GraphQL integration with third-party services and mentoring a junior developer. Cut the Spring Boot web crawler\'s runtime by 30%, materially improving the freshness of job-listing data across the platform.',
  },
  {
    start: '2022-11',
    end: '2023-05',
    role: 'Java Developer',
    company: 'Sabanet Albania · Remote (Durrës)',
    country: 'Albania',
    stack: ['Java', 'Spring Cloud', 'SQL'],
    summary: 'Upgraded microservices, integrated external APIs, and completed advanced SQL training.',
  },
  {
    start: '2021-07',
    end: '2022-10',
    role: 'Java Fullstack Developer',
    company: 'Comdata Group · Remote (Italy)',
    country: 'Italy',
    stack: ['Java', 'Spring', 'SQL'],
    summary: 'Delivered 50+ frontend and backend tasks, growing from junior to independent contributor within the first year.',
  },
];

/* ============================================
   DERIVED FACTS (never type these numbers or lists in copy)
   ============================================ */
const monthIndex = (yearMonth: string) => {
  const [year, month] = yearMonth.split('-').map(Number);
  return year * 12 + (month - 1);
};

/** Months of professional work up to the build month. Overlapping roles count once, end months included. */
export function experienceMonths(asOf: string = __BUILD_DATE__.slice(0, 7)): number {
  const covered = new Set<number>();
  for (const role of roles) {
    const last = monthIndex(role.end ?? asOf);
    for (let month = monthIndex(role.start); month <= last; month++) covered.add(month);
  }
  return covered.size;
}

/** Whole half-years of experience, rounded down: "4.5+" (English) or "4,5+" (Albanian). */
export function experienceYearsLabel(lang: Lang = 'en'): string {
  const years = Math.floor(experienceMonths() / 6) / 2;
  const text = Number.isInteger(years) ? String(years) : years.toFixed(1);
  return `${lang === 'sq' ? text.replace('.', ',') : text}+`;
}

/** Company name without its location suffix: "Noema Consulting". */
export const companyName = (role: Role) => role.company.split(' · ')[0];

/** Contractor engagements, newest first. */
export const contractRoles = roles.filter((role) => role.role.includes('(Contractor)'));

const unique = (items: string[]) => [...new Set(items)];
const localizeCountry = (country: string, lang: Lang) => (lang === 'sq' ? COUNTRY_SQ[country] ?? country : country);

/** "Slovakia, Qatar and Austria": where the companies I contracted for are based. */
export const contractCountriesText = (lang: Lang) =>
  joinList(unique(contractRoles.map((role) => localizeCountry(role.country, lang))), lang);

/** Countries of the companies I worked for from abroad, newest first. */
export const foreignCountriesText = (homeCountry: string, lang: Lang) =>
  joinList(
    unique(roles.map((role) => role.country).filter((country) => country !== homeCountry)).map((country) =>
      localizeCountry(country, lang)
    ),
    lang
  );
