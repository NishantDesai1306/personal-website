// Generates build/service-worker.js after `astro build`.
//
// The filename must stay /service-worker.js: visitors who installed the old
// React app have a worker registered at that URL, and the browser only picks
// up the new site once that script changes. /sw.js (legacy) imports this file.
import { generateSW } from 'workbox-build';

const { count, size, warnings } = await generateSW({
  globDirectory: 'build',
  globPatterns: [
    'index.html',
    '_astro/*.{js,css,webp}',
    // Only the Latin subsets; other unicode ranges are fetched on demand.
    '_astro/*-latin-wght-normal*.woff2',
    'Nishant_Desai_Resume.pdf',
    'manifest.json',
    'favicon.ico',
    'images/icons/icon-192x192.png',
    'images/icons/icon-512x512.png',
  ],
  swDest: 'build/service-worker.js',
  // Astro fingerprints everything under /_astro, so skip Workbox's revision query.
  dontCacheBustURLsMatching: /^_astro\//,
  // Visitors choose when to update (see src/scripts/pwa.ts), so wait for SKIP_WAITING.
  skipWaiting: false,
  clientsClaim: true,
  cleanupOutdatedCaches: true,
  inlineWorkboxRuntime: true,
  sourcemap: false,
  mode: 'production',
});

for (const warning of warnings) console.warn(warning);
console.log(`service-worker.js: precached ${count} files (${(size / 1024).toFixed(0)} KiB)`);
