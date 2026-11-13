import { precacheAndRoute } from 'workbox-precaching';

jest.mock('workbox-core', () => ({ clientsClaim: jest.fn() }));
jest.mock('workbox-expiration', () => ({ ExpirationPlugin: jest.fn() }));
jest.mock('workbox-precaching', () => ({
  precacheAndRoute: jest.fn(),
  createHandlerBoundToURL: jest.fn(),
}));
jest.mock('workbox-routing', () => ({ registerRoute: jest.fn() }));
jest.mock('workbox-strategies', () => ({ StaleWhileRevalidate: jest.fn() }));

test('the resume is precached even before a visitor first opens it', () => {
  window.__WB_MANIFEST = [];
  require('./service-worker');
  const entries = precacheAndRoute.mock.calls[0][0];
  expect(entries).toEqual(expect.arrayContaining([
    expect.objectContaining({ url: '/Nishant_Desai_Resume.pdf', revision: expect.any(String) }),
  ]));
});
