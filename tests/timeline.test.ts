// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { jobs, type Job } from '../src/data/profile';
import { careerRange, placement, rulerYears } from '../src/lib/timeline';
import { enhanceTimeline } from '../src/scripts/timeline';

const now = new Date(2026, 10, 12); // 12 Nov 2026

describe('career timeline placement', () => {
  const range = careerRange(jobs, now);

  it('spans from the first job to the current year', () => {
    expect(range).toEqual({ start: 2016, end: 2027 });
    expect(rulerYears(range)).toHaveLength(11);
  });

  it('places every job inside the ruler in chronological order', () => {
    const spans = [...jobs]
      .reverse()
      .map((job) => placement(job, range, now));
    for (const { left, width } of spans) {
      expect(left).toBeGreaterThanOrEqual(0);
      expect(left + width).toBeLessThanOrEqual(100.01);
    }
    // Consecutive roles may share their changeover month (modd.io → FoodX in Sep 2020).
    const oneMonth = (1 / 12 / 11) * 100;
    for (let i = 1; i < spans.length; i++) {
      expect(spans[i].left).toBeGreaterThanOrEqual(spans[i - 1].left + spans[i - 1].width - oneMonth - 0.01);
    }
  });

  it('extends the current role up to today', () => {
    const current = jobs.find((job) => !job.end) as Job;
    const { left, width } = placement(current, range, now);
    const todayPct = ((2026 + 11 / 12 - 2016) / 11) * 100;
    expect(left + width).toBeCloseTo(todayPct, 1);
  });
});

function renderTimeline() {
  document.body.innerHTML = `
    <div data-timeline>
      <div data-trace-scroll><div class="lane">
        <a id="tab-a" href="#job-a" data-job-tab data-current="false">A</a>
        <a id="tab-b" href="#job-b" data-job-tab data-current="false">B</a>
        <a id="tab-c" href="#job-c" data-job-tab data-current="true">C</a>
      </div></div>
      <article id="job-a" data-job-panel>a</article>
      <article id="job-b" data-job-panel>b</article>
      <article id="job-c" data-job-panel>c</article>
    </div>`;
  const root = document.querySelector<HTMLElement>('[data-timeline]')!;
  root.querySelectorAll<HTMLElement>('[data-job-panel], [data-job-tab]').forEach((element) => {
    element.scrollIntoView = vi.fn();
  });
  enhanceTimeline(root);
  const tabs = [...root.querySelectorAll<HTMLElement>('[data-job-tab]')];
  const panels = [...root.querySelectorAll<HTMLElement>('[data-job-panel]')];
  const visible = () => panels.filter((p) => !p.hidden).map((p) => p.id);
  return { root, tabs, panels, visible };
}

describe('enhanceTimeline', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    window.history.replaceState(null, '', '/');
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0);
      return 0;
    });
  });
  afterEach(() => vi.restoreAllMocks());

  it('opens the linked job instead of hiding it during enhancement', () => {
    window.history.replaceState(null, '', '#job-b');
    const { visible } = renderTimeline();
    expect(visible()).toEqual(['job-b']);
  });

  it('reveals jobs reached through fragment navigation after load', () => {
    const { visible } = renderTimeline();
    window.history.replaceState(null, '', '#job-a');
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    expect(visible()).toEqual(['job-a']);
  });

  it('activates a focused timeline tab with Space', () => {
    const { tabs, visible } = renderTimeline();
    tabs[0].focus();
    const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true });
    tabs[0].dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(visible()).toEqual(['job-a']);
  });

  it('starts on the current role and hides the others', () => {
    const { tabs, visible } = renderTimeline();
    expect(visible()).toEqual(['job-c']);
    expect(tabs[2].getAttribute('aria-selected')).toBe('true');
    expect(tabs.map((t) => t.tabIndex)).toEqual([-1, -1, 0]);
  });

  it('links tabs and panels for assistive technology', () => {
    const { tabs, panels } = renderTimeline();
    expect(tabs[0].parentElement?.getAttribute('role')).toBe('tablist');
    expect(tabs[0].getAttribute('aria-controls')).toBe('job-a');
    expect(panels[0].getAttribute('aria-labelledby')).toBe('tab-a');
  });

  it('switches the visible job on click without following the link', () => {
    const { tabs, visible } = renderTimeline();
    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    tabs[0].dispatchEvent(click);
    expect(click.defaultPrevented).toBe(true);
    expect(visible()).toEqual(['job-a']);
  });

  it('supports arrow, Home and End keys with wrap-around', () => {
    const { tabs, visible } = renderTimeline();
    const press = (el: HTMLElement, key: string) =>
      el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));

    press(tabs[2], 'ArrowRight');
    expect(visible()).toEqual(['job-a']);
    expect(document.activeElement).toBe(tabs[0]);

    press(tabs[0], 'ArrowLeft');
    expect(visible()).toEqual(['job-c']);

    press(tabs[2], 'Home');
    expect(visible()).toEqual(['job-a']);

    press(tabs[0], 'End');
    expect(visible()).toEqual(['job-c']);
  });
});
