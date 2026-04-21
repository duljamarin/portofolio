import React, { useEffect, useState } from 'react';

const sections = [
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
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

    let ticking = false;
    const updateActive = () => {
      // Anchor line sits ~120px below the top of the viewport (just under navbar)
      const anchor = window.scrollY + 140;
      let current = -1;
      for (let i = 0; i < sectionEls.length; i++) {
        const el = sectionEls[i];
        const top = el.offsetTop;
        const bottom = top + el.offsetHeight;
        if (anchor >= top && anchor < bottom) {
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

    window.addEventListener('scroll', onScroll, { passive: true });
    updateActive();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleMobileClick = () => {
    setMobileOpen(false);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, isMobile = false) => {
    if (href === '#contact') {
      e.preventDefault();
      window.dispatchEvent(new Event('contact:open'));
    }
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
      </div>
    </>
  );
};

export default Navbar;
