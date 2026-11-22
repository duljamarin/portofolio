import type { ComponentType } from 'react';
import type { PageId } from '../pageContext';

/**
 * Page modules, loaded on demand in the browser so each page ships only its own
 * code. scripts/prerender.mjs reads PAGE_MODULES to add <link rel="modulepreload">
 * for the page's chunk, so hydration does not wait on a request waterfall.
 */
export const PAGE_MODULES: Record<PageId, string> = {
  home: 'src/pages/HomePage.tsx',
  freelance: 'src/pages/FreelancePage.tsx',
  mentoring: 'src/pages/MentoringPage.tsx',
  mentoringSq: 'src/pages/MentoringPage.tsx',
  notFound: 'src/pages/NotFoundPage.tsx',
};

export const loadPage: Record<PageId, () => Promise<{ default: ComponentType }>> = {
  home: () => import('./HomePage'),
  freelance: () => import('./FreelancePage'),
  mentoring: () => import('./MentoringPage'),
  mentoringSq: () => import('./MentoringPage'),
  notFound: () => import('./NotFoundPage'),
};
