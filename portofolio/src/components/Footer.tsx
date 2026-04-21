import React from 'react';

const ArrowUpIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);

const Footer: React.FC = () => (
  <footer className="footer">
    <a href="#hero" className="footer-back-to-top">
      <ArrowUpIcon />
      Back to top
    </a>
    <p className="footer-copy">
      <span className="footer-copy-mark">&copy; {new Date().getFullYear()}</span>
      <span className="footer-copy-name">Marin Dulja</span>
      <span className="footer-copy-separator">&middot;</span>
      <span className="footer-copy-built">Built with React &amp; TypeScript</span>
    </p>
  </footer>
);

export default Footer;
