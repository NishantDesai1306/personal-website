import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';

import AnchorLink from 'react-anchor-link-smooth-scroll';

import constants from './constant';

import ownerImage from './assets/owner.png';

const useStyles = makeStyles((theme) => {
	return {
		list: {
			width: 300,
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
				<Avatar src={ownerImage} className={classes.ownerImage} />
				<Box className={classes.ownerDetails}>
					<Typography variant='h6'>
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
				onKeyDown={onClose}
			>
				<List component='nav' aria-label='main mailbox folders' className='p-0'>
					<AnchorLink offset='50' href='#about-me' className={classes.buttonLink}>
						<ListItem button>
								<ListItemIcon>
									<Icon color='primary'>notes</Icon>
								</ListItemIcon>
								<ListItemText primary='About Me' />
						</ListItem>
					</AnchorLink>
					
					<AnchorLink offset='50' href='#experience' className={classes.buttonLink}>
						<ListItem button>
								<ListItemIcon>
									<Icon color='primary'>code</Icon>
								</ListItemIcon>
								<ListItemText primary='Experience' />
						</ListItem>
					</AnchorLink>
					
					<AnchorLink offset='75' href='#projects' className={classes.buttonLink}>
						<ListItem button>
								<ListItemIcon>
									<Icon color='primary'>work</Icon>
								</ListItemIcon>
								<ListItemText primary='Projects' />							
						</ListItem>
					</AnchorLink>

					<AnchorLink offset='0' href='#contact-me' className={classes.buttonLink}>
						<ListItem button>
								<ListItemIcon>
									<Icon color='primary'>email</Icon>
								</ListItemIcon>
								<ListItemText primary='Contact Me' />
						</ListItem>
					</AnchorLink>

					<ListItem
						button
						onClick={() => window.open(constants.USER_PROFILE.RESUME, '_blank')}
					>
						<ListItemIcon>
							<Icon color='primary'>description</Icon>
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