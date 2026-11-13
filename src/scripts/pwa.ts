// Progressive web app helpers: service worker registration, the visitor-driven
// update flow and the install prompt. Kept DOM-light so they can be unit tested.

type Container = Pick<ServiceWorkerContainer, 'register' | 'controller'>;

export interface RegisterOptions {
  url: string;
  /** Called with a worker that is installed and waiting to take over. */
  onUpdate: (worker: ServiceWorker) => void;
  container?: Container;
}

export async function registerServiceWorker({ url, onUpdate, container = navigator.serviceWorker }: RegisterOptions) {
  const registration = await container.register(url);

  // A worker can already be waiting from a previous visit.
  if (registration.waiting) onUpdate(registration.waiting);

  const track = (worker: ServiceWorker | null) => {
    worker?.addEventListener('statechange', () => {
      // Without a controller this is the first install, not an update.
      if (worker.state === 'installed' && container.controller) onUpdate(worker);
    });
  };
  registration.addEventListener('updatefound', () => track(registration.installing));
  // updatefound may already have fired before register() resolved.
  track(registration.installing);
  return registration;
}

export type UpdateOutcome = 'reloading' | 'redundant';

/** Ask a waiting worker to activate; resolves once the page should reload or the worker was discarded. */
export function activateUpdate(worker: ServiceWorker): Promise<UpdateOutcome> {
  // Another open tab may already have activated (or replaced) this worker.
  if (worker.state === 'activated') return Promise.resolve('reloading');
  if (worker.state === 'redundant') return Promise.resolve('redundant');

  return new Promise((resolve) => {
    const onStateChange = () => {
      if (worker.state !== 'activated' && worker.state !== 'redundant') return;
      worker.removeEventListener('statechange', onStateChange);
      resolve(worker.state === 'activated' ? 'reloading' : 'redundant');
    };
    worker.addEventListener('statechange', onStateChange);
    worker.postMessage({ type: 'SKIP_WAITING' });
  });
}

/** Wire the "Update available" toast to a waiting worker. */
export function showUpdateToast(toast: HTMLElement, worker: ServiceWorker, reload: () => void = () => location.reload()) {
  const accept = toast.querySelector<HTMLButtonElement>('[data-update-accept]');
  const dismiss = toast.querySelector<HTMLButtonElement>('[data-update-dismiss]');
  if (!accept || !dismiss) return;

  toast.hidden = false;
  accept.disabled = dismiss.disabled = false;
  accept.textContent = 'Update now';

  accept.onclick = async () => {
    accept.disabled = dismiss.disabled = true;
    accept.textContent = 'Updating…';
    const outcome = await activateUpdate(worker);
    if (outcome === 'reloading') reload();
    else toast.hidden = true;
  };
  dismiss.onclick = () => {
    toast.hidden = true;
  };
}

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<unknown>;
}

/** Show `button` only while the browser offers installation. */
export function initInstallPrompt(button: HTMLButtonElement, target: Window = window) {
  let deferred: InstallPromptEvent | null = null;

  target.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferred = event as InstallPromptEvent;
    button.hidden = false;
  });
  target.addEventListener('appinstalled', () => {
    deferred = null;
    button.hidden = true;
  });
  button.addEventListener('click', async () => {
    const prompt = deferred;
    if (!prompt) return;
    // An install prompt can only be used once.
    deferred = null;
    button.hidden = true;
    try {
      await prompt.prompt();
      await prompt.userChoice;
    } catch (error) {
      console.warn('Installation is unavailable in this browser.', error);
    }
  });
}
