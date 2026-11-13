/* eslint-disable testing-library/no-unnecessary-act, testing-library/no-render-in-setup -- These tests use ReactDOM, not Testing Library. */
import React from 'react';
import ReactDOM from 'react-dom';
import { act, Simulate } from 'react-dom/test-utils';
import { ThemeProvider } from '@material-ui/core/styles';
import Projects from './Projects';
import theme from './theme';

let container;
beforeEach(() => {
  window.matchMedia = jest.fn(() => ({ matches: false, addListener() {}, removeListener() {} }));
  container = document.createElement('div');
  document.body.appendChild(container);
  act(() => { ReactDOM.render(<ThemeProvider theme={theme}><Projects /></ThemeProvider>, container); });
});
afterEach(() => {
  act(() => { ReactDOM.unmountComponentAtNode(container); });
  container.remove();
});

test('every project tab selects its labelled accessible panel', () => {
  const tabs = [...container.querySelectorAll('[role="tab"]')];
  expect(tabs).toHaveLength(4);
  tabs.forEach(tab => {
    act(() => { Simulate.click(tab); });
    expect(tab.getAttribute('aria-selected')).toBe('true');
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    expect(panel).not.toBeNull();
    expect(panel.getAttribute('role')).toBe('tabpanel');
    expect(panel.getAttribute('aria-labelledby')).toBe(tab.id);
    expect(panel.hidden).toBe(false);
  });
});

test('project source code is a navigable link, not a scripted popup', () => {
  const link = container.querySelector('[role="tabpanel"]:not([hidden]) a[href^="https://github.com/"]');
  expect(link).not.toBeNull();
  expect(link.target).toBe('_blank');
  expect(link.rel).toContain('noopener');
});

test('technology documentation links retain native link semantics', () => {
  const link = container.querySelector('a[href="https://www.android.com"]');
  expect(link).not.toBeNull();
  expect(link.getAttribute('role')).toBeNull();
});

test('a project demo has an accessible name and a working close control', () => {
  const panel = container.querySelector('[role="tabpanel"]:not([hidden])');
  const demo = [...panel.querySelectorAll('button')].find(button => button.textContent.includes('Demo'));
  act(() => { Simulate.click(demo); });
  const dialog = document.querySelector('[role="dialog"]');
  expect(dialog).not.toBeNull();
  const label = document.getElementById(dialog.getAttribute('aria-labelledby'));
  expect(label).not.toBeNull();
  expect(label.textContent).toBe('Smart Copy Demo');
  expect(dialog.querySelector('a[href="https://www.youtube.com/watch?v=BB-6VMgOwFc"]')).not.toBeNull();
  const close = dialog.querySelector('button[aria-label="Close demo"]');
  expect(close).not.toBeNull();
  act(() => { Simulate.click(close); });
  expect(document.querySelector('[role="dialog"]')).toBeNull();
});
