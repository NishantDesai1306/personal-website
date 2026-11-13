import React from 'react';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Fade from '@material-ui/core/Fade';
import Box from '@material-ui/core/Box';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import MenuIcon from '@material-ui/icons/Menu';
import GetAppIcon from '@material-ui/icons/GetApp';

import ownerImage from './assets/owner.webp';
import constants from './constant';

// Scroll distance (px) after which the header gains elevation and shows the
// compact avatar/name. Fixed so it no longer depends on `window.screen`.
export const HEADER_SCROLL_THRESHOLD = 240;

const NAV_LINKS = [
	{ label: 'About Me', href: '#about-me' },
	{ label: 'Experience', href: '#experience' },
	{ label: 'Projects', href: '#projects' },
	{ label: 'Contact Me', href: '#contact-me' },
];

/**
 * Click handler for in-page `<a href="#id">` links: smooth-scrolls to the
 * target while keeping it clear of the fixed header. Leaves the browser's
 * native anchor jump in place when the target is missing.
 */
export function scrollToSection(event) {
	const hash = event.currentTarget.getAttribute('href');
	const target = hash && hash.startsWith('#') ? document.getElementById(hash.slice(1)) : null;
	if (!target || typeof window.scrollTo !== 'function') {
		return;
	}

	event.preventDefault();
	const header = document.querySelector('header');
	const headerHeight = header ? header.getBoundingClientRect().height : 0;
	const prefersReducedMotion = typeof window.matchMedia === 'function'
		&& window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	target.focus({ preventScroll: true });
	window.scrollTo({
		top: target.getBoundingClientRect().top + window.pageYOffset - headerHeight,
		behavior: prefersReducedMotion ? 'auto' : 'smooth',
	});
	if (window.history && window.history.pushState) {
		window.history.pushState(null, '', hash);
	}
}

const useStyles = makeStyles((theme) => {
	return {
		menuButton: {
			marginRight: theme.spacing(2),
		},
		identity: {
			display: 'flex',
			flexGrow: 1,
			alignItems: 'center',
			minWidth: 0,
		},
		avatar: {
			marginRight: theme.spacing(1),
		},
		name: {
			fontSize: '1.25rem',
			fontWeight: 500,
			whiteSpace: 'nowrap',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
		},
		navLink: {
			margin: theme.spacing(0, 1),
		},
	};
});

export default function MyAppBar(props) {
	const classes = useStyles();
	const theme = useTheme();
	const { onOpenSideDrawer } = props;
	const isDesktop = useMediaQuery(theme.breakpoints.up('xl'));
	const isScrolled = useScrollTrigger({
		disableHysteresis: true,
		threshold: HEADER_SCROLL_THRESHOLD,
	});

	return (
		<AppBar position='fixed' elevation={isScrolled ? 4 : 0}>
			<Toolbar>
				{!isDesktop && (
					<IconButton
						edge='start'
						className={classes.menuButton}
						color='inherit'
						aria-label='menu'
						onClick={onOpenSideDrawer}
					>
						<MenuIcon />
					</IconButton>
				)}

				<Box className={classes.identity}>
					<Fade in={isScrolled}>
						<Box display='flex' alignItems='center' minWidth={0}>
							<Avatar className={classes.avatar} src={ownerImage} alt='' />
							<Typography component='span' className={classes.name}>
								{constants.USER_PROFILE.NAME}
							</Typography>
						</Box>
					</Fade>
				</Box>

				{isDesktop && (
					<Box component='nav' aria-label='Sections' display='flex' alignItems='center'>
						{NAV_LINKS.map(({ label, href }) => (
							<Button
								key={href}
								color='inherit'
								className={classes.navLink}
								href={href}
								onClick={scrollToSection}
							>
								{label}
							</Button>
						))}
						<Button
							color='inherit'
							className={classes.navLink}
							href={constants.USER_PROFILE.RESUME}
							target='_blank'
							rel='noopener noreferrer'
						>
							Resume
						</Button>
					</Box>
				)}

				<Button
					onClick={() => window.showInstallPrompt && window.showInstallPrompt()}
					color='inherit'
					className='install-handle d-none mx-3'
					startIcon={<GetAppIcon />}
				>
					Install
				</Button>
			</Toolbar>
		</AppBar>
	);
}
