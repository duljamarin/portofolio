// "How I build" scroll story: copy and diagram geometry.
// SOURCE OF TRUTH: diagram space is DIAGRAM_W x DIAGRAM_H. Every distance,
// arrival point, connector line and step start is derived from MAIN, BRANCH
// and the node rects in HowIBuild.tsx. Never type a derived number here.

export type Point = { x: number; y: number };

export type DiagramNode = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  name: string;
  sub: string;
  /** Which path the node sits on; its center must lie on that path. */
  on: 'main' | 'branch';
  /** Pops in when the packet reaches the node. */
  badge?: { text: string; place: 'above' | 'below' };
};

export type Step = { number: string; title: string; text: string };

export const DIAGRAM_W = 820;
export const DIAGRAM_H = 444;

export const MAIN: Point[] = [
  { x: 55, y: 222 },
  { x: 215, y: 222 },
  { x: 385, y: 222 },
  { x: 385, y: 372 },
  { x: 385, y: 222 },
  { x: 655, y: 222 },
  { x: 655, y: 132 },
  { x: 745, y: 132 },
];

/** Starts on MAIN at index FORK_INDEX. */
export const BRANCH: Point[] = [
  { x: 655, y: 222 },
  { x: 655, y: 312 },
  { x: 745, y: 312 },
];
export const FORK_INDEX = 5;

export const NODES: DiagramNode[] = [
  { id: 'client', x: 0, y: 190, w: 110, h: 64, name: 'Client', sub: 'React', on: 'main' },
  { id: 'gw', x: 150, y: 182, w: 130, h: 80, name: 'API Gateway', sub: 'Spring Cloud Gateway or Kotlin GraphQL', on: 'main' },
  { id: 'a', x: 320, y: 190, w: 130, h: 64, name: 'Service A', sub: 'Spring Boot', on: 'main' },
  { id: 'db', x: 330, y: 340, w: 110, h: 64, name: 'PostgreSQL', sub: 'transaction', on: 'main', badge: { text: 'Committed', place: 'below' } },
  { id: 'q', x: 500, y: 190, w: 130, h: 64, name: 'Queue', sub: 'RabbitMQ · Kafka', on: 'main', badge: { text: 'Event published', place: 'above' } },
  { id: 'b', x: 680, y: 100, w: 130, h: 64, name: 'Service B', sub: 'Spring Boot', on: 'main', badge: { text: 'Handled', place: 'above' } },
  { id: 'c', x: 680, y: 280, w: 130, h: 64, name: 'Service C', sub: 'Spring Boot', on: 'branch' },
];

export const STEPS: Step[] = [
  {
    number: '01',
    title: 'Edge',
    text: 'The API gateway authenticates, rate-limits and routes the request. Spring Cloud Gateway for REST, or a Kotlin GraphQL layer that resolves queries across services.',
  },
  {
    number: '02',
    title: 'Service',
    text: 'Service A validates it and commits the change to PostgreSQL in one transaction.',
  },
  {
    number: '03',
    title: 'Event',
    text: 'After the commit, Service A publishes an event. The outbox pattern makes sure it is never lost.',
  },
  {
    number: '04',
    title: 'Consumers',
    text: 'Services B and C consume the event on their own. Idempotent handlers make retries safe.',
  },
];

/** Offset past the gateway center where step 02 starts (spec: lengthTo[1] + 15). */
export const SERVICE_STEP_LEAD = 15;
