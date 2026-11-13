/**
 * Magnetic buttons: a hovered `.btn` leans a few pixels towards the cursor and
 * springs back on leave. Uses the CSS `translate` property so it composes with
 * the existing hover/press `transform`, and is updated at most once per frame.
 */

import { whileEffectsEnabled } from './effects';

const PULL = 0.25; // fraction of the cursor's distance from the button centre
const MAX_SHIFT = 6; // px

/** Offset for a cursor at (x, y) over a button whose resting box is `rect`. */
export function magneticOffset(x: number, y: number, rect: { left: number; top: number; width: number; height: number }) {
  const clamp = (value: number) => Math.max(-MAX_SHIFT, Math.min(MAX_SHIFT, value));
  return {
    x: clamp((x - (rect.left + rect.width / 2)) * PULL),
    y: clamp((y - (rect.top + rect.height / 2)) * PULL),
  };
}

export function startMagnetic(selector = '.btn'): () => void {
  let active: HTMLElement | null = null;
  let offset = { x: 0, y: 0 };
  let pointer = { x: 0, y: 0 };
  let frame = 0;

  const release = () => {
    if (active) active.style.removeProperty('translate');
    active = null;
    offset = { x: 0, y: 0 };
  };

  const update = () => {
    frame = 0;
    if (!active) return;
    const rect = active.getBoundingClientRect();
    // Measure from the button's resting position, not where it has already moved to.
    offset = magneticOffset(pointer.x, pointer.y, {
      left: rect.left - offset.x,
      top: rect.top - offset.y,
      width: rect.width,
      height: rect.height,
    });
    active.style.translate = `${offset.x.toFixed(1)}px ${offset.y.toFixed(1)}px`;
  };

  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    const button = (event.target as Element).closest?.<HTMLElement>(selector) ?? null;
    if (button !== active) release();
    if (!button) return;
    active = button;
    pointer = { x: event.clientX, y: event.clientY };
    if (!frame) frame = requestAnimationFrame(update);
  };

  document.addEventListener('pointermove', onMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', release);
  window.addEventListener('blur', release);

  return () => {
    cancelAnimationFrame(frame);
    frame = 0;
    release();
    document.removeEventListener('pointermove', onMove);
    document.documentElement.removeEventListener('pointerleave', release);
    window.removeEventListener('blur', release);
  };
}

export function initMagnetic(): void {
  whileEffectsEnabled(() => startMagnetic());
}
