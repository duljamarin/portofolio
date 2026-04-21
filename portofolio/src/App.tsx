import React, { useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Skills from './components/Skills';
import TestimonialsSection from './components/TestimonialsSection';
import EducationSection from './components/EducationSection';
import Contact from './components/Contact';
import ContactModal from './components/ContactModal';
import Footer from './components/Footer';
import {
  initCounters,
  initCustomCursor,
  initScrollProgress,
  printConsoleEasterEgg,
} from './animations';

const App: React.FC = () => {
  const scrollBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      initCounters();
    }, 100);

    const cursorCleanup = initCustomCursor();
    const scrollCleanup = scrollBarRef.current
      ? initScrollProgress(scrollBarRef.current)
      : undefined;
    printConsoleEasterEgg();

    return () => {
      clearTimeout(timer);
      cursorCleanup?.();
      scrollCleanup?.();
    };
  }, []);

  return (
    <div>
      <div className="scroll-progress" ref={scrollBarRef} />
      <Navbar />
      <Hero />
      <Projects />
      <Experience />
      <About />
      <Skills />
      <TestimonialsSection />
      <EducationSection />
      <Contact />
      <Footer />
      <ContactModal />
    </div>
  );
};

export default App;
