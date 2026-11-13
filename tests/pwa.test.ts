// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { activateUpdate, initInstallPrompt, registerServiceWorker, showUpdateToast } from '../src/scripts/pwa';

/** Minimal ServiceWorker stand-in whose state can be advanced by tests. */
class FakeWorker extends EventTarget {
  state: ServiceWorkerState;
  postMessage = vi.fn();
  constructor(state: ServiceWorkerState = 'installed') {
    super();
    this.state = state;
  }
  setState(state: ServiceWorkerState) {
    this.state = state;
    this.dispatchEvent(new Event('statechange'));
  }
}

class FakeRegistration extends EventTarget {
  waiting: FakeWorker | null = null;
  installing: FakeWorker | null = null;
}

const asWorker = (w: FakeWorker) => w as unknown as ServiceWorker;

function container(registration: FakeRegistration, controller: object | null) {
  return {
    register: vi.fn().mockResolvedValue(registration),
    controller,
  } as unknown as ServiceWorkerContainer;
}

describe('registerServiceWorker', () => {
  it('offers a worker that is already waiting from a previous visit', async () => {
    const registration = new FakeRegistration();
    registration.waiting = new FakeWorker();
    const onUpdate = vi.fn();
    await registerServiceWorker({ url: '/service-worker.js', onUpdate, container: container(registration, {}) });
    expect(onUpdate).toHaveBeenCalledWith(registration.waiting);
  });

  it('offers a newly installed worker when a page is already controlled', async () => {
    const registration = new FakeRegistration();
    const onUpdate = vi.fn();
    await registerServiceWorker({ url: '/service-worker.js', onUpdate, container: container(registration, {}) });

    const worker = new FakeWorker('installing');
    registration.installing = worker;
    registration.dispatchEvent(new Event('updatefound'));
    worker.setState('installed');
    expect(onUpdate).toHaveBeenCalledWith(worker);
  });

  it('does not offer an update on the very first install', async () => {
    const registration = new FakeRegistration();
    const worker = new FakeWorker('installing');
    registration.installing = worker;
    const onUpdate = vi.fn();
    await registerServiceWorker({ url: '/service-worker.js', onUpdate, container: container(registration, null) });
    worker.setState('installed');
    expect(onUpdate).not.toHaveBeenCalled();
  });
});

describe('activateUpdate', () => {
  it('asks the waiting worker to skip waiting and resolves once it activates', async () => {
    const worker = new FakeWorker();
    const outcome = activateUpdate(asWorker(worker));
    expect(worker.postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' });
    worker.setState('activating');
    worker.setState('activated');
    await expect(outcome).resolves.toBe('reloading');
  });

  it('reports a worker that was replaced before activating', async () => {
    const worker = new FakeWorker();
    const outcome = activateUpdate(asWorker(worker));
    worker.setState('redundant');
    await expect(outcome).resolves.toBe('redundant');
  });

  it('reloads immediately when another tab already activated the update', async () => {
    const worker = new FakeWorker('activated');
    await expect(activateUpdate(asWorker(worker))).resolves.toBe('reloading');
    expect(worker.postMessage).not.toHaveBeenCalled();
  });
});

describe('showUpdateToast', () => {
  const render = () => {
    document.body.innerHTML = `
      <div data-update-toast hidden>
        <button data-update-accept></button><button data-update-dismiss></button>
      </div>`;
    const toast = document.querySelector<HTMLElement>('[data-update-toast]')!;
    const accept = toast.querySelector<HTMLButtonElement>('[data-update-accept]')!;
    const dismiss = toast.querySelector<HTMLButtonElement>('[data-update-dismiss]')!;
    return { toast, accept, dismiss };
  };

  it('reloads the page after the visitor accepts and the worker activates', async () => {
    const { toast, accept } = render();
    const worker = new FakeWorker();
    const reload = vi.fn();
    showUpdateToast(toast, asWorker(worker), reload);
    expect(toast.hidden).toBe(false);

    accept.click();
    expect(accept.disabled).toBe(true);
    worker.setState('activated');
    await vi.waitFor(() => expect(reload).toHaveBeenCalledOnce());
  });

  it('can be dismissed without updating', () => {
    const { toast, dismiss } = render();
    const worker = new FakeWorker();
    showUpdateToast(toast, asWorker(worker), vi.fn());
    dismiss.click();
    expect(toast.hidden).toBe(true);
    expect(worker.postMessage).not.toHaveBeenCalled();
  });
});

describe('initInstallPrompt', () => {
  it('shows the install button only while installation is offered, and uses the prompt once', async () => {
    document.body.innerHTML = '<button hidden>install</button>';
    const button = document.querySelector('button')!;
    initInstallPrompt(button);

    const event = Object.assign(new Event('beforeinstallprompt', { cancelable: true }), {
      prompt: vi.fn().mockResolvedValue(undefined),
      userChoice: Promise.resolve({ outcome: 'accepted' }),
    });
    window.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(button.hidden).toBe(false);

    button.click();
    button.click();
    expect(event.prompt).toHaveBeenCalledOnce();
    expect(button.hidden).toBe(true);
  });
});
