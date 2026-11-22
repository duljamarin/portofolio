// SEO SOURCE OF TRUTH. Titles, descriptions, canonicals, hreflang, the sitemap,
// robots.txt, JSON-LD and nav links are all computed from this file. Facts about
// the person are read from src/data, never retyped here. Change SITE_URL, a
// keyword or a route here and a rebuild updates every derived value.

import { contact, profiles } from '../data/contact';
import { roles } from '../data/experience';
import type { Lang } from '../data/lang';
import { formatMoney, mentoringPrices } from '../data/mentoring';

export const SITE_URL = 'https://marindulja.com'; // no trailing slash

export const PERSON = {
  name: 'Marin Dulja',
  city: 'Elbasan',
  countryCode: 'AL',
  countryName: 'Albania',
  email: contact.email,
  whatsapp: contact.whatsapp.href,
  linkedin: profiles.linkedin,
  github: profiles.github,
  /** Current role without the employment type: "Full-Stack Developer". */
  jobTitle: roles[0].role.split(',')[0],
};

export const TITLE_SUFFIX = ` | ${PERSON.name}`;
export const LIMITS = { titleMax: 60, descMin: 120, descMax: 160, minBodyTextChars: 1500 };

/** Social preview image (also the Person image in JSON-LD). */
export const OG_IMAGE = { path: '/og-image.jpg', width: 1200, height: 630, alt: `Portrait of ${PERSON.name}` };

/** Where the freelance service is offered (JSON-LD areaServed). */
export const SERVICE_AREAS = { continents: ['Europe'], countries: ['United States'] };
/** Where the mentoring students are (JSON-LD areaServed). */
export const MENTORING_AREAS = ['Albania', 'Kosovo'];

export const OG_LOCALE: Record<Lang, string> = { en: 'en_US', sq: 'sq_AL' };
/** First breadcrumb, in the page language. */
export const HOME_LABEL: Record<Lang, string> = { en: 'Home', sq: 'Kreu' };

const mock = mentoringPrices.mock;
const training = mentoringPrices.training;

type RouteConfig = {
  id: string;
  path: `/${string}`;
  lang: Lang;
  /** Short page name: nav, breadcrumbs, 404 links. */
  label: string;
  primary: string;
  secondary: readonly string[];
  intent: string;
  /** Middle part of the title; dropped first when the title is too long. */
  titleHook: string;
  description: string;
  /** Path of the same page in the other language (hreflang pair). */
  alternate?: string;
};

// One page owns each keyword. A keyword appears as `primary` on exactly one route.
export const ROUTES = [
  {
    id: 'home',
    path: '/',
    lang: 'en',
    label: 'Home',
    primary: 'Java Developer Albania',
    secondary: ['Full-Stack Developer Albania', 'Software Developer Albania'],
    intent: 'client looking for an experienced Java / Spring Boot / React engineer',
    titleHook: 'Spring Boot & React',
    description: `Java and full-stack developer in ${PERSON.city}, ${PERSON.countryName}. Spring Boot backends for fintech and banking, React frontends, remote B2B contracts and 1:1 Java mentoring.`,
  },
  {
    id: 'freelance',
    path: '/freelance-java-developer-albania/',
    lang: 'en',
    label: 'Freelance Java Developer',
    primary: 'Freelance Java Developer Albania',
    secondary: ['Java Developers Albania', 'Freelancers Albania', 'Contractor Albania', 'Software Developers Albania'],
    intent: 'EU/US company hiring a remote B2B contractor from Albania',
    titleHook: 'Remote B2B',
    description: `Hire a freelance Java developer from ${PERSON.countryName} as a remote B2B contractor. Spring Boot, Kafka and React for fintech and banking teams in Europe and the US.`,
  },
  {
    id: 'mentoring',
    path: '/mentoring/',
    lang: 'en',
    label: 'Java Mentoring',
    primary: 'Java Mentor Albania',
    secondary: ['Programming Mentor Albania', 'Java mock interview', 'Spring Boot training'],
    intent: 'student or junior developer looking for 1:1 Java mentoring',
    titleHook: 'Interview Prep & Lessons',
    description: `Java mentor in ${PERSON.countryName}: realistic mock interviews for ${formatMoney(mock.main)} and 1:1 Spring Boot training at ${formatMoney(training.main)} per hour. First training session free, 100% online.`,
    alternate: '/sq/mentorim-java/',
  },
  {
    id: 'mentoringSq',
    path: '/sq/mentorim-java/',
    lang: 'sq',
    label: 'Mentorim Java',
    primary: 'Mentor Java në Shqipëri',
    secondary: ['kurs Java online', 'trajnim Spring Boot', 'intervistë pune Java'],
    intent: 'Albanian or Kosovo student searching in Albanian',
    titleHook: 'Intervista dhe kurs',
    description: `Mentor Java në Shqipëri për studentë dhe zhvillues junior: intervistë provë me ${formatMoney(mock.local)} dhe trajnim 1:1 në Java e Spring Boot, me seancën e parë falas.`,
    alternate: '/mentoring/',
  },
] as const satisfies readonly RouteConfig[];

export type Route = (typeof ROUTES)[number] & RouteConfig;
export type RouteId = Route['id'];

/* ============================================
   DERIVED VALUES
   ============================================ */
export const routeById = (id: RouteId): Route => ROUTES.find((route) => route.id === id) as Route;
export const pathOf = (id: RouteId) => routeById(id).path;

/** Absolute, self-referencing URL of a route. */
export const canonical = (route: Route) => `${SITE_URL}${route.path}`;

/** primary | hook | name, trimmed to LIMITS.titleMax: the hook goes first, the primary keyword never. */
export function title(route: Route): string {
  const candidates = [`${route.primary} | ${route.titleHook}${TITLE_SUFFIX}`, `${route.primary}${TITLE_SUFFIX}`, route.primary];
  const fit = candidates.find((candidate) => candidate.length <= LIMITS.titleMax);
  if (!fit) throw new Error(`Primary keyword "${route.primary}" is longer than ${LIMITS.titleMax} characters`);
  return fit;
}

export const description = (route: Route) => route.description;

/** The other-language version of a route, if it has one. */
export function alternateOf(route: Route): Route | undefined {
  if (!('alternate' in route)) return undefined;
  return ROUTES.find((candidate) => candidate.path === route.alternate) as Route | undefined;
}

/** hreflang links: the route, its alternate, and x-default on the English one. Empty without an alternate. */
export function hreflangLinks(route: Route): { hreflang: string; href: string }[] {
  const other = alternateOf(route);
  if (!other) return [];
  const pair = [route, other].sort((a, b) => a.lang.localeCompare(b.lang));
  const english = pair.find((candidate) => candidate.lang === 'en') ?? route;
  return [
    ...pair.map((candidate) => ({ hreflang: candidate.lang, href: canonical(candidate) })),
    { hreflang: 'x-default', href: canonical(english) },
  ];
}

/** Route for a browser pathname; "/mentoring", "/mentoring/" and "/mentoring/index.html" all match. */
export function findRoute(pathname: string): Route | undefined {
  let path = decodeURI(pathname).replace(/index\.html$/, '');
  if (!path.endsWith('/')) path += '/';
  return ROUTES.find((route) => route.path === path) as Route | undefined;
}

/** 404 page head values. */
export const NOT_FOUND = { title: `Page not found${TITLE_SUFFIX}`, lang: 'en' as Lang };

/** Web app manifest name and description. */
export const MANIFEST = {
  name: `${PERSON.name}, ${PERSON.jobTitle}`,
  shortName: PERSON.name,
  description: ROUTES[0].description,
};
