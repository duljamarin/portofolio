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

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
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
        <h2 className="section-title">Testimonials</h2>
      </motion.div>

      <div className="testimonials-wall">
        {testimonials.map((t, idx) => (
          <motion.div
            className="testimonial-item"
            key={idx}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fadeUp}
            transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
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
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
