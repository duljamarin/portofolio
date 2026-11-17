import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { motion, useInView, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';
import { projects, type Project } from '../data/projects';
import GalleryModal from './GalleryModal';
import { animateCountText, DUR_REVEAL, EASE_OUT, formatCount, parseCount, scrollToTarget } from '../animations';
import { useInViewAttr } from '../hooks/useInViewAttr';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { SplitReveal } from './fx/SplitReveal';

/* ============================================
   STACK: SOURCE OF TRUTH
   Every position, the rail and the active index derive from these.
   ============================================ */
const CARD_H = 560;      // px, card height (capped to what fits under the nav, see cardHeight)
const GAP = 48;          // px, space between cards in the scroll flow
const OFFSET = 26;       // px, how much of each covered card peeks above the next
const SCALE_STEP = 0.045;
const DIM_STEP = 0.32;
const BLUR_STEP = 1.6;   // px per covered level
const MIN_OPACITY = 0.2;
const MAX_BLUR = 5;      // px
const COUNT_UP_MS = 1200;

const LIST_QUERY = '(max-width: 999px)';

/** The rotating border animates a registered --angle; without @property it stays a static border. */
const SUPPORTS_ANGLE = typeof CSS !== 'undefined' && 'registerProperty' in CSS;

const TYPE_LABEL: Record<Project['type'], string> = {
  main: 'Main',
  fullstack: 'Fullstack',
  contractor: 'Contractor',
};

/** Types that get their own filter chip ("Main" stays reachable through All). */
const FILTER_TYPES: Project['type'][] = ['fullstack', 'contractor'];

const filterOptions: { key: string; label: string; count: number }[] = [
  { key: 'all', label: 'All', count: projects.length },
  ...FILTER_TYPES
    .map((type) => ({ key: type, label: TYPE_LABEL[type], count: projects.filter((p) => p.type === type).length }))
    .filter((opt) => opt.count > 0),
];

const pad2 = (n: number) => String(n).padStart(2, '0');

const SPARKS = Array.from({ length: 9 }, (_, i) => ({
  x: `${6 + i * 11}%`,
  delay: `${(i * 1.7) % 9}s`,
  dur: `${9 + (i % 4) * 2}s`,
}));

/* ============================================
   LAYOUT METRICS (read on resize, no setState in effects)
   ============================================ */
const subscribeResize = (cb: () => void) => {
  window.addEventListener('resize', cb);
  return () => window.removeEventListener('resize', cb);
};

/** Floating nav height plus var(--space) * 3. */
const getNavOffset = () => {
  const nav = document.querySelector<HTMLElement>('.floating-nav');
  const space = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--space')) || 0;
  return (nav?.offsetHeight ?? 0) + space * 3;
};
const getViewportH = () => window.innerHeight;

/* ============================================
   ICONS
   ============================================ */
const GitHubIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.525.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.254-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.747-1.025 2.747-1.025.546 1.378.202 2.396.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.579.688.481C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
  </svg>
);

const ExternalIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

/* ============================================
   METRIC: counts up once when `start` first becomes true
   ============================================ */
const Metric: React.FC<{ value: string; label: string; start: boolean }> = ({ value, label, start }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);
  const reduceMotion = useReducedMotion();
  const parts = parseCount(value);
  const initial = reduceMotion || !parts ? value : formatCount(parts, 0);

  useEffect(() => {
    if (!start || done.current || !ref.current) return;
    done.current = true;
    return animateCountText(ref.current, value, COUNT_UP_MS);
  }, [start, value]);

  return (
    <div className="deck-metric">
      <span className="sr-only">{value}</span>
      <span className="deck-metric-value" ref={ref} aria-hidden="true">
        {initial}
      </span>
      <span className="deck-metric-label">{label}</span>
    </div>
  );
};

