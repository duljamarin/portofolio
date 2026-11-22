import React from 'react';
import type { FaqItem } from '../../types';
import { ui } from '../../data/ui';
import { usePage } from '../../pageContext';
import { HOME_LABEL, alternateOf, pathOf, routeById, type RouteId } from '../../seo/site';
import { Reveal } from '../fx/Reveal';
import { SplitReveal } from '../fx/SplitReveal';

export const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

/** Home > Page. Mirrors the BreadcrumbList JSON-LD. */
const Breadcrumbs: React.FC<{ routeId: RouteId }> = ({ routeId }) => {
  const { lang } = usePage();
  return (
    <nav className="breadcrumbs" aria-label={ui[lang].breadcrumb}>
      <ol>
        <li>
          <a href={pathOf('home')}>{HOME_LABEL[lang]}</a>
        </li>
        <li aria-current="page">{routeById(routeId).label}</li>
      </ol>
    </nav>
  );
};

/** Link to the same page in the other language. */
const LanguageSwitch: React.FC<{ routeId: RouteId; label: string }> = ({ routeId, label }) => {
  const other = alternateOf(routeById(routeId));
  if (!other) return null;
  return (
    <a href={other.path} className="lang-switch" hrefLang={other.lang} lang={other.lang}>
      {label}
    </a>
  );
};

type PageHeroProps = {
  routeId: RouteId;
  eyebrow: string;
  title: string;
  lede: React.ReactNode;
  languageSwitch?: string;
  children?: React.ReactNode;
};

/** Top of every inner page: breadcrumbs, language switch, the page's one h1 and its intro. */
export const PageHero: React.FC<PageHeroProps> = ({ routeId, eyebrow, title, lede, languageSwitch, children }) => (
  <header className="page-hero">
    <div className="page-hero-glow" aria-hidden="true" />
    <div className="page-inner">
      <div className="page-hero-bar">
        <Breadcrumbs routeId={routeId} />
        {languageSwitch && <LanguageSwitch routeId={routeId} label={languageSwitch} />}
      </div>
      <p className="section-label">{eyebrow}</p>
      <SplitReveal as="h1" className="page-title" text={title} stagger={0.05} />
      <p className="page-lede">{lede}</p>
      {children}
    </div>
  </header>
);

type PageSectionProps = {
  id?: string;
  title: string;
  className?: string;
  children: React.ReactNode;
};

/** A titled section of an inner page; the title is an h2. */
export const PageSection: React.FC<PageSectionProps> = ({ id, title, className, children }) => (
  <section id={id} className={`page-section${className ? ` ${className}` : ''}`}>
    <div className="page-inner">
      <Reveal as="header" className="section-header page-section-header" y={16}>
        <SplitReveal className="section-title" text={title} />
      </Reveal>
      {children}
    </div>
  </section>
);

/**
 * FAQ, always expanded (no hidden answers). The FAQPage JSON-LD is built from
 * the same items, and scripts/seo-check.mjs verifies both texts match.
 */
export const FaqList: React.FC<{ items: FaqItem[] }> = ({ items }) => (
  <div className="faq-list">
    {items.map((item) => (
      <Reveal key={item.q} className="faq-item" data-faq-item="" y={12}>
        <h3 className="faq-question" data-faq-question="">{item.q}</h3>
        <p className="faq-answer" data-faq-answer="">{item.a}</p>
      </Reveal>
    ))}
  </div>
);

type CrossLink = { href: string; label: string; hrefLang?: string };

/** Descriptive links to the other pages. */
export const CrossLinks: React.FC<{ links: CrossLink[] }> = ({ links }) => (
  <ul className="page-links">
    {links.map((link) => (
      <li key={link.href}>
        <a href={link.href} className="text-link" hrefLang={link.hrefLang}>
          {link.label}
          <ArrowIcon />
        </a>
      </li>
    ))}
  </ul>
);
