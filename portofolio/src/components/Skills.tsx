import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
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
  SiTailwindcss,
  SiMongodb,
  SiRabbitmq,
  SiApachekafka,
  SiKotlin,
  SiOpenjdk,
  SiDocker,
  SiJunit5,
} from 'react-icons/si';
import { TbBrandAzure, TbAsterisk, TbSettings } from 'react-icons/tb';
import { DUR_REVEAL, EASE_OUT } from '../animations';
import { useInViewAttr } from '../hooks/useInViewAttr';
import { SplitReveal } from './fx/SplitReveal';

/** Max lean (deg) of the marquee rows at high scroll speed, and the speed (px/s) that reaches it. */
const MAX_SKEW = 8;
const SKEW_AT_SPEED = 2500;

type Skill = { name: string; icon: IconType };

/** Two rows that drift in opposite directions. */
const ROWS: Skill[][] = [
  [
    { name: 'Java', icon: SiOpenjdk },
    { name: 'Kotlin', icon: SiKotlin },
    { name: 'Spring Boot', icon: SiSpringboot },
    { name: 'Spring Cloud', icon: SiSpring },
    { name: 'Spring Security', icon: SiSpring },
    { name: 'Hibernate', icon: SiHibernate },
    { name: 'Spring Data JPA', icon: TbAsterisk },
    { name: 'REST', icon: TbAsterisk },
    { name: 'GraphQL', icon: SiGraphql },
    { name: 'Microservices', icon: TbAsterisk },
    { name: 'Event-driven', icon: TbAsterisk },
  ],
  [
    { name: 'PostgreSQL', icon: SiPostgresql },
    { name: 'MongoDB', icon: SiMongodb },
    { name: 'SQL Server', icon: TbSettings },
    { name: 'RabbitMQ', icon: SiRabbitmq },
    { name: 'Kafka', icon: SiApachekafka },
    { name: 'WebSocket / STOMP', icon: TbSettings },
    { name: 'React', icon: SiReact },
    { name: 'TypeScript', icon: SiTypescript },
    { name: 'Tailwind CSS', icon: SiTailwindcss },
    { name: 'Supabase', icon: SiSupabase },
    { name: 'Docker', icon: SiDocker },
    { name: 'Azure', icon: TbBrandAzure },
    { name: 'JUnit 5', icon: SiJunit5 },
  ],
];

const ChipList: React.FC<{ skills: Skill[]; copy?: boolean }> = ({ skills, copy }) => (
  <ul className="marquee-list" aria-hidden={copy || undefined} data-copy={copy || undefined}>
    {skills.map(({ name, icon: Icon }) => (
      <li className="skill-chip" key={name}>
        <Icon className="skill-chip-icon" aria-hidden="true" />
        <span>{name}</span>
      </li>
    ))}
  </ul>
);

const Skills: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useInViewAttr(sectionRef);
  const reduceMotion = useReducedMotion();

  // The rows lean into the scroll direction, harder the faster you scroll.
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { stiffness: 300, damping: 50 });
  const skewX = useTransform(velocity, [-SKEW_AT_SPEED, 0, SKEW_AT_SPEED], [MAX_SKEW, 0, -MAX_SKEW], { clamp: true });

  return (
    <section id="skills" className="skills-section" ref={sectionRef}>
      <motion.header
        className="section-header"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: DUR_REVEAL, ease: EASE_OUT }}
      >
        <p className="section-label">Skills</p>
        <SplitReveal className="section-title" text="The stack I reach for" />
      </motion.header>

      <motion.div className="marquee-rows" style={reduceMotion ? undefined : { skewX }}>
        {ROWS.map((row, i) => (
          <div className="marquee" data-direction={i % 2 ? 'right' : 'left'} key={i}>
            {/* Content is duplicated once so the -50% loop is seamless. */}
            <div className="marquee-track">
              <ChipList skills={row} />
              <ChipList skills={row} copy />
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export default Skills;
