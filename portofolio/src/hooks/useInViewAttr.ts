import { useEffect, type RefObject } from 'react';

/**
 * Mirrors the element's visibility into a data-inview="true|false" attribute.
 * CSS uses it to pause decorative continuous animations off screen:
 *   [data-inview="false"] .thing { animation-play-state: paused; }
 * Writing an attribute (not React state) keeps visibility changes from re-rendering.
 */
export function useInViewAttr(ref: RefObject<HTMLElement | null>, rootMargin = '0px'): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        el.dataset.inview = entry.isIntersecting ? 'true' : 'false';
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin]);
}
