/**
 * Interactive background: a faint "pixel grid" (a nod to the DevTools layout
 * overlay) that lights up and bends away from the mouse, ripples on click, and
 * traces the outline of whichever card the cursor approaches.
 *
 * Performance rules:
 * - Runs only while cursor effects are enabled (see effects.ts).
 * - The canvas is created on the first mouse move, not during page load.
 * - The animation loop runs only while something is moving and stops once the
 *   grid settles, so an idle page costs nothing.
 */

import { whileEffectsEnabled } from './effects';

const SPACING = 28;
const RADIUS = 150;
const PUSH = 1.6;
const SPRING = 0.08;
const DAMPING = 0.82;
const GLOW_DECAY = 0.955;
const RIPPLE_SPEED = 9;
const RIPPLE_WIDTH = 26;
const RIPPLE_MAX = 520;
const REST = 0.02;
const LEVELS = 8;
const EDGE_REACH = 120; // how close the cursor must be to a card to light its outline
const EDGE_BAND = SPACING; // one grid step, so every edge always has a row of dots to light
const EDGE_SPREAD = 320; // the outline fades with distance from the cursor

export interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface Field {
  count: number;
  cols: number;
  rows: number;
  originX: number;
  originY: number;
  hx: Float32Array;
  hy: Float32Array;
  ox: Float32Array;
  oy: Float32Array;
  vx: Float32Array;
  vy: Float32Array;
  glow: Float32Array;
  ripples: { x: number; y: number; r: number }[];
}

export function createField(width: number, height: number, top = 0): Field {
  const cols = Math.ceil(width / SPACING) + 1;
  const rows = Math.ceil((height - top) / SPACING) + 1;
  const count = cols * rows;
  // Centre the grid so the margins are even on both sides.
  const originX = (width - (cols - 1) * SPACING) / 2;
  const originY = top + SPACING / 2;
  const field: Field = {
    count,
    cols,
    rows,
    originX,
    originY,
    hx: new Float32Array(count),
    hy: new Float32Array(count),
    ox: new Float32Array(count),
    oy: new Float32Array(count),
    vx: new Float32Array(count),
    vy: new Float32Array(count),
    glow: new Float32Array(count),
    ripples: [],
  };
  for (let i = 0; i < count; i++) {
    field.hx[i] = originX + (i % cols) * SPACING;
    field.hy[i] = originY + Math.floor(i / cols) * SPACING;
  }
  return field;
}

/** Distance from a point to a rectangle (0 inside it). */
function distanceToRect(x: number, y: number, rect: Rect): number {
  const dx = Math.max(rect.left - x, 0, x - rect.right);
  const dy = Math.max(rect.top - y, 0, y - rect.bottom);
  return Math.hypot(dx, dy);
}

/**
 * Lights the dots just outside each nearby card's border, brightest where the
 * cursor is. Only the grid cells around a card are visited, not the whole grid.
 */
export function lightEdges(field: Field, rects: Rect[], pointer: { x: number; y: number }): void {
  const { hx, hy, glow, cols, rows, originX, originY } = field;
  const clamp = (value: number, max: number) => Math.max(0, Math.min(max, value));

  for (const rect of rects) {
    const reach = distanceToRect(pointer.x, pointer.y, rect);
    if (reach > EDGE_REACH) continue;
    const proximity = 1 - reach / EDGE_REACH;

    const c0 = clamp(Math.floor((rect.left - EDGE_BAND - originX) / SPACING), cols - 1);
    const c1 = clamp(Math.ceil((rect.right + EDGE_BAND - originX) / SPACING), cols - 1);
    const r0 = clamp(Math.floor((rect.top - EDGE_BAND - originY) / SPACING), rows - 1);
    const r1 = clamp(Math.ceil((rect.bottom + EDGE_BAND - originY) / SPACING), rows - 1);

    for (let row = r0; row <= r1; row++) {
      for (let col = c0; col <= c1; col++) {
        const i = row * cols + col;
        const outside = distanceToRect(hx[i], hy[i], rect);
        // Dots under the card are hidden by it anyway.
        if (outside === 0 || outside > EDGE_BAND) continue;
        const along = 1 - Math.hypot(hx[i] - pointer.x, hy[i] - pointer.y) / EDGE_SPREAD;
        if (along <= 0) continue;
        const strength = proximity * along * (1 - outside / EDGE_BAND) * 0.9;
        if (strength > glow[i]) glow[i] = strength;
      }
    }
  }
}

/**
 * Advances the simulation one frame. Returns false once everything is at rest.
 * Dots stay bent around a cursor that has stopped, but only movement lights
 * them up, so a resting cursor lets the loop go idle.
 */
