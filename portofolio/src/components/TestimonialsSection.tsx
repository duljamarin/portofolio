import React from 'react';
import { motion } from 'framer-motion';
import { testimonials } from '../data/testimonials';
import { LockIn, SparkBurst } from './fx/LockIn';
import { Reveal } from './fx/Reveal';
import { SplitReveal } from './fx/SplitReveal';

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

/** Wraps the highlight phrase in <mark>; its gold underline draws in on lock. */
const withHighlight = (paragraph: string, phrase: string) => {
  const at = paragraph.indexOf(phrase);
  if (at < 0) return paragraph;
  return (
    <>
      {paragraph.slice(0, at)}
      <mark className="testimonial-highlight">{phrase}</mark>
      {paragraph.slice(at + phrase.length)}
    </>
  );
};

const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="testimonials-section">
      <Reveal className="section-header" y={28}>
        <SplitReveal
          className="section-title"
          text={[{ text: 'Words of ' }, { text: 'Appreciation', className: 'accent' }]}
        />
        <p className="section-subtitle">Reflections from peers and mentors I've worked with.</p>
      </Reveal>

      <div className="testimonials-grid">
        {testimonials.map((t, idx) => (
          <LockIn as="article" className="testimonial-card fx-ring" key={t.name} index={idx}>
            {({ locked }) => (
              <>
                <span className="testimonial-quote" aria-hidden="true">&ldquo;</span>
                <div className="testimonial-stars" role="img" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.span
                      key={i}
                      className="testimonial-star"
                      initial={false}
                      animate={locked ? { scale: [0.4, 1.5, 1], rotate: [-30, 12, 0] } : { scale: 1, rotate: 0 }}
                      transition={{ duration: 0.55, delay: 0.08 * i, ease: 'easeOut' }}
                    >
                      <StarIcon />
                    </motion.span>
                  ))}
                  <SparkBurst className="testimonial-burst" scale={0.8} />
                </div>

                <div className="testimonial-text">
                  {t.text.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx}>{withHighlight(paragraph, t.highlight)}</p>
                  ))}
                </div>

                <div className="testimonial-author">
                  <span className="testimonial-avatar" aria-hidden="true">
                    {t.name.split(' ').map((part) => part[0]).join('')}
                  </span>
                  <span className="testimonial-name">{t.name}</span>
                  <span className="testimonial-role">{t.role}</span>
                  <span className="testimonial-date">{t.date}</span>
                </div>
              </>
            )}
          </LockIn>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
