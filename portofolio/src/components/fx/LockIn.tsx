import React, { useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';

/** Scroll progress at which an element counts as "locked in". */
const LOCK_AT = 0.97;

type Tag = 'div' | 'article' | 'li' | 'aside';

type LockInProps = {
  as?: Tag;
  className?: string;
  /** Alternates the 3D swing direction (even: from the left, odd: from the right). */
  index?: number;
  /** 0..1, scales rotation, travel and zoom. 1 = the certificate effect. */
  intensity?: number;
  style?: React.CSSProperties;
  children: React.ReactNode | ((state: { locked: boolean; progress: MotionValue<number> }) => React.ReactNode);
};

/**
 * Scroll-driven 3D entrance that "locks in" once: rotates, rises and scales
 * into place on a spring, then sets data-locked so CSS can fire the ring
 * pulse, spark burst and sheen. Under reduced motion it renders locked and still.
 */
export const LockIn: React.FC<LockInProps> = ({ as = 'div', className, index = 0, intensity = 1, style, children }) => {
  const reduceMotion = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const [locked, setLocked] = useState(false);
  const isLocked = locked || reduceMotion;

  // 0 when the top enters the viewport, 1 when the center reaches 65% of its height.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center 0.65'] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 22, mass: 0.4 });

  const side = index % 2 ? 1 : -1;
  const rotateX = useTransform(progress, [0, 1], [34 * intensity, 0]);
  const rotateY = useTransform(progress, [0, 1], [14 * side * intensity, 0]);
  const y = useTransform(progress, [0, 1], [140 * intensity, 0]);
  const scale = useTransform(progress, [0, 1], [1 - 0.22 * intensity, 1]);
  const opacity = useTransform(progress, [0, 0.35, 1], [0, 0.85, 1]);

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (p >= LOCK_AT) setLocked(true);
  });

  const Component = motion[as];
  return (
    <Component
      ref={ref as React.Ref<never>}
      className={`lockin${className ? ` ${className}` : ''}`}
      data-locked={isLocked || undefined}
      style={reduceMotion ? style : { ...style, rotateX, rotateY, y, scale, opacity, transformPerspective: 1100 }}
    >
      {typeof children === 'function' ? children({ locked: isLocked, progress: scrollYProgress }) : children}
    </Component>
  );
};

/** Sparks that fly out when the nearest [data-locked] ancestor locks in. */
const SPARKS = Array.from({ length: 14 }, (_, i) => ({
  angle: (360 / 14) * i + (i % 2 ? 8 : -6),
  distance: 70 + (i % 3) * 28,
  delay: (i % 4) * 30,
}));

export const SparkBurst: React.FC<{ className?: string; scale?: number }> = ({ className, scale = 1 }) => (
  <span className={`fx-burst${className ? ` ${className}` : ''}`} aria-hidden="true">
    {SPARKS.map((s, i) => (
      <span
        key={i}
        className="fx-burst-spark"
        style={
          {
            '--a': `${s.angle}deg`,
            '--d': `${s.distance * scale}px`,
            '--delay': `${s.delay}ms`,
          } as React.CSSProperties
        }
      />
    ))}
  </span>
);
