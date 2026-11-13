/**
 * Single switch for every cursor effect (background grid, inspect hover,
 * magnetic buttons, hero tilt). Effects run only when the device has a real
 * mouse, the visitor hasn't asked for reduced motion, and they haven't turned
 * effects off with the top-bar toggle. Nothing runs at all otherwise.
 */

export const EFFECTS_QUERY = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';
export const EFFECTS_KEY = 'cursor-effects';
const OFF_CLASS = 'effects-off';
const CHANGE = 'effects-change';

/** The visitor's own choice, applied to <html> before first paint by Base.astro. */
export function effectsOptedOut(): boolean {
  return document.documentElement.classList.contains(OFF_CLASS);
}

export function setEffectsOptedOut(off: boolean): void {
  document.documentElement.classList.toggle(OFF_CLASS, off);
  try {
    if (off) localStorage.setItem(EFFECTS_KEY, 'off');
    else localStorage.removeItem(EFFECTS_KEY);
  } catch {
    // Storage can be blocked; the choice still applies for this visit.
  }
  window.dispatchEvent(new Event(CHANGE));
}

/**
 * Runs `start` while effects are allowed and calls the cleanup it returns as
 * soon as they aren't (toggle, OS setting, or a mouse being unplugged).
 */
export function whileEffectsEnabled(start: () => () => void): void {
  const query = matchMedia(EFFECTS_QUERY);
  let stop: (() => void) | null = null;

  const sync = () => {
    const enabled = query.matches && !effectsOptedOut();
    if (enabled && !stop) stop = start();
    else if (!enabled && stop) {
      stop();
      stop = null;
    }
  };

  query.addEventListener('change', sync);
  window.addEventListener(CHANGE, sync);
  sync();
}

/** Wires the top-bar switch (TopBar.astro); the choice persists across visits. */
export function initEffectsToggle(toggle = document.querySelector<HTMLButtonElement>('[data-effects-toggle]')): void {
  if (!toggle) return;
  const render = () => {
    const on = !effectsOptedOut();
    toggle.setAttribute('aria-pressed', String(on));
    toggle.title = `Turn cursor effects ${on ? 'off' : 'on'}`;
  };
  toggle.addEventListener('click', () => {
    setEffectsOptedOut(!effectsOptedOut());
    render();
  });
  render();
}
