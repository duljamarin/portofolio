// Skills, grouped. The Skills marquee (row 1: backend, row 2: the rest), the
// freelance page stack lists and the Person JSON-LD (knowsAbout) read this.
// Icons live in Skills.tsx, keyed by name.

export type SkillGroup = { id: 'backend' | 'data' | 'frontend'; label: string; skills: string[] };

export const skillGroups: SkillGroup[] = [
  {
    id: 'backend',
    label: 'Backend',
    skills: [
      'Java',
      'Kotlin',
      'Spring Boot',
      'Spring Cloud',
      'Spring Security',
      'Hibernate',
      'Spring Data JPA',
      'REST',
      'GraphQL',
      'Microservices',
      'Event-driven',
    ],
  },
  {
    id: 'data',
    label: 'Data and messaging',
    skills: ['PostgreSQL', 'MongoDB', 'SQL Server', 'RabbitMQ', 'Kafka', 'WebSocket / STOMP'],
  },
  {
    id: 'frontend',
    label: 'Frontend and tooling',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Docker', 'Azure', 'JUnit 5'],
  },
];

export const skillNames = skillGroups.flatMap((group) => group.skills);
