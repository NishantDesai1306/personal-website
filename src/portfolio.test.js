import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { ThemeProvider } from '@material-ui/core/styles';

import theme from './theme';
import constants from './constant';
import Introduction from './Introduction';
import AppBar from './AppBar';
import AboutMe from './AboutMe';
import Experience from './Experience';
import ContactMe from './ContactMe';

let container;
let viewportWidth = 1280;
const originalMatchMedia = window.matchMedia;
const originalOpen = window.open;

// Minimal matchMedia that evaluates the min-width/max-width queries MUI emits.
function matchesQuery(query) {
	const min = /min-width:\s*([\d.]+)px/.exec(query);
	const max = /max-width:\s*([\d.]+)px/.exec(query);
	if (min && viewportWidth < parseFloat(min[1])) return false;
	if (max && viewportWidth > parseFloat(max[1])) return false;
	return Boolean(min || max);
}

function setViewportWidth(width) {
	viewportWidth = width;
	window.matchMedia = (query) => ({
		matches: matchesQuery(query),
		media: query,
		onchange: null,
		addListener: () => {},
		removeListener: () => {},
		addEventListener: () => {},
		removeEventListener: () => {},
		dispatchEvent: () => false,
	});
}

function mount(element) {
	// Remount so media-query hooks read the current viewport width.
	act(() => {
		ReactDOM.unmountComponentAtNode(container);
	});
	// ReactDOM.render (not Testing Library's render) needs act to flush effects.
	// eslint-disable-next-line testing-library/no-unnecessary-act
	act(() => {
		ReactDOM.render(<ThemeProvider theme={theme}>{element}</ThemeProvider>, container);
	});
	return container;
}

function linkByText(root, text) {
	return Array.from(root.querySelectorAll('a')).find(
		(link) => link.textContent.trim().toLowerCase() === text.toLowerCase()
	);
}

function expectSafeExternalLink(link) {
	expect(link).toBeTruthy();
	expect(link.tagName).toBe('A');
	expect(link.getAttribute('target')).toBe('_blank');
	expect(link.getAttribute('rel')).toEqual(expect.stringContaining('noopener'));
	expect(link.getAttribute('rel')).toEqual(expect.stringContaining('noreferrer'));
}

beforeEach(() => {
	setViewportWidth(1280);
	window.open = jest.fn();
	container = document.createElement('div');
	document.body.appendChild(container);
});

afterEach(() => {
	act(() => {
		ReactDOM.unmountComponentAtNode(container);
	});
	container.remove();
	container = null;
	window.matchMedia = originalMatchMedia;
	window.open = originalOpen;
});

describe('Introduction', () => {
	it('has one h1 with the owner name and a described portrait', () => {
		const root = mount(<Introduction />);
		const headings = root.querySelectorAll('h1');
		expect(headings).toHaveLength(1);
		expect(headings[0].textContent).toBe(constants.USER_PROFILE.NAME);

		const portrait = root.querySelector('img');
		expect(portrait.getAttribute('alt')).toEqual(expect.stringContaining(constants.USER_PROFILE.NAME));
	});

	it('offers in-page links to projects and contact sections', () => {
		const root = mount(<Introduction />);
		expect(linkByText(root, 'View projects').getAttribute('href')).toBe('#projects');
		expect(linkByText(root, 'Contact me').getAttribute('href')).toBe('#contact-me');
		expect(root.querySelector('a button, button a')).toBeNull();
	});
});

describe('AppBar', () => {
	const sections = [
		['About Me', '#about-me'],
		['Experience', '#experience'],
		['Projects', '#projects'],
		['Contact Me', '#contact-me'],
	];

	it('renders desktop navigation as plain anchors at 1200px and above', () => {
		setViewportWidth(1200);
		const root = mount(<AppBar onOpenSideDrawer={() => {}} />);

		sections.forEach(([label, href]) => {
			expect(linkByText(root, label).getAttribute('href')).toBe(href);
		});
		expect(root.querySelector('a button, button a')).toBeNull();
		expectSafeExternalLink(linkByText(root, 'Resume'));
		expect(root.querySelector('[aria-label="menu"]')).toBeNull();
	});

	it.each([1199, 1000, 768, 375])('uses only the drawer menu at %ipx', (width) => {
		setViewportWidth(width);
		const onOpenSideDrawer = jest.fn();
		const root = mount(<AppBar onOpenSideDrawer={onOpenSideDrawer} />);

		expect(linkByText(root, 'About Me')).toBeUndefined();
		const menuButton = root.querySelector('button[aria-label="menu"]');
		expect(menuButton).toBeTruthy();
		act(() => {
			menuButton.click();
		});
		expect(onOpenSideDrawer).toHaveBeenCalledTimes(1);
	});

	it('does not expose the header name as a heading', () => {
		const root = mount(<AppBar onOpenSideDrawer={() => {}} />);
		expect(root.querySelector('h1, h2, h3, h4, h5, h6')).toBeNull();
	});

	it('moves keyboard focus to the selected section', () => {
		const originalScrollTo = window.scrollTo;
		window.scrollTo = jest.fn();
		try {
			const root = mount(<><AppBar onOpenSideDrawer={() => {}} /><div id='projects' tabIndex={-1}>Projects content</div></>);
			const link = linkByText(root, 'Projects');
			link.focus();
			act(() => { link.click(); });
			expect(document.activeElement).toBe(root.querySelector('#projects'));
		} finally {
			window.scrollTo = originalScrollTo;
			window.history.replaceState(null, '', '/');
		}
	});
});

