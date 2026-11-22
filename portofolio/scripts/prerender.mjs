// Writes one static HTML file per route (dist/<path>/index.html), dist/404.html,
// sitemap.xml, robots.txt and site.webmanifest. Every value comes from the server
// bundle (dist-ssr/entry-server.js), which is built from src/seo/site.ts.
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const server = await import(pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href);

const template = await fs.readFile(path.join(dist, 'index.html'), 'utf8');
const manifestPath = path.join(dist, '.vite', 'manifest.json');
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));

for (const placeholder of ['<!--app-head-->', '<!--app-html-->', '<html lang="en">']) {
  if (!template.includes(placeholder)) throw new Error(`dist/index.html is missing ${placeholder}`);
}

/** <link rel="modulepreload"> for a page chunk and the chunks it imports (minus what the template already loads). */
function modulePreloads(pageModule) {
  const files = new Set();
  const visit = (key) => {
    const entry = manifest[key];
    if (!entry || files.has(entry.file)) return;
    files.add(entry.file);
    entry.imports?.forEach(visit);
  };
  visit(pageModule);
  return [...files]
    .filter((file) => !template.includes(`/${file}"`))
    .map((file) => `<link rel="modulepreload" crossorigin href="/${file}" />`);
}

/**
 * <link rel="preload"> for every <img fetchpriority="high"> in the page (the hero
 * portrait on the home page), so the largest image starts loading before the
 * stylesheet and scripts. Pages without one get no preload.
 */
function imagePreloads(body) {
  return [...body.matchAll(/<img\b[^>]*>/g)]
    .map((match) => match[0])
    .filter((tag) => /fetchpriority="high"/i.test(tag))
    .map((tag) => tag.match(/\ssrc="([^"]+)"/)?.[1])
    .filter(Boolean)
    .map((src) => `<link rel="preload" as="image" href="${src}" fetchpriority="high" />`);
}

function fill({ lang, head, body }) {
  return template
    .replace('<html lang="en">', `<html lang="${lang}">`)
    .replace('<!--app-head-->', () => head)
    .replace('<!--app-html-->', () => body);
}

async function writePage(relativePath, html) {
  const file = path.join(dist, relativePath);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, html);
  console.log(`  prerendered ${relativePath}`);
}

console.log('Prerendering');
for (const route of server.ROUTES) {
  const body = await server.renderPage(route.id, route.lang);
  const head = [...imagePreloads(body), server.renderHead(route), ...modulePreloads(server.PAGE_MODULES[route.id])].join('\n    ');
  await writePage(path.join(route.path, 'index.html'), fill({ lang: route.lang, head, body }));
}

const notFoundBody = await server.renderPage('notFound', server.NOT_FOUND.lang);
const notFoundHead = [server.renderHead(null), ...modulePreloads(server.PAGE_MODULES.notFound)].join('\n    ');
await writePage('404.html', fill({ lang: server.NOT_FOUND.lang, head: notFoundHead, body: notFoundBody }));

await writePage('sitemap.xml', server.sitemapXml(server.BUILD_DATE));
await writePage('robots.txt', server.robotsTxt());
await writePage('site.webmanifest', server.webManifest());

// The manifest was only needed here; do not deploy it.
await fs.rm(path.join(dist, '.vite'), { recursive: true, force: true });
