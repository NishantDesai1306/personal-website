/* eslint-disable import/no-webpack-loader-syntax */
import React from 'react';

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';
import EmailIcon from '@material-ui/icons/Email';

import constants from './constant';

import githubIcon from '!file-loader!./assets/github.svg';
import linkedinIcon from '!file-loader!./assets/linkedin.svg';
import upworkIcon from '!file-loader!./assets/upwork.svg';
import facebookIcon from '!file-loader!./assets/facebook.svg';

const useClasses = makeStyles((theme) => {
	return {
		iconContainer: {
			padding: '70px 0',
		},
		sectionIcon: {
			transform: 'scale(10)',
			position: 'sticky',
    		top: '150px',
		},
		tabs: {
			borderRight: `1px solid ${theme.palette.divider}`,
		},
		contactMeButton: {
			'& img': {
				height: '50px',
			},
			'& img.upwork-icon': {
				filter: 'invert(40%) sepia(86%) saturate(1116%) hue-rotate(66deg) brightness(94%) contrast(102%)',
			}
		}
	};
});

export default function ContactMe(props) {
	const classes = useClasses();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	
	return (
		<Container className='my-4 px-0'>
			<Box className='d-flex'>
				<Box className='col-12 col-xl-9 px-0'>
					<Paper className='p-4'>
						<Box className='d-flex align-items-center mb-2'>
							<Hidden mdUp>
								<EmailIcon color='disabled' className='mr-2' />
							</Hidden>
							<Typography variant='h5'>
								Contact Me
							</Typography>
						</Box>

						<Box>
							<Typography>
								If you have a good job offer, potential project or just want to discuss something related to tech drop in a message, I'll try my best to answer it!
							</Typography>

							<Box className='d-flex justify-content-center my-4'>
								<Button
									variant='contained'
									color='primary'
									size='large'
									className='uses-internet'
									onClick={() => window.open(`mailto:${constants.USER_PROFILE.EMAIL}`, '_blank')}
									fullWidth={isMobile}
								>
									Write an E-mail
								</Button>
							</Box>

							<Divider className='my-3' />

							<Typography variant='subtitle2'>
								or you can also contact me on these platforms
							</Typography>

							<Box className='py-2 row m-0 justify-content-center'>
								{
									constants.USER_PROFILE.LINKS.GITHUB && (
										<Tooltip title='Github'>
											<Box className='mx-2'>
												<IconButton
													color='primary'
													onClick={() => window.open(constants.USER_PROFILE.LINKS.GITHUB)}
													className={`${classes.contactMeButton} uses-internet`}
												>
													<img alt='github_profile' src={githubIcon} />
												</IconButton>
											</Box>
										</Tooltip>
									)
								}
								{
									constants.USER_PROFILE.LINKS.UPWORK && (
										<Tooltip title='Upwork'>
											<Box className='mx-2'>
												<IconButton
													onClick={() => window.open(constants.USER_PROFILE.LINKS.UPWORK)}
													className={classes.contactMeButton}
												>
													<img src={upworkIcon} alt='upwork_profile' className='upwork-icon' />
												</IconButton>
											</Box>
										</Tooltip>
									)
								}
								{
									constants.USER_PROFILE.LINKS.LINKEDIN && (
										<Tooltip title='LinkedIn'>
											<Box className='mx-2'>
												<IconButton
													onClick={() => window.open(constants.USER_PROFILE.LINKS.LINKEDIN)}
													className={classes.contactMeButton}
												>
													<img src={linkedinIcon} alt='linkedin_profile' />
												</IconButton>
											</Box>
										</Tooltip>
									)
								}
								{
									constants.USER_PROFILE.LINKS.FACEBOOK && (
										<Tooltip title='Facebook'>
											<Box className='mx-2'>
												<IconButton
													onClick={() => window.open(constants.USER_PROFILE.LINKS.FACEBOOK)}
													className={classes.contactMeButton}
												>
													<img src={facebookIcon} alt='linkedin_profile' />
												</IconButton>
											</Box>
										</Tooltip>
									)
								}
							</Box>
						</Box>
					</Paper>
				</Box>

				<Hidden mdDown>
					<Box className={clsx('d-xl-flex d-none justify-content-center col-xl-3', classes.iconContainer)}>
						<EmailIcon className={classes.sectionIcon} color='disabled' />
					</Box>
				</Hidden>
			</Box>
		</Container>
	)
}