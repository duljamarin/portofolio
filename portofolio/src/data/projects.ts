// Portfolio projects data for the app
// Each project includes title, description, links, tags, and type

export type Project = {
  title: string;
  description: string;
  gallery?: string[];
  video?: string;
  links: { label: string; url: string }[];
  tags: string[];
  type: 'main' | 'fullstack' | 'contractor';
  weight?: 1 | 2;
  badge?: {
    text: string;
    url?: string;
    color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  };
};

export const projects: Project[] = [
  {
    title: 'xBratAI: AI-Driven Alerts Platform at Adus Technologies',
    description: 'Real-time signal-detection and alerting pipeline (RabbitMQ, WebSockets, PostgreSQL, MongoDB) identifying multi-indicator confluences and delivering sub-second alerts to 10,000+ day traders across crypto, forex, and futures. Shipped Stripe subscription billing, community chat, and OneSignal push notifications; delivered 70+ end-to-end tasks in 7 months while cutting post-deployment regressions by 40% through targeted integration test coverage.',
    gallery: ['/xbrat-ai.webp'],
    links: [
      { label: 'Live Site', url: 'https://xbratai.com/' }
    ],
    tags: ['Backend', 'Java', 'Spring Boot', 'MongoDB', 'PostgreSQL', 'RabbitMQ', 'WebSockets', 'Stripe', 'Contractor'],
    type: 'contractor',
  },
  {
    title: 'Personal Finance Tracker: Solo-Built SaaS',
    description:
      'A production subscription SaaS for personal finance, architected and shipped solo: React 19 + Vite + Tailwind frontend on a Supabase backend (PostgreSQL, Auth, Edge Functions), with a 15-table schema across 52 versioned migrations. Per-user data isolation via 28 Row-Level Security policies, with plan limits, default-data provisioning, and denormalised totals enforced by 16 Postgres triggers. Full billing lifecycle on Paddle across 5+ Supabase Edge Functions (webhook verification, entitlement checks, customer-portal provisioning, failed-payment recovery, GDPR deletion), plus a Recharts analytics surface, English/Albanian i18n, and an SEO prerender pipeline.',
    gallery: ['/personal-finances-1.webp', '/personal-finances-2.webp', '/personal-finances-3.webp'],
    links: [
      { label: 'Live Site', url: 'https://personal-finances.app/' },
      { label: 'GitHub', url: 'https://github.com/duljamarin/personal-finance-tracker' }
    ],
    tags: ['SaaS', 'React', 'Vite', 'Tailwind', 'Supabase', 'PostgreSQL', 'Paddle Billing', 'Row-Level Security'],
    type: 'fullstack',
    weight: 2,
  },
  {
    title: 'Tiger Project at Candidatis',
    description: 'Web Crawler developed for Candidatis.net, automating job ads data extraction and processing',
    gallery: ['/tiger-candidatis.webp'],
    links: [
      { label: 'Candidatis Crawler Website', url: 'https://www.candidatis.net/crawler.html' }
    ],
    tags: ['Backend', 'Web Crawler', 'Java', 'Spring Boot', 'Contractor'],
    type: 'contractor',
  },
  {
    title: 'Wikloud',
    description: 'Microservice architecture backend for Sabanet Albania, using Spring Cloud and Spring Boot. Alarm management system for MyPumaSecurity, enabling monitoring and control of alarm systems.',
    gallery: ['/wikloud-pumasecurity.webp'],
    links: [
      { label: 'PumaSecurity', url: 'https://www.pumasecurity.it/wellmakers/' },
      { label: 'Company', url: 'https://www.sabanet.it/' }
    ],
    tags: ['Full Time Job', 'Spring Cloud', 'Spring Boot', 'Microservices', 'Alarm Management'],
    type: 'main',
  },
  {
    title: 'The Literary Heaven',
    description:
      'A fullstack bookstore e-commerce platform featuring complete online shopping functionality with product browsing, cart management, and checkout flow. Built with React and Tailwind CSS for a modern, responsive interface, powered by Supabase for authentication and data management.',
    gallery: ['/the-literary-heaven-1.webp', '/the-literary-heaven-2.webp'],
    links: [
      { label: 'Live Site', url: 'https://the-literary-heaven.netlify.app/' },
      { label: 'GitHub', url: 'https://github.com/duljamarin/bookshop-ecommerce' }
    ],
    tags: ['React', 'Tailwind', 'Supabase', 'Full-Stack'],
    type: 'fullstack',
  },
  {
    title: 'ClearSight Clinic Website',
    description:
      'A responsive, production-ready single-page application showcasing modern frontend architecture and UX clarity. Features client-style multi-section layout with proper React Router configuration and Supabase backend integration.',
    gallery: ['/clearsight-1.webp', '/clearsight-2.webp', '/clearsight-3.webp'],
    links: [
      { label: 'GitHub', url: 'https://github.com/duljamarin/eye-clinic-app' }
    ],
    tags: ['React', 'CSS', 'Supabase'],
    type: 'fullstack',
  },
  // ...existing main projects from your portfolio...

  {
    title: 'Therapism',
    description: 'Mental health platform, built with Java, Spring Boot, PostgreSQL, and Spring AI.',
    links: [
      { label: 'GitHub', url: 'https://github.com/duljamarin/Therapism' }
    ],
    tags: ['Personal Project', 'Java', 'Spring Boot', 'PostgreSQL', 'Spring AI', 'Backend'],
    type: 'main',
  },
  {
    title: 'Quotes Social Network',
    description: 'Quote sharing platform with authentication, posting, commenting, and liking features.',
    links: [
      { label: 'GitHub', url: 'https://github.com/duljamarin/QuotesSocialNetworkBE' }
    ],
    tags: ['Personal Project', 'Social Network', 'Backend', 'Java', 'API integration', 'Spring Boot', 'Hibernate', 'JPA'],
    type: 'main',
  },
];
