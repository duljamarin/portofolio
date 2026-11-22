import { useSyncExternalStore } from 'react';
import { useReducedMotion } from 'framer-motion';

const subscribeNever = () => () => {};

/**
 * false while rendering on the server and during hydration, true afterwards.
 * Anything that depends on the browser (viewport, motion settings, feature
 * detection) must wait for this, or the first client render would differ from
 * the prerendered HTML and React would report a hydration mismatch.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribeNever, () => true, () => false);
}

/** The visitor's reduced-motion setting, read only after hydration (false before). */
export function useHydratedReducedMotion(): boolean {
  const reduceMotion = useReducedMotion();
  const hydrated = useHydrated();
  return hydrated && !!reduceMotion;
}
