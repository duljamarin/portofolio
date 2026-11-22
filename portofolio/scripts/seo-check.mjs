// SEO check on the built site (dist/). No browser, no page JavaScript: it reads
// the static HTML exactly as a crawler that does not run JS would. Expected
// values come from src/seo/site.ts via the server bundle. Exits 1 on any failure,
// which fails `npm run build`.
//
// Run: node scripts/seo-check.mjs  (after the build)
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse } from 'node-html-parser';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const server = await import(pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href);
const { ROUTES, LIMITS, SITE_URL, canonical, alternateOf } = server;

/* ============================================
   HELPERS
   ============================================ */
let passed = 0;
const failures = [];
let group = '';
function check(ok, message) {
  if (ok) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failures.push(`${group}: ${message}`);
    console.log(`  ✗ ${message}`);
  }
}
function section(name) {
  group = name;
  console.log(`\n${name}`);
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const decodeEntities = (text) =>
  text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code) => {
    if (code[0] === '#') {
      const value = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return String.fromCodePoint(value);
    }
    return ENTITIES[code.toLowerCase()] ?? match;
  });

/** Body text a non-JS crawler sees: <script>, <style>, comments and tags stripped. */
function visibleText(html) {
  const body = html.slice(html.indexOf('<body'), html.lastIndexOf('</body>'));
  const stripped = body
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  return decodeEntities(stripped).replace(/\s+/g, ' ').trim();
}

/** Case, punctuation and spacing ignored: "Java Developer · Albania" matches "Java Developer Albania". */
const normalize = (text) => text.toLowerCase().normalize('NFC').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const containsKeyword = (text, keyword) => ` ${normalize(text)} `.includes(` ${normalize(keyword)} `);

const textOf = (node) => decodeEntities(node.textContent ?? '').replace(/\s+/g, ' ').trim();
const attr = (doc, selector, name) => doc.querySelector(selector)?.getAttribute(name) ?? null;
const routeFile = (route) => path.join(dist, route.path, 'index.html');
const readDoc = (file) => {
  const html = fs.readFileSync(file, 'utf8');
  return { html, doc: parse(html, { comment: false }) };
};

const HIDDEN_STYLE = /(^|;)\s*(opacity\s*:\s*0(\.0+)?\s*(;|$)|visibility\s*:\s*hidden)/i;

/* ============================================
   PER ROUTE
   ============================================ */
