const normalize = (value: string) => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

const isEditable = (target: EventTarget | null) =>
  target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));

/** A local, progressively enhanced portfolio finder. Native dialog owns focus containment. */
export function initQuickOpen(dialog: HTMLDialogElement, trigger: HTMLButtonElement): () => void {
  const input = dialog.querySelector<HTMLInputElement>('[data-quick-search]');
  const status = dialog.querySelector<HTMLElement>('[data-quick-status]');
  const empty = dialog.querySelector<HTMLElement>('[data-quick-empty]');
  if (!input || !status || !empty || typeof dialog.showModal !== 'function') return () => {};

  const entries = [...dialog.querySelectorAll<HTMLElement>('[data-quick-item]')].map((item) => ({
    item,
    link: item.querySelector<HTMLAnchorElement>('a')!,
    search: '',
  }));
  const platform = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform || navigator.platform;
  const isApple = /mac|iphone|ipad|ipod/i.test(platform);
  const controller = new AbortController();
  const { signal } = controller;
  let visible = entries;
  let selected = 0;
  let opener: HTMLElement | null = null;
  let navigating = false;

  const select = (index: number, scroll = false) => {
    selected = index;
    for (const entry of entries) entry.link.setAttribute('aria-selected', String(entry === visible[index]));
    const active = visible[index]?.link;
    if (active) {
      input.setAttribute('aria-activedescendant', active.id);
      if (scroll) active.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    } else input.removeAttribute('aria-activedescendant');
  };

  const filter = () => {
    const terms = normalize(input.value).trim().split(/\s+/).filter(Boolean);
    visible = entries.filter((entry) => {
      entry.item.hidden = !terms.every((term) => entry.search.includes(term));
      return !entry.item.hidden;
    });
    empty.hidden = visible.length > 0;
    status.textContent = visible.length ? `${visible.length} result${visible.length === 1 ? '' : 's'}` : 'No matches';
    select(0);
    const scroller = dialog.querySelector('[data-quick-scroll]');
    if (scroller) scroller.scrollTop = 0;
  };

  // Indexed on first open from the section each result links to, so the HTML never ships that text twice.
  let indexed = false;
  const index = () => {
    if (indexed) return;
    indexed = true;
    for (const entry of entries) {
      const { hash, pathname } = entry.link;
      const target = hash && pathname === location.pathname ? document.getElementById(hash.slice(1)) : null;
      entry.search = normalize(`${entry.item.textContent} ${entry.item.dataset.search ?? ''} ${target?.textContent ?? ''}`);
    }
  };

  // A non-modal <dialog open> leaves the page interactive, so only a real modal blocks Quick Open.
  const otherModalOpen = () =>
    [...document.querySelectorAll('dialog[open]')].some((other) => other !== dialog && other.matches(':modal'));

  /** Returns false when Quick Open could not be shown. */
  const open = () => {
    if (dialog.open || otherModalOpen()) return false;
    index();
    opener = document.activeElement instanceof HTMLElement ? document.activeElement : trigger;
    navigating = false;
    input.value = '';
    filter();
    dialog.showModal();
    input.setAttribute('aria-expanded', 'true');
    input.focus();
    return true;
  };

  const shortcut = trigger.querySelector('[data-quick-shortcut]');
  if (shortcut) shortcut.textContent = isApple ? '⌘ K' : 'Ctrl K';
  trigger.hidden = false;
  trigger.addEventListener('click', () => { open(); }, { signal });
  window.addEventListener('keydown', (event) => {
    if (event.isComposing || event.repeat || event.altKey || event.shiftKey) return;
    if (!event.metaKey && !event.ctrlKey) return;
    // `key` follows the layout (Dvorak's K), but non-Latin layouts report another letter there: use the physical key.
    if (event.key.toLowerCase() !== 'k' && (event.code !== 'KeyK' || /^[a-z]$/i.test(event.key))) return;
    // Ctrl+K deletes to the end of the line in macOS text fields; ⌘K still opens from them.
    if (isApple && !event.metaKey && isEditable(event.target) && !dialog.contains(event.target as Node)) return;
    if (dialog.open) dialog.close();
    else if (!open()) return; // Another modal owns the keyboard.
    event.preventDefault();
  }, { signal });

  input.addEventListener('input', filter, { signal });
  input.addEventListener('keydown', (event) => {
    if (event.isComposing) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      dialog.close();
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (visible.length) select((selected + (event.key === 'ArrowDown' ? 1 : -1) + visible.length) % visible.length, true);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      visible[selected]?.link.click();
    }
  }, { signal });

  // pointermove, not pointerover: rows scrolling under a resting cursor must not steal the keyboard selection.
  dialog.addEventListener('pointermove', (event) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest('a[role="option"]');
    const index = visible.findIndex((entry) => entry.link === link);
    if (index !== -1) select(index);
  }, { signal });

  dialog.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    if (event.target.closest('[data-quick-close]')) {
      dialog.close();
      return;
    }
    const link = event.target.closest<HTMLAnchorElement>('a[role="option"]');
    if (link) {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      navigating = true;
      dialog.close();
      if (link.hash && link.pathname === location.pathname) {
        event.preventDefault();
        const focusTarget = (scroll = false) => requestAnimationFrame(() => {
          const target = document.getElementById(link.hash.slice(1));
          if (!target) {
            opener?.focus({ preventScroll: true });
            return;
          }
          // An unchanged hash gets no native fragment scroll, so scroll explicitly.
          if (scroll) target.scrollIntoView({ block: 'start', behavior: 'instant' });
          if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        });
        // The timeline must reveal its panel before focus can enter it. Only a URL that
        // actually changed fires hashchange, so compare it rather than the raw hashes.
        const before = location.href;
        location.hash = link.hash;
        if (location.href === before) {
          window.dispatchEvent(new HashChangeEvent('hashchange'));
          focusTarget(true);
        } else {
          window.addEventListener('hashchange', () => focusTarget(), { once: true, signal });
        }
      }
      return;
    }
    if (event.target === dialog) {
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    }
  }, { signal });

  dialog.addEventListener('close', () => {
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    if (!navigating) opener?.focus({ preventScroll: true });
  }, { signal });

  return () => {
    // Close first so the close handler still resets ARIA state and returns focus.
    if (dialog.open) dialog.close();
    controller.abort();
    trigger.hidden = true;
  };
}
