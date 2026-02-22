import React from 'react';

type SkillCategory = {
  icon: string;
  title: string;
  skills: string[];
  className?: string;
};

const skillCategories: SkillCategory[] = [
  {
    icon: '⚡',
    title: 'Primary Stack',
    skills: [
      'Java', 'Spring Boot', 'React.js', 'TypeScript', 'PostgreSQL',
      'Spring Cloud', 'Spring Security', 'Hibernate', 'REST & GraphQL',
    ],
    className: 'anchor',
  },
  {
    icon: '🖥️',
    title: 'Frontend',
    skills: ['React.js', 'HTML5', 'CSS3', 'Tailwind CSS', 'JavaScript (ES6+)'],
    className: '',
  },
  {
    icon: '⚙️',
    title: 'Backend & Architecture',
    skills: ['Microservices', 'Event-Driven', 'Distributed Systems', 'API Design'],
    className: '',
  },
  {
    icon: '🗄️',
    title: 'Databases',
    skills: ['PostgreSQL', 'MongoDB', 'SQL Server', 'Query Optimization'],
    className: '',
  },
  {
    icon: '☁️',
    title: 'Cloud & DevOps',
    skills: ['Azure', 'Docker', 'Kubernetes', 'Git', 'Docker Compose'],
    className: 'span-2',
  },
  {
    icon: '📨',
    title: 'Messaging',
    skills: ['RabbitMQ', 'Kafka', 'WebSocket/STOMP'],
    className: '',
  },
  {
    icon: '🧪',
    title: 'Testing',
    skills: ['JUnit', 'Mockito', 'Integration Testing'],
    className: '',
  },
  {
    icon: '🔧',
    title: 'Tools',
    skills: ['IntelliJ IDEA', 'Postman', 'Swagger/OpenAPI', 'Jira', 'Maven'],
    className: 'span-2',
  },
  {
    icon: '🔐',
    title: 'Frameworks & Libraries',
    skills: [
      'Spring Data JPA', 'Lombok', 'MapStruct', 'Feign Client',
      'OAuth 2.0', 'JWT', 'Stripe SDK', 'OneSignal API',
    ],
    className: 'span-2',
  },
];

const Skills: React.FC = () => {
  return (
    <section id="skills" className="skills-section">
      <div className="section-header fade-up">
        <h2 className="section-title">
          <span className="section-number">04.</span>
          Skills
        </h2>
      </div>

      <div className="bento-grid stagger-children">
        {skillCategories.map((cat) => (
          <div
            className={`bento-card fade-up${cat.className ? ` ${cat.className}` : ''}`}
            key={cat.title}
          >
            <div className="bento-card-icon">{cat.icon}</div>
            <div className="bento-card-title">{cat.title}</div>
            <div className="bento-card-skills">
              {cat.skills.map((skill) => (
                <span className="bento-skill" key={skill}>{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
