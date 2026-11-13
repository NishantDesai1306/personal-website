/* eslint-disable testing-library/no-unnecessary-act -- This test uses ReactDOM, not Testing Library. */
import React from 'react';
import ReactDOM from 'react-dom';
import { act, Simulate } from 'react-dom/test-utils';
import { ThemeProvider } from '@material-ui/core/styles';
import SideDrawer from './SideDrawer';
import theme from './theme';

test('keyboard users can tab through the drawer without closing it', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const onClose = jest.fn();
  try {
    act(() => { ReactDOM.render(<ThemeProvider theme={theme}><SideDrawer isDrawerOpen onClose={onClose} /></ThemeProvider>, container); });
    const nav = document.querySelector('nav');
    act(() => { Simulate.keyDown(nav, { key: 'Tab' }); });
    expect(onClose).not.toHaveBeenCalled();
    expect(nav.querySelector('a[href="/Nishant_Desai_Resume.pdf"]')).not.toBeNull();
  } finally {
    act(() => { ReactDOM.unmountComponentAtNode(container); });
    container.remove();
  }
});
