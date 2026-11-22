// Nav items, in page order. Used by the top nav, the mobile menu and the footer.
// Pages link to their route (from src/seo/site.ts); home-only sections link to
// /#section, which still smooth-scrolls when you are already on the home page.

import { pathOf, type RouteId } from '../seo/site';
import type { Lang } from './lang';
import { ui } from './ui';

export type NavItem = {
  label: string;
  href: string;
  /** Home page section id the item highlights while it is in view. */
  section?: string;
  /** Page the item highlights while you are on it. */
  pages?: RouteId[];
};

export function navItems(lang: Lang): NavItem[] {
  const labels = ui[lang].nav;
  const home = pathOf('home');
  const section = (id: string) => `${home}#${id}`;
  return [
    { label: labels.projects, href: section('projects'), section: 'projects' },
    { label: labels.freelance, href: pathOf('freelance'), section: 'offer', pages: ['freelance'] },
    {
      label: labels.mentoring,
      href: pathOf(lang === 'sq' ? 'mentoringSq' : 'mentoring'),
      section: 'mentoring',
      pages: ['mentoring', 'mentoringSq'],
    },
    { label: labels.about, href: section('about'), section: 'about' },
    { label: labels.skills, href: section('skills'), section: 'skills' },
    { label: labels.contact, href: section('contact'), section: 'contact' },
  ];
}
