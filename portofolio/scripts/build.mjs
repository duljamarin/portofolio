// npm run build: client bundle, server bundle, prerendered pages, then the SEO check.
// Any failing step (including a failing SEO check) exits non-zero and fails the build.
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { build } from 'vite';

const root = path.resolve(import.meta.dirname, '..');
process.chdir(root);

// One date for the whole build: footer year, experience label and sitemap lastmod.
process.env.BUILD_DATE ??= new Date().toISOString().slice(0, 10);

await build();
await build({
  logLevel: 'warn',
  build: { ssr: 'src/entry-server.tsx', outDir: 'dist-ssr', emptyOutDir: true, copyPublicDir: false, manifest: false },
});

for (const script of ['prerender.mjs', 'seo-check.mjs']) {
  // Production React for the render, the same build visitors get.
  const result = spawnSync(process.execPath, [path.join('scripts', script)], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: process.env.NODE_ENV ?? 'production' },
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
