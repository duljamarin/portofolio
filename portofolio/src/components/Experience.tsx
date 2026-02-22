import React from 'react';

const experiences = [
  {
    role: 'Backend Software Engineer (Contractor)',
    company: 'ADUS Technologies s.r.o',
    period: '04/2025 – 11/2025',
    description: 'Delivered core backend features for an AI-driven trading platform. Built real-time trading signal processing workflows, subscription billing, and multi-channel notifications.',
  },
  {
    role: 'Backend Software Engineer (Contractor)',
    company: 'Noema Consulting',
    period: '08/2024 – 03/2025',
    description: 'Contributed to a large-scale banking platform with 240+ microservices. Designed REST/GraphQL APIs and improved service resilience and operational quality.',
  },
  {
    role: 'Backend Java Developer (Contractor)',
    company: 'Candidatis GmbH',
    period: '05/2023 – 12/2023',
    description: 'Improved and optimized the backend of an Austrian and German JobAd portal, enhanced the web crawler, and mentored a junior developer.',
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
    description: 'Delivered 50+ tasks in frontend and backend, grew quickly from junior to independent contributor.',
  },
];

const Experience: React.FC = () => {
  return (
    <section id="experience" className="experience-section">
      <div className="section-header fade-up">
        <h2 className="section-title">
          <span className="section-number">03.</span>
          Experience
        </h2>
      </div>

      <div className="timeline">
        {experiences.map((exp, idx) => (
          <div className="timeline-item fade-up" key={idx}>
            <div className="timeline-node" />
            <span className="timeline-date">{exp.period}</span>
            <div className="timeline-company">{exp.company}</div>
            <div className="timeline-role">{exp.role}</div>
            <div className="timeline-desc">{exp.description}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
