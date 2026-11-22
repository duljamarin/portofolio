// Recommendations from LinkedIn. Shown on the home page; the mentoring page
// quotes `pullQuote` (a sentence from `text`). No Review or AggregateRating
// structured data is built from these: self-serving reviews are not eligible.

export type Testimonial = {
  name: string;
  role: string;
  date: string;
  highlight: string;
  /** One sentence of `text`, quoted on the mentoring page. */
  pullQuote?: string;
  text: string;
};

export const testimonials: Testimonial[] = [
  {
    name: 'Jonas Figu',
    role: 'Software Developer',
    date: 'June 28, 2025',
    highlight: 'highly recommend him for any team looking for both technical excellence and strong mentorship',
    pullQuote: 'He had a unique ability to break down complex concepts into manageable, understandable pieces, which made a huge difference in my development as a programmer.',
    text: `I had the privilege of working alongside Marin Dulja at Candidatis, where he worked as a Java Developer and my mentor. From day one, Marin stood out not only for his deep technical expertise in Java and backend systems, but also for his patience, clarity, and dedication to helping others grow.

As a mentor, Marin was incredibly generous with his time and knowledge. He had a unique ability to break down complex concepts into manageable, understandable pieces, which made a huge difference in my development as a programmer. His code reviews were always insightful, focused not just on pointing out issues, but on teaching better practices.

Beyond his mentorship, Marin consistently brought quality and professionalism to the team. He tackled difficult technical challenges with confidence and precision, always striving for clean, maintainable solutions. His approach to problem-solving, especially under pressure, set a great example for the rest of us.

Anyone would be lucky to have Marin on their team. I'm grateful to have learned from him and highly recommend him for any team looking for both technical excellence and strong mentorship.`,
  },
  {
    name: 'Abbass Faytaroony',
    role: 'Senior Software Engineer (Java | Kotlin) @ Genesys',
    date: 'April 10, 2025',
    highlight: 'the kind of developer who lifts a team technically and culturally',
    text: `I was fortunate enough to mentor Marin when working for Noema Consulting, where we collaborated on the backend development. Marin grasped Kotlin really fast and was making meaningful contributions within a very short time. He also became Azure Developer Associate certified soon after joining, which reflects his determination and quick learning abilities.

What stood out most was Marin's positive attitude and professionalism. He was always polite, receptive to feedback, and genuinely curious. Very soon, he learned the codebase and improved/extended it. Marin is the kind of developer who lifts a team technically and culturally, and I'd gladly work with him again.`,
  },
];

/** The mentee's recommendation, quoted on the mentoring pages. */
export const menteeTestimonial = testimonials[0];
