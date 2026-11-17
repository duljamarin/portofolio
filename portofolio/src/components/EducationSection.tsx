import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { animateCountText, formatCount, parseCount } from '../animations';
import { useInViewAttr } from '../hooks/useInViewAttr';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

type Cert = {
  issuer: string;
  title: string;
  image: string;
  alt: string;
  width: number;
  height: number;
  meta?: string;
  verifyUrl?: string;
  stat?: { value: string; label: string };
};

const CERTS: Cert[] = [
  {
    issuer: 'Microsoft',
    title: 'Microsoft Certified: Azure Developer Associate',
    image: '/azure-certification.webp',
    alt: 'Microsoft Certified: Azure Developer Associate',
    width: 800,
    height: 440,
    verifyUrl: 'https://learn.microsoft.com/en-us/users/marindulja-4281/credentials/95bcad6e81b05db8',
  },
  {
    issuer: 'TestGorilla',
    title: 'TestGorilla: Spring - 98th Percentile',
    image: '/testgorilla-spring.webp',
    alt: 'TestGorilla Spring assessment, verified result, 98th percentile',
    width: 800,
    height: 537,
    meta: 'Verified result · valid through August 2028',
    stat: { value: '98th', label: 'percentile' },
  },
];

/** Sparks that burst out when a card locks in: angle (deg) and distance (px). */
const SPARKS = Array.from({ length: 14 }, (_, i) => ({
  angle: (360 / 14) * i + (i % 2 ? 8 : -6),
  distance: 70 + (i % 3) * 28,
  delay: (i % 4) * 30,
}));

/** Scroll progress at which a card counts as "locked in". */
const LOCK_AT = 0.97;
const COUNT_UP_MS = 1200;

const ExternalIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CertStat: React.FC<{ value: string; label: string; run: boolean }> = ({ value, label, run }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);
  const reduceMotion = useReducedMotion();
  const parts = parseCount(value);

  useEffect(() => {
    if (!run || done.current || !ref.current) return;
    done.current = true;
    return animateCountText(ref.current, value, COUNT_UP_MS);
  }, [run, value]);

  return (
    <div className="cert-stat">
      <span className="sr-only">{value} {label}</span>
      <span className="cert-stat-value" ref={ref} aria-hidden="true">
        {reduceMotion || !parts ? value : formatCount(parts, 0)}
      </span>
      <span className="cert-stat-label" aria-hidden="true">{label}</span>
    </div>
  );
};

const CertCard: React.FC<{ cert: Cert; index: number }> = ({ cert, index }) => {
  const reduceMotion = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const [locked, setLocked] = useState(reduceMotion);
  const isLocked = locked || reduceMotion;

  // 0 when the card's top enters the viewport, 1 when it sits at 65% of the viewport height.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center 0.65'] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 22, mass: 0.4 });

  const side = index % 2 ? 1 : -1;
  const rotateX = useTransform(progress, [0, 1], [34, 0]);
  const rotateY = useTransform(progress, [0, 1], [14 * side, 0]);
  const y = useTransform(progress, [0, 1], [140, 0]);
  const scale = useTransform(progress, [0, 1], [0.78, 1]);
  const opacity = useTransform(progress, [0, 0.35, 1], [0, 0.85, 1]);
  const barFill = useTransform(scrollYProgress, [0, LOCK_AT], [0, 1]);

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (p >= LOCK_AT) setLocked(true);
  });

  return (
    <motion.article
      ref={ref}
      className="cert-card"
      data-locked={isLocked || undefined}
      style={reduceMotion ? undefined : { rotateX, rotateY, y, scale, opacity, transformPerspective: 1100 }}
    >
      <div className="cert-card-inner">
        <div className="cert-media">
          <img src={cert.image} alt={cert.alt} width={cert.width} height={cert.height} loading="lazy" decoding="async" />
          <span className="cert-sheen" aria-hidden="true" />

          {isLocked && (
            <motion.span
              className="cert-stamp"
              initial={reduceMotion ? false : { scale: 2.4, rotate: -24, opacity: 0 }}
              animate={{ scale: 1, rotate: -9, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 520, damping: 16, mass: 0.7 }}
            >
              <CheckIcon />
              Verified
            </motion.span>
          )}

          <span className="cert-burst" aria-hidden="true">
            {SPARKS.map((s, i) => (
              <span
                key={i}
                className="cert-spark"
                style={
                  {
                    '--a': `${s.angle}deg`,
                    '--d': `${s.distance}px`,
                    '--delay': `${s.delay}ms`,
                  } as React.CSSProperties
                }
              />
            ))}
          </span>
        </div>

        <div className="cert-info">
          <span className="cert-issuer">{cert.issuer}</span>
          <h3 className="cert-title">{cert.title}</h3>
          {cert.meta && <span className="cert-meta">{cert.meta}</span>}
          {cert.stat && <CertStat value={cert.stat.value} label={cert.stat.label} run={isLocked} />}

          <div className="cert-progress" aria-hidden="true">
            <span className="cert-progress-track">
              <motion.span
                className="cert-progress-fill"
                style={reduceMotion ? { scaleX: 1 } : { scaleX: barFill }}
              />
            </span>
            <span className="cert-progress-label">{isLocked ? 'Verified' : 'Verifying'}</span>
          </div>

          {cert.verifyUrl && (
            <a href={cert.verifyUrl} target="_blank" rel="noopener noreferrer" className="cert-verify-btn">
              <ExternalIcon />
              Verify Online
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
};

const EducationSection: React.FC = () => {
  const certsRef = useRef<HTMLDivElement>(null);
  useInViewAttr(certsRef);

  return (
    <section id="education" className="education-section">
      <motion.div
        className="section-header"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeUp}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="section-title">Education & <span className="accent">Certifications</span></h2>
      </motion.div>

      {/* Certifications: scroll-driven 3D reveal that locks in with a stamp and a spark burst */}
      <div className="cert-stage" ref={certsRef}>
        <div className="cert-stage-glow" aria-hidden="true" />
        <div className="cert-grid">
          {CERTS.map((cert, i) => (
            <CertCard key={cert.title} cert={cert} index={i} />
          ))}
        </div>
      </div>

      {/* Education cards */}
      <div className="education-row">
        <motion.a
          className="education-card"
          href="https://www.unitir.edu.al/"
          target="_blank"
          rel="noopener noreferrer"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h3>Bachelor of Computer Science</h3>
          <span className="school">University of Tirana &middot; 8.18/10</span>
          <span className="period">2015 – 2018</span>
        </motion.a>
        <motion.a
          className="education-card"
          href="https://www.unitir.edu.al/"
          target="_blank"
          rel="noopener noreferrer"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          <h3>MSc. of Computer Science</h3>
          <span className="school">University of Tirana &middot; 8.1/10</span>
          <span className="period">2018 – 2020</span>
        </motion.a>
      </div>
    </section>
  );
};

export default EducationSection;
