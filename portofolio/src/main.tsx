import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import type { PageId } from './pageContext';
import { loadPage } from './pages/registry';
import { findRoute } from './seo/site';
import 'lenis/dist/lenis.css';
import './styles/main.css';

// Pick the page from the URL; unknown paths are the 404 page (Netlify serves dist/404.html).
const route = findRoute(window.location.pathname);
const pageId: PageId = route?.id ?? 'notFound';
const lang = route?.lang ?? 'en';

/**
 * Resolves after the browser has painted a frame. The prerendered HTML is already
 * complete, so hydration (the page's JS work) waits until it is on screen instead
 * of delaying the first paint.
 */
const afterFirstPaint = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));

Promise.all([loadPage[pageId](), afterFirstPaint()]).then(([{ default: Page }]) => {
  const container = document.getElementById('root')!;
  const app = (
    <React.StrictMode>
      <App pageId={pageId} lang={lang}>
        <Page />
      </App>
    </React.StrictMode>
  );
  // Built pages are prerendered, so React attaches to the existing HTML.
  // The dev server has no prerender, so it renders from scratch.
  if (container.firstElementChild) ReactDOM.hydrateRoot(container, app);
  else ReactDOM.createRoot(container).render(app);
});
