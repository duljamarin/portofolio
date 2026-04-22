import React from 'react';
import { motion } from 'framer-motion';

const experiences = [
  {
    year: '2025',
    role: 'Freelance Full-Stack Developer',
    company: 'Independent',
    period: '12/2025 - Now',
    description: 'Building fast, scalable web apps and modern websites for clients - end-to-end product delivery from API design and backend services to polished React frontends.',
  },
  {
    year: '2025',
    role: 'Backend Software Engineer (Contractor)',
    company: 'ADUS Technologies s.r.o',
    period: '04/2025 - 11/2025',
    description: 'Built the core signal engine for an AI-driven trading platform - real-time processing across crypto and forex markets, subscription billing, and multi-channel push notifications.',
  },
  {
    year: '2024',
    role: 'Backend Software Engineer (Contractor)',
    company: 'Noema Consulting',
    period: '08/2024 - 03/2025',
    description: 'Contributed to a banking platform with 240+ microservices. Designed REST/GraphQL APIs and improved service resilience for millions of daily transactions.',
  },
  {
    year: '2023',
    role: 'Backend Java Developer (Contractor)',
    company: 'Candidatis GmbH',
    period: '05/2023 - 12/2023',
    description: 'Optimized the backend of an Austrian/German job portal, enhanced the web crawler performance, and mentored a junior developer.',
  },
  {
    year: '2022',
    role: 'Java Developer',
    company: 'Sabanet Albania',
    period: '11/2022 - 05/2023',
    description: 'Upgraded microservices, integrated external APIs, and completed advanced SQL training.',
  },
  {
    year: '2021',
    role: 'Java Fullstack Developer',
    company: 'Comdata Group',
    period: '07/2021 - 10/2022',
    description: 'Delivered 50+ frontend and backend tasks, growing from junior to independent contributor within the first year.',
  },
];

const BuildingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="9" y1="6" x2="9" y2="6.01" />
    <line x1="15" y1="6" x2="15" y2="6.01" />
    <line x1="9" y1="10" x2="9" y2="10.01" />
    <line x1="15" y1="10" x2="15" y2="10.01" />
    <line x1="9" y1="14" x2="9" y2="14.01" />
    <line x1="15" y1="14" x2="15" y2="14.01" />
    <path d="M10 22v-4h4v4" />
  </svg>
);

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

const timelineCard = {
  hidden: { opacity: 0, x: -30, filter: 'blur(8px)' },
  visible: { opacity: 1, x: 0, filter: 'blur(0px)' },
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
        <h2 className="section-title"><span className="accent">Experience</span></h2>
        <p className="section-subtitle">
          Four years of building backends across banking, fintech, AI trading and recruitment platforms.
        </p>
      </motion.div>

      <div className="experience-timeline">
        <div className="experience-track">
          {experiences.map((exp, idx) => (
            <motion.div
              className="experience-node"
              key={exp.company}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-30px' }}
              variants={timelineCard}
              transition={{ duration: 0.65, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="experience-node-marker">
                <span className="experience-node-dot" />
              </div>
              <div className="experience-node-stem" />

              <div className="experience-tl-card">
                <div className="experience-tl-card-top">
                  <span className="experience-year-pill">
                    <span className="experience-year-pill-dot" />
                    {exp.year}
                  </span>
                  <span className="experience-tl-icon">
                    <BuildingIcon />
                  </span>
                </div>

                <h3 className="experience-tl-role">{exp.role}</h3>
                <p className="experience-tl-company">{exp.company}</p>
                <p className="experience-tl-desc">{exp.description}</p>

                <div className="experience-tl-footer">
                  <span className="experience-tl-period">{exp.period}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
