// Contact facts. Null/empty fields render nothing — never fill these with
// invented values (availability, rates, response time, etc).

export const contact = {
  heading: "Have a project in mind? Let's build it.",
  statement: "I'm a full-stack engineer available for backend-heavy Java/Spring and React projects.",
  ctaLabel: 'Get in touch',
  email: 'duljamarin@gmail.com',
};

// Gmail's compose window opens in the browser, so the CTA works even when the
// visitor has no desktop mail client registered for mailto:.
export const emailHref =
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(contact.email)}`;
