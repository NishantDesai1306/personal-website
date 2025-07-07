import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider';

import constants from './constant';

const useClasses = makeStyles((theme) => {
	return {
		technologiesImage: {
			height: 40,
			width: '100%'
		},
		chip: {
			margin: theme.spacing(0.5),
			fontWeight: 500,
			'&:hover': {
				transform: 'translateY(-1px)',
				boxShadow: theme.shadows[4],
				transition: 'all 0.2s ease-in-out',
			}
		},
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
		subtitle: {
			fontWeight: 500,
			marginBottom: theme.spacing(2),
			color: theme.palette.text.secondary,
		},
		description: {
			lineHeight: 1.7,
			marginBottom: theme.spacing(2),
			color: theme.palette.text.primary,
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
		technologiesSection: {
			marginTop: theme.spacing(4),
		},
		chipsContainer: {
			marginTop: theme.spacing(2),
		}
	};
});

export default function AboutMe(props) {
	const classes = useClasses();
	const technologies = [
		{
			text: 'NextJS',
			link: 'https://nextjs.org/'
		},
		{
			text: 'React',
			link: 'https://reactjs.org'
		},
		{
			text: 'NodeJS',
			link: 'https://nodejs.org/en/'
		},
		{
			text: 'Angular',
			link: 'https://angular.io'
		},
		{
			text: 'Meteor',
			link: 'https://www.meteor.com'
		},
		{
			text: 'React Native',
			link: 'https://facebook.github.io/react-native/'
		},
		{
			text: 'Flutter',
			link: 'https://flutter.dev'
		},
		{
			text: 'MySQL',
			link: 'https://www.mysql.com'
		},
		{
			text: 'MongoDB',
			link: 'https://www.mongodb.com'
		},
	];

	return (
		<Container className='my-5 px-0'>
			<Box className='row m-0'>
				<Box className='col-12 px-0'>
					<Paper className={classes.paper}>
						<Typography variant='h4' className={classes.sectionTitle}>
							About Me
						</Typography>

						{
							constants.ABOUT.description.map((text, index) => (
								<Typography key={index} className={classes.description}>
									{text}
								</Typography>
							))
						}

						<Divider className='my-4' />

						<Box className={classes.technologiesSection}>
							<Typography variant='h5' className={classes.subtitle}>
								Technologies
							</Typography>

							<Typography className={classes.description}>
								Technologies that I have worked with to build awesome applications
							</Typography>

							<Box className={classes.chipsContainer}>
								{
									technologies.map((technology, index) => {
										return (
											<Chip
												key={index}
												color='primary'
												variant='outlined'
												className={`${classes.chip} ${technology.link ? 'uses-internet' : ''}`}
												label={technology.text}
												clickable={!!technology.link}
												onClick={() => technology.link && window.open(technology.link, '__blank')}
											/>
										)
									})
								}
							</Box>
						</Box>
					</Paper>
				</Box>
			</Box>
		</Container>
	)
}