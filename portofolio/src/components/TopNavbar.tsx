import React, { useRef, useState, useEffect } from 'react';
import '../styles/main.css';

const sections = [
  { label: 'About me', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Hard Skills', href: '#hard-skills' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Soft Skills', href: '#soft-skills' },
  { label: 'Education', href: '#education' },
  { label: 'Connect', href: '#connect' },
];

const TopNavbar: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const navRef = useRef<HTMLDivElement>(null);


  // Track active section on scroll
  useEffect(() => {
    const sectionEls: HTMLElement[] = sections
      .map(s => document.querySelector(s.href) as HTMLElement)
      .filter((el): el is HTMLElement => !!el);
    if (!sectionEls.length) return;
    const handleScroll = () => {
      const offsets = sectionEls.map(el => {
        const rect = el.getBoundingClientRect();
        return Math.abs(rect.top - 80); // 80px offset for navbar height
      });
      const minIdx = offsets.indexOf(Math.min(...offsets));
      setActiveIdx(minIdx);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="top-navbar" ref={navRef}>
      <ul>
        {sections.map((s, i) => (
          <li key={s.href}>
            <a
              href={s.href}
              className={`top-navbar-link${i === activeIdx ? ' active' : ''}`}
              tabIndex={0}
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TopNavbar;
