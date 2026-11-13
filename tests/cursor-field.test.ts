// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createField, initCursorField, lightEdges, step } from '../src/scripts/cursor-field';

function settle(field: ReturnType<typeof createField>, pointer: { x: number; y: number } | null) {
  let frames = 0;
  while (step(field, pointer) && frames < 1000) frames++;
  return frames;
}

describe('cursor field simulation', () => {
  it('pushes nearby dots away from the pointer and leaves distant ones alone', () => {
    const field = createField(400, 400);
    const pointer = { x: 200, y: 200 };
    for (let i = 0; i < 5; i++) step(field, pointer);

    const near = [...field.hx.keys()].find(
      (i) => Math.hypot(field.hx[i] - 200, field.hy[i] - 200) < 40 && field.hx[i] > 205,
    )!;
    const far = [...field.hx.keys()].find((i) => Math.hypot(field.hx[i] - 200, field.hy[i] - 200) > 200)!;

    expect(field.ox[near]).toBeGreaterThan(0); // moved right, away from the pointer
    expect(field.glow[near]).toBeGreaterThan(0);
    expect(field.ox[far]).toBe(0);
    expect(field.glow[far]).toBe(0);
  });

  it('comes to rest after the pointer leaves, so the animation loop stops', () => {
    const field = createField(400, 400);
    for (let i = 0; i < 10; i++) step(field, { x: 120, y: 160 });

    const frames = settle(field, null);
    expect(frames).toBeLessThan(1000);
    expect(step(field, null)).toBe(false);
    expect(field.ox.every((v) => v === 0) && field.glow.every((v) => v === 0)).toBe(true);
  });

  it('goes idle while the cursor rests on the page', () => {
    const field = createField(400, 400);
    const pointer = { x: 200, y: 200 };
    for (let i = 0; i < 5; i++) step(field, pointer, true);

    let frames = 0;
    while (step(field, pointer, false) && frames < 1000) frames++;
    expect(frames).toBeLessThan(1000);
  });

  it('a click ripple travels outwards and then finishes', () => {
    const field = createField(600, 600);
    field.ripples.push({ x: 300, y: 300, r: 0 });
    for (let i = 0; i < 12; i++) step(field, null);
    expect(field.glow.some((v) => v > 0)).toBe(true);

    expect(settle(field, null)).toBeLessThan(1000);
    expect(field.ripples).toHaveLength(0);
  });

  it('keeps the strip under the top bar empty', () => {
    const field = createField(400, 400, 48);
    expect(Math.min(...field.hy)).toBeGreaterThan(48);
  });

  it('traces the outline of a card the cursor approaches, nearest edge brightest', () => {
    const field = createField(800, 600);
    const card = { left: 200, top: 200, right: 500, bottom: 400 };
    lightEdges(field, [card], { x: 510, y: 300 });

    const lit = [...field.glow.keys()].filter((i) => field.glow[i] > 0);
    expect(lit.length).toBeGreaterThan(0);
    for (const i of lit) {
      const x = field.hx[i];
      const y = field.hy[i];
      const inside = x >= card.left && x <= card.right && y >= card.top && y <= card.bottom;
      expect(inside).toBe(false); // hidden under the card, so never lit
      expect(x > card.left - 29 && x < card.right + 29 && y > card.top - 29 && y < card.bottom + 29).toBe(true);
    }
    const right = lit.filter((i) => field.hx[i] > card.right);
    const left = lit.filter((i) => field.hx[i] < card.left);
    expect(Math.max(...right.map((i) => field.glow[i]))).toBeGreaterThan(Math.max(0, ...left.map((i) => field.glow[i])));
  });

  it('leaves cards alone when the cursor is far away', () => {
    const field = createField(800, 600);
    lightEdges(field, [{ left: 200, top: 200, right: 300, bottom: 300 }], { x: 700, y: 550 });
    expect(field.glow.every((v) => v === 0)).toBe(true);
  });
});

describe('cursor field activation', () => {
  afterEach(() => {
    document.querySelector('.cursor-field')?.remove();
    vi.unstubAllGlobals();
  });

  function stubMotion(matches: boolean) {
    vi.stubGlobal('matchMedia', () => ({ matches, addEventListener() {} }));
    vi.stubGlobal('requestAnimationFrame', () => 1);
    vi.stubGlobal('cancelAnimationFrame', () => {});
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      setTransform() {},
      clearRect() {},
      fillRect() {},
    })) as never;
  }

  function mouseMove() {
    const event = new Event('pointermove') as PointerEvent;
    Object.assign(event, { pointerType: 'mouse', clientX: 10, clientY: 10 });
    window.dispatchEvent(event);
  }

  it('adds nothing until the mouse moves, then adds the decorative canvas', () => {
    stubMotion(true);
    initCursorField();
    expect(document.querySelector('.cursor-field')).toBeNull();

    mouseMove();
    const canvas = document.querySelector('.cursor-field');
    expect(canvas).not.toBeNull();
    expect(canvas?.getAttribute('aria-hidden')).toBe('true');
  });

  it('stays off for touch screens and reduced motion', () => {
    stubMotion(false);
    initCursorField();
    mouseMove();
    expect(document.querySelector('.cursor-field')).toBeNull();
  });
});
