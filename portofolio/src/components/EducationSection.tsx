import React, { useEffect, useRef } from 'react';
import { motion, useReducedMotion, useTransform, type MotionValue } from 'framer-motion';
import { animateCountText, formatCount, parseCount } from '../animations';
import { useInViewAttr } from '../hooks/useInViewAttr';
import { LockIn, SparkBurst } from './fx/LockIn';
import { SplitReveal } from './fx/SplitReveal';

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

const COUNT_UP_MS = 1200;

const EDUCATION = [
  { degree: 'Bachelor of Computer Science', school: 'University of Tirana · 8.18/10', period: '2015 – 2018', url: 'https://www.unitir.edu.al/' },
  { degree: 'MSc. of Computer Science', school: 'University of Tirana · 8.1/10', period: '2018 – 2020', url: 'https://www.unitir.edu.al/' },
];

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

/** Fills with scroll until the card locks in. */
const VerifyBar: React.FC<{ progress: MotionValue<number>; locked: boolean }> = ({ progress, locked }) => {
  const reduceMotion = useReducedMotion();
  const fill = useTransform(progress, [0, 0.97], [0, 1]);
  return (
    <div className="cert-progress" aria-hidden="true">
      <span className="cert-progress-track">
        <motion.span className="cert-progress-fill" style={{ scaleX: reduceMotion || locked ? 1 : fill }} />
      </span>
      <span className="cert-progress-label">{locked ? 'Verified' : 'Verifying'}</span>
    </div>
  );
};

const CertCard: React.FC<{ cert: Cert; index: number }> = ({ cert, index }) => (
  <LockIn as="article" className="cert-card fx-ring" index={index}>
    {({ locked, progress }) => (
      <div className="cert-card-inner">
        <div className="cert-media">
          <img src={cert.image} alt={cert.alt} width={cert.width} height={cert.height} loading="lazy" decoding="async" />
          <span className="cert-sheen" aria-hidden="true" />
          {locked && (
            <motion.span
              className="cert-stamp"
              initial={{ scale: 2.4, rotate: -24, opacity: 0 }}
              animate={{ scale: 1, rotate: -9, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 520, damping: 16, mass: 0.7 }}
            >
              <CheckIcon />
              Verified
            </motion.span>
          )}
          <SparkBurst className="cert-burst" />
        </div>

        <div className="cert-info">
          <span className="cert-issuer">{cert.issuer}</span>
          <h3 className="cert-title">{cert.title}</h3>
          {cert.meta && <span className="cert-meta">{cert.meta}</span>}
          {cert.stat && <CertStat value={cert.stat.value} label={cert.stat.label} run={locked} />}
          <VerifyBar progress={progress} locked={locked} />
          {cert.verifyUrl && (
            <a href={cert.verifyUrl} target="_blank" rel="noopener noreferrer" className="cert-verify-btn">
              <ExternalIcon />
              Verify Online
            </a>
          )}
        </div>
      </div>
    )}
  </LockIn>
);

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
        <SplitReveal
          className="section-title"
          text={[{ text: 'Education & ' }, { text: 'Certifications', className: 'accent' }]}
        />
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
        {EDUCATION.map((e, i) => (
          <LockIn key={e.degree} className="education-lockin fx-ring" index={i} intensity={0.6}>
            <a className="education-card" href={e.url} target="_blank" rel="noopener noreferrer">
              <h3>{e.degree}</h3>
              <span className="school">{e.school}</span>
              <span className="period">{e.period}</span>
              <SparkBurst className="education-burst" scale={0.7} />
            </a>
          </LockIn>
        ))}
      </div>
    </section>
  );
};

export default EducationSection;
