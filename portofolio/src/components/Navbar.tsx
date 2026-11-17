import React, { useEffect, useState } from 'react';
import { sections } from '../data/nav';

const Navbar: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(-1);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Track scroll state for navbar background
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Active section tracking via scroll position, robust for tall sections

    // Cache section bounds so the scroll handler never reads layout (offsetTop/
    // offsetHeight) per frame: that read-after-scroll is what triggers forced
    // reflow. Recompute only when layout can actually change (page height).
    // Sections are looked up on every measure: they arrive in a lazy chunk after
    // the nav mounts. Each element keeps its index in `sections`, so a missing
    // section never shifts the highlight onto its neighbour.
    let bounds: Array<{ idx: number; top: number; bottom: number }> = [];
    const measure = () => {
      const tracked = sections
        .map((s, idx) => ({ idx, el: document.querySelector<HTMLElement>(s.href) }))
        .filter((t): t is { idx: number; el: HTMLElement } => !!t.el);
      bounds = tracked.map(({ idx, el }) => ({
        idx,
        top: el.offsetTop,
        bottom: el.offsetTop + el.offsetHeight,
      }));
    };

    let ticking = false;
    const updateActive = () => {
      // Anchor line sits ~140px below the top of the viewport (just under navbar)
      const anchor = window.scrollY + 140;
      let current = -1;
      for (let i = 0; i < bounds.length; i++) {
        if (anchor >= bounds[i].top && anchor < bounds[i].bottom) {
          current = bounds[i].idx;
          break;
        }
      }
      setActiveIdx(current);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateActive);
        ticking = true;
      }
    };

    measure();
    updateActive();
    // Images, pinned sections and filters change the page height after mount.
    const resizeObserver = new ResizeObserver(() => {
      measure();
      onScroll();
    });
    resizeObserver.observe(document.body);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const handleMobileClick = () => {
    setMobileOpen(false);
  };

  const handleNavClick = (_e: React.MouseEvent<HTMLAnchorElement>, _href: string, isMobile = false) => {
    if (isMobile) handleMobileClick();
  };

  return (
    <>
      <nav className={`floating-nav${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-links">
          {sections.map((s, i) => (
            <a
              key={s.href}
              href={s.href}
              className={`nav-link${i === activeIdx ? ' active' : ''}`}
              onClick={(e) => handleNavClick(e, s.href)}
            >
              {s.label}
            </a>
          ))}
          <a
            href="/Marin_Dulja_CV.pdf"
            className="nav-link nav-link-cv"
            target="_blank"
            rel="noopener noreferrer"
          >
            CV
          </a>
        </div>

        <button
          className={`nav-hamburger${mobileOpen ? ' open' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile overlay */}
      <div className={`nav-mobile-overlay${mobileOpen ? ' open' : ''}`}>
        {sections.map((s, i) => (
          <a
            key={s.href}
            href={s.href}
            className={`mobile-nav-link${i === activeIdx ? ' active' : ''}`}
            onClick={(e) => handleNavClick(e, s.href, true)}
          >
            {s.label}
          </a>
        ))}
        <a
          href="/Marin_Dulja_CV.pdf"
          className="mobile-nav-link mobile-nav-link-cv"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleMobileClick}
        >
          CV
        </a>
      </div>
    </>
  );
};

export default Navbar;
