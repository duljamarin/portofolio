// Interface strings shared by every page (nav, footer, breadcrumbs), per language.

import type { Lang } from './lang';

export const ui: Record<
  Lang,
  {
    nav: { projects: string; freelance: string; mentoring: string; about: string; skills: string; contact: string; cv: string };
    openMenu: string;
    closeMenu: string;
    breadcrumb: string;
    footerTagline: string;
    footerExplore: string;
    footerConnect: string;
    footerBuiltWith: string;
    backToTop: string;
    emailCopied: string;
    copyEmail: string;
  }
> = {
  en: {
    nav: { projects: 'Projects', freelance: 'Freelance', mentoring: 'Mentoring', about: 'About', skills: 'Skills', contact: 'Contact', cv: 'CV' },
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    breadcrumb: 'Breadcrumb',
    footerTagline: 'Full-stack engineer · Java, Spring Boot, React',
    footerExplore: 'Explore',
    footerConnect: 'Connect',
    footerBuiltWith: 'Built with React & TypeScript',
    backToTop: 'Back to top',
    emailCopied: 'Email copied',
    copyEmail: 'Copy email address',
  },
  sq: {
    nav: { projects: 'Projektet', freelance: 'Freelance', mentoring: 'Mentorim', about: 'Rreth meje', skills: 'Aftësitë', contact: 'Kontakt', cv: 'CV' },
    openMenu: 'Hap menunë',
    closeMenu: 'Mbyll menunë',
    breadcrumb: 'Vendndodhja në faqe',
    footerTagline: 'Zhvillues full-stack · Java, Spring Boot, React',
    footerExplore: 'Eksploro',
    footerConnect: 'Lidhu',
    footerBuiltWith: 'Ndërtuar me React dhe TypeScript',
    backToTop: 'Kthehu lart',
    emailCopied: 'Email-i u kopjua',
    copyEmail: 'Kopjo adresën e email-it',
  },
};
