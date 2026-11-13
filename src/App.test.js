/* eslint-disable testing-library/no-unnecessary-act -- These tests use ReactDOM, not Testing Library. */
import React from 'react';
import ReactDOM from 'react-dom';
import { act, Simulate } from 'react-dom/test-utils';
import { ThemeProvider } from '@material-ui/core/styles';
import App from './App';
import theme from './theme';
import { register } from './serviceWorkerRegistration';

jest.mock('./serviceWorkerRegistration', () => ({ register: jest.fn() }));
jest.mock('./SideDrawer', () => () => null);
jest.mock('./AppBar', () => () => null);
jest.mock('./Introduction', () => () => null);
jest.mock('./AboutMe', () => () => null);
jest.mock('./Experience', () => () => null);
jest.mock('./Projects', () => () => null);
jest.mock('./ContactMe', () => () => null);
jest.mock('./Fab', () => () => null);

let container;
beforeEach(() => {
  window.matchMedia = jest.fn(() => ({ matches: false, addListener() {}, removeListener() {} }));
  register.mockClear();
  container = document.createElement('div');
  document.body.appendChild(container);
});
afterEach(() => {
  act(() => { ReactDOM.unmountComponentAtNode(container); });
  container.remove();
});

test('a click before an update arrives does not consume the update invitation', () => {
  act(() => { ReactDOM.render(<ThemeProvider theme={theme}><App /></ThemeProvider>, container); });
  act(() => { document.body.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
  expect(register).toHaveBeenCalledTimes(1);
  const worker = { postMessage: jest.fn(), addEventListener: jest.fn(), removeEventListener: jest.fn() };
  act(() => { register.mock.calls[0][0].onUpdate({ waiting: worker }); });
  expect(document.querySelector('[role="alert"]').textContent).toContain('Update available');
  const update = [...document.querySelectorAll('button')].find(button => button.textContent === 'Update now');
  expect(update).toBeDefined();
  act(() => { Simulate.click(update); });
  expect(worker.postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' });
});

test('an update activated by another tab can still be applied here', () => {
  const originalLocation = window.location;
  const reload = jest.fn();
  Object.defineProperty(window, 'location', { configurable: true, value: { reload } });
  try {
    act(() => { ReactDOM.render(<ThemeProvider theme={theme}><App /></ThemeProvider>, container); });
    const worker = { state: 'installed', postMessage: jest.fn(), addEventListener: jest.fn(), removeEventListener: jest.fn() };
    act(() => { register.mock.calls[0][0].onUpdate({ waiting: worker }); });
    worker.state = 'activated';
    const update = [...document.querySelectorAll('button')].find(button => button.textContent === 'Update now');
    act(() => { Simulate.click(update); });
    expect(reload).toHaveBeenCalledTimes(1);
  } finally {
    Object.defineProperty(window, 'location', { configurable: true, value: originalLocation });
  }
});
