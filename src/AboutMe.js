import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Hidden from '@material-ui/core/Hidden'
import Box from '@material-ui/core/Box'
import NotesIcon from '@material-ui/icons/Notes';

import constants from './constant';

const useClasses = makeStyles((theme) => {
	return {
		technologiesImage: {
			height: 40,
			width: '100%'
		},
		chip: {
			margin: theme.spacing(1),
		},
		sectionIcon: {
			transform: 'scale(10)',
			position: 'sticky',
    		top: '135px',
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
		<Container className='my-4 py-5 px-0'>
			<Box className='row m-0'>
				<Box className='d-none d-xl-flex justify-content-center col-xl-3 py-5'>
					<NotesIcon className={classes.sectionIcon} color='disabled' />
				</Box>

				<Box className='col-12 col-xl-9 px-0'>
					<Paper className='p-4'>
						<Box className='d-flex align-items-center mb-2'>
							<Hidden xlUp>
								<NotesIcon color='disabled' className='mr-2' />
							</Hidden>
							<Typography variant='h5'>
								About Me
							</Typography>
						</Box>

						{
							constants.ABOUT.description.map((text, index) => <Typography key={index} className='mb-1'>{text}</Typography>)
						}

						<Typography variant='h5' className='mt-4 mb-2'>
							Technologies
						</Typography>

						<Typography className='mb-1'>
							Technologies that I have worked with till now to build awesome apps
						</Typography>

						{
							technologies.map((technology, index) => {
								return (
									<Chip
										key={index}
										color='primary'
										className={`${classes.chip} ${technology.link ? 'uses-internet' : ''}`}
										label={technology.text}
										clickable={!!technology.link}
										onClick={() => technology.link && window.open(technology.link, '__blank')}
									/>
								)
							})
						}
					</Paper>
				</Box>
			</Box>
		</Container>
	)
}