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
    if (scroller) {
      const tab = tabs[index].getBoundingClientRect();
      const bounds = scroller.getBoundingClientRect();
      if (tab.left < bounds.left + 8) scroller.scrollLeft += tab.left - bounds.left - 8;
      else if (tab.right > bounds.right - 8) scroller.scrollLeft += tab.right - bounds.right + 8;
    }
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
        ' ': i,
      }[event.key];
      if (next === undefined) return;
      event.preventDefault();
      select(next, true);
    });
  });

  const linkedIndex = () => tabs.findIndex((tab) =>
    location.hash === tab.hash || location.hash === `#${tab.id}`,
  );
  const revealLinked = () => {
    if (!root.isConnected) return;
    const index = linkedIndex();
    if (index === -1) return;
    select(index);
    // Collapsing earlier jobs changes the fragment's position after native scrolling.
    requestAnimationFrame(() => {
      const target = location.hash === `#${tabs[index].id}` ? tabs[index] : panels[index];
      target.scrollIntoView({ block: 'start', behavior: 'instant' });
    });
  };
  const initial = linkedIndex();
  const current = tabs.findIndex((tab) => tab.dataset.current === 'true');
  select(initial !== -1 ? initial : current === -1 ? 0 : current);
  root.classList.add('is-enhanced');
  if (initial !== -1) revealLinked();
  window.addEventListener('hashchange', revealLinked);
}
