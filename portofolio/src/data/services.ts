// What I offer companies. The home Offer section and the freelance page render
// these cards; the freelance Service JSON-LD (serviceType) reads the titles.
// Icons live in Offer.tsx, keyed by id.

export type ServiceOffer = { id: 'backend' | 'fullstack' | 'saas'; title: string; desc: string };

export const services: ServiceOffer[] = [
  {
    id: 'backend',
    title: 'Backend & API development',
    desc: 'Java, Kotlin, and Spring Boot systems built for scale: REST/GraphQL APIs, event-driven pipelines with Kafka and RabbitMQ, and microservice architectures that hold up under real production traffic.',
  },
  {
    id: 'fullstack',
    title: 'Full-stack product delivery',
    desc: 'End-to-end ownership from database schema to polished React frontend. I ship features, not just backend endpoints, and I am comfortable owning a product across the whole stack.',
  },
  {
    id: 'saas',
    title: 'Solo SaaS builds',
    desc: 'From idea to production: auth, billing, data modeling, and deployment. I have taken a subscription SaaS from system design through Paddle billing integration to a live product, solo.',
  },
];
