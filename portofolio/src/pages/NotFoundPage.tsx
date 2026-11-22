import React from 'react';
import Footer from '../components/Footer';
import { CrossLinks } from '../components/page/PageParts';
import { pathOf } from '../seo/site';

// Netlify serves dist/404.html (noindex) for any unknown path.
const LINKS = [
  { href: pathOf('home'), label: 'Java developer in Albania: projects and experience' },
  { href: pathOf('freelance'), label: 'Freelance Java developer for remote B2B contracts' },
  { href: pathOf('mentoring'), label: 'Java mentoring: mock interviews and 1:1 training' },
  { href: pathOf('mentoringSq'), label: 'Mentorim Java në shqip', hrefLang: 'sq' },
];

const NotFoundPage: React.FC = () => (
  <>
    <header className="page-hero page-hero--short">
      <div className="page-hero-glow" aria-hidden="true" />
      <div className="page-inner">
        <p className="section-label">404</p>
        <h1 className="page-title">This page does not exist</h1>
        <p className="page-lede">The link may be old or mistyped. Here is where you can go instead:</p>
        <CrossLinks links={LINKS} />
      </div>
    </header>
    <Footer />
  </>
);

export default NotFoundPage;
