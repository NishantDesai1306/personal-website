// Checks the production output in build/ (run `npm run build` first; `npm run
// check` does this). These guard what crawlers, AI agents and offline visitors get.
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';
import { jobs, profile, projects } from '../src/data/profile';

const build = resolve(import.meta.dirname, '../build');
const read = (file: string) => readFileSync(resolve(build, file), 'utf8');

if (!existsSync(resolve(build, 'index.html'))) {
  throw new Error('build/ is missing — run `npm run build` before the tests.');
}

const document = new JSDOM(read('index.html')).window.document;
const text = document.body.textContent ?? '';

describe('static HTML (no JavaScript)', () => {
  it('contains the full work history', () => {
    for (const job of jobs) {
      const panel = document.getElementById(`job-${job.id}`);
      expect(panel, job.company).not.toBeNull();
      expect(panel?.hidden).toBe(false);
      expect(panel?.textContent).toContain(job.title);
      expect(panel?.textContent).toContain(job.duration);
    }
  });

  it('contains every project with working links', () => {
    for (const project of projects) {
      expect(text).toContain(project.name);
      for (const link of project.links) {
        expect(document.querySelector(`a[href="${link.href}"]`), link.href).not.toBeNull();
      }
    }
  });

  it('keeps the historical section anchors and the contact routes', () => {
    for (const id of ['about-me', 'experience', 'projects', 'contact-me', 'main-content']) {
      expect(document.getElementById(id), id).not.toBeNull();
    }
    expect(document.querySelector(`a[href="mailto:${profile.email}"]`)).not.toBeNull();
    expect(document.querySelector(`a[href="${profile.resume}"]`)).not.toBeNull();
    expect(document.querySelector(`a[href="${profile.links.linkedin}"]`)).not.toBeNull();
  });

  it('every in-page link points at an existing element', () => {
    const hashes = [...document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')].map((a) => a.getAttribute('href')!);
    for (const hash of new Set(hashes)) {
      expect(document.getElementById(hash.slice(1)), hash).not.toBeNull();
    }
  });

  it('has a single h1 and alt text on images', () => {
    expect(document.querySelectorAll('h1')).toHaveLength(1);
    for (const img of document.querySelectorAll('img')) expect(img.getAttribute('alt')).toBeTruthy();
  });
});

describe('metadata for search engines and agents', () => {
  it('publishes valid Person structured data', () => {
    const script = document.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script?.textContent ?? '{}');
    expect(data['@type']).toBe('ProfilePage');
    expect(data.mainEntity).toMatchObject({
      '@type': 'Person',
      name: profile.name,
      worksFor: { name: 'J.D. Power' },
    });
    expect(data.mainEntity.sameAs).toContain(profile.links.github);
  });

  it('sets canonical, description and social preview', () => {
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(profile.site);
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBeTruthy();
    expect(document.querySelector('meta[property="og:image"]')?.getAttribute('content')).toMatch(/social-preview\.png$/);
    expect(existsSync(resolve(build, 'social-preview.png'))).toBe(true);
  });

  it('serves llms.txt with the same experience and projects', () => {
    const llms = read('llms.txt');
    expect(llms.startsWith(`# ${profile.name}`)).toBe(true);
    for (const job of jobs) expect(llms).toContain(`${job.title} — ${job.company} (${job.duration})`);
    for (const project of projects) expect(llms).toContain(`### ${project.name}`);
  });

  it('allows crawling and lists the sitemap', () => {
    expect(read('robots.txt')).toMatch(/Allow: \//);
    expect(read('robots.txt')).toContain('Sitemap: https://nishantdesai1306.github.io/sitemap.xml');
    expect(read('sitemap.xml')).toContain(`<loc>${profile.site}</loc>`);
  });
});

describe('offline support and upgrades', () => {
  const sw = read('service-worker.js');

  it('precaches the page and the résumé so both open offline', () => {
    expect(sw).toContain('"index.html"');
    expect(sw).toContain('"Nishant_Desai_Resume.pdf"');
  });

  it('waits for the visitor to accept an update', () => {
    expect(sw).toMatch(/"SKIP_WAITING"===\w+\.data\.type&&self\.skipWaiting\(\)/);
  });

  it('keeps the legacy /sw.js entry point pointing at the current worker', () => {
    expect(read('sw.js')).toContain("importScripts('./service-worker.js')");
  });

  it('references manifest icons that exist', () => {
    const manifest = JSON.parse(read('manifest.json'));
    for (const icon of manifest.icons) {
      expect(existsSync(resolve(build, icon.src.replace(/^\//, ''))), icon.src).toBe(true);
    }
  });
});
