// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://nishantdesai1306.github.io',
  // Keep the historical output folder so the publishing workflow is unchanged.
  outDir: './build',
  build: { inlineStylesheets: 'auto' },
  compressHTML: true,
});
