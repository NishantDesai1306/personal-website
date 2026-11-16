// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initQuickOpen } from '../src/scripts/quick-open';

let cleanup = () => {};

function render() {
  document.body.innerHTML = `
    <button data-trigger hidden>Search <kbd data-quick-shortcut></kbd></button>
    <dialog>
      <button data-quick-close>Close</button>
      <input data-quick-search aria-expanded="false" />
      <div data-quick-scroll><ul>
        <li data-quick-item data-search="React frontend"><a id="result-case" role="option" href="#case-test">Migration</a></li>
        <li data-quick-item data-search="FoodX React orders"><a id="result-job" role="option" href="#job-foodx">FoodX</a></li>
        <li data-quick-item data-search="Open résumé cv"><a id="result-resume" role="option" href="/resume.pdf">Résumé</a></li>
      </ul></div>
      <p data-quick-empty hidden></p>
      <p data-quick-status></p>
    </dialog>
    <article id="case-test">Replaced a legacy AngularJS build</article>
    <input id="elsewhere" />
    <article id="job-foodx" hidden></article>`;
  const dialog = document.querySelector('dialog')!;
  const trigger = document.querySelector<HTMLButtonElement>('[data-trigger]')!;
  // jsdom has no modal implementation; real-browser acceptance exercises native trapping/Esc.
  dialog.showModal = () => { dialog.open = true; };
  dialog.close = () => {
    dialog.open = false;
    dialog.dispatchEvent(new Event('close'));
  };
  dialog.querySelectorAll('a').forEach((link) => { link.scrollIntoView = vi.fn(); });
  document.querySelectorAll('article').forEach((article) => { article.scrollIntoView = vi.fn(); });
  cleanup = initQuickOpen(dialog, trigger);
  const input = dialog.querySelector('input')!;
  const search = (query: string) => {
    input.value = query;
    input.dispatchEvent(new Event('input'));
  };
  const press = (key: string) => input.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
  const visible = () => [...dialog.querySelectorAll<HTMLElement>('[data-quick-item]')].filter((item) => !item.hidden);
  return { dialog, trigger, input, search, press, visible };
}

beforeEach(() => {
  window.history.replaceState(null, '', '/');
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => { callback(0); return 1; });
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.body.replaceChildren();
});