describe('section headings', () => {
	it.each([
		['About Me', AboutMe],
		['Experience', Experience],
		['Contact Me', ContactMe],
	])('renders %s as an h2', (title, Component) => {
		const root = mount(<Component />);
		const h2 = root.querySelectorAll('h2');
		expect(h2).toHaveLength(1);
		expect(h2[0].textContent).toBe(title);
		expect(root.querySelector('h1, h4, h5, h6')).toBeNull();
	});

	it('uses h3 for section subtitles', () => {
		expect(mount(<AboutMe />).querySelector('h3').textContent).toBe('Technologies');
		expect(mount(<ContactMe />).querySelector('h3').textContent).toBe('Connect with me on these platforms');
		expect(mount(<Experience />).querySelector('[role="tabpanel"]:not([hidden]) h3').textContent)
			.toBe('Senior Frontend Developer');
	});
});

describe('AboutMe', () => {
	it('does not state a location that conflicts with the hero', () => {
		expect(mount(<AboutMe />).textContent).not.toMatch(/Surat/);
	});

	it('links technologies with safe external anchors', () => {
		const root = mount(<AboutMe />);
		const react = linkByText(root, 'React');
		expectSafeExternalLink(react);
		expect(react.getAttribute('href')).toBe('https://reactjs.org');
		expect(react.getAttribute('role')).toBeNull();
	});
});

describe('ContactMe', () => {
	it('uses a mailto link for email instead of a popup', () => {
		const root = mount(<ContactMe />);
		const email = linkByText(root, 'Send an E-mail');
		expect(email.getAttribute('href')).toBe(`mailto:${constants.USER_PROFILE.EMAIL}`);
		expect(email.getAttribute('target')).toBeNull();
		act(() => {
			email.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
		});
		expect(window.open).not.toHaveBeenCalled();
	});

	it('links every profile with a named, safe external anchor', () => {
		const root = mount(<ContactMe />);
		const { GITHUB, UPWORK, LINKEDIN, FACEBOOK } = constants.USER_PROFILE.LINKS;
		[GITHUB, UPWORK, LINKEDIN, FACEBOOK].forEach((url) => {
			const link = root.querySelector(`a[href="${url}"]`);
			expectSafeExternalLink(link);
			expect(link.getAttribute('aria-label')).toBeTruthy();
		});
	});
});

describe('Experience', () => {
	it.each([
		[1000, 'ArrowRight', 'ArrowDown'],
		[1200, 'ArrowDown', 'ArrowRight'],
	])('at %ipx moves between tabs with %s (not %s)', (width, nextKey, ignoredKey) => {
		setViewportWidth(width);
		const root = mount(<Experience />);
		const tabs = root.querySelectorAll('[role="tab"]');
		const press = (key) => act(() => {
			document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
		});

		tabs[0].focus();
		press(ignoredKey);
		expect(document.activeElement).toBe(tabs[0]);
		press(nextKey);
		expect(document.activeElement).toBe(tabs[1]);
	});

	it('switches the visible job when a tab is selected', () => {
		const root = mount(<Experience />);
		const tab = Array.from(root.querySelectorAll('[role="tab"]')).find((t) => t.textContent === 'AppGambit');
		act(() => {
			tab.click();
		});
		const panel = root.querySelector('[role="tabpanel"]:not([hidden])');
		expect(panel.querySelector('h3').textContent).toMatch(/AppGambit/);
		expectSafeExternalLink(panel.querySelector('a[href="https://appgambit.com/"]'));
	});

	it('has no duplicated words in the listed achievements', () => {
		expect(mount(<Experience />).textContent).not.toMatch(/\b(\w+) \1\b/i);
	});
});
