import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { roles } from '../data/experience';
import { DUR_REVEAL, EASE_OUT, REVEAL_STAGGER, initCounters } from '../animations';
import { LockIn, SparkBurst } from './fx/LockIn';
import { SplitReveal } from './fx/SplitReveal';

const previously = roles
  .map((r) => r.company.split(' · ')[0])
  .filter((company) => company !== 'Independent');

/** Values count up once on enter (initCounters reads data-count). */
const stats = [
  { value: '4.5+', label: 'years of experience' },
  { value: '15+', label: 'projects shipped' },
  { value: '240+', label: 'microservices in the banking platform I worked on', highlight: true },
];

const principles = [
  {
    title: 'Ship then refine',
    desc: 'Working code in production beats perfect code on a branch.',
  },
  {
    title: 'Boring tech wins',
    desc: 'I reach for proven tools first. Novelty is a tax worth paying only when it earns its place.',
  },
  {
    title: 'Write it for the next dev',
    desc: 'Code is read more than it\'s written. Clarity outlives cleverness.',
  },
  {
    title: 'Measure before you optimize',
    desc: 'I profile first, guess never. Real numbers pick the right fight.',
  },
];

const reveal = (order: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: DUR_REVEAL, delay: order * REVEAL_STAGGER, ease: EASE_OUT },
});

const About: React.FC = () => {
  // Stat tiles count up once on enter (data-count).
  useEffect(() => initCounters(), []);

  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <div className="about-text-content">
          <motion.header className="section-header" {...reveal(0)}>
            <p className="section-label">About</p>
            <SplitReveal className="section-title" text="I started writing Java in college and never stopped." />
          </motion.header>

          <motion.p {...reveal(1)}>
            With 4.5+ years of work experience, I have shipped banking platforms, built trading
            systems, improved a web crawler, developed microservices, and designed, built and
            operated a subscription SaaS solo, from system design through billing to production.
          </motion.p>
          <motion.p {...reveal(2)}>
            My core stack is Java, Kotlin and Spring Boot on the backend, React and Supabase on the
            frontend and data layer.
          </motion.p>

          <div className="stats-grid">
            {stats.map((s, i) => (
              <LockIn key={s.label} className="stat-lockin fx-ring" index={i} intensity={0.7}>
                <div className="stat-tile" data-highlight={s.highlight || undefined}>
                  <span className="sr-only">{s.value}</span>
                  <span className="stat-number" data-count={s.value} aria-hidden="true">
                    {s.value}
                  </span>
                  <span className="stat-label">{s.label}</span>
                  <SparkBurst className="stat-burst" scale={s.highlight ? 1 : 0.7} />
                </div>
              </LockIn>
            ))}
          </div>

          <motion.p className="about-previously" {...reveal(6)}>
            Previously: {previously.join(' · ')}
          </motion.p>
        </div>

        <aside className="principles-card">
          <motion.p className="section-label" {...reveal(0)}>How I work</motion.p>
          <motion.h3 className="principles-card-title" {...reveal(1)}>Engineering principles</motion.h3>
          <div className="principles-list">
            {principles.map((p, idx) => (
              <LockIn className="principles-list-item" key={p.title} index={idx} intensity={0.4}>
                <h4>{p.title}</h4>
                <p>{p.desc}</p>
              </LockIn>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
};

export default About;
