// Portfolio projects data for the app
// Each project includes title, description, links, tags, and type

export type Project = {
  title: string;
  description: string;
  gallery?: string[];
  links: { label: string; url: string }[];
  tags: string[];
  type: 'main' | 'fullstack' | 'contractor';
  badge?: {
    text: string;
    url?: string;
    color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  };
};

export const projects: Project[] = [
  {
    title: 'Trading Intelligence Platform at Adus Technologies',
    description: 'Backend for crypto & forex signals, with RabbitMQ, WebSockets, push notifications, Coinbase API integration, and community chat.',
    gallery: ['/xbrat-ai.png'],
    links: [
      { label: 'Live Site', url: 'https://xbratai.com/' }
    ],
    tags: ['Backend', 'Java', 'Spring Boot', 'MongoDB', 'PostgreSQL', 'RabbitMQ', 'WebSockets', 'API Integration', 'Contractor'],
    type: 'contractor',
  },
  {
    title: 'Personal Finance Tracker (Fullstack)',
    description:
      'A real-world personal finance web application with end-to-end income, expense, and balance tracking. Features recurring transactions, spending insights, financial scoring, and goal management. Migrated from Java/Spring Boot to Supabase for streamlined authentication and data persistence. Built with React.js and Tailwind CSS for a responsive, low-friction user experience optimized for daily use.',
    gallery: ['/personal-finances-1.png', '/personal-finances-2.png', '/personal-finances-3.png', '/personal-finances-4.png'],
    links: [
      { label: 'Live Site', url: 'https://personal-finances.app/' },
      { label: 'GitHub', url: 'https://github.com/freudmarin/personal-finance-tracker' }
    ],
    tags: ['React', 'Tailwind', 'Supabase', 'Full-Stack'],
    type: 'fullstack',
    badge: {
      text: 'Featured on fip.al • Website with 3000+ Daily Views',
      url: 'https://www.fip.al/pages/mjete-financiare.html',
      color: 'green',
    },
  },
  {
    title: 'ClearSight Clinic Website',
    description:
      'A responsive, production-ready single-page application showcasing modern frontend architecture and UX clarity. Features client-style multi-section layout with proper React Router configuration and Supabase backend integration.',
    gallery: ['/clearsight-1.png', '/clearsight-2.png', '/clearsight-3.png', '/clearsight-4.png'],
    links: [
      { label: 'Live Site', url: 'https://clearsight-clinic.netlify.app' },
      { label: 'GitHub', url: 'https://github.com/freudmarin/eye-clinic-app' }
    ],
    tags: ['React', 'CSS', 'Supabase'],
    type: 'fullstack',
  },
  // ...existing main projects from your portfolio...

  {
    title: 'Tiger Project at Candidatis',
    description: 'Web Crawler developed for Candidatis.net, automating job ads data extraction and processing',
    links: [
      { label: 'Candidatis Crawler Website', url: 'https://www.candidatis.net/crawler.html' }
    ],
    tags: ['Backend', 'Web Crawler', 'Java', 'Spring Boot', 'Contractor'],
    type: 'contractor',
  },
  {
    title: 'Therapism',
    description: 'Mental health platform, built with Java, Spring Boot, PostgreSQL, and Spring AI.',
    links: [
      { label: 'GitHub', url: 'https://github.com/freudmarin/Therapism' }
    ],
    tags: ['Personal Project', 'Java', 'Spring Boot', 'PostgreSQL', 'Spring AI', 'Backend'],
    type: 'main',
  },
  {
    title: 'Wikloud',
    description: 'Microservice architecture backend for Sabanet Albania, using Spring Cloud and Spring Boot. Alarm management system for MyPumaSecurity, enabling monitoring and control of alarm systems.',
    links: [
      { label: 'Company', url: 'https://www.sabanet.it/' }
    ],
    tags: ['Full Time Job', 'Spring Cloud', 'Spring Boot', 'Microservices', 'Alarm Management'],
    type: 'main',
  },
  {
    title: 'Quotes Social Network',
    description: 'Quote sharing platform with authentication, posting, commenting, and liking features.',
    links: [
      { label: 'GitHub', url: 'https://github.com/freudmarin/QuotesSocialNetworkBE' }
    ],
    tags: ['Personal Project', 'Social Network', 'Backend', 'Java', 'API integration', 'Spring Boot', 'Hibernate', 'JPA'],
    type: 'main',
  },
];