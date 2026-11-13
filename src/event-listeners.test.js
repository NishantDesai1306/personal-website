import './event-listeners';

afterEach(() => { window.deferredPrompt = null; });

test('install is harmless when the browser has not supplied an installation event', () => {
  window.deferredPrompt = null;
  expect(() => window.showInstallPrompt()).not.toThrow();
});

test('a native install event is consumed only once even on a double click', async () => {
  const prompt = jest.fn().mockResolvedValue();
  const event = new Event('beforeinstallprompt', { cancelable: true });
  event.prompt = prompt;
  event.userChoice = Promise.resolve({ outcome: 'dismissed' });
  window.dispatchEvent(event);
  await Promise.all([window.showInstallPrompt(), window.showInstallPrompt()]);
  expect(prompt).toHaveBeenCalledTimes(1);
});
