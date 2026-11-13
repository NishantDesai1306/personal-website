import { register } from './serviceWorkerRegistration';

const flushPromises = async () => {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
};

let serviceWorker;
let originalNodeEnv;

beforeEach(() => {
  Object.defineProperty(document, 'readyState', { configurable: true, value: 'loading' });
  originalNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  serviceWorker = { register: jest.fn(), controller: {}, ready: Promise.resolve() };
  Object.defineProperty(navigator, 'serviceWorker', { configurable: true, value: serviceWorker });
  global.fetch = jest.fn().mockResolvedValue({
    status: 200,
    headers: { get: () => 'application/javascript' },
  });
});

afterEach(() => {
  process.env.NODE_ENV = originalNodeEnv;
  delete navigator.serviceWorker;
  delete global.fetch;
});

test('offers an update already waiting when registration is loaded', async () => {
  const registration = { waiting: {}, installing: null };
  serviceWorker.register.mockResolvedValue(registration);
  const onUpdate = jest.fn();

  register({ onUpdate });
  window.dispatchEvent(new Event('load'));
  await flushPromises();

  expect(onUpdate).toHaveBeenCalledWith(registration);
});

test('registers immediately when the page has already finished loading', async () => {
  Object.defineProperty(document, 'readyState', { configurable: true, value: 'complete' });
  serviceWorker.register.mockResolvedValue({ waiting: null, installing: null });

  register();
  await flushPromises();

  expect(serviceWorker.register).toHaveBeenCalledTimes(1);
});

test('observes a worker that was already installing before registration resolved', async () => {
  const worker = { state: 'installing' };
  const registration = { waiting: null, installing: worker };
  serviceWorker.register.mockResolvedValue(registration);
  const onUpdate = jest.fn();

  register({ onUpdate });
  window.dispatchEvent(new Event('load'));
  await flushPromises();
  registration.waiting = worker;
  worker.state = 'installed';
  if (worker.onstatechange) worker.onstatechange();

  expect(onUpdate).toHaveBeenCalledWith(registration);
});