const Metrics: React.FC<{ items: NonNullable<Project['metrics']>; activated: boolean; listMode: boolean }> = ({
  items,
  activated,
  listMode,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const start = listMode ? inView : activated;
  return (
    <div className="deck-metrics" ref={ref}>
      {items.map((m) => (
        <Metric key={m.label} value={m.value} label={m.label} start={start} />
      ))}
    </div>
  );
};

/* ============================================
   SECTION
   ============================================ */
const Projects: React.FC = () => {
  const reduceMotion = useReducedMotion() ?? false;
  const narrow = useMediaQuery(LIST_QUERY);
  const deckMode = !narrow && !reduceMotion;

  const navOffset = useSyncExternalStore(subscribeResize, getNavOffset, () => 0);
  const viewportH = useSyncExternalStore(subscribeResize, getViewportH, () => 0);

  const [galleryOpen, setGalleryOpen] = useState<number | null>(null);
  const [filter, setFilter] = useState('all');
  const [active, setActive] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  useInViewAttr(sectionRef);

  const filtered = useMemo(
    () => (filter === 'all' ? projects : projects.filter((p) => p.type === filter)),
    [filter]
  );
  const count = filtered.length;

  // The whole stack must fit under the nav: covered cards peek OFFSET px each.
  const cardHeight = Math.min(
    CARD_H,
    Math.max(360, viewportH - navOffset - (count - 1) * OFFSET - GAP / 2)
  );
  /** Scroll needed to bring the next card onto its sticky position. */
  const stepScroll = cardHeight + GAP - OFFSET;
  const deckHeight = count * (cardHeight + GAP);

  const { scrollYProgress } = useScroll({ target: deckRef, offset: ['start start', 'end start'] });
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (!deckMode) return;
    const scrolled = navOffset + p * deckHeight;
    const next = Math.max(0, Math.min(count - 1, Math.floor(scrolled / stepScroll)));
    setActive((prev) => (prev === next ? prev : next));
  });

  const chooseFilter = (key: string) => {
    if (key === filter) return;
    setFilter(key);
    setActive(0);
    if (sectionRef.current) scrollToTarget(sectionRef.current);
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="projects-section"
      data-mode={deckMode ? 'deck' : 'list'}
      data-angle={SUPPORTS_ANGLE ? 'on' : 'off'}
      style={
        {
          '--nav-offset': `${navOffset}px`,
          '--card-h': `${cardHeight}px`,
          '--card-gap': `${GAP}px`,
        } as React.CSSProperties
      }
    >
      <div className="projects-bg" aria-hidden="true">
        <div className="fx-grid" />
        <div className="fx-blob fx-blob-a" />
        <div className="fx-blob fx-blob-b" />
        {SPARKS.map((s, i) => (
          <span
            key={i}
            className="fx-spark"
            style={{ '--x': s.x, '--delay': s.delay, '--dur': s.dur } as React.CSSProperties}
          />
        ))}
      </div>

      <div className="projects-inner">
        <motion.header
          className="projects-header"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: DUR_REVEAL, ease: EASE_OUT }}
        >
          <div>
            <p className="section-label">Selected work</p>
            <SplitReveal className="projects-title" text="Projects" />
          </div>
          <div className="project-filter" role="tablist" aria-label="Filter projects by type">
            {filterOptions.map((opt) => (
              <button
                key={opt.key}
                type="button"
                role="tab"
                aria-selected={filter === opt.key}
                className="project-filter-btn"
                data-active={filter === opt.key || undefined}
                onClick={() => chooseFilter(opt.key)}
              >
                {opt.label} <span className="project-filter-count">{opt.count}</span>
              </button>
            ))}
          </div>
        </motion.header>

        <div className="deck-layout">
          <div className="deck" ref={deckRef}>
            {filtered.map((project, i) => {
              const covered = deckMode ? Math.max(0, active - i) : 0;
              const cardStyle: React.CSSProperties = deckMode
                ? {
                    top: `calc(var(--nav-offset) + ${i * OFFSET}px)`,
                    zIndex: i + 1,
                    transform: `scale(${1 - SCALE_STEP * covered})`,
                    opacity: Math.max(MIN_OPACITY, 1 - DIM_STEP * covered),
                    filter: covered ? `blur(${Math.min(MAX_BLUR, BLUR_STEP * covered)}px)` : undefined,
                  }
                : {};
              const galleryIndex = projects.indexOf(project);
              const image = project.gallery?.[0];

              return (
                <article
                  key={project.title}
                  className="deck-card"
                  data-covered={covered > 0 || undefined}
                  data-active={deckMode && i === active ? true : undefined}
                  style={cardStyle}
                >
                  <div className="deck-card-inner">
                    <div className="deck-media">
                      {image ? (
                        <button
                          type="button"
                          className="deck-shot"
                          onClick={() => setGalleryOpen(galleryIndex)}
                          aria-label={`Open screenshot of ${project.title}`}
                        >
                          <span className="deck-shot-float">
                            <img
                              src={image}
                              alt={`${project.title} screenshot`}
                              loading="lazy"
                              decoding="async"
                            />
                          </span>
                        </button>
                      ) : (
                        <div className="deck-shot deck-shot-empty" aria-hidden="true">
                          <span>{'</>'}</span>
                        </div>
                      )}
                    </div>

                    <div className="deck-text">
                      <span className="deck-num" aria-hidden="true">{pad2(i + 1)}</span>
                      <p className="card-label">{project.label ?? TYPE_LABEL[project.type]}</p>
                      <h3 className="deck-title">{project.title}</h3>
                      <p className="deck-desc">{project.description}</p>

                      {project.metrics && project.metrics.length > 0 && (
                        <Metrics items={project.metrics} activated={i <= active} listMode={!deckMode} />
                      )}

                      <ul className="deck-tags">
                        {project.tags.map((tag) => (
                          <li className="deck-tag" key={tag}>{tag}</li>
                        ))}
                      </ul>

                      <div className="deck-links">
                        {project.links.map((link) => (
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="deck-link"
                            key={link.url}
                          >
                            {link.label.toLowerCase().includes('github') ? <GitHubIcon /> : <ExternalIcon />}
                            {link.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="deck-rail" aria-hidden="true">
            <div className="deck-rail-inner">
              <span className="deck-rail-current">{pad2(active + 1)}</span>
              <span className="deck-rail-total">/ {pad2(count)}</span>
              <span className="deck-rail-ticks">
                {filtered.map((p, i) => (
                  <span
                    key={p.title}
                    className="deck-rail-tick"
                    data-state={i < active ? 'done' : i === active ? 'active' : 'future'}
                  />
                ))}
              </span>
              <span className="deck-rail-cue">Scroll the stack</span>
            </div>
          </aside>
        </div>

        <div className="text-center">
          <a
            href="https://github.com/duljamarin?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="view-all-btn"
          >
            View All Projects
            <ExternalIcon />
          </a>
        </div>
      </div>

      {projects.map((project, idx) =>
        project.gallery && project.gallery.length > 0 ? (
          <GalleryModal
            key={project.title}
            images={project.gallery}
            title={project.title}
            isOpen={galleryOpen === idx}
            onClose={() => setGalleryOpen(null)}
          />
        ) : null
      )}
    </section>
  );
};

export default Projects;
