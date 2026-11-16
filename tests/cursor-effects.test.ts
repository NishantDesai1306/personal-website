// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { effectsOptedOut, setEffectsOptedOut, whileEffectsEnabled, EFFECTS_KEY } from '../src/scripts/effects';
import { describe as describeElement, startInspectOverlay } from '../src/scripts/inspect-overlay';
import { magneticOffset, startMagnetic } from '../src/scripts/magnetic';
import { endsWith, initLayoutDebug, layoutDebugOn, toggleLayoutDebug } from '../src/scripts/layout-debug';

function stubMedia(matches: boolean) {
  vi.stubGlobal('matchMedia', () => ({ matches, addEventListener() {} }));
}

function pointer(type: string, target: EventTarget, init: Partial<PointerEvent> = {}) {
  const event = new Event(type, { bubbles: true });
  Object.assign(event, { pointerType: 'mouse', clientX: 0, clientY: 0, ...init });
  target.dispatchEvent(event);
}

function press(...keys: string[]) {
  for (const key of keys) document.body.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

afterEach(() => {
  vi.unstubAllGlobals();
  document.body.replaceChildren();
  document.documentElement.className = '';
  localStorage.clear();
});

describe('cursor effects switch', () => {
  it('starts effects when allowed and stops them when the visitor opts out, remembering the choice', () => {
    stubMedia(true);
    const stop = vi.fn();
    const start = vi.fn(() => stop);
    whileEffectsEnabled(start);
    expect(start).toHaveBeenCalledTimes(1);

    setEffectsOptedOut(true);
    expect(stop).toHaveBeenCalledTimes(1);
    expect(effectsOptedOut()).toBe(true);
    expect(localStorage.getItem(EFFECTS_KEY)).toBe('off');

    setEffectsOptedOut(false);
    expect(start).toHaveBeenCalledTimes(2);
    expect(localStorage.getItem(EFFECTS_KEY)).toBeNull();
  });

  it('never starts on touch screens or with reduced motion', () => {
    stubMedia(false);
    const start = vi.fn(() => () => {});
    whileEffectsEnabled(start);
    setEffectsOptedOut(false);
    expect(start).not.toHaveBeenCalled();
  });

  it('respects an opt-out saved on a previous visit', () => {
    stubMedia(true);
    document.documentElement.classList.add('effects-off'); // set by the inline head script
    const start = vi.fn(() => () => {});
    whileEffectsEnabled(start);
    expect(start).not.toHaveBeenCalled();
  });
});

describe('inspect hover', () => {
  it('names elements the way DevTools does', () => {
    const el = document.createElement('article');
    el.className = 'job panel extra';
    expect(describeElement(el)).toBe('article.job.panel');
  });

  it('labels the hovered card with its name and size, and hides off-target', () => {
    document.body.innerHTML = '<article class="card panel"><a class="chip">x</a></article><p>text</p>';
    const card = document.querySelector('.card')!;
    card.getBoundingClientRect = () => ({ left: 10, top: 200, width: 320.4, height: 180, right: 330, bottom: 380 }) as DOMRect;
    const stop = startInspectOverlay();

    pointer('pointerover', card);
    const overlay = document.querySelector<HTMLElement>('.inspect-overlay')!;
    expect(overlay.hidden).toBe(false);
    expect(overlay.textContent).toBe('article.card.panel320 × 180');

    // Nested targets win over their container.
    pointer('pointerover', document.querySelector('.chip')!);
    expect(overlay.textContent).toContain('a.chip');

    pointer('pointerover', document.querySelector('p')!);
    expect(overlay.hidden).toBe(true);

    stop();
    expect(document.querySelector('.inspect-overlay')).toBeNull();
  });

  it('does not box magnetic buttons, but keeps the box of a card they sit in', () => {
    document.body.innerHTML = '<a class="btn" id="loose">x</a><article class="card panel"><a class="btn" id="nested">y</a></article>';
    const stop = startInspectOverlay();
    pointer('pointerover', document.querySelector('#loose')!);
    expect(document.querySelector('.inspect-overlay')).toBeNull();
    pointer('pointerover', document.querySelector('#nested')!);
    expect(document.querySelector('.inspect-overlay')!.textContent).toContain('article.card.panel');
    stop();
  });

  it('ignores touch input', () => {
    document.body.innerHTML = '<div class="panel"></div>';
    const stop = startInspectOverlay();
    pointer('pointerover', document.querySelector('.panel')!, { pointerType: 'touch' });
    expect(document.querySelector('.inspect-overlay')).toBeNull();
    stop();
  });
});

describe('magnetic buttons', () => {
  it('pulls towards the cursor, capped at a few pixels', () => {
    const rect = { left: 0, top: 0, width: 100, height: 40 };
    expect(magneticOffset(50, 20, rect)).toEqual({ x: 0, y: 0 });
    expect(magneticOffset(60, 24, rect)).toEqual({ x: 2.5, y: 1 });
    expect(magneticOffset(500, -500, rect)).toEqual({ x: 6, y: -6 });
  });

  it('moves the hovered button and releases it when the cursor leaves', () => {
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => (cb(0), 1));
    document.body.innerHTML = '<a class="btn">Hi</a><p>away</p>';
    const button = document.querySelector<HTMLElement>('.btn')!;
    button.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 40 }) as DOMRect;
    const stop = startMagnetic();

    pointer('pointermove', button, { clientX: 100, clientY: 40 });
    expect(button.style.translate).toBe('6.0px 5.0px');

    pointer('pointermove', document.querySelector('p')!, { clientX: 300, clientY: 300 });
    expect(button.style.translate).toBe('');
    stop();
  });
});

describe('layout-debug easter egg', () => {
  beforeEach(() => toggleLayoutDebug(false));

  it('matches key sequences at the end of the buffer only', () => {
    expect(endsWith(['x', 'a', 'b'], ['a', 'b'])).toBe(true);
    expect(endsWith(['a', 'b', 'x'], ['a', 'b'])).toBe(false);
  });

  it('toggles with the typed word or the Konami code, and Esc turns it off', () => {
    initLayoutDebug();
    press(...'inspect');
    expect(layoutDebugOn()).toBe(true);
    expect(document.querySelector('[role="status"]')?.textContent).toContain('Layout overlay on');

    press('Escape');
    expect(layoutDebugOn()).toBe(false);

    press('ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'B', 'A');
    expect(layoutDebugOn()).toBe(true);
  });

  it('ignores keys typed into form fields', () => {
    document.body.innerHTML = '<input />';
    const input = document.querySelector('input')!;
    for (const key of 'inspect') input.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    expect(layoutDebugOn()).toBe(false);
  });
});
