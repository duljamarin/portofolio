import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { initDotGrid } from '../animations';

const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const cleanup = initDotGrid(canvasRef.current);
      return cleanup;
    }
  }, []);

  return (
    <section id="hero" className="hero">
      <canvas ref={canvasRef} className="hero-canvas" />

      <div className="hero-content">
        <motion.h1
            className="hero-name"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            Marin Dulja
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
          Full-stack engineer - Java, Spring Boot, React. From banking platforms
          with 240+ microservices to AI-powered trading systems.
        </motion.p>

        <motion.div
          className="hero-ctas"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <a href="#projects" className="btn-primary">
            See My Work
          </a>
          <a href="#contact" className="btn-ghost">
            Get In Touch
          </a>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
