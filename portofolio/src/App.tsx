import React, { Suspense, lazy, useEffect, useRef } from 'react';
import { MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import {
  initCursorSpotlight,
  initScrollProgress,
  initSmoothScroll,
  printConsoleEasterEgg,
  scrollToInitialHash,
} from './animations';

// Sections after the hero load as a separate chunk (see BelowFold).
const BelowFold = lazy(() => import('./components/BelowFold'));

const App: React.FC = () => {
  const scrollBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const smoothScrollCleanup = initSmoothScroll();
    // After Lenis exists: a deep link (/#mentoring) lands on its section, otherwise the top.
    const initialHashCleanup = scrollToInitialHash();
    const cursorCleanup = initCursorSpotlight();
    const scrollCleanup = scrollBarRef.current
      ? initScrollProgress(scrollBarRef.current)
      : undefined;
    printConsoleEasterEgg();

    return () => {
      initialHashCleanup();
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
        {/* The fallback holds a screen of space so the hero never jumps. */}
        <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
          <BelowFold />
        </Suspense>
      </div>
    </MotionConfig>
  );
};

export default App;
