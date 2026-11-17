import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import type { IconType } from 'react-icons';
import { FaEnvelope, FaGraduationCap, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { mentoring, type Offer } from '../data/mentoring';
import { DUR_REVEAL, EASE_OUT, REVEAL_STAGGER } from '../animations';
import { useInViewAttr } from '../hooks/useInViewAttr';
import { LockIn, SparkBurst } from './fx/LockIn';
import { SplitReveal } from './fx/SplitReveal';

const CHANNEL_ICON: Record<string, IconType> = {
  Email: FaEnvelope,
  LinkedIn: FaLinkedin,
  Superprof: FaGraduationCap,
  WhatsApp: FaWhatsapp,
};

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const reveal = (order: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: DUR_REVEAL, delay: order * REVEAL_STAGGER, ease: EASE_OUT },
});

const OfferCard: React.FC<{ offer: Offer; order: number }> = ({ offer, order }) => (
  <LockIn className="mentor-lockin fx-ring" index={order}>
    {({ locked }) => (
      <article className="mentor-card" data-featured={offer.featured || undefined}>
        <div className="mentor-card-inner">
          <p className="card-label">{offer.label}</p>
          <h3 className="mentor-card-title">{offer.title}</h3>
          <p className="mentor-price">
            <motion.span
              className="mentor-price-main"
              initial={false}
              animate={locked ? { scale: [0.6, 1.18, 1] } : { scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              {offer.price.main}
              {offer.featured && <SparkBurst className="mentor-burst" />}
            </motion.span>
            <span className="mentor-price-local">{offer.price.local}</span>
          </p>

          {offer.bullets && (
            <ul className="mentor-bullets">
              {offer.bullets.map((b) => (
                <li key={b}>
                  <CheckIcon />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}

          {offer.text && <p className="mentor-text">{offer.text}</p>}

          {offer.topics && (
            <ul className="mentor-topics" aria-label="Topics">
              {offer.topics.map((t) => (
                <li key={t.name} className="mentor-topic" data-highlight={t.highlight || undefined}>
                  {t.name}
                </li>
              ))}
            </ul>
          )}

          <a
            href={offer.cta.href}
            className={offer.cta.variant === 'gold' ? 'btn-primary mentor-cta' : 'btn-ghost mentor-cta'}
          >
            {offer.cta.label}
          </a>
        </div>
      </article>
    )}
  </LockIn>
);

const Mentoring: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useInViewAttr(sectionRef);
  const { heading, offers, steps, book } = mentoring;

  return (
    <section id="mentoring" className="mentoring-section" ref={sectionRef}>
      <div className="mentoring-glow" aria-hidden="true" />

      <motion.header className="section-header" {...reveal(0)}>
        <p className="section-label">{mentoring.label}</p>
        <SplitReveal
          className="section-title"
          text={[
            { text: heading.before },
            { text: heading.highlight, className: 'mentor-highlight' },
            { text: heading.after },
          ]}
        />
        <p className="section-subtitle">{mentoring.sub}</p>
      </motion.header>

      <div className="mentor-grid">
        {offers.map((offer, i) => (
          <OfferCard key={offer.id} offer={offer} order={i} />
        ))}
      </div>

      <ol className="mentor-steps">
        {steps.map((step, i) => (
          <LockIn as="li" key={step.title} className="mentor-step" index={i} intensity={0.5}>
            <span className="mentor-step-num" aria-hidden="true">{i + 1}</span>
            <div>
              <h3 className="mentor-step-title">{step.title}</h3>
              <p className="mentor-step-text">{step.text}</p>
            </div>
          </LockIn>
        ))}
      </ol>

      <LockIn className="mentor-book-lockin fx-ring" intensity={0.5}>
        <div id={book.id} className="mentor-book">
          <h3 className="mentor-book-heading">{book.heading}</h3>
          <div className="mentor-channels">
            {book.channels.map((ch) => {
              const Icon = CHANNEL_ICON[ch.name];
              return (
                <a
                  key={ch.name}
                  href={ch.href}
                  className="mentor-channel"
                  {...(ch.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {Icon && <Icon aria-hidden="true" />}
                  {ch.name}
                </a>
              );
            })}
          </div>
        </div>
      </LockIn>
    </section>
  );
};

export default Mentoring;