export function step(field: Field, pointer: { x: number; y: number } | null, moved = true): boolean {
  const { hx, hy, ox, oy, vx, vy, glow, ripples } = field;
  let active = ripples.length > 0;

  for (const ripple of ripples) ripple.r += RIPPLE_SPEED;
  field.ripples = ripples.filter((ripple) => ripple.r < RIPPLE_MAX);

  for (let i = 0; i < field.count; i++) {
    const x = hx[i] + ox[i];
    const y = hy[i] + oy[i];

    if (pointer) {
      const dx = x - pointer.x;
      const dy = y - pointer.y;
      // Cheap bounding-box reject before the square root.
      if (Math.abs(dx) < RADIUS && Math.abs(dy) < RADIUS) {
        const distance = Math.hypot(dx, dy) || 1;
        if (distance < RADIUS) {
          const strength = 1 - distance / RADIUS;
          const force = strength * strength * PUSH;
          vx[i] += (dx / distance) * force;
          vy[i] += (dy / distance) * force;
          if (moved && strength > glow[i]) glow[i] = strength;
        }
      }
    }

    for (const ripple of ripples) {
      const dx = hx[i] - ripple.x;
      const dy = hy[i] - ripple.y;
      const distance = Math.hypot(dx, dy) || 1;
      const band = 1 - Math.abs(distance - ripple.r) / RIPPLE_WIDTH;
      if (band > 0) {
        // The wave weakens as it travels outwards.
        const strength = band * (1 - ripple.r / RIPPLE_MAX);
        vx[i] += (dx / distance) * strength * 2.2;
        vy[i] += (dy / distance) * strength * 2.2;
        if (strength > glow[i]) glow[i] = strength;
      }
    }

    vx[i] = (vx[i] - ox[i] * SPRING) * DAMPING;
    vy[i] = (vy[i] - oy[i] * SPRING) * DAMPING;
    ox[i] += vx[i];
    oy[i] += vy[i];
    glow[i] *= GLOW_DECAY;

    const displaced = Math.abs(ox[i]) > REST || Math.abs(oy[i]) > REST;
    if (glow[i] > REST || Math.abs(vx[i]) > REST || Math.abs(vy[i]) > REST) {
      active = true;
    } else if (!displaced) {
      ox[i] = oy[i] = vx[i] = vy[i] = glow[i] = 0;
    } else if (!pointer) {
      // Still springing home after the cursor left.
      active = true;
    }
  }
  return active;
}

// Resting dots are a dim grey; lit dots blend from the tag blue to amber.
function palette(): string[] {
  const from = [124, 196, 255];
  const to = [255, 178, 36];
  return Array.from({ length: LEVELS }, (_, level) => {
    if (level === 0) return 'rgb(143 150 160 / 0.13)';
    const t = level / (LEVELS - 1);
    const [r, g, b] = from.map((c, i) => Math.round(c + (to[i] - c) * t));
    return `rgb(${r} ${g} ${b} / ${(0.35 + 0.6 * t).toFixed(2)})`;
  });
}

export function startCursorField(edgeSelector = '.panel'): () => void {
  const canvas = document.createElement('canvas');
  canvas.className = 'cursor-field';
  canvas.setAttribute('aria-hidden', 'true');
  const context = canvas.getContext('2d', { alpha: true });
  if (!context) return () => {};

  const colors = palette();
  const cards = [...document.querySelectorAll(edgeSelector)];
  // Leave the sticky bar's strip empty so its backdrop blur never has to re-run.
  const top = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--bar-h')) || 0;
  let field: Field;
  let levels: Uint8Array;
  let pointer: { x: number; y: number } | null = null;
  let moved = false;
  let frame = 0;

  const resize = () => {
    const ratio = Math.min(devicePixelRatio || 1, 2);
    const { innerWidth: width, innerHeight: height } = window;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    field = createField(width, height, top);
    levels = new Uint8Array(field.count);
    draw();
  };

  const draw = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < field.count; i++) {
      levels[i] = Math.min(LEVELS - 1, Math.round(field.glow[i] * (LEVELS - 1)));
    }
    // Group dots by colour so fillStyle changes only LEVELS times per frame.
    for (let level = 0; level < LEVELS; level++) {
      context.fillStyle = colors[level];
      const size = 2 + (level / (LEVELS - 1)) * 3;
      const half = size / 2;
      for (let i = 0; i < field.count; i++) {
        if (levels[i] !== level) continue;
        context.fillRect(field.hx[i] + field.ox[i] - half, field.hy[i] + field.oy[i] - half, size, size);
      }
    }
  };

  const tick = () => {
    if (moved && pointer) {
      // A handful of rect reads, only on frames where the mouse moved.
      const viewport = innerHeight;
      const rects = cards
        .map((card) => card.getBoundingClientRect())
        .filter((rect) => rect.bottom > 0 && rect.top < viewport);
      lightEdges(field, rects, pointer);
    }
    const active = step(field, pointer, moved);
    moved = false;
    draw();
    frame = active ? requestAnimationFrame(tick) : 0;
  };

  const wake = () => {
    if (!frame) frame = requestAnimationFrame(tick);
  };

  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    pointer = { x: event.clientX, y: event.clientY };
    moved = true;
    wake();
  };

  const onDown = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    field.ripples.push({ x: event.clientX, y: event.clientY, r: 0 });
    wake();
  };

  const onLeave = () => {
    pointer = null;
    wake();
  };

  let resizeFrame = 0;
  const onResize = () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(resize);
  };

  resize();
  document.body.prepend(canvas);
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerdown', onDown, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeave);
  window.addEventListener('blur', onLeave);
  window.addEventListener('resize', onResize);

  return () => {
    cancelAnimationFrame(frame);
    cancelAnimationFrame(resizeFrame);
    frame = 0;
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerdown', onDown);
    document.documentElement.removeEventListener('pointerleave', onLeave);
    window.removeEventListener('blur', onLeave);
    window.removeEventListener('resize', onResize);
    canvas.remove();
  };
}

/** Starts the field on the first real mouse move while cursor effects are enabled. */
export function initCursorField(): void {
  whileEffectsEnabled(() => {
    let stop: (() => void) | null = null;
    const first = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      window.removeEventListener('pointermove', first);
      stop = startCursorField();
    };
    window.addEventListener('pointermove', first, { passive: true });
    return () => {
      window.removeEventListener('pointermove', first);
      stop?.();
    };
  });
}
