import { useEffect, useRef } from 'react';
import { useAnimationControls } from 'framer-motion';
import { prefersReducedMotion } from '../animations';

/**
 * Scroll reveal that never ships hidden text.
 *
 * The server and the hydration render leave the element as it is (visible, no
 * inline style), so the prerendered HTML always shows the text. After hydration,
 * an element that is still below the viewport jumps to its 'hidden' variant
 * (off screen, so nobody sees the jump) and plays 'visible' when it scrolls in.
 * Elements already on screen or scrolled past simply stay visible.
 */
export function useRevealControls<T extends Element>(margin = '-50px') {
  const ref = useRef<T>(null);
  const controls = useAnimationControls();

  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion()) return;
    if (element.getBoundingClientRect().top < window.innerHeight) return;

    // start(), not set(): the element has no motion values yet (no `initial`), and
    // set() would create them without rendering. 'hidden' has a 0s transition.
    controls.start('hidden');
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        controls.start('visible');
      },
      { rootMargin: margin }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [controls, margin]);

  return { ref, controls };
}
