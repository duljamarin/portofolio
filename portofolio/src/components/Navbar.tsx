import React, { useEffect, useState } from 'react';

const sections = [
  { label: 'Projects', href: '#projects' },
  { label: 'Offer', href: '#offer' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
];

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
    // Active section tracking via scroll position — robust for tall sections
    const sectionEls = sections
      .map((s) => document.querySelector(s.href) as HTMLElement)
      .filter((el): el is HTMLElement => !!el);

    if (!sectionEls.length) return;

    // Cache section bounds so the scroll handler never reads layout (offsetTop/
    // offsetHeight) per frame — that read-after-scroll is what triggers forced
    // reflow. Recompute only when layout can actually change (resize/load).
    let bounds: Array<{ top: number; bottom: number }> = [];
    const measure = () => {
      bounds = sectionEls.map((el) => ({
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
          current = i;
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
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      window.removeEventListener('load', measure);
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
          aria-label="Toggle navigation menu"
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
          className="mobile-nav-link"
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
