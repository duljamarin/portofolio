import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { DUR_REVEAL, EASE_OUT, REVEAL_STAGGER } from '../animations';

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

const offers = [
  {
    title: 'Backend & API development',
    desc: 'Java, Kotlin, and Spring Boot systems built for scale: REST/GraphQL APIs, event-driven pipelines with Kafka and RabbitMQ, and microservice architectures that hold up under real production traffic.',
    icon: ServerIcon,
  },
  {
    title: 'Full-stack product delivery',
    desc: 'End-to-end ownership from database schema to polished React frontend. I ship features, not just backend endpoints - comfortable owning a product across the whole stack.',
    icon: LayersIcon,
  },
  {
    title: 'Solo SaaS builds',
    desc: 'From idea to production: auth, billing, data modeling, and deployment. I have taken a subscription SaaS from system design through Paddle billing integration to a live product, solo.',
    icon: RocketIcon,
  },
];

/** Pointer position as CSS vars; the spotlight and gold border read them. */
const trackPointer = (e: React.PointerEvent<HTMLElement>) => {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
  el.style.setProperty('--my', `${e.clientY - rect.top}px`);
};

const Offer: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const revealed = useInView(gridRef, { once: true, margin: '-60px' });

  return (
    <section id="offer" className="offer-section">
      <motion.header
        className="section-header"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: DUR_REVEAL, ease: EASE_OUT }}
      >
        <p className="section-label">What I offer</p>
        <h2 className="section-title">Ways I can help your team or product ship.</h2>
      </motion.header>

      <div className="offer-grid" ref={gridRef} data-revealed={revealed || undefined}>
        {offers.map((o, idx) => {
          const Icon = o.icon;
          return (
            <motion.article
              className="offer-card"
              key={o.title}
              onPointerMove={trackPointer}
              initial={{ opacity: 0, y: 24 }}
              animate={revealed ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: DUR_REVEAL, delay: idx * REVEAL_STAGGER, ease: EASE_OUT }}
              style={{ '--i': idx } as React.CSSProperties}
            >
              <span className="offer-icon">
                <Icon />
              </span>
              <h3 className="offer-card-title">{o.title}</h3>
              <p className="offer-card-desc">{o.desc}</p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
};

export default Offer;
