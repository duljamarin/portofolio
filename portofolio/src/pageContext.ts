import { createContext, useContext } from 'react';
import type { Lang } from './data/lang';
import type { RouteId } from './seo/site';

/** Every rendered page: a route from site.ts, or the 404 page. */
export type PageId = RouteId | 'notFound';

export type PageInfo = { pageId: PageId; lang: Lang };

export const PageContext = createContext<PageInfo>({ pageId: 'home', lang: 'en' });

/** Which page is rendering and in which language (nav, footer, breadcrumbs read this). */
export const usePage = () => useContext(PageContext);
