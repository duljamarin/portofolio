import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { initDotGrid } from '../animations';

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const cleanup = initDotGrid(canvasRef.current);
      return cleanup;
    }
  }, []);

  useEffect(() => {
    const portrait = portraitRef.current;
    if (!portrait) return;
    if (window.matchMedia('(hover: none)').matches) return;

    const onMove = (e: MouseEvent) => {
      const rect = portrait.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      const rotY = Math.max(-8, Math.min(8, dx * 14));
      const rotX = Math.max(-8, Math.min(8, -dy * 14));
      portrait.style.setProperty('--tilt-x', `${rotX}deg`);
      portrait.style.setProperty('--tilt-y', `${rotY}deg`);
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
    if (window.matchMedia('(hover: none)').matches) return;

    const buttons = Array.from(wrap.querySelectorAll<HTMLAnchorElement>('a'));
    const handlers: Array<{ el: HTMLAnchorElement; move: (e: MouseEvent) => void; leave: () => void }> = [];

    buttons.forEach((btn) => {
      const move = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.18;
        const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.28;
        btn.style.transform = `translate(${dx}px, ${dy}px)`;
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

  return (
    <section id="hero" className="hero">
      <canvas ref={canvasRef} className="hero-canvas" />

      {/* Camera framing brackets — corner marks around the entire hero */}
      <span className="hero-frame-bracket br-tl" aria-hidden="true" />
      <span className="hero-frame-bracket br-tr" aria-hidden="true" />
      <span className="hero-frame-bracket br-bl" aria-hidden="true" />
      <span className="hero-frame-bracket br-br" aria-hidden="true" />

      <div className="hero-content">
        <div className="hero-text">
          <motion.h1
            className="hero-name"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="first">Marin</span>
            <span className="last">Dulja</span>
          </motion.h1>

          <motion.p
            className="hero-headline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            I build systems that{' '}
            <span className="text-gradient">scale</span>
          </motion.p>

          <motion.p
            className="hero-bio"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            From banking platforms with 240+ microservices to AI-powered trading systems -
            I ship clean, maintainable backends and full-stack products that solve real problems.
          </motion.p>

          <motion.div
            className="hero-ctas"
            ref={ctasRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <a href="#projects" className="btn-primary">
              See My Work <ArrowRightIcon />
            </a>
            <a
              href="#contact"
              className="btn-ghost"
              onClick={(e) => {
                e.preventDefault();
                window.dispatchEvent(new Event('contact:open'));
              }}
            >
              Get In Touch
            </a>
          </motion.div>
        </div>

        <div className="hero-portrait-col">
          <motion.span
            className="hero-status-chip"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Open to Opportunities
          </motion.span>

          <motion.div
            className="hero-portrait"
            ref={portraitRef}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="hero-portrait-frame">
              <img
                src="/photo_portofolio.jpg"
                alt="Marin Dulja"
                loading="eager"
              />
            </div>
          </motion.div>

          <motion.span
            className="hero-role-chip"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="hero-role-chip-accent" aria-hidden="true" />
            <span className="hero-role-chip-content">
              <strong>Full-Stack Engineer</strong>
              <em>Java · Spring Boot · React</em>
            </span>
          </motion.span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