for (const route of ROUTES) {
  section(`${route.path} (${route.lang}, primary "${route.primary}")`);
  const file = routeFile(route);
  check(fs.existsSync(file), `dist${route.path}index.html exists`);
  if (!fs.existsSync(file)) continue;
  const { html, doc } = readDoc(file);
  const url = canonical(route);

  const body = visibleText(html);
  check(body.length >= LIMITS.minBodyTextChars, `visible body text ${body.length} chars (min ${LIMITS.minBodyTextChars})`);
  check(containsKeyword(body, route.primary), 'visible body text contains the primary keyword');

  const h1s = doc.querySelectorAll('h1');
  check(h1s.length === 1, `exactly one <h1> (found ${h1s.length})`);
  if (h1s.length === 1) check(containsKeyword(textOf(h1s[0]), route.primary), `<h1> "${textOf(h1s[0])}" contains the primary keyword`);

  const titles = doc.querySelectorAll('title');
  const title = titles.length ? textOf(titles[0]) : '';
  check(titles.length === 1, 'exactly one <title>');
  check(title.length <= LIMITS.titleMax, `<title> "${title}" is ${title.length} chars (max ${LIMITS.titleMax})`);
  check(title.toLowerCase().includes(route.primary.toLowerCase()), '<title> contains the primary keyword');

  const descriptions = doc.querySelectorAll('meta[name="description"]');
  const desc = descriptions.length ? descriptions[0].getAttribute('content') ?? '' : '';
  check(descriptions.length === 1, 'exactly one meta description');
  check(desc.length >= LIMITS.descMin && desc.length <= LIMITS.descMax, `meta description is ${desc.length} chars (${LIMITS.descMin}-${LIMITS.descMax})`);
  check(!doc.querySelector('meta[name="keywords"]'), 'no meta keywords tag');

  const canonicals = doc.querySelectorAll('link[rel="canonical"]');
  check(canonicals.length === 1 && canonicals[0].getAttribute('href') === url, `canonical is ${url}`);
  check(attr(doc, 'meta[property="og:url"]', 'content') === url, 'og:url equals the canonical');
  check(attr(doc, 'meta[property="og:title"]', 'content') === title, 'og:title equals <title>');
  check(attr(doc, 'meta[property="og:description"]', 'content') === desc, 'og:description equals the meta description');
  check(attr(doc, 'meta[name="twitter:title"]', 'content') === title, 'twitter:title equals <title>');
  check(attr(doc, 'meta[name="twitter:description"]', 'content') === desc, 'twitter:description equals the meta description');

  check(attr(doc, 'html', 'lang') === route.lang, `<html lang="${route.lang}">`);

  const hreflangs = doc.querySelectorAll('link[rel="alternate"][hreflang]').map((link) => [link.getAttribute('hreflang'), link.getAttribute('href')]);
  const other = alternateOf(route);
  if (!other) {
    check(hreflangs.length === 0, 'no hreflang links (no alternate route)');
  } else {
    const english = [route, other].find((candidate) => candidate.lang === 'en') ?? route;
    const expected = new Map([[route.lang, url], [other.lang, canonical(other)], ['x-default', canonical(english)]]);
    const actual = new Map(hreflangs);
    const same = actual.size === expected.size && [...expected].every(([lang, href]) => actual.get(lang) === href);
    check(same, `hreflang ${[...expected.keys()].join(', ')} point to this page, ${other.path} and the English page`);
    const otherFile = routeFile(other);
    if (fs.existsSync(otherFile)) {
      const back = readDoc(otherFile).doc.querySelector(`link[rel="alternate"][hreflang="${route.lang}"]`)?.getAttribute('href');
      check(back === url, `${other.path} links back to this page with hreflang="${route.lang}"`);
    }
  }

  const blocks = doc.querySelectorAll('script[type="application/ld+json"]');
  const parsed = [];
  blocks.forEach((block, i) => {
    try {
      const json = JSON.parse(block.textContent);
      parsed.push(json);
      check(Boolean(json['@context']) && Boolean(json['@type']), `JSON-LD #${i + 1} (${json['@type']}) parses and has @context and @type`);
    } catch (error) {
      check(false, `JSON-LD #${i + 1} parses (${error.message})`);
    }
  });
  const types = parsed.map((json) => json['@type']);
  check(types.includes('Person') && types.includes('WebSite'), 'JSON-LD includes Person and WebSite');
  check(!types.includes('AggregateRating') && !types.includes('Review') && !html.includes('"aggregateRating"'), 'no Review or AggregateRating markup');
  if (route.id !== 'home') check(types.includes('BreadcrumbList'), 'JSON-LD includes BreadcrumbList');

  const visibleFaq = doc.querySelectorAll('[data-faq-item]').map((item) => ({
    q: textOf(item.querySelector('[data-faq-question]')),
    a: textOf(item.querySelector('[data-faq-answer]')),
  }));
  const faqPage = parsed.find((json) => json['@type'] === 'FAQPage');
  if (visibleFaq.length || faqPage) {
    const marked = (faqPage?.mainEntity ?? []).map((entry) => ({ q: entry.name, a: entry.acceptedAnswer?.text }));
    const same = marked.length === visibleFaq.length && marked.every((entry, i) => entry.q === visibleFaq[i].q && entry.a === visibleFaq[i].a);
    check(same, `FAQPage JSON-LD matches the ${visibleFaq.length} visible FAQ entries exactly`);
  }

  const images = doc.querySelectorAll('img');
  const badImages = images.filter((img) => !img.getAttribute('alt')?.trim() || !img.getAttribute('width') || !img.getAttribute('height'));
  check(badImages.length === 0, `all ${images.length} <img> have alt, width and height${badImages.length ? ` (bad: ${badImages.map((img) => img.getAttribute('src')).join(', ')})` : ''}`);

  const hiddenText = doc
    .querySelectorAll('[style]')
    .filter((element) => HIDDEN_STYLE.test(element.getAttribute('style') ?? '') && textOf(element).length > 0);
  check(hiddenText.length === 0, `no text shipped with inline opacity:0 or visibility:hidden${hiddenText.length ? ` (${hiddenText.length} found: "${textOf(hiddenText[0]).slice(0, 60)}")` : ''}`);
}

