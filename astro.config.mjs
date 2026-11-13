// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://nishantdesai1306.github.io',
  // Keep the historical output folder so the publishing workflow is unchanged.
  outDir: './build',
  build: { inlineStylesheets: 'auto' },
  compressHTML: true,
  vite: {
    build: {
      // Inline the page's small client scripts into the HTML (no extra JS requests);
      // every other asset keeps Vite's default 4 KB rule.
      assetsInlineLimit: (file, content) => (file.endsWith('.js') ? content.length < 16 * 1024 : undefined),
    },
  },
});
