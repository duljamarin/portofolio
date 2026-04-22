import React, { useState } from 'react';
import { motion } from 'framer-motion';

type SkillCategory = {
  label: string;
  title: string;
  skills: string[];
  className?: string;
  icon: React.ReactNode;
};

const iconProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const CoreIcon = () => (
  <svg {...iconProps}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const FrontendIcon = () => (
  <svg {...iconProps}>
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const ArchitectureIcon = () => (
  <svg {...iconProps}>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const DataIcon = () => (
  <svg {...iconProps}>
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5V19A9 3 0 0 0 21 19V5" />
    <path d="M3 12A9 3 0 0 0 21 12" />
  </svg>
);

const CloudIcon = () => (
  <svg {...iconProps}>
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </svg>
);

const ToolingIcon = () => (
  <svg {...iconProps}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

const skillCategories: SkillCategory[] = [
  {
    label: 'Core',
    title: 'Primary Stack',
    icon: <CoreIcon />,
    skills: [
      'Java', 'Kotlin', 'Spring Boot', 'React.js', 'TypeScript', 'PostgreSQL',
      'Spring Cloud', 'Spring Security', 'Hibernate', 'REST', 'GraphQL',
    ],
    className: 'anchor',
  },
  {
    label: 'Frontend',
    title: 'Frontend',
    icon: <FrontendIcon />,
    skills: ['React.js', 'TypeScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'JavaScript (ES6+)'],
  },
  {
    label: 'Architecture',
    title: 'Backend & Architecture',
    icon: <ArchitectureIcon />,
    skills: ['Microservices', 'Event-Driven', 'Distributed Systems', 'API Design', 'Spring Data JPA'],
  },
  {
    label: 'Data',
    title: 'Databases & Messaging',
    icon: <DataIcon />,
    skills: ['PostgreSQL', 'MongoDB', 'SQL Server', 'RabbitMQ', 'Kafka', 'WebSocket/STOMP'],
    className: 'span-2',
  },
  {
    label: 'Cloud',
    title: 'Cloud & DevOps',
    icon: <CloudIcon />,
    skills: ['Azure', 'Docker', 'Git', 'Docker Compose'],
  },
  {
    label: 'Tooling',
    title: 'Tools & Libraries',
    icon: <ToolingIcon />,
    skills: [
      'IntelliJ IDEA', 'Postman', 'Swagger/OpenAPI', 'Jira', 'Maven',
      'Lombok', 'MapStruct', 'Feign Client', 'JUnit', 'Mockito',
      'OAuth 2.0', 'JWT', 'Stripe SDK',
    ],
    className: 'span-2',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28, scale: 0.94, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
};

const Skills: React.FC = () => {
  const [activeSkill, setActiveSkill] = useState<string | null>(null);

  const handleCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <section id="skills" className="skills-section">
      <motion.div
        className="section-header"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeUp}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="section-number">04</span>
        <h2 className="section-title"><span className="accent">Skills</span></h2>
      </motion.div>

      <div className="bento-grid">
        {skillCategories.map((cat, idx) => (
          <motion.div
            className={`bento-card${cat.className ? ` ${cat.className}` : ''}`}
            key={cat.title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-30px' }}
            variants={fadeUp}
            transition={{ duration: 0.65, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
            onMouseMove={handleCardMove}
          >
            <div className="bento-card-header">
              <span className="bento-card-icon">{cat.icon}</span>
              <span className="bento-card-label">{cat.label}</span>
            </div>
            <div className="bento-card-title">{cat.title}</div>
            <div className="bento-card-skills">
              {cat.skills.map((skill) => (
                <span
                  className={`bento-skill${activeSkill === skill ? ' is-active' : ''}`}
                  key={skill}
                  onMouseEnter={() => setActiveSkill(skill)}
                  onMouseLeave={() => setActiveSkill(null)}
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
