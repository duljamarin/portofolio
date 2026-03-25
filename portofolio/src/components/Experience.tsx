import React from 'react';
import { motion } from 'framer-motion';

const experiences = [
  {
    role: 'Backend Software Engineer (Contractor)',
    company: 'ADUS Technologies s.r.o',
    period: '04/2025 – 11/2025',
    description: 'Built the core signal engine for an AI-driven trading platform - real-time processing across crypto and forex markets, subscription billing, and multi-channel push notifications.',
  },
  {
    role: 'Backend Software Engineer (Contractor)',
    company: 'Noema Consulting',
    period: '08/2024 – 03/2025',
    description: 'Contributed to a banking platform with 240+ microservices. Designed REST/GraphQL APIs and improved service resilience for millions of daily transactions.',
  },
  {
    role: 'Backend Java Developer (Contractor)',
    company: 'Candidatis GmbH',
    period: '05/2023 – 12/2023',
    description: 'Optimized the backend of an Austrian/German job portal, enhanced the web crawler performance, and mentored a junior developer.',
  },
  {
    role: 'Java Developer',
    company: 'Sabanet Albania',
    period: '11/2022 – 05/2023',
    description: 'Upgraded microservices, integrated external APIs, and completed advanced SQL training.',
  },
  {
    role: 'Java Fullstack Developer',
    company: 'Comdata Group',
    period: '07/2021 – 10/2022',
    description: 'Delivered 50+ frontend and backend tasks, growing from junior to independent contributor within the first year.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Experience: React.FC = () => {
  return (
    <section id="experience" className="experience-section">
      <motion.div
        className="section-header"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeUp}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="section-number">02</span>
        <h2 className="section-title">Experience</h2>
      </motion.div>

      <div className="experience-cards">
        {experiences.map((exp, idx) => (
          <motion.div
            className="experience-card"
            key={idx}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-30px' }}
            variants={fadeUp}
            transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="experience-card-main">
              <span className="experience-company">{exp.company}</span>
              <span className="experience-role">{exp.role}</span>
              <p className="experience-desc">{exp.description}</p>
            </div>
            <span className="experience-date">{exp.period}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
