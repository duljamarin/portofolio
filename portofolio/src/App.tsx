import React, { Suspense, lazy, useEffect, useRef } from 'react';
import { MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import {
  initCursorSpotlight,
  initScrollProgress,
  initSmoothScroll,
  printConsoleEasterEgg,
} from './animations';

// Sections after the hero load as a separate chunk (see BelowFold).
const BelowFold = lazy(() => import('./components/BelowFold'));

const App: React.FC = () => {
  const scrollBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const smoothScrollCleanup = initSmoothScroll();
    const cursorCleanup = initCursorSpotlight();
    const scrollCleanup = scrollBarRef.current
      ? initScrollProgress(scrollBarRef.current)
      : undefined;
    printConsoleEasterEgg();

    return () => {
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
