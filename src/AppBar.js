import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import Avatar from '@material-ui/core/Avatar';
import Fade from '@material-ui/core/Fade';
import Box from '@material-ui/core/Box';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';

import AnchorLink from 'react-anchor-link-smooth-scroll'

import ownerImage from './assets/owner.png';
import constants from './constant';

const useStyles = makeStyles((theme) => {
	return {
		menuButton: {
			marginRight: theme.spacing(2),
		},
		title: {
			flexGrow: 1,
		},
		buttonLink: {
			color: theme.palette.primary.contrastText,
			textDecoration: 'none',
		}
	}
});

function ElevationScroll(props) {
	const { children } = props;
	const theme = useTheme();
	const isDesktop = useMediaQuery(theme.breakpoints.up('xl'));
	const introHeight = isDesktop ? 0.8 : 1;

	// Note that you normally won't need to set the window ref as useScrollTrigger
	// will default to window.
	// This is only being set here because the demo is in an iframe.
	const trigger = useScrollTrigger({
		disableHysteresis: true,
		threshold: (window.screen.height * introHeight) - 200,
	});

	return React.cloneElement(children, {
		elevation: !!trigger ? 4 : 0,
	});
}

function AvatarScroll(props) {
	const { children } = props;
	const theme = useTheme();
	const isDesktop = useMediaQuery(theme.breakpoints.up('xl'));
	const introHeight = isDesktop ? 0.8 : 1;

	// Note that you normally won't need to set the window ref as useScrollTrigger
	// will default to window.
	// This is only being set here because the demo is in an iframe.
	const trigger = useScrollTrigger({
		disableHysteresis: true,
		threshold: (window.screen.height * introHeight) - 200,
	});

	return React.cloneElement(children, {
		in: !!trigger,
		className: trigger ? 'mr-2' : ''
	});
}

export default function MyAppBar(props) {
	const classes = useStyles();
	const {
		onOpenSideDrawer
	} = props;

	return (
		<ElevationScroll {...props}>
			<AppBar position='fixed' elevation={0}>
				<Toolbar>
					<Hidden xlUp>
						<IconButton
							edge='start'
							className={classes.menuButton}
							color='inherit'
							aria-label='menu'
							onClick={onOpenSideDrawer}
						>
							<Icon>menu</Icon>
						</IconButton>
					</Hidden>

					<AvatarScroll>
						<Fade>
							<Avatar src={ownerImage} />
						</Fade>
					</AvatarScroll>
					
					<Typography variant='h6' className={classes.title}>
						{constants.USER_PROFILE.NAME}
					</Typography>

					<Hidden mdDown>
						<Box>
							<AnchorLink offset='25' href='#about-me' className={classes.buttonLink}>
								<Button color='inherit' className='mx-3'>About Me</Button>
							</AnchorLink>
						</Box>
						<Box>
							<AnchorLink offset='50' href='#experience' className={classes.buttonLink}>
								<Button color='inherit' className='mx-3'>Experience</Button>
							</AnchorLink>
						</Box>
						<Box>
							<AnchorLink offset='75' href='#projects' className={classes.buttonLink}>
								<Button color='inherit' className='mx-3'>Projects</Button>
							</AnchorLink>
						</Box>
						<Box>
							<AnchorLink offset='0' href='#contact-me' className={classes.buttonLink}>
								<Button color='inherit' className='mx-3'>Contact Me</Button>
							</AnchorLink>
						</Box>
						<Box>
							<Button color='inherit' className='mx-3' href='/Nishant_Desai_Resume.pdf' target='_blank'>Resume</Button>
						</Box>
					</Hidden>
				</Toolbar>
			</AppBar>
		</ElevationScroll>
	);
}