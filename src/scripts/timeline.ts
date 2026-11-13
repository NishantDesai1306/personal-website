/**
 * Upgrades the server-rendered career list into a tab interface.
 * Without JavaScript every job stays visible, so crawlers and no-JS visitors
 * get the full history.
 */
export function enhanceTimeline(root: HTMLElement): void {
  const tabs = [...root.querySelectorAll<HTMLAnchorElement>('[data-job-tab]')];
  const panels = [...root.querySelectorAll<HTMLElement>('[data-job-panel]')];
  if (!tabs.length) return;

  const list = tabs[0].parentElement;
  const scroller = root.querySelector<HTMLElement>('[data-trace-scroll]');
  list?.setAttribute('role', 'tablist');
  list?.setAttribute('aria-label', 'Career timeline');

  const select = (index: number, focus = false) => {
    tabs.forEach((tab, i) => {
      const selected = i === index;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[i].hidden = !selected;
    });
    // On narrow screens the trace scrolls sideways; keep the selection visible
    // without moving the page vertically.
    if (scroller) scroller.scrollLeft = Math.max(0, tabs[index].offsetLeft - 24);
    if (focus) tabs[index].focus({ preventScroll: true });
  };

  tabs.forEach((tab, i) => {
    const panel = panels[i];
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panel.id);
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.tabIndex = 0;

    tab.addEventListener('click', (event) => {
      event.preventDefault();
      select(i);
    });
    tab.addEventListener('keydown', (event) => {
      const last = tabs.length - 1;
      const next = {
        ArrowRight: i === last ? 0 : i + 1,
        ArrowLeft: i === 0 ? last : i - 1,
        Home: 0,
        End: last,
      }[event.key];
      if (next === undefined) return;
      event.preventDefault();
      select(next, true);
    });
  });

  const initial = tabs.findIndex((tab) => tab.dataset.current === 'true');
  select(initial === -1 ? 0 : initial);
  root.classList.add('is-enhanced');
}
