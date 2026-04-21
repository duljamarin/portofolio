import React from 'react';
import { motion } from 'framer-motion';

const ArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const Contact: React.FC = () => {
  const openModal = () => {
    window.dispatchEvent(new Event('contact:open'));
  };

  return (
    <section id="contact" className="contact-section">
      <motion.div
        className="contact-card"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeUp}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="contact-card-eyebrow">
          <span className="contact-card-eyebrow-dot" />
          Let's connect
        </span>

        <motion.h2
          className="contact-card-heading"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Got a project in mind?
          <br />
          <span className="accent">Let's talk.</span>
        </motion.h2>

        <motion.p
          className="contact-card-subtitle"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Open to freelance work, full-time roles, and interesting collaborations.
        </motion.p>

        <motion.button
          type="button"
          className="contact-card-cta"
          onClick={openModal}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          Get in touch
          <ArrowIcon />
        </motion.button>
      </motion.div>
    </section>
  );
};

export default Contact;
