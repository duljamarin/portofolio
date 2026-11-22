import React, { Suspense, lazy } from 'react';
import Hero from '../components/Hero';

// Sections after the hero load as a separate chunk (see BelowFold). The server
// render waits for it, so the HTML still contains every section.
const BelowFold = lazy(() => import('../components/BelowFold'));

const HomePage: React.FC = () => (
  <>
    <Hero />
    {/* The fallback holds a screen of space so the hero never jumps. */}
    <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
      <BelowFold />
    </Suspense>
  </>
);

export default HomePage;
