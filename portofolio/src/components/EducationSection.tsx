import React from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const EducationSection: React.FC = () => (
  <section id="education" className="education-section">
    <motion.div
      className="section-header"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={fadeUp}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="section-number">06</span>
      <h2 className="section-title">Education & Certifications</h2>
    </motion.div>

    {/* Certification */}
    <motion.div
      className="certification-compact"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="certification-card">
        <img
          src="/azure-certification.png"
          alt="Microsoft Certified: Azure Developer Associate"
          loading="lazy"
        />
        <div className="cert-info">
          <h3 className="cert-title">Microsoft Certified: Azure Developer Associate</h3>
          <a
            href="https://learn.microsoft.com/en-us/users/marindulja-4281/credentials/95bcad6e81b05db8"
            target="_blank"
            rel="noopener noreferrer"
            className="cert-verify-btn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Verify Online
          </a>
        </div>
      </div>
    </motion.div>

    {/* Education cards */}
    <div className="education-row">
      <motion.a
        className="education-card"
        href="https://www.unitir.edu.al/"
        target="_blank"
        rel="noopener noreferrer"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <h3>Bachelor of Computer Science</h3>
        <span className="school">University of Tirana</span>
        <span className="period">2015 – 2018</span>
      </motion.a>
      <motion.a
        className="education-card"
        href="https://www.unitir.edu.al/"
        target="_blank"
        rel="noopener noreferrer"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
      >
        <h3>MSc. of Computer Science</h3>
        <span className="school">University of Tirana</span>
        <span className="period">2018 – 2020</span>
      </motion.a>
    </div>
  </section>
);

export default EducationSection;
