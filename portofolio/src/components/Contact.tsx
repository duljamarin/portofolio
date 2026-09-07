import React from 'react';
import { motion } from 'framer-motion';
import { contact, emailHref } from '../data/contact';
import { fadeIn, DUR } from '../animations';

const ArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const Contact: React.FC = () => {
  if (!contact.statement) {
    // TODO: contact.statement is empty — fill src/data/contact.ts before shipping this section.
    return null;
  }

  return (
    <section id="contact" className="contact-section">
      <motion.div
        className="ledger-band"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeIn}
        transition={{ duration: DUR * 2, ease: [0.2, 0.6, 0.2, 1] }}
      >
        <h2 className="ledger-band-heading">{contact.heading}</h2>
        <p className="ledger-band-statement">{contact.statement}</p>

        <a
          href={emailHref}
          target="_blank"
          rel="noopener noreferrer"
          className="ledger-band-cta"
        >
          {contact.ctaLabel}
          <ArrowIcon />
        </a>
      </motion.div>
    </section>
  );
};

export default Contact;
