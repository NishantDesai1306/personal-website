/**
 * Hero "Styles" card tilts a few degrees towards the cursor (the CSS lives in
 * Hero.astro and reads --pointer-x / --pointer-y). Updated at most once per frame.
 */

import { whileEffectsEnabled } from './effects';

const MAX_TILT = 3; // degrees

export function initHeroTilt(card: HTMLElement | null = document.querySelector('[data-pointer-card]')): void {
  if (!card) return;
  let frame = 0;
  let x = 0;
  let y = 0;

  const reset = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    card.style.removeProperty('--pointer-x');
    card.style.removeProperty('--pointer-y');
  };

  const move = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    x = event.clientX;
    y = event.clientY;
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const rect = card.getBoundingClientRect();
      const position = (value: number, start: number, size: number) =>
        Math.max(-1, Math.min(1, ((value - start) / size - 0.5) * 2));
      card.style.setProperty('--pointer-x', `${-position(y, rect.top, rect.height) * MAX_TILT}deg`);
      card.style.setProperty('--pointer-y', `${position(x, rect.left, rect.width) * MAX_TILT}deg`);
    });
  };

  // No listeners (and no animation work) unless cursor effects are enabled.
  whileEffectsEnabled(() => {
    card.addEventListener('pointermove', move, { passive: true });
    card.addEventListener('pointerleave', reset);
    card.addEventListener('pointercancel', reset);
    window.addEventListener('blur', reset);
    return () => {
      reset();
      card.removeEventListener('pointermove', move);
      card.removeEventListener('pointerleave', reset);
      card.removeEventListener('pointercancel', reset);
      window.removeEventListener('blur', reset);
    };
  });
}
