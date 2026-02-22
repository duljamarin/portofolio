/**
 * animations.ts — Utility functions for scroll-triggered animations,
 * typewriter effect, counter animations, custom cursor, and console easter egg.
 * Pure vanilla JS/TS — no external libraries.
 */

/* ============================================
   SCROLL-TRIGGERED FADE-UP (IntersectionObserver)
   ============================================ */
export function initScrollAnimations(): void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.fade-up').forEach((el) => {
    observer.observe(el);
  });
}

/* ============================================
   TYPEWRITER EFFECT
   ============================================ */
export function createTypewriter(
  phrases: string[],
  onUpdate: (text: string) => void,
  options?: { typeSpeed?: number; deleteSpeed?: number; pauseTime?: number }
): () => void {
  const typeSpeed = options?.typeSpeed ?? 80;
  const deleteSpeed = options?.deleteSpeed ?? 40;
  const pauseTime = options?.pauseTime ?? 2000;

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let timeoutId: number;

  function tick() {
    const current = phrases[phraseIdx];
    if (isDeleting) {
      charIdx--;
      onUpdate(current.slice(0, charIdx));
      if (charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        timeoutId = window.setTimeout(tick, typeSpeed);
      } else {
        timeoutId = window.setTimeout(tick, deleteSpeed);
      }
    } else {
      charIdx++;
      onUpdate(current.slice(0, charIdx));
      if (charIdx === current.length) {
        isDeleting = true;
        timeoutId = window.setTimeout(tick, pauseTime);
      } else {
        timeoutId = window.setTimeout(tick, typeSpeed);
      }
    }
  }

  tick();
  return () => window.clearTimeout(timeoutId);
}

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
    // ease out cubic
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
  // Skip on touch devices
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
    // Lerp for smooth following
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
      target.closest('a, button, [role="button"], .project-card, .bento-card, .project-gallery-preview')
    ) {
      dot.classList.add('hovering');
      ring.classList.add('hovering');
    }
  }

  function onMouseOut(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (
      target.closest('a, button, [role="button"], .project-card, .bento-card, .project-gallery-preview')
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
   DOT GRID BACKGROUND (Canvas)
   ============================================ */
export function initDotGrid(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext('2d')!;
  let mouseX = -1000;
  let mouseY = -1000;
  let rafId: number;
  const dotSpacing = 30;
  const dotBaseSize = 1.5;
  const dotBaseAlpha = 0.12;
  const interactRadius = 120;

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

        const size = dotBaseSize + influence * 2;
        const alpha = dotBaseAlpha + influence * 0.4;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 136, ${alpha})`;
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

  // Use IntersectionObserver to pause when off-screen
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
   TIMELINE NODE PULSE ANIMATION
   ============================================ */
export function initTimelineNodes(): void {
  const nodes = document.querySelectorAll('.timeline-node');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('pulse');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  nodes.forEach((node) => observer.observe(node));
}

/* ============================================
   CONSOLE EASTER EGG
   ============================================ */
export function printConsoleEasterEgg(): void {
  const styles = [
    'color: #00FF88',
    'font-size: 14px',
    'font-family: monospace',
    'font-weight: bold',
    'text-shadow: 0 0 10px rgba(0, 255, 136, 0.5)',
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
  GitHub: https://github.com/freudmarin
  Email: duljamarin@gmail.com

  Built with React + TypeScript + pure CSS animations
  `;

  console.log(art, styles);
}
