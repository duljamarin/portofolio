import React from 'react';
import { services, type ServiceOffer } from '../data/services';
import { pathOf } from '../seo/site';
import { LockIn, SparkBurst } from './fx/LockIn';
import { Reveal } from './fx/Reveal';
import { SplitReveal } from './fx/SplitReveal';

/* Stroke icons. Every shape has pathLength=1 so CSS can draw it in with
   stroke-dasharray: 1 and stroke-dashoffset 1 -> 0 on reveal. */
const ServerIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="3" width="18" height="7" rx="1.5" pathLength={1} />
    <rect x="3" y="14" width="18" height="7" rx="1.5" pathLength={1} />
    <line x1="7" y1="6.5" x2="7.01" y2="6.5" pathLength={1} />
    <line x1="7" y1="17.5" x2="7.01" y2="17.5" pathLength={1} />
    <line x1="11" y1="6.5" x2="17" y2="6.5" pathLength={1} />
    <line x1="11" y1="17.5" x2="17" y2="17.5" pathLength={1} />
  </svg>
);

const LayersIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <polygon points="12 2 2 7 12 12 22 7 12 2" pathLength={1} />
    <polyline points="2 12 12 17 22 12" pathLength={1} />
    <polyline points="2 17 12 22 22 17" pathLength={1} />
  </svg>
);

const RocketIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" pathLength={1} />
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" pathLength={1} />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" pathLength={1} />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" pathLength={1} />
  </svg>
);

const ICONS: Record<ServiceOffer['id'], React.FC> = {
  backend: ServerIcon,
  fullstack: LayersIcon,
  saas: RocketIcon,
};

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

/** Pointer position as CSS vars; the spotlight and gold border read them. */
const trackPointer = (e: React.PointerEvent<HTMLElement>) => {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
  el.style.setProperty('--my', `${e.clientY - rect.top}px`);
};

/** The three service cards. Used by the home Offer section and the freelance page. */
export const OfferGrid: React.FC = () => (
  <div className="offer-grid">
    {services.map((service, idx) => {
      const Icon = ICONS[service.id];
      return (
        // LockIn flips the card in; on lock the icon draws itself and sparks fly.
        <LockIn key={service.id} className="offer-lockin fx-ring" index={idx} intensity={0.8}>
          <article className="offer-card" onPointerMove={trackPointer}>
            <span className="offer-icon">
              <Icon />
              <SparkBurst className="offer-burst" scale={0.6} />
            </span>
            <h3 className="offer-card-title">{service.title}</h3>
            <p className="offer-card-desc">{service.desc}</p>
          </article>
        </LockIn>
      );
    })}
  </div>
);

const Offer: React.FC = () => {
  return (
    <section id="offer" className="offer-section">
      <Reveal as="header" className="section-header" y={16}>
        <p className="section-label">What I offer</p>
        <SplitReveal className="section-title" text="Ways I can help your team or product ship." />
      </Reveal>

      <OfferGrid />

      <p className="section-more-links">
        <a href={pathOf('freelance')} className="text-link">
          How remote B2B contracting with me works
          <ArrowIcon />
        </a>
      </p>
    </section>
  );
};

export default Offer;
