import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';

import AnchorLink from 'react-anchor-link-smooth-scroll';

import constants from './constant';

const useStyles = makeStyles((theme) => {
	return {
		list: {
			width: 250,
		},
		buttonLink: {
			color: theme.palette.primary.main,
			textDecoration: 'none',
			display: 'flex',
			alignItems: 'center',
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
			<div
				className={classes.list}
				role='presentation'
				onClick={onClose}
				onKeyDown={onClose}
			>
				<List component='nav' aria-label='main mailbox folders'>
					<ListItem button>
						<AnchorLink offset='50' href='#about-me' className={classes.buttonLink}>
							<ListItemIcon>
								<Icon color='primary'>notes</Icon>
							</ListItemIcon>
							<ListItemText primary='About Me' />
						</AnchorLink>
					</ListItem>
					
					<ListItem button>
						<AnchorLink offset='50' href='#experience' className={classes.buttonLink}>
							<ListItemIcon>
								<Icon color='primary'>code</Icon>
							</ListItemIcon>
							<ListItemText primary='Experience' />
						</AnchorLink>
					</ListItem>
					
					<ListItem button>
						<AnchorLink offset='75' href='#projects' className={classes.buttonLink}>
							<ListItemIcon>
								<Icon color='primary'>work</Icon>
							</ListItemIcon>
							<ListItemText primary='Projects' />							
						</AnchorLink>
					</ListItem>

					<ListItem button>
						<AnchorLink offset='0' href='#contact-me' className={classes.buttonLink}>
							<ListItemIcon>
								<Icon color='primary'>email</Icon>
							</ListItemIcon>
							<ListItemText primary='Contact Me' />
						</AnchorLink>
					</ListItem>

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