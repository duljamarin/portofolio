import React, { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'framer-motion';
import {
  BRANCH,
  DIAGRAM_H,
  DIAGRAM_W,
  FORK_INDEX,
  MAIN,
  NODES,
  SERVICE_STEP_LEAD,
  STEPS,
} from '../data/howIBuild';
import { buildPath, clamp01, distanceTo, gapRuns, pointAt, runPoints, type Pt, type Run } from '../lib/path';
import { scrollToTarget } from '../animations';
import { useInViewAttr } from '../hooks/useInViewAttr';
import { SplitReveal } from './fx/SplitReveal';

/* ============================================
   DERIVED GEOMETRY (computed once from MAIN, BRANCH and NODES)
   ============================================ */
const mainPath = buildPath(MAIN);
const branchPath = buildPath(BRANCH);
const TOTAL = mainPath.total;
const FORK = mainPath.lengthTo[FORK_INDEX];

const center = (n: { x: number; y: number; w: number; h: number }): Pt => ({ x: n.x + n.w / 2, y: n.y + n.h / 2 });

/** Distance along MAIN at which the packet reaches each node's center. */
const NODE_ARRIVAL = NODES.map((n) =>
  n.on === 'main' ? distanceTo(mainPath, center(n)) : FORK + distanceTo(branchPath, center(n))
);

/**
 * The story runs past the end of the path: after both packets arrive, step 05
 * holds Services B and C highlighted for as long as step 04 took (FORK to TOTAL).
 */
const STORY_TOTAL = TOTAL + (TOTAL - FORK);
/** At the start of step 05 the arrived packets fade out over this distance, as if absorbed. */
const ABSORB = (STORY_TOTAL - TOTAL) * 0.3;

/** Step starts: Edge at 0, Service just past the gateway, Event back at A,
 *  Consumers at the fork, Delivered when both packets reach B and C. */
const STEP_START = [0, mainPath.lengthTo[1] + SERVICE_STEP_LEAD, mainPath.lengthTo[4], FORK, TOTAL];
const STEP_END = STEP_START.map((_, i) => STEP_START[i + 1] ?? STORY_TOTAL);

type Line = { key: string; run: Run; points: string; length: number };
const toPoints = (pts: Pt[]) => pts.map((p) => `${p.x},${p.y}`).join(' ');

/** Connector lines = path stretches between node edges. Distances are in MAIN terms. */
const LINES: Line[] = [
  ...gapRuns(mainPath, NODES.filter((n) => n.on === 'main')).map((run, i) => ({
    key: `m${i}`,
    run,
    points: toPoints(runPoints(mainPath, run)),
    length: run.end - run.start,
  })),
  // The branch shares its first point with MAIN at the fork; only its own stretch is drawn.
  ...gapRuns(branchPath, NODES).map((run, i) => ({
    key: `b${i}`,
    run: { start: FORK + run.start, end: FORK + run.end },
    points: toPoints(runPoints(branchPath, run)),
    length: run.end - run.start,
  })),
];

/** Comet trail: [distance behind the packet, opacity, scale] per ghost. */
const TRAIL: Array<[number, number, number]> = [
  [18, 0.5, 0.8],
  [36, 0.3, 0.65],
  [54, 0.18, 0.5],
];

const SPARKS = [
  { x: '12%', delay: '0s', dur: '9s' },
  { x: '31%', delay: '2.4s', dur: '11s' },
  { x: '54%', delay: '5.1s', dur: '8s' },
  { x: '72%', delay: '1.2s', dur: '10s' },
  { x: '89%', delay: '3.7s', dur: '12s' },
];

/** Orb plus comet trail. paint() positions children[0..TRAIL.length]. */
const Packet: React.FC<{ ref: React.Ref<HTMLDivElement> }> = ({ ref }) => (
  <div className="how-packet" ref={ref}>
    <span className="how-orb" />
    {TRAIL.map(([, alpha, scale], i) => (
      <span
        key={i}
        className="how-orb how-orb-ghost"
        style={{ '--ghost-alpha': alpha, '--ghost-scale': scale } as React.CSSProperties}
      />
    ))}
  </div>
);

/* ============================================
   DISCRETE STATE: changes only at thresholds, so React re-renders rarely
   ============================================ */
/** latest = arrival distance of the most recently reached node(s). */
type StoryState = { activeStep: number; latest: number };

function storyStateAt(d: number): StoryState {
  let activeStep = 0;
  STEP_START.forEach((s, i) => {
    if (s <= d) activeStep = i;
  });
  const reachedArrivals = NODE_ARRIVAL.filter((a) => a <= d + 0.5);
  const latest = reachedArrivals.length ? Math.max(...reachedArrivals) : -1;
  return { activeStep, latest };
}

const sameState = (a: StoryState, b: StoryState) =>
  a.activeStep === b.activeStep && a.latest === b.latest;

/* ============================================
   MEDIA QUERY HOOK
   ============================================ */
const NARROW_QUERY = '(max-width: 900px)';
const subscribeNarrow = (cb: () => void) => {
  const mq = window.matchMedia(NARROW_QUERY);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};
const getNarrow = () => window.matchMedia(NARROW_QUERY).matches;

/* ============================================
   COMPONENT
   ============================================ */
const HowIBuild: React.FC = () => {
  const reduceMotion = useReducedMotion() ?? false;
  const narrow = useSyncExternalStore(subscribeNarrow, getNarrow, () => false);
  const pinned = !narrow && !reduceMotion;

  const wrapRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const packetRef = useRef<HTMLDivElement>(null);
  const branchPacketRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<Array<SVGGElement | null>>([]);
  const barRefs = useRef<Array<HTMLSpanElement | null>>([]);
  useInViewAttr(wrapRef);

  // Pinned: progress runs across the 4-viewport wrapper. Narrow list: across the list itself.
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: pinned ? ['start start', 'end end'] : ['start 0.75', 'end 0.6'],
  });

  const distanceFor = useCallback(
    (progress: number) => (reduceMotion ? STORY_TOTAL : clamp01(progress) * STORY_TOTAL),
    [reduceMotion]
  );

  const [story, setStory] = useState<StoryState>(() => storyStateAt(reduceMotion ? STORY_TOTAL : 0));

  /** Continuous visuals: written straight to the DOM (transforms and CSS vars only). */
  const paint = useCallback((d: number) => {
    const place = (el: HTMLElement | null, p: Pt) => {
      if (el) el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
    };
    const absorbed = 1 - clamp01((d - TOTAL) / ABSORB);
    const paintPacket = (root: HTMLDivElement | null, path: typeof mainPath, dist: number) => {
      if (!root) return;
      root.style.opacity = dist >= 0 ? String(absorbed) : '0';
      const parts = root.children;
      place(parts[0] as HTMLElement, pointAt(path, dist));
      TRAIL.forEach(([behind], i) => {
        const ghost = parts[i + 1] as HTMLElement;
        const gd = dist - behind;
        ghost.style.opacity = gd >= 0 ? '' : '0';
        place(ghost, pointAt(path, gd));
      });
    };

    paintPacket(packetRef.current, mainPath, d);
    paintPacket(branchPacketRef.current, branchPath, d > FORK ? d - FORK : -1);

    LINES.forEach((line, i) => {
      lineRefs.current[i]?.style.setProperty('--fill', String(clamp01((d - line.run.start) / line.length)));
    });
    STEP_START.forEach((s, i) => {
      barRefs.current[i]?.style.setProperty('--fill', String(clamp01((d - s) / (STEP_END[i] - s))));
    });
    stepsRef.current?.style.setProperty('--progress', String(d / STORY_TOTAL));
  }, []);

  const update = useCallback(
    (progress: number) => {
      const d = distanceFor(progress);
      paint(d);
      const next = storyStateAt(d);
      setStory((prev) => (sameState(prev, next) ? prev : next));
    },
    [distanceFor, paint]
  );

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!reduceMotion) update(v);
  });

  // First paint and mode switches (reduced motion, narrow): DOM only, no state.
  useEffect(() => {
    paint(distanceFor(scrollYProgress.get()));
  }, [paint, distanceFor, scrollYProgress, pinned]);

  // One CSS transform scales the 820x444 diagram to its column.
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const ro = new ResizeObserver(([entry]) => {
      box.style.setProperty('--diagram-scale', String(entry.contentRect.width / DIAGRAM_W));
    });
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  const goToStep = (i: number) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const top = wrap.getBoundingClientRect().top + window.scrollY;
    const travel = pinned ? wrap.offsetHeight - window.innerHeight : 0;
    // +1px lands just inside the step's range.
    scrollToTarget(top + (STEP_START[i] / STORY_TOTAL) * travel + 1);
  };

  const { activeStep, latest } = story;

  return (
    <section
      id="how"
      ref={wrapRef}
      className="how-wrap"
      data-pinned={pinned}
      // One viewport of scroll per step.
      style={{ '--how-steps': STEPS.length } as React.CSSProperties}
      aria-labelledby="how-heading"
    >
      <div className="how-stage">
        {/* Decorative background */}
        <div className="how-bg" aria-hidden="true">
          <div className="how-grid" />
          <div className="how-blob" />
          <div className="how-scan" />
          {SPARKS.map((s, i) => (
            <span
              key={i}
              className="how-spark"
              style={{ '--x': s.x, '--delay': s.delay, '--dur': s.dur } as React.CSSProperties}
            />
          ))}
          <AnimatePresence initial={false}>
            <motion.span
              key={STEPS[activeStep].number}
              className="how-bignum"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
            >
              {STEPS[activeStep].number}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="how-inner">
          <header className="how-header">
            <p className="section-label">How I build</p>
            <SplitReveal
              id="how-heading"
              className="section-title"
              text="Follow one request through a system I would build."
            />
          </header>

          <div className="how-body">
            <div className="how-steps-wrap" ref={stepsRef}>
              <span className="how-steps-line" aria-hidden="true">
                <span className="how-steps-line-fill" />
              </span>
              <ol className="how-steps">
                {STEPS.map((step, i) => {
                  const state = i === activeStep ? 'active' : i < activeStep ? 'done' : 'future';
                  return (
                    <li key={step.number}>
                      <button
                        type="button"
                        className="how-step"
                        data-state={state}
                        aria-current={state === 'active' ? 'step' : undefined}
                        onClick={() => goToStep(i)}
                      >
                        <span className="how-step-num">{step.number}</span>
                        <span className="how-step-title">{step.title}</span>
                        {/* Pinned: only the active step opens its text (grid-rows 0fr -> 1fr). */}
                        <span className="how-step-text-wrap">
                          <span className="how-step-text">{step.text}</span>
                        </span>
                        <span className="how-step-bar" aria-hidden="true">
                          <span
                            className="how-step-bar-fill"
                            ref={(el) => {
                              barRefs.current[i] = el;
                            }}
                          />
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>

            <figure className="how-figure">
              <div className="how-diagram-box" ref={boxRef} aria-hidden="true">
                <div className="how-diagram" style={{ width: DIAGRAM_W, height: DIAGRAM_H }}>
                  <svg className="how-lines" width={DIAGRAM_W} height={DIAGRAM_H} viewBox={`0 0 ${DIAGRAM_W} ${DIAGRAM_H}`}>
                    {LINES.map((line, i) => (
                      <g
                        key={line.key}
                        ref={(el) => {
                          lineRefs.current[i] = el;
                        }}
                      >
                        <polyline className="how-line-base" points={line.points} />
                        <polyline className="how-line-fill" points={line.points} pathLength={1} />
                      </g>
                    ))}
                  </svg>

                  {NODES.map((n, idx) => {
                    const visited = latest >= 0 && NODE_ARRIVAL[idx] <= latest;
                    const isLatest = NODE_ARRIVAL[idx] === latest;
                    return (
                      <div
                        key={n.id}
                        className="how-node"
                        data-visited={visited}
                        data-latest={isLatest}
                        // Step 05: the consumers stay lit as the finished state.
                        data-delivered={activeStep === STEPS.length - 1 && NODE_ARRIVAL[idx] === TOTAL ? true : undefined}
                        style={{ left: n.x, top: n.y, width: n.w, height: n.h }}
                      >
                        <span className="how-node-name">{n.name}</span>
                        <span className="how-node-sub">{n.sub}</span>
                        <AnimatePresence>
                          {n.badge && visited && (
                            <motion.span
                              className="how-badge"
                              data-place={n.badge.place}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                              transition={{ type: 'spring', stiffness: 420, damping: 22 }}
                            >
                              {n.badge.text}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}

                  <Packet ref={packetRef} />
                  <Packet ref={branchPacketRef} />
                </div>
              </div>
              <figcaption className="how-caption">
                The same pattern I worked with on a <em>240+ microservice</em> banking platform.
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowIBuild;
