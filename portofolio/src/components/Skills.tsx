import React from 'react';
import { motion } from 'framer-motion';

type SkillCategory = {
  label: string;
  title: string;
  skills: string[];
  className?: string;
};

const skillCategories: SkillCategory[] = [
  {
    label: 'Core',
    title: 'Primary Stack',
    skills: [
      'Java', 'Kotlin', 'Spring Boot', 'React.js', 'TypeScript', 'PostgreSQL',
      'Spring Cloud', 'Spring Security', 'Hibernate', 'REST', 'GraphQL',
    ],
    className: 'anchor',
  },
  {
    label: 'Frontend',
    title: 'Frontend',
    skills: ['React.js', 'TypeScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'JavaScript (ES6+)'],
  },
  {
    label: 'Architecture',
    title: 'Backend & Architecture',
    skills: ['Microservices', 'Event-Driven', 'Distributed Systems', 'API Design', 'Spring Data JPA'],
  },
  {
    label: 'Data',
    title: 'Databases & Messaging',
    skills: ['PostgreSQL', 'MongoDB', 'SQL Server', 'RabbitMQ', 'Kafka', 'WebSocket/STOMP'],
    className: 'span-2',
  },
  {
    label: 'Cloud',
    title: 'Cloud & DevOps',
    skills: ['Azure', 'Docker', 'Git', 'Docker Compose'],
  },
  {
    label: 'Tooling',
    title: 'Tools & Libraries',
    skills: [
      'IntelliJ IDEA', 'Postman', 'Swagger/OpenAPI', 'Jira', 'Maven',
      'Lombok', 'MapStruct', 'Feign Client', 'JUnit', 'Mockito',
      'OAuth 2.0', 'JWT', 'Stripe SDK',
    ],
    className: 'span-2',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Skills: React.FC = () => {
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
        <h2 className="section-title">Skills</h2>
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
            transition={{ duration: 0.5, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="bento-card-label">{cat.label}</span>
            <div className="bento-card-title">{cat.title}</div>
            <div className="bento-card-skills">
              {cat.skills.map((skill) => (
                <span className="bento-skill" key={skill}>{skill}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
