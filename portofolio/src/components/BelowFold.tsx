import React from 'react';
import HowIBuild from './HowIBuild';
import Projects from './Projects';
import Offer from './Offer';
import Mentoring from './Mentoring';
import About from './About';
import Skills from './Skills';
import TestimonialsSection from './TestimonialsSection';
import EducationSection from './EducationSection';
import Contact from './Contact';
import Footer from './Footer';

/**
 * Everything after the hero, loaded as its own chunk so the hero (the LCP)
 * paints before the heavier scroll sections are parsed.
 */
const BelowFold: React.FC = () => (
  <>
    <HowIBuild />
    <Projects />
    <Offer />
    <Mentoring />
    <About />
    <Skills />
    <TestimonialsSection />
    <EducationSection />
    <Contact />
    <Footer />
  </>
);

export default BelowFold;
