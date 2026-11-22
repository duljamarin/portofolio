// Server entry, used only at build time by scripts/prerender.mjs. Renders each
// page to HTML (waiting for the lazy below-the-fold chunk) and re-exports the
// SEO helpers the prerender and the SEO check need.
import React, { type ComponentType } from 'react';
import { prerender } from 'react-dom/static';
import App from './App';
import type { Lang } from './data/lang';
import type { PageId } from './pageContext';
import FreelancePage from './pages/FreelancePage';
import HomePage from './pages/HomePage';
import MentoringPage from './pages/MentoringPage';
import NotFoundPage from './pages/NotFoundPage';

const PAGES: Record<PageId, ComponentType> = {
  home: HomePage,
  freelance: FreelancePage,
  mentoring: MentoringPage,
  mentoringSq: MentoringPage,
  notFound: NotFoundPage,
};

/** Full HTML of one page's <div id="root"> contents. */
export async function renderPage(pageId: PageId, lang: Lang): Promise<string> {
  const Page = PAGES[pageId];
  const { prelude } = await prerender(
    <React.StrictMode>
      <App pageId={pageId} lang={lang}>
        <Page />
      </App>
    </React.StrictMode>
  );
  return new Response(prelude).text();
}

export const BUILD_DATE = __BUILD_DATE__;
export { PAGE_MODULES } from './pages/registry';
// Server-only module (never hot-reloaded), so re-exporting non-components is fine here.
// eslint-disable-next-line react-refresh/only-export-components
export * from './seo/site';
export { renderHead } from './seo/head';
export { sitemapXml, robotsTxt, webManifest } from './seo/files';
export { structuredData } from './seo/structuredData';
export { freelance } from './data/freelance';
export { mentoringCopy } from './data/mentoring';
