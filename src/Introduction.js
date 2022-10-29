import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Avatar	 from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import ownerImage from './assets/owner.png';
import constants from './constant';

const useStyles = makeStyles((theme) => {
	return {
		profilePicture: {
			height: 250,
			width: 250
		}
	}
});

export default function Introduction(props) {
	const classes = useStyles();

	return (
		<Box className={`row align-items-center ${classes.main} h-100 p-lg-0 px-5 pb-5 m-0 flex-grow-1`}>
			<Box className='col-12 col-md-5 offset-md-1'>
				<Box className='row justify-content-center align-items-center'>
					<Avatar src={ownerImage} className={classes.profilePicture} />
				</Box>
			</Box>

			<Box className='col-12 col-md-5'>
				<Typography variant='h6'>Hello I'm </Typography>
				<Typography variant='h4' gutterBottom>{constants.USER_PROFILE.NAME}</Typography>

				<Typography variant='h4' color='textSecondary' gutterBottom>
					I build web and mobile based applications
				</Typography>

				<Typography variant='h6' color='textSecondary'>
					I'm a software engineer working in Canada with expertise in building high-quality web applications.
				</Typography>
			</Box>
		</Box>
	);
}