/* ============================================
   GLOBAL
   ============================================ */
section('Global');
const primaries = ROUTES.map((route) => normalize(route.primary));
check(new Set(primaries).size === primaries.length, 'every primary keyword belongs to exactly one route');

const sitemapFile = path.join(dist, 'sitemap.xml');
check(fs.existsSync(sitemapFile), 'dist/sitemap.xml exists');
if (fs.existsSync(sitemapFile)) {
  const sitemap = fs.readFileSync(sitemapFile, 'utf8');
  const locs = [...sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)].map((match) => match[1]);
  const expected = ROUTES.map(canonical);
  check(locs.length === expected.length && expected.every((loc) => locs.includes(loc)), `sitemap lists exactly the ${expected.length} route URLs`);
  check(!sitemap.includes('#'), 'sitemap has no # URLs');
  const lastmods = [...sitemap.matchAll(/<lastmod>([^<]*)<\/lastmod>/g)].map((match) => match[1]);
  const validDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().startsWith(value);
  check(lastmods.length === expected.length && lastmods.every(validDate), `every <url> has a valid YYYY-MM-DD lastmod (${lastmods[0]})`);
  for (const route of ROUTES.filter((candidate) => alternateOf(candidate))) {
    const entry = sitemap.split('<url>').find((chunk) => chunk.includes(`<loc>${canonical(route)}</loc>`)) ?? '';
    check(entry.includes(`hreflang="${alternateOf(route).lang}" href="${canonical(alternateOf(route))}"`), `sitemap entry for ${route.path} has its hreflang alternate`);
  }
}

const robotsFile = path.join(dist, 'robots.txt');
check(fs.existsSync(robotsFile), 'dist/robots.txt exists');
if (fs.existsSync(robotsFile)) {
  const robots = fs.readFileSync(robotsFile, 'utf8');
  check(robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`), `robots.txt references ${SITE_URL}/sitemap.xml`);
  check(/^Allow: \/$/m.test(robots) && !/^Disallow: \/\s*$/m.test(robots), 'robots.txt allows all crawlers');
}

const notFoundFile = path.join(dist, '404.html');
check(fs.existsSync(notFoundFile), 'dist/404.html exists');
if (fs.existsSync(notFoundFile)) {
  const { doc } = readDoc(notFoundFile);
  check(/noindex/.test(attr(doc, 'meta[name="robots"]', 'content') ?? ''), '404.html has <meta name="robots" content="noindex">');
  check(!doc.querySelector('link[rel="canonical"]'), '404.html has no canonical');
}

const TEXT_FILE = /\.(html|js|css|xml|txt|json|webmanifest|svg)$/i;
const walk = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
const leftovers = walk(dist).filter((file) => TEXT_FILE.test(file) && fs.readFileSync(file, 'utf8').includes('Portfolio App'));
check(leftovers.length === 0, `no file in dist/ contains "Portfolio App"${leftovers.length ? ` (${leftovers.join(', ')})` : ''}`);

const siteFile = path.join(root, 'src', 'seo', 'site.ts');
const hardcoded = walk(path.join(root, 'src')).filter((file) => file !== siteFile && fs.readFileSync(file, 'utf8').includes(SITE_URL));
check(hardcoded.length === 0, `${SITE_URL} appears in src/ only in src/seo/site.ts${hardcoded.length ? ` (also in ${hardcoded.join(', ')})` : ''}`);

/* ============================================
   RESULT
   ============================================ */
console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) {
  console.log('\nFailures:');
  failures.forEach((failure) => console.log(`  - ${failure}`));
  process.exit(1);
}
