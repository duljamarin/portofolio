import React from 'react';
import { motion } from 'framer-motion';
import { DUR_REVEAL, EASE_OUT } from '../../animations';
import { useRevealControls } from '../../hooks/useRevealControls';

type RevealTag = 'div' | 'header' | 'p' | 'nav' | 'section' | 'aside' | 'h3' | 'li';

type RevealProps = {
  as?: RevealTag;
  className?: string;
  id?: string;
  /** Rise distance in px. */
  y?: number;
  /** Seconds before the entrance starts. */
  delay?: number;
  duration?: number;
  /** IntersectionObserver root margin, like framer-motion's viewport.margin. */
  margin?: string;
  children: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'className' | 'id'>;

/**
 * Fade-and-rise entrance on first scroll into view. The prerendered HTML shows
 * the content in place; see useRevealControls for when it hides and plays.
 */
export const Reveal: React.FC<RevealProps> = ({
  as = 'div',
  className,
  id,
  y = 20,
  delay = 0,
  duration = DUR_REVEAL,
  margin = '-50px',
  children,
  ...rest
}) => {
  const { ref, controls } = useRevealControls<HTMLElement>(margin);
  const Component = motion[as] as React.ElementType;
  return (
    <Component
      ref={ref}
      id={id}
      className={className}
      animate={controls}
      variants={{
        hidden: { opacity: 0, y, transition: { duration: 0 } },
        visible: { opacity: 1, y: 0, transition: { duration, delay, ease: EASE_OUT } },
      }}
      {...rest}
    >
      {children}
    </Component>
  );
};
