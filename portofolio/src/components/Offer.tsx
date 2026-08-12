import React from 'react';
import { motion } from 'framer-motion';

const offers = [
  {
    title: 'Backend & API development',
    desc: 'Java, Kotlin, and Spring Boot systems built for scale: REST/GraphQL APIs, event-driven pipelines with Kafka and RabbitMQ, and microservice architectures that hold up under real production traffic.',
  },
  {
    title: 'Full-stack product delivery',
    desc: 'End-to-end ownership from database schema to polished React frontend. I ship features, not just backend endpoints - comfortable owning a product across the whole stack.',
  },
  {
    title: 'Solo SaaS builds',
    desc: 'From idea to production: auth, billing, data modeling, and deployment. I have taken a subscription SaaS from system design through Paddle billing integration to a live product, solo.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const Offer: React.FC = () => (
  <section id="offer" className="offer-section">
    <motion.div
      className="section-header"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={fadeUp}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <h2 className="section-title">What I <span className="accent">Offer</span></h2>
      <p className="section-subtitle">Ways I can help your team or product ship.</p>
    </motion.div>

    <div className="offer-grid">
      {offers.map((o, idx) => (
        <motion.div
          className="offer-card"
          key={o.title}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-30px' }}
          variants={fadeUp}
          transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h3 className="offer-card-title">{o.title}</h3>
          <p className="offer-card-desc">{o.desc}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

export default Offer;
