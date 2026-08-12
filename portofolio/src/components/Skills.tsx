import React from 'react';
import { motion } from 'framer-motion';
import type { IconType } from 'react-icons';
import {
  SiTypescript,
  SiSpringboot,
  SiSpring,
  SiReact,
  SiPostgresql,
  SiSupabase,
  SiHibernate,
  SiGraphql,
  SiHtml5,
  SiTailwindcss,
  SiJavascript,
  SiMongodb,
  SiRabbitmq,
  SiApachekafka,
  SiKotlin,
  SiOpenjdk,
  SiDocker,
  SiGit,
  SiPostman,
  SiSwagger,
  SiJira,
  SiApachemaven,
  SiJunit5,
  SiJsonwebtokens,
  SiJetbrains,
  SiStripe,
} from 'react-icons/si';
import { DiCss3 } from 'react-icons/di';
import { TbBrandAzure, TbAsterisk, TbSettings } from 'react-icons/tb';

type Skill = {
  name: string;
  icon: IconType;
};

type SkillCategory = {
  label: string;
  title: string;
  skills: Skill[];
  className?: string;
};

const skillCategories: SkillCategory[] = [
  {
    label: 'Core',
    title: 'Primary Stack',
    skills: [
      { name: 'Java', icon: SiOpenjdk },
      { name: 'Kotlin', icon: SiKotlin },
      { name: 'Spring Boot', icon: SiSpringboot },
      { name: 'React.js', icon: SiReact },
      { name: 'TypeScript', icon: SiTypescript },
      { name: 'PostgreSQL', icon: SiPostgresql },
      { name: 'Supabase', icon: SiSupabase },
      { name: 'Spring Cloud', icon: SiSpring },
      { name: 'Spring Security', icon: SiSpring },
      { name: 'Hibernate', icon: SiHibernate },
      { name: 'REST', icon: TbAsterisk },
      { name: 'GraphQL', icon: SiGraphql },
    ],
    className: 'anchor',
  },
  {
    label: 'Frontend',
    title: 'Frontend',
    skills: [
      { name: 'React.js', icon: SiReact },
      { name: 'TypeScript', icon: SiTypescript },
      { name: 'HTML5', icon: SiHtml5 },
      { name: 'CSS3', icon: DiCss3 },
      { name: 'Tailwind CSS', icon: SiTailwindcss },
      { name: 'JavaScript (ES6+)', icon: SiJavascript },
    ],
  },
  {
    label: 'Architecture',
    title: 'Backend & Architecture',
    skills: [
      { name: 'Microservices', icon: TbAsterisk },
      { name: 'Event-Driven', icon: TbAsterisk },
      { name: 'Distributed Systems', icon: TbAsterisk },
      { name: 'API Design', icon: TbAsterisk },
      { name: 'Spring Data JPA', icon: TbAsterisk },
    ],
  },
  {
    label: 'Data',
    title: 'Databases & Messaging',
    skills: [
      { name: 'PostgreSQL', icon: SiPostgresql },
      { name: 'MongoDB', icon: SiMongodb },
      { name: 'SQL Server', icon: TbSettings },
      { name: 'RabbitMQ', icon: SiRabbitmq },
      { name: 'Kafka', icon: SiApachekafka },
      { name: 'WebSocket/STOMP', icon: TbSettings },
    ],
    className: 'span-2',
  },
  {
    label: 'Cloud',
    title: 'Cloud & DevOps',
    skills: [
      { name: 'Azure', icon: TbBrandAzure },
      { name: 'Docker', icon: SiDocker },
      { name: 'Git', icon: SiGit },
      { name: 'Docker Compose', icon: SiDocker },
    ],
  },
  {
    label: 'Tooling',
    title: 'Tools & Libraries',
    skills: [
      { name: 'IntelliJ IDEA', icon: SiJetbrains },
      { name: 'Postman', icon: SiPostman },
      { name: 'Swagger/OpenAPI', icon: SiSwagger },
      { name: 'Jira', icon: SiJira },
      { name: 'Maven', icon: SiApachemaven },
      { name: 'Lombok', icon: TbSettings },
      { name: 'MapStruct', icon: TbSettings },
      { name: 'Feign Client', icon: TbSettings },
      { name: 'JUnit', icon: SiJunit5 },
      { name: 'Mockito', icon: TbSettings },
      { name: 'OAuth 2.0', icon: TbAsterisk },
      { name: 'JWT', icon: SiJsonwebtokens },
      { name: 'Stripe SDK', icon: SiStripe },
    ],
    className: 'span-2',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
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
            transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="bento-card-header">
              <span className="bento-card-label">{cat.label}</span>
            </div>
            <div className="bento-card-title">{cat.title}</div>
            <div className="bento-skill-grid">
              {cat.skills.map((skill) => {
                const Icon = skill.icon;
                return (
                  <div className="bento-skill-tile" key={skill.name}>
                    <Icon className="bento-skill-icon" aria-hidden="true" />
                    <span className="bento-skill-name">{skill.name}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
