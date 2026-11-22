// JSON-LD for every page, built from site.ts and the data files. One object per
// <script> (each with @context and @type); nodes reference each other by @id.
// No Review or AggregateRating: self-serving reviews are not eligible for rich
// results and risk a manual action.

import type { FaqItem } from '../types';
import { azureCertification, university } from '../data/education';
import { freelance } from '../data/freelance';
import { workLanguages } from '../data/languages';
import { mentoringCopy, mentoringPrices, type PriceId } from '../data/mentoring';
import { services } from '../data/services';
import { skillNames } from '../data/skills';
import {
  HOME_LABEL,
  MENTORING_AREAS,
  OG_IMAGE,
  PERSON,
  ROUTES,
  SERVICE_AREAS,
  SITE_URL,
  canonical,
  description,
  routeById,
  type Route,
} from './site';

type JsonLd = Record<string, unknown>;

const CONTEXT = 'https://schema.org';
const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

function person(): JsonLd {
  return {
    '@context': CONTEXT,
    '@type': 'Person',
    '@id': PERSON_ID,
    name: PERSON.name,
    jobTitle: PERSON.jobTitle,
    url: `${SITE_URL}/`,
    image: `${SITE_URL}${OG_IMAGE.path}`,
    email: `mailto:${PERSON.email}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: PERSON.city,
      addressCountry: PERSON.countryCode,
    },
    sameAs: [PERSON.linkedin, PERSON.github],
    knowsAbout: skillNames,
    knowsLanguage: workLanguages.map((language) => ({ '@type': 'Language', name: language.name, alternateName: language.code })),
    alumniOf: { '@type': 'CollegeOrUniversity', name: university.name, url: university.url },
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      name: azureCertification.title,
      credentialCategory: 'certification',
      recognizedBy: { '@type': 'Organization', name: azureCertification.issuer },
      ...(azureCertification.verifyUrl ? { url: azureCertification.verifyUrl } : {}),
    },
  };
}

function website(): JsonLd {
  return {
    '@context': CONTEXT,
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: PERSON.name,
    inLanguage: [...new Set(ROUTES.map((route) => route.lang))],
    publisher: { '@id': PERSON_ID },
  };
}

function breadcrumbs(route: Route): JsonLd {
  const home = routeById('home');
  return {
    '@context': CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: HOME_LABEL[route.lang], item: canonical(home) },
      { '@type': 'ListItem', position: 2, name: route.label, item: canonical(route) },
    ],
  };
}

function faqPage(items: FaqItem[]): JsonLd {
  return {
    '@context': CONTEXT,
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

function freelanceService(route: Route): JsonLd {
  return {
    '@context': CONTEXT,
    '@type': 'Service',
    '@id': `${canonical(route)}#service`,
    name: freelance.servicesHeading,
    description: description(route),
    url: canonical(route),
    serviceType: services.map((service) => service.title),
    provider: { '@id': PERSON_ID },
    areaServed: [
      ...SERVICE_AREAS.continents.map((name) => ({ '@type': 'Continent', name })),
      ...SERVICE_AREAS.countries.map((name) => ({ '@type': 'Country', name })),
    ],
  };
}

/** One price as a schema.org price specification; hourly prices carry unitCode HUR. */
function priceSpecification(id: PriceId, which: 'main' | 'local'): JsonLd {
  const price = mentoringPrices[id];
  return {
    '@type': 'UnitPriceSpecification',
    price: price[which].amount,
    priceCurrency: price[which].currency,
    ...(price.perHour ? { unitCode: 'HUR', unitText: 'hour' } : {}),
  };
}

function mentoringService(route: Route): JsonLd {
  const copy = mentoringCopy[route.lang];
  return {
    '@context': CONTEXT,
    '@type': 'Service',
    '@id': `${canonical(route)}#service`,
    name: copy.page.serviceName,
    description: description(route),
    url: canonical(route),
    serviceType: copy.offers.map((offer) => offer.title),
    provider: { '@id': PERSON_ID },
    areaServed: MENTORING_AREAS.map((name) => ({ '@type': 'Country', name })),
    offers: copy.offers.map((offer) => ({
      '@type': 'Offer',
      name: offer.title,
      url: `${canonical(route)}#${copy.book.id}`,
      price: mentoringPrices[offer.id].main.amount,
      priceCurrency: mentoringPrices[offer.id].main.currency,
      priceSpecification: [priceSpecification(offer.id, 'main'), priceSpecification(offer.id, 'local')],
    })),
  };
}

/** Every JSON-LD block for a route, in output order. */
export function structuredData(route: Route): JsonLd[] {
  const blocks: JsonLd[] = [person(), website()];
  if (route.id !== 'home') blocks.push(breadcrumbs(route));
  if (route.id === 'freelance') blocks.push(freelanceService(route), faqPage(freelance.faq));
  if (route.id === 'mentoring' || route.id === 'mentoringSq') {
    blocks.push(mentoringService(route), faqPage(mentoringCopy[route.lang].page.faq));
  }
  return blocks;
}
