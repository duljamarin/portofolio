import React, { useEffect, useRef, useState } from 'react';
import { createTypewriter, initDotGrid } from '../animations';

const roles = [
  'Full-Stack Developer',
  'Java & Spring Boot Engineer',
  'React & Javascript',
  'Freelance Problem Solver',
];

const Hero: React.FC = () => {
  const [typewriterText, setTypewriterText] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cleanup = createTypewriter(roles, setTypewriterText, {
      typeSpeed: 80,
      deleteSpeed: 40,
      pauseTime: 2000,
    });
    return cleanup;
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      const cleanup = initDotGrid(canvasRef.current);
      return cleanup;
    }
  }, []);

  return (
    <section id="hero" className="hero">
      {/* Dot grid background */}
      <canvas ref={canvasRef} className="hero-canvas" />

      {/* Animated scan line */}
      <div className="scan-line" />

      <div className="hero-content">
        <h1 className="hero-name fade-up">Marin Dulja</h1>

        <div className="typewriter-wrapper fade-up">
          <span className="typewriter-text">{typewriterText}</span>
          <span className="typewriter-cursor" />
        </div>

        <p className="hero-bio fade-up">
          Building scalable, reliable, and modern web applications with Java,
          Spring Boot, and React.js — turning ideas into fast, maintainable solutions.
        </p>

        <div className="hero-ctas fade-up">
          <a href="#projects" className="btn-primary">
            View My Work
          </a>
          <a href="#contact" className="btn-ghost">
            Get In Touch
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
