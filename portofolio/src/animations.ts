/**
 * animations.ts — Utility functions for dot grid background,
 * counter animations, custom cursor, scroll progress, and console easter egg.
 * Kept lightweight — Framer Motion handles component-level animations.
 */

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
   CUSTOM CURSOR
   ============================================ */
export function initCustomCursor(): (() => void) | null {
  if (window.matchMedia('(hover: none)').matches) return null;

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.appendChild(dot);

  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.appendChild(ring);

  let mouseX = 0;
  let mouseY = 0;
  let dotX = 0;
  let dotY = 0;
  let ringX = 0;
  let ringY = 0;
  let rafId: number;

  function onMouseMove(e: MouseEvent) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  function animate() {
    dotX += (mouseX - dotX) * 0.2;
    dotY += (mouseY - dotY) * 0.2;
    ringX += (mouseX - ringX) * 0.1;
    ringY += (mouseY - ringY) * 0.1;

    dot.style.transform = `translate(${dotX}px, ${dotY}px)`;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;

    rafId = requestAnimationFrame(animate);
  }

  function onMouseOver(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (
      target.closest('a, button, [role="button"], .project-card, .bento-card, .project-featured, .experience-card')
    ) {
      dot.classList.add('hovering');
      ring.classList.add('hovering');
    }
  }

  function onMouseOut(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (
      target.closest('a, button, [role="button"], .project-card, .bento-card, .project-featured, .experience-card')
    ) {
      dot.classList.remove('hovering');
      ring.classList.remove('hovering');
    }
  }

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseover', onMouseOver);
  document.addEventListener('mouseout', onMouseOut);
  rafId = requestAnimationFrame(animate);

  return () => {
    cancelAnimationFrame(rafId);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseover', onMouseOver);
    document.removeEventListener('mouseout', onMouseOut);
    dot.remove();
    ring.remove();
  };
}

/* ============================================
   DOT GRID BACKGROUND (Canvas) — toned down
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
        ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`;
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
    'color: #10B981',
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
