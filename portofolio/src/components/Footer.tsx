import React from 'react';

const Footer: React.FC = () => (
  <footer className="footer">
    <a href="#hero" className="footer-back-to-top">&uarr; Back to top</a>
    <p className="footer-copy">
      &copy; {new Date().getFullYear()} Marin Dulja &mdash; Built with React &amp; TypeScript
    </p>
  </footer>
);

export default Footer;
