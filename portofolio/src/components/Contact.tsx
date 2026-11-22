import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { contact, emailHref } from '../data/contact';
import { REVEAL_STAGGER } from '../animations';
import CopyEmailButton from './CopyEmailButton';
import { Reveal } from './fx/Reveal';
import { SplitReveal } from './fx/SplitReveal';

const ArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const reveal = (order: number) => ({ delay: order * REVEAL_STAGGER });

const Contact: React.FC = () => {
  if (!contact.statement) {
    // TODO: contact.statement is empty: fill src/data/contact.ts before shipping this section.
    return null;
  }

  return (
    <section id="contact" className="contact-section">
      <div className="contact-glow" aria-hidden="true" />
      <div className="contact-inner">
        <Reveal as="p" className="section-label" {...reveal(0)}>{contact.label}</Reveal>
        <SplitReveal
          className="contact-heading"
          stagger={0.08}
          text={[
            { text: contact.heading, className: 'contact-heading-line' },
            { text: contact.headingAccent, className: 'contact-heading-accent' },
          ]}
        />
        <Reveal as="p" className="contact-statement" {...reveal(2)}>{contact.statement}</Reveal>

        <Reveal className="contact-actions" {...reveal(3)}>
          <a href={emailHref} target="_blank" rel="noopener noreferrer" className="btn-primary contact-cta fx-pulse">
            {contact.ctaLabel}
            <ArrowIcon />
          </a>
          <a
            href={contact.whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-copy contact-whatsapp"
          >
            <FaWhatsapp aria-hidden="true" />
            {contact.whatsapp.label}
          </a>
          <CopyEmailButton className="contact-copy" />
        </Reveal>
      </div>
    </section>
  );
};

export default Contact;
