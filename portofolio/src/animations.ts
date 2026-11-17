/**
 * animations.ts: smooth scroll (Lenis), cursor spotlight, counter animations,
 * scroll progress, dot grid background and the console easter egg.
 * Kept lightweight: Framer Motion handles component-level animations.
 */
import Lenis from 'lenis';

/* ============================================
   MOTION TOKENS (scroll story redesign)
   Mirror of --dur-reveal, --ease-out and --stagger in the :root block of
   src/styles/main.css. Change a value there and here together.
   ============================================ */
export const DUR_REVEAL = 0.6;                                        // s, --dur-reveal: 600ms
export const EASE_OUT: [number, number, number, number] = [0.2, 0.7, 0.2, 1]; // --ease-out
export const REVEAL_STAGGER = DUR_REVEAL / 7.5;                       // s, --stagger (80ms)

export const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Legacy "minimal motion" constants, used only by sections the redesign does not touch.
// Source of truth for motion, mirroring --dur and --space in main.css.
export const DUR = 0.18;            // seconds; must equal the ms value of --dur / 1000
export const STAGGER = DUR / 3;
export const SHIFT = 16;            // px; must equal 2 * the px value of --space

// Shared entrance variant for the redesigned sections (Experience, Contact, Projects).
// Permitted properties only: opacity, y.
export const fadeIn = {
  hidden: { opacity: 0, y: SHIFT },
  visible: { opacity: 1, y: 0 },
};

/* ============================================
   ANIMATED COUNTER
   ============================================ */
export function initCounters(): void {
  const counters = document.querySelectorAll<HTMLElement>('[data-count]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const target = parseInt(el.dataset.count || '0', 10);
          const suffix = el.dataset.suffix || '';
          const prefix = el.dataset.prefix || '';
          animateCount(el, target, prefix, suffix);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.3 }
  );

  counters.forEach((el) => observer.observe(el));
}

function animateCount(
  el: HTMLElement,
  target: number,
  prefix: string,
  suffix: string
): void {
  const duration = 1500;
  const start = performance.now();

  function step(now: number) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = `${prefix}${current}${suffix}`;
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }
  requestAnimationFrame(step);
}

/* ============================================
   SMOOTH SCROLL (Lenis)
   One instance for the whole app. Components scroll through
   scrollToTarget() so they work with or without Lenis.
   ============================================ */
const LENIS_LERP = 0.1;
let lenis: Lenis | null = null;

