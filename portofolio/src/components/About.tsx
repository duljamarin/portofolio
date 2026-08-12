import React from 'react';
import { motion } from 'framer-motion';
import { roles } from '../data/experience';

const previously = roles
  .map((r) => r.company.split(' · ')[0])
  .filter((company) => company !== 'Independent');

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const principles = [
  {
    title: 'Ship then refine',
    desc: 'Working code in production beats perfect code on a branch.',
  },
  {
    title: 'Boring tech wins',
    desc: 'I reach for proven tools first. Novelty is a tax worth paying only when it earns its place.',
  },
  {
    title: 'Write it for the next dev',
    desc: 'Code is read more than it\'s written. Clarity outlives cleverness.',
  },
  {
    title: 'Measure before you optimize',
    desc: 'I profile first, guess never. Real numbers pick the right fight.',
  },
];

const About: React.FC = () => {
  return (
    <section id="about" className="about-section">
      <div className="about-container">
        {/* Text content */}
        <div className="about-text-content">
          <motion.div
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fadeUp}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="section-title">About <span className="accent">Me</span></h2>
          </motion.div>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            I started writing Java in college and never stopped. With more than four years of work experience, I've shipped banking platforms, built AI trading systems,
            improved a web crawler, developed microservices, and designed, built, and operated a subscription SaaS solo, from system design through billing integration and production deployment.
          </motion.p>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            My core stack is Java, Kotlin, and Spring Boot on the backend, React and Supabase
            on the frontend and data layer - but I'm comfortable across the entire stack. I thrive
            in environments where I can solve real problems with clean, maintainable code.
          </motion.p>

          {/* Stats strip */}
          <motion.div
            className="stats-strip"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="stat-item">
              <span className="stat-number" data-count="4" data-suffix="+">4+</span>
              <span className="stat-label">Years Experience</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number" data-count="15" data-suffix="+">15+</span>
              <span className="stat-label">Projects</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number" data-count="15" data-suffix="+">15+</span>
              <span className="stat-label">Technologies</span>
            </div>
          </motion.div>

          <motion.p
            className="about-previously"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            Previously: {previously.join(' · ')}
          </motion.p>
        </div>

        {/* Engineering principles */}
        <motion.aside
          className="principles-card"
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="principles-card-label">How I work</span>
          <h3 className="principles-card-title">Engineering principles</h3>
          <div className="principles-list">
            {principles.map((p, idx) => (
              <motion.div
                className="principles-list-item"
                key={p.title}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 + idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <div>
                  <h4>{p.title}</h4>
                  <p>{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.aside>
      </div>
    </section>
  );
};

export default About;
