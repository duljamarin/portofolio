import React from 'react';
import '../styles/main.css';

const experiences = [
  {
    title: 'Backend Software Engineer (Contractor)',
    company: 'ADUS Technologies s.r.o ',
    period: '04/2025 – 11/2025',
    summary: 'Delivered core backend features for an AI-driven trading platform. Built real-time trading signal processing workflows, subscription billing, and multi-channel notifications.'
  },
  {
    title: 'Backend Software Engineer (Contractor)',
    company: 'Noema Consulting',
    period: '08/2024 – 02/2025',
    summary: 'Contributed to a large-scale banking system with 240+ microservices. Contributed to a large-scale banking platform with 240+ microservices. Designed REST/GraphQL APIs and improved service resilience and operational quality.'
  },
  {
    title: 'Backend Java Developer (Contractor)',
    company: 'Candidatis GmbH',
    period: '05/2023 – 12/2023',
    summary: 'Improved and optimized the backend of an Austrian and German JobAd portal, enhanced the web crawler, and mentored a junior developer.'
  },
  {
    title: 'Java Developer',
    company: 'Sabanet Albania',
    period: '11/2022 – 05/2023',
    summary: 'Upgraded microservices, integrated external APIs, and completed advanced SQL training.'
  },
  {
    title: 'Java Fullstack Developer',
    company: 'Comdata Group',
    period: '07/2021 – 10/2022',
    summary: 'Delivered 50+ tasks in frontend and backend, grew quickly from junior to independent contributor.'
  }
];

const ExperienceShort: React.FC = () => (
  <section id="experience" className="experience-section">
    <h2 className="section-title" style={{ textAlign: 'center', color: '#fff', fontWeight: 800, fontSize: '2.2rem', marginBottom: '1.2rem' }}>Work Experience</h2>
    <div className="experience-list">
      {experiences.map((exp, idx) => (
        <div className="experience-card" key={idx}>
          <h3>{exp.title}</h3>
          <span className="company" style={{
            fontFamily: 'Montserrat, Inter, Segoe UI, Roboto, Arial, sans-serif',
            color: '#fff',
            fontWeight: 700,
            fontSize: '1.08rem',
            letterSpacing: '0.02em',
            marginRight: '1.2rem',
            padding: '2px 10px',
            borderRadius: '6px',
            background: 'rgba(91,231,196,0.08)'
          }}>{exp.company}</span>
          <br />
          <span className="period" style={{
            fontFamily: 'Inter, Segoe UI, Roboto, Arial, sans-serif',
            color: 'var(--neon)',
            fontWeight: 500,
            fontSize: '1rem',
            letterSpacing: '0.01em',
            marginLeft: '0.5rem',
            padding: '2px 8px',
            borderRadius: '6px',
            background: 'rgba(91,231,196,0.05)'
          }}>{exp.period}</span>
          <p style={{
            marginTop: '0.7rem',
            fontSize: '1.08rem',
            fontFamily: 'Montserrat, Inter, Segoe UI, Roboto, Arial, sans-serif',
            color: '#fff',
            fontWeight: 500,
            letterSpacing: '0.01em',
            textShadow: '0 2px 12px rgba(91,231,196,0.10)'
          }}>{exp.summary}</p>
        </div>
      ))}
    </div>
  </section>
);

export default ExperienceShort;
