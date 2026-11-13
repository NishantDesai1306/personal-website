# Nishant Desai — portfolio source

This is the editable React / Material UI source for `nishantdesai1306.github.io`.
The sibling `../nishantdesai1306.github.io` repository contains the published build,
not the application source. Make application changes here; do not edit minified
files in the publication repository.

## Local development

Use Node.js 24 and npm with the committed lockfile:

```sh
npm ci
npm start
```

## Verification and production build

```sh
CI=true npm run check
```

This runs ESLint, the functional Jest tests, and an optimized build into `build/`.
The GitHub Actions verification workflow runs the same checks on pushes and pull
requests. It does **not** publish the website. Source maps remain enabled for
production debugging; never include private information in client source.

To inspect the production PWA locally:

```sh
python3 -m http.server 8766 --bind 127.0.0.1 --directory build
```

Open `http://127.0.0.1:8766/`. Service workers are registered only in production
builds, not by the development server.

## Content and assets

- `src/constant.js`: profile links and About copy.
- `src/Experience.js`: employment history and existing engineering results.
- `src/Projects.js`: personal projects and demos.
- `public/Nishant_Desai_Resume.pdf`: résumé download.
- `src/assets/owner.webp`, `chess.webp`: optimized display assets; originals remain
  in `src/assets/` for future edits.
- `public/social-preview.png`: sharing image. Its editable composition is
  `scripts/social-preview.html`; render at 1200 × 630 pixels to re-export it.
- `public/index.html`: metadata and a JavaScript-disabled contact/résumé fallback.
  The full page still uses client-side React rendering; this is not an SSR setup.

## Offline use and updates

`src/service-worker.js` precaches compiled application assets plus the public
resources listed in `src/offline-assets.json`, including the résumé and icons.
`npm run build` hashes those public resources and supplies their revision to
Workbox. Always use that command rather than calling `react-scripts build`
directly; it ensures a changed résumé invalidates the offline cache.

`public/sw.js` is a compatibility entry point for older installations. It imports
the maintained worker rather than keeping the original cache-first implementation.
Keep it available until legacy registrations have been intentionally retired.

The update invitation is React state, not a hidden DOM node. It detects both new
updates and a worker already waiting from a previous visit. Visitors choose when
to activate a new worker; the page reloads after activation.

### Manual acceptance checks

1. At 320, 390, 1024, and 1440 px, confirm navigation and project controls remain
   reachable without horizontal page scrolling.
2. Use the mobile drawer with Tab and Enter; selecting a section closes the drawer,
   but tabbing through links must not close it.
3. Visit the production build online, wait for the worker to activate, then go
   offline. Reload the homepage and open the résumé without having opened it first.
   External demo videos and social links still require an internet connection.
4. Leave a page open while serving a second build from the same origin. Verify
   “Update available”, dismissal, and “Update now”. Reload with an update already
   waiting to verify it is offered again.
5. Verify `/sw.js` installations receive the current app without deleting unrelated
   site storage. Physical-device installation remains a separate manual check.

## Publishing

Publication is a separate, explicitly approved step: verify this source, copy the
contents of `build/` into the publication repository, and review the generated
changes there before committing/pushing. Preserve unrelated notes and repository
metadata. Remove stale generated bundles/legacy precache manifests deliberately,
not with a blanket directory deletion. Do not remove the compatibility `sw.js`.
