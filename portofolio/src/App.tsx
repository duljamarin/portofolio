import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Skills from './components/Skills';
import TestimonialsSection from './components/TestimonialsSection';
import EducationSection from './components/EducationSection';
import Contact from './components/Contact';
import Footer from './components/Footer';
import {
  initScrollAnimations,
  initCounters,
  initCustomCursor,
  initTimelineNodes,
  printConsoleEasterEgg,
} from './animations';

const App: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);

    // Initialize all animations after DOM is ready
    const timer = setTimeout(() => {
      initScrollAnimations();
      initCounters();
      initTimelineNodes();
    }, 100);

    const cursorCleanup = initCustomCursor();
    printConsoleEasterEgg();

    return () => {
      clearTimeout(timer);
      cursorCleanup?.();
    };
  }, []);

  return (
    <div>
      {/* Loading bar */}
      <div className="loading-bar" />

      <Navbar />
      <Hero />
      <div className="section-divider" />
      <About />
      <div className="section-divider" />
      <Projects />
      <div className="section-divider" />
      <Experience />
      <div className="section-divider" />
      <Skills />
      <div className="section-divider" />
      <TestimonialsSection />
      <div className="section-divider" />
      <EducationSection />
      <div className="section-divider" />
      <Contact />
      <Footer />
    </div>
  );
};

export default App;
