import React, { useEffect, useState } from 'react';
import { navItems } from '../data/nav';
import { ui } from '../data/ui';
import { usePage } from '../pageContext';

const Navbar: React.FC = () => {
  const { pageId, lang } = usePage();
  const items = navItems(lang);
  const labels = ui[lang];
  const onHome = pageId === 'home';

  // On the home page the item of the section in view lights up; on other pages, the page's own item.
  const pageIndex = items.findIndex((item) => pageId !== 'notFound' && item.pages?.includes(pageId));
  const [sectionIndex, setSectionIndex] = useState(-1);
  const activeIndex = onHome ? sectionIndex : pageIndex;

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
    if (!onHome) return;
    // Active section tracking via scroll position, robust for tall sections

    // Cache section bounds so the scroll handler never reads layout (offsetTop/
    // offsetHeight) per frame: that read-after-scroll is what triggers forced
    // reflow. Recompute only when layout can actually change (page height).
    // Sections are looked up on every measure: they arrive in a lazy chunk after
    // the nav mounts. Each element keeps its index in `items`, so a missing
    // section never shifts the highlight onto its neighbour.
    let bounds: Array<{ idx: number; top: number; bottom: number }> = [];
    const measure = () => {
      const tracked = items
        .map((item, idx) => ({ idx, el: item.section ? document.getElementById(item.section) : null }))
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
      setSectionIndex(current);
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
    // items only changes with lang, which is fixed for the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onHome]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <nav className={`floating-nav${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-links">
          {items.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              className={`nav-link${i === activeIndex ? ' active' : ''}`}
              aria-current={i === pageIndex ? 'page' : undefined}
            >
              {item.label}
            </a>
          ))}
          <a
            href="/Marin_Dulja_CV.pdf"
            className="nav-link nav-link-cv"
            target="_blank"
            rel="noopener noreferrer"
          >
            {labels.nav.cv}
          </a>
        </div>

        <button
          className={`nav-hamburger${mobileOpen ? ' open' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? labels.closeMenu : labels.openMenu}
          aria-expanded={mobileOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile overlay */}
      <div className={`nav-mobile-overlay${mobileOpen ? ' open' : ''}`}>
        {items.map((item, i) => (
          <a
            key={item.href}
            href={item.href}
            className={`mobile-nav-link${i === activeIndex ? ' active' : ''}`}
            aria-current={i === pageIndex ? 'page' : undefined}
            onClick={closeMobile}
          >
            {item.label}
          </a>
        ))}
        <a
          href="/Marin_Dulja_CV.pdf"
          className="mobile-nav-link mobile-nav-link-cv"
          target="_blank"
          rel="noopener noreferrer"
          onClick={closeMobile}
        >
          {labels.nav.cv}
        </a>
      </div>
    </>
  );
};

export default Navbar;
