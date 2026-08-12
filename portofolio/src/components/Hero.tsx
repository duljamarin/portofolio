import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const Hero: React.FC = () => {
  const portraitRef = useRef<HTMLDivElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);

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

  return (
    <section id="hero" className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <motion.h1
            className="hero-name"
            initial={{ opacity: 1, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="first">Marin</span>
            <span className="last">Dulja</span>
          </motion.h1>

          <motion.p
            className="hero-headline"
            initial={{ opacity: 1, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            I build systems that <span className="accent">scale</span>
          </motion.p>

          <motion.p
            className="hero-bio"
            initial={{ opacity: 1, y: 14 }}
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
            <a href="#contact" className="btn-ghost">
              Get In Touch
            </a>
            <a
              href="/Marin_Dulja_CV.pdf"
              className="btn-ghost"
              target="_blank"
              rel="noopener noreferrer"
            >
              View CV
            </a>
          </motion.div>
        </div>

        <div className="hero-portrait-col">
          <motion.div
            className="hero-portrait"
            ref={portraitRef}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="hero-portrait-frame">
              <picture>
                <source srcSet="/photo_portofolio.webp" type="image/webp" />
                <img
                  src="/photo_portofolio-opt.jpg"
                  alt="Marin Dulja"
                  width={680}
                  height={680}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              </picture>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