export function scrollToTarget(target: string | HTMLElement | number, offset = 0): void {
  if (lenis) {
    lenis.scrollTo(target, { offset });
    return;
  }
  let top: number;
  if (typeof target === 'number') {
    top = target;
  } else {
    const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
    if (!el) return;
    top = el.getBoundingClientRect().top + window.scrollY;
  }
  window.scrollTo({ top: top + offset, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

export function initSmoothScroll(): () => void {
  // In-page anchors go through scrollToTarget in both modes, so hash links
  // behave the same with Lenis on (smooth) and off (reduced motion).
  const onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;
    const el = document.querySelector<HTMLElement>(hash);
    if (!el) return;
    e.preventDefault();
    scrollToTarget(el);
    history.replaceState(null, '', hash);
  };
  document.addEventListener('click', onClick);

  if (!prefersReducedMotion()) {
    lenis = new Lenis({
      lerp: LENIS_LERP,
      autoRaf: true,
      // Modals and the mobile menu lock the page; let their events scroll natively.
      prevent: (node) => !!node.closest('.gallery-modal-overlay, .nav-mobile-overlay'),
    });
  }

  return () => {
    document.removeEventListener('click', onClick);
    lenis?.destroy();
    lenis = null;
  };
}

/* ============================================
   CURSOR SPOTLIGHT
   A single fixed layer that follows the pointer with inertia.
   Its size and color live in .cursor-spotlight in main.css.
   The rAF loop only runs while the layer is catching up to the pointer.
   ============================================ */
const SPOTLIGHT_LERP = 0.12;
const SPOTLIGHT_SETTLE = 0.1; // px; below this distance the loop stops

export function initCursorSpotlight(): (() => void) | null {
  if (window.matchMedia('(hover: none)').matches || prefersReducedMotion()) return null;

  const layer = document.createElement('div');
  layer.className = 'cursor-spotlight';
  layer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(layer);

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let x = targetX;
  let y = targetY;
  let rafId = 0;

  const frame = () => {
    x += (targetX - x) * SPOTLIGHT_LERP;
    y += (targetY - y) * SPOTLIGHT_LERP;
    layer.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    if (Math.abs(targetX - x) > SPOTLIGHT_SETTLE || Math.abs(targetY - y) > SPOTLIGHT_SETTLE) {
      rafId = requestAnimationFrame(frame);
    } else {
      rafId = 0;
    }
  };

  const onMove = (e: PointerEvent) => {
    targetX = e.clientX;
    targetY = e.clientY;
    layer.dataset.active = 'true';
    if (!rafId) rafId = requestAnimationFrame(frame);
  };
  const onLeave = () => {
    layer.dataset.active = 'false';
  };

  document.addEventListener('pointermove', onMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeave);

  return () => {
    cancelAnimationFrame(rafId);
    document.removeEventListener('pointermove', onMove);
    document.documentElement.removeEventListener('pointerleave', onLeave);
    layer.remove();
  };
}

/* ============================================
   DOT GRID BACKGROUND (Canvas), toned down
   ============================================ */
export function initDotGrid(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext('2d')!;
  let mouseX = -1000;
  let mouseY = -1000;
  let rafId: number;
  const dotSpacing = 35;
  const dotBaseSize = 1.2;
  const dotBaseAlpha = 0.12;
  const interactRadius = 180;

  function resize() {
    const rect = canvas.parentElement?.getBoundingClientRect();
    if (rect) {
      canvas.width = rect.width;
      canvas.height = rect.height;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let x = 0; x < canvas.width; x += dotSpacing) {
      for (let y = 0; y < canvas.height; y += dotSpacing) {
        const dx = x - mouseX;
        const dy = y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - dist / interactRadius);

        const size = dotBaseSize + influence * 3;
        const alpha = dotBaseAlpha + influence * 0.45;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(216, 162, 42, ${alpha})`;
        ctx.fill();
      }
    }

    rafId = requestAnimationFrame(draw);
  }

  function onMouseMove(e: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  }

  function onMouseLeave() {
    mouseX = -1000;
    mouseY = -1000;
  }

  let isVisible = true;
  const observer = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        rafId = requestAnimationFrame(draw);
      } else {
        cancelAnimationFrame(rafId);
      }
    },
    { threshold: 0 }
  );

  resize();
  observer.observe(canvas);
  canvas.parentElement?.addEventListener('mousemove', onMouseMove);
  canvas.parentElement?.addEventListener('mouseleave', onMouseLeave);
  window.addEventListener('resize', resize);
  rafId = requestAnimationFrame(draw);

  return () => {
    cancelAnimationFrame(rafId);
    observer.disconnect();
    canvas.parentElement?.removeEventListener('mousemove', onMouseMove);
    canvas.parentElement?.removeEventListener('mouseleave', onMouseLeave);
    window.removeEventListener('resize', resize);
  };
}

/* ============================================
   SCROLL PROGRESS
   ============================================ */
export function initScrollProgress(el: HTMLElement): () => void {
  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    el.style.transform = `scaleX(${progress})`;
  }

  window.addEventListener('scroll', update, { passive: true });
  update();

  return () => window.removeEventListener('scroll', update);
}

/* ============================================
   CONSOLE EASTER EGG
   ============================================ */
export function printConsoleEasterEgg(): void {
  const styles = [
    'color: #D8A22A',
    'font-size: 14px',
    'font-family: monospace',
    'font-weight: bold',
  ].join(';');

  const art = `
%c
   __  __            _         ____        _ _
  |  \\/  | __ _ _ __(_)_ __   |  _ \\ _   _| (_) __ _
  | |\\/| |/ _\` | '__| | '_ \\  | | | | | | | | |/ _\` |
  | |  | | (_| | |  | | | | | | |_| | |_| | | | (_| |
  |_|  |_|\\__,_|_|  |_|_| |_| |____/ \\__,_|_| |\\__,_|
                                            |__/

  Thanks for inspecting! 👋
  GitHub: https://github.com/duljamarin
  Email: duljamarin@gmail.com

  Built with React + TypeScript + Framer Motion
  `;

  console.log(art, styles);
}
