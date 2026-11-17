import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT } from '../../animations';

export type Segment = { text: string; className?: string };

type SplitRevealProps = {
  as?: 'h2' | 'h3' | 'p';
  className?: string;
  id?: string;
  /** Plain text, or segments when some words need their own class (accent color). */
  text: string | Segment[];
  /** Seconds between words. */
  stagger?: number;
};

/**
 * Heading whose words rise out of a clip mask with a blur, one after another,
 * the first time it enters the viewport. Screen readers get the whole line.
 */
export const SplitReveal: React.FC<SplitRevealProps> = ({ as = 'h2', className, id, text, stagger = 0.06 }) => {
  const reduceMotion = useReducedMotion();
  const segments: Segment[] = typeof text === 'string' ? [{ text }] : text;
  const label = segments.map((s) => s.text).join('');
  const Tag = motion[as];

  let wordIndex = 0;
  return (
    <Tag
      id={id}
      className={className}
      aria-label={label}
      initial={reduceMotion ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {segments.map((seg, s) => (
        <span key={s} className={seg.className} aria-hidden="true">
          {seg.text.split(/(\s+)/).map((part, p) => {
            if (!part) return null;
            if (/^\s+$/.test(part)) return <React.Fragment key={p}> </React.Fragment>;
            const i = wordIndex++;
            return (
              <span key={p} className="split-word">
                <motion.span
                  className="split-word-inner"
                  variants={{
                    hidden: { y: '110%', opacity: 0, filter: 'blur(8px)' },
                    visible: { y: '0%', opacity: 1, filter: 'blur(0px)' },
                  }}
                  transition={{ duration: 0.7, delay: i * stagger, ease: EASE_OUT }}
                >
                  {part}
                </motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
};
