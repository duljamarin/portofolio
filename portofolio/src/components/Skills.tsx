import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
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
import { skillGroups } from '../data/skills';
import { useHydrated, useHydratedReducedMotion } from '../hooks/useHydrated';
import { useInViewAttr } from '../hooks/useInViewAttr';
import { Reveal } from './fx/Reveal';
import { SplitReveal } from './fx/SplitReveal';

/** Max lean (deg) of the marquee rows at high scroll speed, and the speed (px/s) that reaches it. */
const MAX_SKEW = 8;
const SKEW_AT_SPEED = 2500;

type Skill = { name: string; icon: IconType };

const ICONS: Record<string, IconType> = {
  Java: SiOpenjdk,
  Kotlin: SiKotlin,
  'Spring Boot': SiSpringboot,
  'Spring Cloud': SiSpring,
  'Spring Security': SiSpring,
  Hibernate: SiHibernate,
  GraphQL: SiGraphql,
  PostgreSQL: SiPostgresql,
  MongoDB: SiMongodb,
  'SQL Server': TbSettings,
  RabbitMQ: SiRabbitmq,
  Kafka: SiApachekafka,
  'WebSocket / STOMP': TbSettings,
  React: SiReact,
  TypeScript: SiTypescript,
  'Tailwind CSS': SiTailwindcss,
  Supabase: SiSupabase,
  Docker: SiDocker,
  Azure: TbBrandAzure,
  'JUnit 5': SiJunit5,
};

const withIcons = (names: string[]): Skill[] => names.map((name) => ({ name, icon: ICONS[name] ?? TbAsterisk }));

/** Two rows that drift in opposite directions: backend, then data, frontend and tooling. */
const ROWS: Skill[][] = [
  withIcons(skillGroups.filter((group) => group.id === 'backend').flatMap((group) => group.skills)),
  withIcons(skillGroups.filter((group) => group.id !== 'backend').flatMap((group) => group.skills)),
];

/**
 * The brand logos are decorative and their SVG paths are the heaviest part of the
 * prerendered HTML, so the HTML carries a same-size placeholder and the logo
 * arrives with hydration (the chip keeps its exact size either way).
 */
const ChipList: React.FC<{ skills: Skill[]; copy?: boolean }> = ({ skills, copy }) => {
  const hydrated = useHydrated();
  return (
    <ul className="marquee-list" aria-hidden={copy || undefined} data-copy={copy || undefined}>
      {skills.map(({ name, icon: Icon }) => (
        <li className="skill-chip" key={name}>
          {hydrated ? (
            <Icon className="skill-chip-icon" aria-hidden="true" />
          ) : (
            <span className="skill-chip-icon" aria-hidden="true" />
          )}
          <span>{name}</span>
        </li>
      ))}
    </ul>
  );
};

const Skills: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useInViewAttr(sectionRef);
  const reduceMotion = useHydratedReducedMotion();

  // The rows lean into the scroll direction, harder the faster you scroll.
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { stiffness: 300, damping: 50 });
  const skewX = useTransform(velocity, [-SKEW_AT_SPEED, 0, SKEW_AT_SPEED], [MAX_SKEW, 0, -MAX_SKEW], { clamp: true });

  return (
    <section id="skills" className="skills-section" ref={sectionRef}>
      <Reveal as="header" className="section-header" y={16}>
        <p className="section-label">Skills</p>
        <SplitReveal className="section-title" text="The stack I reach for" />
      </Reveal>

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
