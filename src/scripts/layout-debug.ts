/**
 * Easter egg: the Konami code, or typing "inspect" anywhere on the page (or in
 * the console section), toggles a layout-debug overlay that outlines every
 * element, coloured by depth, over an 8px baseline grid. Esc turns it off.
 *
 * This isn't motion, so it works on any device with a keyboard. The CSS lives
 * in global.css under `.layout-debug`; the only JS is a tiny key buffer.
 */

const CLASS = 'layout-debug';
export const TOGGLE_EVENT = 'layout-debug:toggle'; // dispatched by the console's `inspect` command
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
const WORD = [...'inspect'];
const MEMORY = Math.max(KONAMI.length, WORD.length);

let badge: HTMLElement | null = null;

export function layoutDebugOn(): boolean {
  return document.documentElement.classList.contains(CLASS);
}

export function toggleLayoutDebug(on = !layoutDebugOn()): void {
  document.documentElement.classList.toggle(CLASS, on);
  if (!badge?.isConnected) {
    badge = document.createElement('div');
    badge.className = 'layout-debug-badge mono';
    badge.setAttribute('role', 'status');
    document.body.append(badge);
  }
  badge.textContent = on ? 'Layout overlay on · press Esc or type "inspect" to exit' : '';
  badge.hidden = !on;
}

/** True when the most recent keys finish `sequence`. */
export function endsWith(keys: string[], sequence: string[]): boolean {
  if (keys.length < sequence.length) return false;
  const tail = keys.slice(-sequence.length);
  return sequence.every((key, i) => key === tail[i]);
}

function isTyping(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
}

export function initLayoutDebug(): void {
  const keys: string[] = [];
  document.addEventListener(TOGGLE_EVENT, () => toggleLayoutDebug());

  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey || event.key === 'Shift' || isTyping(event.target)) return;
    if (event.key === 'Escape' && layoutDebugOn()) {
      toggleLayoutDebug(false);
      return;
    }
    keys.push(event.key.length === 1 ? event.key.toLowerCase() : event.key);
    if (keys.length > MEMORY) keys.shift();
    if (endsWith(keys, KONAMI) || endsWith(keys, WORD)) {
      keys.length = 0;
      toggleLayoutDebug();
    }
  });
}
