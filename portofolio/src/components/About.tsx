import React from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const About: React.FC = () => {
  return (
    <section id="about" className="about-section">
      <div className="about-container">
        {/* Photo */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="about-photo-container">
            <div className="about-photo-inner">
              <img
                src="/photo_portofolio.jpg"
                alt="Marin Dulja"
                loading="lazy"
              />
            </div>
          </div>
        </motion.div>

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
            <span className="section-number">03</span>
            <h2 className="section-title">About Me</h2>
          </motion.div>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            I started writing Java in college and never stopped. With more than four years of work experience, I've shipped banking platforms, built AI trading systems,
            improved a web crawler, developed microservices and still get excited about a clean API design.
          </motion.p>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            My core stack is Java and Spring Boot on the backend, React and TypeScript
            on the frontend - but I'm comfortable across the entire stack. I thrive
            in environments where I can solve real problems with clean, maintainable code.
          </motion.p>

          {/* Stats strip */}
          <motion.div
            className="stats-strip"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
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

        </div>
      </div>
    </section>
  );
};

export default About;
