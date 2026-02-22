import React, { useEffect, useRef, useState } from 'react';

const sections = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
];

const Navbar: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(-1);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

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
    // IntersectionObserver for active section tracking
    const sectionEls = sections
      .map((s) => document.querySelector(s.href) as HTMLElement)
      .filter((el): el is HTMLElement => !!el);

    if (!sectionEls.length) return;

    const visibilityMap = new Map<Element, boolean>();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibilityMap.set(entry.target, entry.isIntersecting);
        });
        // Find first visible section
        for (let i = 0; i < sectionEls.length; i++) {
          if (visibilityMap.get(sectionEls[i])) {
            setActiveIdx(i);
            break;
          }
        }
      },
      { threshold: 0.2, rootMargin: '-80px 0px -40% 0px' }
    );

    sectionEls.forEach((el) => observerRef.current!.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  const handleMobileClick = () => {
    setMobileOpen(false);
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
            onClick={handleMobileClick}
          >
            {s.label}
          </a>
        ))}
      </div>
    </>
  );
};

export default Navbar;
