// Generates optimized WebP (and JPG fallback) versions of site images.
// Originals are left untouched; outputs get an `-opt` suffix.
// Run with: node scripts/optimize-images.mjs
import sharp from 'sharp';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, '../public');

// Per-image config: max width and WebP quality. Project screenshots render
// at most ~1280px wide (modal); the hero portrait frame is small.
const config = {
  'photo_portofolio.jpg': { maxWidth: 760, quality: 72, fallback: 'jpeg' },
  'xbrat-ai.png': { maxWidth: 1280, quality: 78 },
  'personal-finances-1.png': { maxWidth: 1280, quality: 78 },
  'personal-finances-2.png': { maxWidth: 1280, quality: 78 },
  'personal-finances-3.png': { maxWidth: 1280, quality: 78 },
  'the-literary-heaven-1.png': { maxWidth: 1280, quality: 78 },
  'the-literary-heaven-2.png': { maxWidth: 1280, quality: 78 },
  'clearsight-1.png': { maxWidth: 1280, quality: 78 },
  'clearsight-2.png': { maxWidth: 1280, quality: 78 },
  'clearsight-3.png': { maxWidth: 1280, quality: 78 },
  'azure-certification.png': { maxWidth: 800, quality: 80 },
};

const fmtKB = (n) => `${(n / 1024).toFixed(0)} KB`;

async function run() {
  const entries = await readdir(PUBLIC_DIR);
  let totalBefore = 0;
  let totalAfter = 0;

  for (const [file, opts] of Object.entries(config)) {
    if (!entries.includes(file)) {
      console.warn(`skip (missing): ${file}`);
      continue;
    }
    const src = path.join(PUBLIC_DIR, file);
    const base = file.replace(/\.[^.]+$/, '');
    const input = sharp(src);
    const meta = await input.metadata();
    const beforeSize = meta.size ?? 0;
    totalBefore += beforeSize;

    const resize = meta.width && meta.width > opts.maxWidth
      ? { width: opts.maxWidth, withoutEnlargement: true }
      : null;

    // WebP output
    const webpPath = path.join(PUBLIC_DIR, `${base}.webp`);
    const webpPipe = sharp(src);
    if (resize) webpPipe.resize(resize);
    const webpInfo = await webpPipe.webp({ quality: opts.quality }).toFile(webpPath);
    totalAfter += webpInfo.size;

    let line = `${file}: ${fmtKB(beforeSize)} -> ${path.basename(webpPath)} ${fmtKB(webpInfo.size)}`;

    // Optional compressed fallback in the original format (for <picture>)
    if (opts.fallback === 'jpeg') {
      const fbPath = path.join(PUBLIC_DIR, `${base}-opt.jpg`);
      const fbPipe = sharp(src);
      if (resize) fbPipe.resize(resize);
      const fbInfo = await fbPipe.jpeg({ quality: opts.quality, mozjpeg: true }).toFile(fbPath);
      line += ` | ${path.basename(fbPath)} ${fmtKB(fbInfo.size)}`;
    }

    console.log(line);
  }

  console.log('---');
  console.log(`WebP total: ${fmtKB(totalBefore)} -> ${fmtKB(totalAfter)} (saved ${fmtKB(totalBefore - totalAfter)})`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
