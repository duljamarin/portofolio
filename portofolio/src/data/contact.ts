// Contact facts. Null/empty fields render nothing: never fill these with
// invented values (availability, rates, response time, etc).

export const contact = {
  label: 'Contact',
  heading: 'Have a system to build?',
  headingAccent: "Let's make it hold up.",
  statement: 'Available for backend-heavy Java and Spring Boot work and full-stack React projects, remote, as a B2B contractor.',
  ctaLabel: 'Get in touch',
  whatsapp: { label: 'WhatsApp', href: 'https://wa.me/355684448934' },
  email: 'duljamarin@gmail.com',
};

// Public profiles. The footer, the booking channels and the Person JSON-LD
// (sameAs) all read these.
export const profiles = {
  linkedin: 'https://www.linkedin.com/in/marin-dulja/',
  github: 'https://github.com/duljamarin',
  instagram: 'https://www.instagram.com/marindulja/',
};

// Gmail's compose window opens in the browser, so the CTA works even when the
// visitor has no desktop mail client registered for mailto:.
export const emailHref =
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(contact.email)}`;
