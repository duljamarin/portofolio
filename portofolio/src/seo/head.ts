// The per-page <head> tags, written into each prerendered HTML file. Open Graph
// and Twitter values are the page title and description, never separate text.

import { structuredData } from './structuredData';
import {
  NOT_FOUND,
  OG_IMAGE,
  OG_LOCALE,
  PERSON,
  SITE_URL,
  alternateOf,
  canonical,
  description,
  hreflangLinks,
  title,
  type Route,
} from './site';

const escapeAttribute = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const escapeText = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** JSON inside <script>: "<" is escaped so the text can never close the tag. */
const jsonForScript = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');

const meta = (attribute: 'name' | 'property', key: string, content: string | number) =>
  `<meta ${attribute}="${key}" content="${escapeAttribute(String(content))}" />`;

/** Head tags for a route, or for the 404 page when route is null. */
export function renderHead(route: Route | null): string {
  if (!route) {
    return [`<title>${escapeText(NOT_FOUND.title)}</title>`, meta('name', 'robots', 'noindex')].join('\n    ');
  }

  const pageTitle = title(route);
  const pageDescription = description(route);
  const url = canonical(route);
  const image = `${SITE_URL}${OG_IMAGE.path}`;
  const other = alternateOf(route);

  const tags = [
    `<title>${escapeText(pageTitle)}</title>`,
    meta('name', 'description', pageDescription),
    meta('name', 'robots', 'index, follow, max-image-preview:large'),
    `<link rel="canonical" href="${url}" />`,
    ...hreflangLinks(route).map((link) => `<link rel="alternate" hreflang="${link.hreflang}" href="${link.href}" />`),

    meta('property', 'og:type', 'website'),
    meta('property', 'og:site_name', PERSON.name),
    meta('property', 'og:locale', OG_LOCALE[route.lang]),
    ...(other ? [meta('property', 'og:locale:alternate', OG_LOCALE[other.lang])] : []),
    meta('property', 'og:title', pageTitle),
    meta('property', 'og:description', pageDescription),
    meta('property', 'og:url', url),
    meta('property', 'og:image', image),
    meta('property', 'og:image:type', 'image/jpeg'),
    meta('property', 'og:image:width', OG_IMAGE.width),
    meta('property', 'og:image:height', OG_IMAGE.height),
    meta('property', 'og:image:alt', OG_IMAGE.alt),

    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', pageTitle),
    meta('name', 'twitter:description', pageDescription),
    meta('name', 'twitter:image', image),
    meta('name', 'twitter:image:alt', OG_IMAGE.alt),

    ...structuredData(route).map((block) => `<script type="application/ld+json">${jsonForScript(block)}</script>`),
  ];
  return tags.join('\n    ');
}
