import React, { useEffect, useRef } from 'react';
import { MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowIBuild from './components/HowIBuild';
import About from './components/About';
import Projects from './components/Projects';
import Offer from './components/Offer';
import Skills from './components/Skills';
import TestimonialsSection from './components/TestimonialsSection';
import EducationSection from './components/EducationSection';
import Contact from './components/Contact';
import Footer from './components/Footer';
import {
  initCounters,
  initCursorSpotlight,
  initScrollProgress,
  initSmoothScroll,
  printConsoleEasterEgg,
} from './animations';

const App: React.FC = () => {
  const scrollBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      initCounters();
    }, 100);

    const smoothScrollCleanup = initSmoothScroll();
    const cursorCleanup = initCursorSpotlight();
    const scrollCleanup = scrollBarRef.current
      ? initScrollProgress(scrollBarRef.current)
      : undefined;
    printConsoleEasterEgg();

    return () => {
      clearTimeout(timer);
      smoothScrollCleanup();
      cursorCleanup?.();
      scrollCleanup?.();
    };
  }, []);

  return (
    // reducedMotion="user": framer-motion skips transform animations when the
    // visitor asks the OS for reduced motion.
    <MotionConfig reducedMotion="user">
      <div>
        <div className="scroll-progress" ref={scrollBarRef} />
        <Navbar />
        <Hero />
        <HowIBuild />
        <Projects />
        <Offer />
        {/* Mentoring (Phase 4) */}
        <About />
        <Skills />
        <TestimonialsSection />
        <EducationSection />
        <Contact />
        <Footer />
      </div>
    </MotionConfig>
  );
};

export default App;
