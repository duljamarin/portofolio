import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Jonas Figu',
    role: 'Software Developer',
    date: 'June 28, 2025',
    text: `I had the privilege of working alongside Marin Dulja at Candidatis, where he worked as a Java Developer and my mentor. From day one, Marin stood out not only for his deep technical expertise in Java and backend systems, but also for his patience, clarity, and dedication to helping others grow.

As a mentor, Marin was incredibly generous with his time and knowledge. He had a unique ability to break down complex concepts into manageable, understandable pieces, which made a huge difference in my development as a programmer. His code reviews were always insightful, focused not just on pointing out issues, but on teaching better practices.

Beyond his mentorship, Marin consistently brought quality and professionalism to the team. He tackled difficult technical challenges with confidence and precision, always striving for clean, maintainable solutions. His approach to problem-solving, especially under pressure, set a great example for the rest of us.

Anyone would be lucky to have Marin on their team. I'm grateful to have learned from him and highly recommend him for any team looking for both technical excellence and strong mentorship.`,
  },
  {
    name: 'Abbass Faytaroony',
    role: 'Senior Software Engineer (Java | Kotlin) @ Genesys',
    date: 'April 10, 2025',
    text: `I was fortunate enough to mentor Marin when working for Noema Consulting, where we collaborated on the backend development. Marin grasped Kotlin really fast and was making meaningful contributions within a very short time. He also became Azure Developer Associate certified soon after joining, which reflects his determination and quick learning abilities.

What stood out most was Marin's positive attitude and professionalism. He was always polite, receptive to feedback, and genuinely curious. Very soon, he learned the codebase and improved/extended it. Marin is the kind of developer who lifts a team technically and culturally, and I'd gladly work with him again.`,
  },
];

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const QuoteIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 .989 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
  </svg>
);

const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

const testimonialReveal = {
  hidden: { opacity: 0, y: 40, scale: 0.95, filter: 'blur(10px)' },
  visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
};

const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="testimonials-section">
      <motion.div
        className="section-header"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeUp}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="section-number">05</span>
        <h2 className="section-title">Words of <span className="accent">Appreciation</span></h2>
        <p className="section-subtitle">Reflections from peers and mentors I've worked with.</p>
      </motion.div>

      <div className="testimonials-grid">
        {testimonials.map((t, idx) => (
          <motion.article
            className="testimonial-card"
            key={t.name}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={testimonialReveal}
            transition={{ duration: 0.75, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="testimonial-card-top">
              <div className="testimonial-stars" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
              <span className="testimonial-quote-mark"><QuoteIcon /></span>
            </div>

            <div className="testimonial-text">
              {t.text.split('\n\n').map((paragraph, pIdx) => (
                <p key={pIdx}>{paragraph}</p>
              ))}
            </div>

            <div className="testimonial-author">
              <span className="testimonial-name">{t.name}</span>
              <span className="testimonial-role">{t.role}</span>
              <span className="testimonial-date">{t.date}</span>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
