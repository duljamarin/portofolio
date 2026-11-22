import React, { useEffect, useRef } from 'react';
import { MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar';
import { PageContext, type PageInfo } from './pageContext';
import {
  initCursorSpotlight,
  initScrollProgress,
  initSmoothScroll,
  printConsoleEasterEgg,
  scrollToInitialHash,
} from './animations';

type AppProps = PageInfo & { children: React.ReactNode };

/** Shell shared by every page: nav, scroll progress, smooth scroll and cursor spotlight. */
const App: React.FC<AppProps> = ({ pageId, lang, children }) => {
  const scrollBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const smoothScrollCleanup = initSmoothScroll();
    // After Lenis exists: a deep link (/#mentoring) is re-aligned on its section.
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
    <PageContext.Provider value={{ pageId, lang }}>
      {/* reducedMotion="user": framer-motion skips transform animations when the
          visitor asks the OS for reduced motion. */}
      <MotionConfig reducedMotion="user">
        <div id="top">
          <div className="scroll-progress" ref={scrollBarRef} />
          <Navbar />
          {children}
        </div>
      </MotionConfig>
    </PageContext.Provider>
  );
};

export default App;