describe('Quick Open', () => {
  it('opens from its button, focuses search and restores the opener when dismissed', () => {
    const { trigger, dialog, input } = render();
    trigger.focus();
    trigger.click();
    expect(dialog.open).toBe(true);
    expect(document.activeElement).toBe(input);
    expect(input.getAttribute('aria-expanded')).toBe('true');
    dialog.querySelector<HTMLButtonElement>('[data-quick-close]')!.click();
    expect(dialog.open).toBe(false);
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger);
  });

  it('supports both keyboard shortcuts without intercepting composition or unrelated keys', () => {
    const { dialog } = render();
    for (const modifier of ['metaKey', 'ctrlKey']) {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', [modifier]: true, bubbles: true }));
      expect(dialog.open).toBe(true);
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', [modifier]: true, bubbles: true }));
      expect(dialog.open).toBe(false);
    }
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, isComposing: true }));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k' }));
    expect(dialog.open).toBe(false);
  });

  it('opens from the physical K key on non-Latin layouts but respects remapped Latin ones', () => {
    const { dialog } = render();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 't', code: 'KeyK', ctrlKey: true }));
    expect(dialog.open).toBe(false);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'л', code: 'KeyK', ctrlKey: true }));
    expect(dialog.open).toBe(true);
  });

  it('leaves Ctrl+K to macOS text fields while ⌘K still opens from them', () => {
    vi.spyOn(navigator, 'platform', 'get').mockReturnValue('MacIntel');
    const { dialog, trigger } = render();
    expect(trigger.querySelector('[data-quick-shortcut]')!.textContent).toBe('⌘ K');
    const field = document.querySelector<HTMLInputElement>('#elsewhere')!;
    const press = (init: KeyboardEventInit) => {
      const event = new KeyboardEvent('keydown', { key: 'k', bubbles: true, cancelable: true, ...init });
      field.dispatchEvent(event);
      return event;
    };
    expect(press({ ctrlKey: true }).defaultPrevented).toBe(false);
    expect(dialog.open).toBe(false);
    expect(press({ metaKey: true }).defaultPrevented).toBe(true);
    expect(dialog.open).toBe(true);
  });

  it('labels the shortcut for non-Apple platforms', () => {
    vi.spyOn(navigator, 'platform', 'get').mockReturnValue('Win32');
    const { trigger } = render();
    expect(trigger.querySelector('[data-quick-shortcut]')!.textContent).toBe('Ctrl K');
  });

  it('searches the text of the section a result links to', () => {
    const { trigger, search, visible } = render();
    trigger.click();
    search('angularjs legacy');
    expect(visible().map((item) => item.textContent)).toEqual(['Migration']);
  });

  it('selects on pointer movement only, so rows scrolling under a resting cursor keep the keyboard selection', () => {
    const { trigger, dialog, input } = render();
    trigger.click();
    const job = dialog.querySelector('#result-job')!;
    job.dispatchEvent(new MouseEvent('pointerover', { bubbles: true }));
    expect(input.getAttribute('aria-activedescendant')).toBe('result-case');
    job.dispatchEvent(new MouseEvent('pointermove', { bubbles: true }));
    expect(input.getAttribute('aria-activedescendant')).toBe('result-job');
  });

  it('matches all query words case-insensitively and accepts unaccented resume searches', () => {
    const { trigger, search, visible, input } = render();
    trigger.click();
    search('  REACT   migration  ');
    expect(visible().map((item) => item.textContent)).toEqual(['Migration']);
    expect(input.getAttribute('aria-activedescendant')).toBe('result-case');
    search('resume');
    expect(visible().map((item) => item.textContent)).toEqual(['Résumé']);
  });

  it('wraps arrow navigation across visible results while keeping focus in search', () => {
    const { trigger, search, press, input } = render();
    trigger.click();
    search('React');
    press('ArrowUp');
    expect(input.getAttribute('aria-activedescendant')).toBe('result-job');
    press('ArrowDown');
    expect(input.getAttribute('aria-activedescendant')).toBe('result-case');
    expect(document.activeElement).toBe(input);
  });

  it('announces no results and keeps Enter safe, then resets the query when reopened', () => {
    const { trigger, dialog, search, press, input, visible } = render();
    trigger.click();
    search('missing technology');
    expect(visible()).toHaveLength(0);
    expect(dialog.querySelector('[data-quick-status]')!.textContent).toBe('No matches');
    expect(input.hasAttribute('aria-activedescendant')).toBe(false);
    press('Enter');
    expect(dialog.open).toBe(true);
    dialog.close();
    trigger.click();
    expect(input.value).toBe('');
    expect(visible()).toHaveLength(3);
  });

  it('closes with Escape even when the search field contains a query', () => {
    const { trigger, dialog, search, press } = render();
    trigger.click();
    search('React');
    press('Escape');
    expect(dialog.open).toBe(false);
  });

  it('waits for fragment navigation to reveal a hidden job before focusing it', async () => {
    const { trigger, search, press } = render();
    const panel = document.getElementById('job-foodx')!;
    const focusedWhileVisible: boolean[] = [];
    vi.spyOn(panel, 'focus').mockImplementation(() => { focusedWhileVisible.push(!panel.hidden); });
    window.addEventListener('hashchange', () => { panel.hidden = false; }, { once: true });
    trigger.click();
    search('FoodX');
    press('Enter');
    await vi.waitFor(() => expect(panel.hidden).toBe(false));
    expect(focusedWhileVisible).toEqual([true]);
  });

  it('reselects a hidden job when the URL already contains its fragment', () => {
    window.history.replaceState(null, '', '#job-foodx');
    const { trigger, search, press } = render();
    const panel = document.getElementById('job-foodx')!;
    window.addEventListener('hashchange', () => { panel.hidden = false; }, { once: true });
    trigger.click();
    search('FoodX');
    press('Enter');
    expect(panel.hidden).toBe(false);
    expect(document.activeElement).toBe(panel);
  });

  it('scrolls back to a non-timeline result whose fragment is already active', () => {
    window.history.replaceState(null, '', '#case-test');
    const { trigger, search, press } = render();
    const target = document.getElementById('case-test')!;
    target.scrollIntoView = vi.fn();
    trigger.click();
    search('migration');
    press('Enter');
    expect(target.scrollIntoView).toHaveBeenCalledWith({ block: 'start', behavior: 'instant' });
    expect(document.activeElement).toBe(target);
  });

  it('returns focus to the opener when a result points at a missing section', async () => {
    const { trigger, search, press } = render();
    document.getElementById('job-foodx')!.remove();
    trigger.focus();
    trigger.click();
    search('FoodX');
    press('Enter');
    await vi.waitFor(() => expect(location.hash).toBe('#job-foodx'));
    await vi.waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it('does not open on top of another modal, but ignores non-modal dialogs', () => {
    const { trigger, dialog } = render();
    const other = document.createElement('dialog');
    other.open = true;
    document.body.append(other);
    // jsdom never matches :modal, so stand in for a dialog opened with showModal().
    const isModal = vi.spyOn(other, 'matches').mockReturnValue(true);
    trigger.click();
    const shortcut = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, cancelable: true });
    window.dispatchEvent(shortcut);
    expect(dialog.open).toBe(false);
    expect(shortcut.defaultPrevented).toBe(false);
    isModal.mockReturnValue(false);
    trigger.click();
    expect(dialog.open).toBe(true);
  });

  it('resets state when cleaned up while open, then stops listening', () => {
    const { trigger, dialog, input } = render();
    trigger.focus();
    trigger.click();
    cleanup();
    expect(dialog.open).toBe(false);
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(input.hasAttribute('aria-activedescendant')).toBe(false);
    expect(document.activeElement).toBe(trigger);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
    expect(dialog.open).toBe(false);
    expect(trigger.hidden).toBe(true);
  });
});
