/* eslint-disable import/no-webpack-loader-syntax */
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

import githubIcon from '!file-loader!./assets/github.svg';
import linkedinIcon from '!file-loader!./assets/linkedin.svg';
import upworkIcon from '!file-loader!./assets/upwork.svg';
import facebookIcon from '!file-loader!./assets/facebook.svg';

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
	
	return (
		<Container className='my-5 px-0'>
			<Box className='row m-0'>
				<Box className='col-12 px-0'>
					<Paper className={classes.paper}>
						<Typography variant='h4' className={classes.sectionTitle}>
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
									onClick={() => window.open(`mailto:${constants.USER_PROFILE.EMAIL}`, '_blank')}
									fullWidth={isMobile}
								>
									Send an E-mail
								</Button>
							</Box>

							<Divider className={classes.divider} />

							<Typography variant='h6' className={classes.platformsTitle}>
								Connect with me on these platforms
							</Typography>

							<Box className={classes.socialIconsContainer}>
								{
									constants.USER_PROFILE.LINKS.GITHUB && (
										<Tooltip title='Github'>
											<IconButton
												color='primary'
												onClick={() => window.open(constants.USER_PROFILE.LINKS.GITHUB)}
												className={`${classes.contactMeButton} uses-internet`}
											>
												<img alt='github_profile' src={githubIcon} />
											</IconButton>
										</Tooltip>
									)
								}
								{
									constants.USER_PROFILE.LINKS.UPWORK && (
										<Tooltip title='Upwork'>
											<IconButton
												onClick={() => window.open(constants.USER_PROFILE.LINKS.UPWORK)}
												className={classes.contactMeButton}
											>
												<img src={upworkIcon} alt='upwork_profile' className='upwork-icon' />
											</IconButton>
										</Tooltip>
									)
								}
								{
									constants.USER_PROFILE.LINKS.LINKEDIN && (
										<Tooltip title='LinkedIn'>
											<IconButton
												onClick={() => window.open(constants.USER_PROFILE.LINKS.LINKEDIN)}
												className={classes.contactMeButton}
											>
												<img src={linkedinIcon} alt='linkedin_profile' />
											</IconButton>
										</Tooltip>
									)
								}
								{
									constants.USER_PROFILE.LINKS.FACEBOOK && (
										<Tooltip title='Facebook'>
											<IconButton
												onClick={() => window.open(constants.USER_PROFILE.LINKS.FACEBOOK)}
												className={classes.contactMeButton}
											>
												<img src={facebookIcon} alt='facebook_profile' />
											</IconButton>
										</Tooltip>
									)
								}
							</Box>
						</Box>
					</Paper>
				</Box>
			</Box>
		</Container>
	)
}