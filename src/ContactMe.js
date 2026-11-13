import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';
import Email from '@material-ui/icons/Email';

import constants from './constant';

import githubIcon from './assets/github.svg';
import linkedinIcon from './assets/linkedin.svg';
import upworkIcon from './assets/upwork.svg';
import facebookIcon from './assets/facebook.svg';

const useClasses = makeStyles((theme) => {
	return {
		sectionTitle: {
			fontWeight: 600,
			marginBottom: theme.spacing(3),
			color: theme.palette.primary.main,
			position: 'relative',
			'&::after': {
				content: '""',
				position: 'absolute',
				bottom: -8,
				left: 0,
				width: 40,
				height: 3,
				backgroundColor: theme.palette.primary.main,
				borderRadius: 2,
			}
		},
		paper: {
			padding: theme.spacing(4),
			borderRadius: 12,
			boxShadow: theme.shadows[2],
			'&:hover': {
				boxShadow: theme.shadows[4],
				transition: 'box-shadow 0.3s ease-in-out',
			}
		},
		description: {
			lineHeight: 1.7,
			marginBottom: theme.spacing(3),
			color: theme.palette.text.primary,
			fontSize: '1.1rem',
		},
		emailButton: {
			textTransform: 'none',
			fontWeight: 500,
			fontSize: '1.1rem',
			padding: theme.spacing(1.5, 3),
			'&:hover': {
				transform: 'translateY(-1px)',
				boxShadow: theme.shadows[4],
				transition: 'all 0.2s ease-in-out',
			}
		},
		divider: {
			margin: theme.spacing(3, 0),
		},
		platformsTitle: {
			fontWeight: 500,
			marginBottom: theme.spacing(2),
			color: theme.palette.text.secondary,
			textAlign: 'center',
		},
		socialIconsContainer: {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			flexWrap: 'wrap',
			gap: theme.spacing(2),
		},
		contactMeButton: {
			'& img': {
				height: '50px',
				transition: 'transform 0.2s ease-in-out',
			},
			'& img.upwork-icon': {
				filter: 'invert(40%) sepia(86%) saturate(1116%) hue-rotate(66deg) brightness(94%) contrast(102%)',
			},
			'&:hover': {
				transform: 'translateY(-2px)',
				boxShadow: theme.shadows[4],
				transition: 'all 0.2s ease-in-out',
				'& img': {
					transform: 'scale(1.1)',
				}
			}
		}
	};
});

export default function ContactMe(props) {
	const classes = useClasses();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const { GITHUB, UPWORK, LINKEDIN, FACEBOOK } = constants.USER_PROFILE.LINKS;
	const socialLinks = [
		{ name: 'GitHub', url: GITHUB, icon: githubIcon },
		{ name: 'Upwork', url: UPWORK, icon: upworkIcon, iconClassName: 'upwork-icon' },
		{ name: 'LinkedIn', url: LINKEDIN, icon: linkedinIcon },
		{ name: 'Facebook', url: FACEBOOK, icon: facebookIcon },
	];
	
	return (
		<Container className='my-5 px-0'>
			<Box className='row m-0'>
				<Box className='col-12 px-0'>
					<Paper className={classes.paper}>
						<Typography variant='h4' component='h2' className={classes.sectionTitle}>
							Contact Me
						</Typography>

						<Box>
							<Typography className={classes.description}>
								I welcome opportunities to discuss potential collaborations, whether it's a job opportunity, project proposal, or technical discussion. I'm committed to providing thoughtful responses to all professional inquiries.
							</Typography>

							<Box className='d-flex justify-content-center'>
								<Button
									variant='contained'
									color='primary'
									size='large'
									className={`${classes.emailButton} uses-internet`}
									startIcon={<Email />}
									href={`mailto:${constants.USER_PROFILE.EMAIL}`}
									fullWidth={isMobile}
								>
									Send an E-mail
								</Button>
							</Box>

							<Divider className={classes.divider} />

							<Typography variant='h6' component='h3' className={classes.platformsTitle}>
								Connect with me on these platforms
							</Typography>

							<Box className={classes.socialIconsContainer}>
								{
									socialLinks.filter(({ url }) => !!url).map(({ name, url, icon, iconClassName }) => (
										<Tooltip key={name} title={name}>
											<IconButton
												color='primary'
												href={url}
												target='_blank'
												rel='noopener noreferrer'
												aria-label={`${name} profile (opens in a new tab)`}
												className={`${classes.contactMeButton} uses-internet`}
											>
												<img src={icon} alt='' className={iconClassName} />
											</IconButton>
										</Tooltip>
									))
								}
							</Box>
						</Box>
					</Paper>
				</Box>
			</Box>
		</Container>
	)
}