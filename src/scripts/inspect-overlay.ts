/**
 * DevTools-style "inspect element" hover: a highlight box and a
 * `tag.class  W × H` label over the card, button or heading under the cursor.
 *
 * One overlay element is reused for everything. It is created on the first
 * hover and only repositioned when the hovered element changes (pointerover),
 * not on every mouse move.
 */

import { whileEffectsEnabled } from './effects';

export const INSPECT_TARGETS = '.panel, .btn, .chip, .section-title, .photo';
const LABEL_HEIGHT = 26;

/** `article.job.panel` style name, as DevTools prints it (max two classes). */
export function describe(element: Element): string {
  const classes = [...element.classList].filter((name) => !name.startsWith('astro-')).slice(0, 2);
  return [element.tagName.toLowerCase(), ...classes].join('.');
}

export function startInspectOverlay(): () => void {
  let overlay: HTMLElement | null = null;
  let name: HTMLElement;
  let size: HTMLElement;
  let current: Element | null = null;

  const build = () => {
    overlay = document.createElement('div');
    overlay.className = 'inspect-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    const label = document.createElement('span');
    label.className = 'inspect-label';
    name = document.createElement('span');
    size = document.createElement('span');
    size.className = 'inspect-size';
    label.append(name, size);
    overlay.append(label);
    document.body.append(overlay);
  };

  const hide = () => {
    current = null;
    if (overlay) overlay.hidden = true;
  };

  const show = (element: Element) => {
    if (!overlay) build();
    const box = overlay!;
    current = element;
    const rect = element.getBoundingClientRect();
    const barHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--bar-h')) || 0;
    name.textContent = describe(element);
    size.textContent = `${Math.round(rect.width)} × ${Math.round(rect.height)}`;
    box.style.transform = `translate(${rect.left}px, ${rect.top}px)`;
    box.style.width = `${rect.width}px`;
    box.style.height = `${rect.height}px`;
    // Flip the label below the box when there's no room above it.
    box.classList.toggle('is-below', rect.top - LABEL_HEIGHT < barHeight);
    box.hidden = false;
  };

  const onOver = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    const target = (event.target as Element).closest?.(INSPECT_TARGETS) ?? null;
    if (target === current) return;
    if (target) show(target);
    else hide();
  };

  // The box would drift away from its element while scrolling, so hide it until the next hover.
  const onScroll = () => {
    if (current) hide();
  };

  document.addEventListener('pointerover', onOver, { passive: true });
  document.documentElement.addEventListener('pointerleave', hide);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('blur', hide);

  return () => {
    document.removeEventListener('pointerover', onOver);
    document.documentElement.removeEventListener('pointerleave', hide);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('blur', hide);
    overlay?.remove();
    overlay = null;
    current = null;
  };
}

export function initInspectOverlay(): void {
  whileEffectsEnabled(startInspectOverlay);
}
