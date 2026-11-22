import React from 'react';
import { motion } from 'framer-motion';
import { EASE_OUT } from '../../animations';
import { useRevealControls } from '../../hooks/useRevealControls';

export type Segment = { text: string; className?: string };

type SplitRevealProps = {
  as?: 'h1' | 'h2' | 'h3' | 'p';
  className?: string;
  id?: string;
  /** Plain text, or segments when some words need their own class (accent color). */
  text: string | Segment[];
  /** Seconds between words. */
  stagger?: number;
};

const WORD_VARIANTS = {
  hidden: { y: '110%', opacity: 0, filter: 'blur(8px)', transition: { duration: 0 } },
  visible: { y: '0%', opacity: 1, filter: 'blur(0px)' },
};

/**
 * Heading whose words rise out of a clip mask with a blur, one after another,
 * the first time it scrolls into view. Screen readers get the whole line.
 * The prerendered HTML shows the words in place (see useRevealControls); only
 * headings still below the viewport after hydration are hidden and revealed.
 */
export const SplitReveal: React.FC<SplitRevealProps> = ({ as = 'h2', className, id, text, stagger = 0.06 }) => {
  const segments: Segment[] = typeof text === 'string' ? [{ text }] : text;
  const label = segments.map((s) => s.text).join('');
  const Tag = motion[as];
  const { ref, controls } = useRevealControls<HTMLHeadingElement>('-60px');

  let wordIndex = 0;
  return (
    <Tag ref={ref} id={id} className={className} aria-label={label} animate={controls}>
      {segments.map((seg, s) => (
        <span key={s} className={seg.className} aria-hidden="true">
          {/* Split on breaking whitespace only: a no-break space keeps two words in one unit. */}
          {seg.text.split(/([ \t\r\n]+)/).map((part, p) => {
            if (!part) return null;
            if (/^[ \t\r\n]+$/.test(part)) return <React.Fragment key={p}> </React.Fragment>;
            const i = wordIndex++;
            return (
              <span key={p} className="split-word">
                <motion.span
                  className="split-word-inner"
                  variants={WORD_VARIANTS}
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
