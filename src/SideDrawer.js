import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import NotesIcon from '@material-ui/icons/Notes';
import CodeIcon from '@material-ui/icons/Code';
import WorkIcon from '@material-ui/icons/Work';
import EmailIcon from '@material-ui/icons/Email';
import DescriptionIcon from '@material-ui/icons/Description';



import constants from './constant';

import ownerImage from './assets/owner.webp';

const useStyles = makeStyles((theme) => {
	return {
		list: {
			width: 280,
			maxWidth: 'calc(100vw - 32px)',
		},
		buttonLink: {
			color: theme.palette.primary.main,
			textDecoration: 'none',
			display: 'flex',
			alignItems: 'center',
		},
		drawerHeader: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			padding: theme.spacing(2),
			background: theme.palette.primary.main,
			height: '250px',
		},
		ownerImage: {
			width: '150px',
			height: '150px',
		},
		ownerDetails: {
			flexGrow: 1,
			display: 'flex',
			justifyContent: 'center',
			color: 'white',
			flexDirection: 'column',
		}
	}
});

export default function SideDrawer(props) {
	const {
		isDrawerOpen,
		onClose
	} = props;
	const classes = useStyles();

	return (
		<Drawer open={isDrawerOpen} onClose={onClose}>
			<div className={classes.drawerHeader}>
				<Avatar src={ownerImage} alt='' className={classes.ownerImage} />
				<Box className={classes.ownerDetails}>
					<Typography variant='h6' component='p'>
						{constants.USER_PROFILE.NAME}
					</Typography>
					<Typography>
						{constants.USER_PROFILE.EMAIL}
					</Typography>
				</Box>
			</div>
			<div
				className={classes.list}
				role='presentation'
				onClick={onClose}

			>
				<List component='nav' aria-label='Mobile navigation' className='p-0'>
					{[
						['About Me', '#about-me', NotesIcon],
						['Experience', '#experience', CodeIcon],
						['Projects', '#projects', WorkIcon],
						['Contact Me', '#contact-me', EmailIcon],
					].map(([label, href, Icon]) => (
						<ListItem key={href} button component='a' href={href} className={classes.buttonLink}>
							<ListItemIcon><Icon color='primary' /></ListItemIcon>
							<ListItemText primary={label} />
						</ListItem>
					))}

					<ListItem
						button
						component='a'
						href={constants.USER_PROFILE.RESUME}
						target='_blank'
						rel='noopener noreferrer'
					>
						<ListItemIcon>
							<DescriptionIcon color='primary' />
						</ListItemIcon>
						<ListItemText>
							<Typography color='primary'>
								Resume
							</Typography>
						</ListItemText>
					</ListItem>
				</List>
			</div>
		</Drawer>
	);
}