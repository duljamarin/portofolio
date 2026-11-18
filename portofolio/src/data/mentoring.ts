// Mentoring section: every price, link and line of copy lives here.
// Mentoring.tsx only renders this data, so a price change is a one-line edit.

export type Offer = {
  id: string;
  label: string;
  title: string;
  price: { main: string; local: string };
  bullets?: string[];
  text?: string;
  topics?: { name: string; highlight?: boolean }[];
  cta: { label: string; href: string; variant: 'gold' | 'ghost' };
  featured?: boolean;
};

export type Channel = {
  name: string;
  href: string;
  /** External links open in a new tab; mailto stays a plain link. */
  external: boolean;
};

export const mentoring = {
  label: 'Mentoring',
  heading: { before: 'Mock interviews and ', highlight: 'Java training', after: ', 1:1.' },
  sub: 'For students and junior developers getting ready for their first Java role. Taught from 4.5+ years of real production work. 100% online.',

  offers: [
    {
      id: 'mock',
      label: 'Start here · 45 min',
      title: 'Mock interview',
      price: { main: '15 EUR', local: '1500 lekë' },
      bullets: [
        'A realistic Java and Spring Boot technical interview',
        'Also for junior developers preparing for a mid-level role',
        'A written summary of your strengths and gaps after the session',
        'The price is credited back if you continue with 4+ lessons',
      ],
      cta: { label: 'Book a mock interview', href: '#book', variant: 'gold' },
      featured: true,
    },
    {
      id: 'training',
      label: 'First session free',
      title: '1:1 training',
      price: { main: '22 EUR / h', local: '2000 lekë / hour' },
      text: 'The free first session covers your goals, background and current knowledge, and ends with a study plan built for you.',
      topics: [
        { name: 'Java' },
        { name: 'OOP' },
        { name: 'Spring Boot' },
        { name: 'SQL' },
        { name: 'Hibernate' },
        { name: 'Microservices basics', highlight: true },
      ],
      cta: { label: 'Book your free first session', href: '#book', variant: 'ghost' },
    },
  ] satisfies Offer[],

  steps: [
    { title: 'Message me', text: 'On whichever channel below suits you.' },
    { title: 'Pick a time', text: 'Mock interview or the free first session.' },
    { title: 'Leave with a plan', text: 'A written summary or a study plan.' },
  ],

  book: {
    id: 'book',
    heading: 'Book on the channel you prefer',
    channels: [
      { name: 'Email', href: 'mailto:duljamarin@gmail.com?subject=Mock%20interview', external: false },
      { name: 'LinkedIn', href: 'https://www.linkedin.com/in/marin-dulja/', external: true },
      {
        name: 'Superprof',
        href: 'https://www.superprof.al/meso-java-nje-zhvillues-backend-mesime-java-spring-boot-sql-hibernate-dhe-bazat-mikroserviseve-online-meso-programim.html',
        external: true,
      },
      { name: 'WhatsApp', href: 'https://wa.me/355684448934', external: true },
    ] satisfies Channel[],
  },
};
