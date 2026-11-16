# Nishant Desai — portfolio source

Source for `nishantdesai1306.github.io`, built with [Astro](https://astro.build) as a
static, JavaScript-light site in a "browser DevTools" style. The sibling
`../nishantdesai1306.github.io` repository contains the published build, not the
source. Make changes here; never edit generated files in the publication repository.

## Local development

Use Node.js 24 and npm with the committed lockfile:

```sh
npm ci
npm run dev        # http://localhost:4321 (no service worker in dev)
```

## Verification and production build

```sh
CI=true npm run check
```

This runs `astro check` (TypeScript + Astro diagnostics), the production build into
`build/` (including `build/service-worker.js`), then the Vitest suite. Tests under
`tests/` cover client behaviour (timeline tabs, console, Quick Open, PWA update/install flow)
and the built output (no-JS content, structured data, `llms.txt`, offline
precache). The GitHub Actions workflow runs the same command; it does **not**
publish the website.

To inspect the production build locally:

```sh
python3 -m http.server 8766 --bind 127.0.0.1 --directory build
```

## Content and assets

- `src/data/profile.ts`: **all content** — profile, About copy, technologies, Core
  Web Vitals results, experience and projects. The page, `llms.txt`, JSON-LD and
  the console easter egg are all generated from it. Keep it faithful to the résumé.
- `src/components/*.astro`: page sections (`Hero`, `About`, `CaseStudies`, `Vitals`,
  `Experience`, `Projects`, `Contact`) plus `TopBar`, `QuickOpen` and `UpdateToast`.
- `src/scripts/*.ts`: client behavior modules — timeline tabs, console, Quick Open, PWA helpers
  and cursor effects (field, hero tilt, inspect overlay and magnetic buttons), plus
  the layout-debug easter egg. Core content renders without JavaScript; scripts
  only enhance it. Cursor effects share a fine-pointer/reduced-motion/preference
  gate in `effects.ts` and a single entry in `src/pages/index.astro`.
- `src/assets/owner.webp`: portrait (Astro generates responsive sizes); the original
  `owner.png` stays for future edits.
- `public/Nishant_Desai_Resume.pdf`: résumé download.
- `public/social-preview.png`: sharing image, composed in `scripts/social-preview.html`
  (render command in that file).
- Fonts (Geist, JetBrains Mono) are self-hosted via `@fontsource-variable`.

## Quick Open

Use the header search button or **⌘K / Ctrl+K** to find projects, experience, case
studies and the résumé. Search is local, case/accent-insensitive and matches all
query words. Arrow keys select a result, Enter opens it, and Escape closes the
dialog and returns focus. Selecting a job also reveals its collapsed timeline
panel. The index is built in the browser on first open from the sections each
result links to; there is no search service, client dependency, duplicated content
in the HTML or additional index request. Without JavaScript the
search button stays hidden and all core content remains available normally.

## Crawlers and AI agents

The full page — every job, project and link — is in the static HTML. The build also
emits `ProfilePage`/`Person` JSON-LD, `/llms.txt` (plain-text profile), `/sitemap.xml`
and `/robots.txt`.

## Offline use and updates

`scripts/generate-sw.mjs` runs after `astro build` and uses Workbox to generate
`build/service-worker.js`, precaching the page, its assets, Latin font subsets, the
résumé and the app icons. Always build with `npm run build` so the worker is
regenerated.

The worker **must stay at `/service-worker.js`**: visitors who installed the old React
version have a worker registered at that URL, and they receive this site as a normal
update. `public/sw.js` is the compatibility entry point for even older installations;
it imports the current worker. Keep both.

Visitors choose when to update: a waiting worker shows the "Update available" toast,
also after a reload, and "Update now" activates it and reloads.

### Manual acceptance checks

1. At 320, 390, 1024 and 1440 px, confirm there is no horizontal page scrolling and
   the career trace keeps the selected role visible.
2. Keyboard: the skip link is the first stop; section tabs move focus; timeline tabs
   respond to ←/→/Home/End.
3. Visit the production build online, then go offline. Reload the homepage and open
   the résumé without having opened it first.
4. With a page open, serve a second build from the same origin. Verify "Update
   available", dismissal, reload-while-waiting and "Update now".
5. Upgrade path: install the currently published site, deploy this build at the same
   origin and confirm the old page's update prompt loads the new site.

## Publishing

Publication is a separate, explicitly approved step: verify this source, copy the
contents of `build/` into the publication repository, and review the changes there
before committing/pushing. The old React build files (`static/`, `asset-manifest.json`,
`precache-manifest.*.js`, `service-worker.js.map`, `index.css`, hashed SVGs) can be
removed deliberately at that point. Preserve unrelated notes and repository metadata,
and never remove `sw.js`.
