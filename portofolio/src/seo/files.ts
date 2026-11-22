// sitemap.xml, robots.txt and site.webmanifest, generated at build time from site.ts.

import { MANIFEST, ROUTES, SITE_URL, canonical, hreflangLinks, type Route } from './site';

/** Exactly one <url> per route, no fragments; hreflang alternates for routes with a language pair. */
export function sitemapXml(buildDate: string): string {
  const urls = (ROUTES as readonly Route[]).map((route) => {
    const alternates = hreflangLinks(route).map(
      (link) => `\n    <xhtml:link rel="alternate" hreflang="${link.hreflang}" href="${link.href}" />`
    );
    return `  <url>\n    <loc>${canonical(route)}</loc>\n    <lastmod>${buildDate}</lastmod>${alternates.join('')}\n  </url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
}

/** Every crawler is allowed, search engines and AI search (OAI-SearchBot, ChatGPT-User) included. */
export function robotsTxt(): string {
  return `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

export function webManifest(): string {
  return `${JSON.stringify(
    {
      name: MANIFEST.name,
      short_name: MANIFEST.shortName,
      description: MANIFEST.description,
      icons: [
        { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
      theme_color: '#0a0e1a',
      background_color: '#0a0e1a',
      display: 'standalone',
      start_url: '/',
      scope: '/',
    },
    null,
    2
  )}\n`;
}
