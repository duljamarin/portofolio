import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { DUR_REVEAL, EASE_OUT } from '../animations';
import { useInViewAttr } from '../hooks/useInViewAttr';

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/* Rotating line. The word list is data: add, remove or reorder freely. */
const ROTATING_PREFIX = 'I build';
const ROTATING_WORDS = ['systems that scale.', 'fintech products', 'SaaS products'];
const ROTATING_LABEL = 'I build systems that scale, fintech products and SaaS products';
const WORD_HOLD = 2.6;      // s each word stays still
const WORD_TRANSITION = 0.4; // s slide up, blurred at mid-transition
const WORD_BLUR = 'blur(3px)';

const PREVIOUSLY = 'Previously at ADUS Technologies · Noema Consulting · Candidatis · Sabanet · Comdata Group';

const TILT_MAX = 6;    // deg
const TILT_GAIN = 14;  // deg per portrait-width of pointer offset

const RotatingWord: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % ROTATING_WORDS.length),
      (WORD_HOLD + WORD_TRANSITION) * 1000
    );
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  const word = reduceMotion ? ROTATING_WORDS[0] : ROTATING_WORDS[index];

  return (
    <span className="hero-rotator">
      <AnimatePresence initial={false}>
        <motion.span
          key={word}
          className="hero-rotator-word"
          initial={{ y: '100%', filter: WORD_BLUR }}
          animate={{ y: '0%', filter: 'blur(0px)' }}
          exit={{ y: '-100%', filter: WORD_BLUR }}
          transition={{ duration: WORD_TRANSITION, ease: EASE_OUT }}
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

const Hero: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  useInViewAttr(sectionRef);

  useEffect(() => {
    const portrait = portraitRef.current;
    if (!portrait) return;
    if (window.matchMedia('(hover: none), (prefers-reduced-motion: reduce)').matches) return;

    const clamp = (v: number) => Math.max(-TILT_MAX, Math.min(TILT_MAX, v));
    const onMove = (e: MouseEvent) => {
      const rect = portrait.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
      const dy = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
      portrait.style.setProperty('--tilt-x', `${clamp(-dy * TILT_GAIN)}deg`);
      portrait.style.setProperty('--tilt-y', `${clamp(dx * TILT_GAIN)}deg`);
    };
    const onLeave = () => {
      portrait.style.setProperty('--tilt-x', '0deg');
      portrait.style.setProperty('--tilt-y', '0deg');
    };

    window.addEventListener('mousemove', onMove);
    portrait.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      portrait.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  useEffect(() => {
    const wrap = ctasRef.current;
    if (!wrap) return;
    if (window.matchMedia('(hover: none), (prefers-reduced-motion: reduce)').matches) return;

    const buttons = Array.from(wrap.querySelectorAll<HTMLAnchorElement>('a'));
    const handlers: Array<{ el: HTMLAnchorElement; move: (e: MouseEvent) => void; leave: () => void }> = [];

    buttons.forEach((btn) => {
      let rafId = 0;
      const move = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
          rafId = 0;
          const rect = btn.getBoundingClientRect();
          const dx = (clientX - (rect.left + rect.width / 2)) * 0.18;
          const dy = (clientY - (rect.top + rect.height / 2)) * 0.28;
          btn.style.transform = `translate(${dx}px, ${dy}px)`;
        });
      };
      const leave = () => {
        btn.style.transform = '';
      };
      btn.addEventListener('mousemove', move);
      btn.addEventListener('mouseleave', leave);
      handlers.push({ el: btn, move, leave });
    });

    return () => {
      handlers.forEach(({ el, move, leave }) => {
        el.removeEventListener('mousemove', move);
        el.removeEventListener('mouseleave', leave);
      });
    };
  }, []);

  const enter = (order: number) => ({
    initial: { opacity: 1, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: DUR_REVEAL, delay: order * 0.12, ease: EASE_OUT },
  });

  return (
    <section id="hero" className="hero" ref={sectionRef}>
      <div className="hero-content">
        <div className="hero-text">
          <motion.p className="section-label hero-label" {...enter(0)}>
            Full-stack engineer · Java, Spring Boot, React
          </motion.p>

          <motion.h1 className="hero-name" {...enter(0)}>
            <span className="first">Marin</span>
            <span className="last">Dulja</span>
          </motion.h1>

          <motion.p className="hero-headline" {...enter(1)}>
            <span className="sr-only">{ROTATING_LABEL}</span>
            <span aria-hidden="true">
              {ROTATING_PREFIX} <RotatingWord />
            </span>
          </motion.p>

          <motion.p className="hero-bio" {...enter(2)}>
            4.5+ years shipping Java and Spring Boot backends for fintech and banking, plus
            full-stack products in React. Clean, maintainable, built to hold up in production.
          </motion.p>

          <motion.div
            className="hero-ctas"
            ref={ctasRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR_REVEAL, delay: 0.36, ease: EASE_OUT }}
          >
            <a href="#projects" className="btn-primary">
              See my work <ArrowRightIcon />
            </a>
            <a href="#contact" className="btn-ghost">
              Get in touch
            </a>
          </motion.div>
        </div>

        <div className="hero-portrait-col">
          <motion.div
            className="hero-portrait"
            ref={portraitRef}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: DUR_REVEAL, delay: 0.2, ease: EASE_OUT }}
          >
            {/* Cutout of og-image.jpg on a gold panel: no white background, no ring. */}
            <div className="hero-portrait-frame">
              <span className="hero-portrait-sheen" aria-hidden="true" />
              <img
                src="/hero-portrait-cutout.webp"
                alt="Marin Dulja"
                width={800}
                height={800}
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="hero-bottom">
        <p className="hero-previously">{PREVIOUSLY}</p>
        {/* Gold pill with a rotating light border; a packet runs along a mini
            track, echoing the "How I build" diagram it scrolls to. */}
        <a href="#how" className="hero-cue">
          <span className="hero-cue-inner">
            <span className="hero-cue-track" aria-hidden="true">
              <span className="hero-cue-packet" />
            </span>
            <span className="hero-cue-text">Scroll to follow a request through my stack</span>
            <span className="hero-cue-arrows" aria-hidden="true">
              <ChevronDown />
              <ChevronDown />
            </span>
          </span>
        </a>
      </div>
    </section>
  );
};

export default Hero;
