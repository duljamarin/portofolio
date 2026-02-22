import React from 'react';

const techStack = [
  'Java', 'Kotlin', 'Spring Boot', 'React.js', 'TypeScript',
  'PostgreSQL', 'MongoDB', 'Docker', 'Kubernetes', 'Azure',
];

const About: React.FC = () => {
  return (
    <section id="about" className="about-section">
      <div className="about-container">
        {/* Photo */}
        <div className="fade-up">
          <div className="about-photo-container">
            <div className="about-photo-border" />
            <div className="about-photo-inner">
              <img
                src="/photo_portofolio.jpg"
                alt="Marin Dulja"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Text content */}
        <div className="about-text-content">
          <div className="section-header fade-up">
            <h2 className="section-title">
              <span className="section-number">01.</span>
              About Me
            </h2>
          </div>

          <p className="fade-up">
            I'm a full-stack software engineer with 4+ years of experience building scalable,
            reliable web applications. My core stack is Java and Spring Boot on the backend,
            React.js on the frontend — and I'm comfortable across the entire stack.
          </p>
          <p className="fade-up">
            I've worked on banking platforms with 240+ microservices, AI-driven trading systems,
            and everything in between. I thrive in environments where I can solve real problems
            with clean, maintainable code.
          </p>

          {/* Stats */}
          <div className="stats-row fade-up stagger-children">
            <div className="stat-item fade-up">
              <div className="stat-number" data-count="4" data-suffix="+">0+</div>
              <div className="stat-label">Years Experience</div>
            </div>
            <div className="stat-item fade-up">
              <div className="stat-number" data-count="15" data-suffix="+">0+</div>
              <div className="stat-label">Projects</div>
            </div>
            <div className="stat-item fade-up">
              <div className="stat-number" data-count="15" data-suffix="+">0+</div>
              <div className="stat-label">Technologies</div>
            </div>
          </div>

          {/* Tech pills */}
          <div className="tech-pills fade-up">
            {techStack.map((tech) => (
              <span className="tech-pill" key={tech}>{tech}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
