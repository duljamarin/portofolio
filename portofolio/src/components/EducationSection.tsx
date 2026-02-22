import React from 'react';

const EducationSection: React.FC = () => (
  <section id="education" className="education-section">
    <div className="section-header fade-up">
      <h2 className="section-title">
        <span className="section-number">06.</span>
        Education & Certifications
      </h2>
    </div>

    {/* Certification */}
    <div className="certifications-grid fade-up" style={{ marginBottom: '2rem' }}>
      <div className="certification-card">
        <img
          src="/azure-certification.png"
          alt="Microsoft Certified: Azure Developer Associate"
          loading="lazy"
        />
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

    {/* Education cards */}
    <div className="education-grid stagger-children">
      <a
        className="education-card fade-up"
        href="https://www.unitir.edu.al/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h3>Bachelor of Computer Science</h3>
        <span className="school">University of Tirana</span>
        <span className="period">2015 - 2018</span>
      </a>
      <a
        className="education-card fade-up"
        href="https://www.unitir.edu.al/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h3>MSc. of Computer Science</h3>
        <span className="school">University of Tirana</span>
        <span className="period">2018 - 2020</span>
      </a>
    </div>
  </section>
);

export default EducationSection;
