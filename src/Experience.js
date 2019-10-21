import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const useClasses = makeStyles((theme) => {
	return {
		sectionIcon: {
			transform: 'scale(10)',
		},
		tabs: {
			borderRight: `1px solid ${theme.palette.divider}`,
		},
	};
});

function a11yProps(index) {
	return {
		id: `vertical-tab-${index}`,
		'aria-controls': `vertical-tabpanel-${index}`,
	};
}

function TabPanel(props) {
	const { children, value, index, } = props;

	return (
		<Typography
			component='div'
			role='tabpanel'
			hidden={value !== index}
			id={`vertical-tabpanel-${index}`}
			aria-labelledby={`vertical-tab-${index}`}
		>
			<Box px={3}>{children}</Box>
		</Typography>
	);
}

export default function Experience(props) {
	const classes = useClasses();
	const theme = useTheme();
	const isDesktop = useMediaQuery(theme.breakpoints.up('xl'));
	const [activeTabIndex, setActiveTabIndex] = React.useState(0);

	const experience = [
		{
			tabTitle: 'AppGambit',
			title: 'AppGambit (Formerly known as JumpByte)',
			duration: 'May 2016 - Dec 2017',
			experience: [
				`Developed and maintained notification server built on top of Meteor`,
				`Developed and Managed multiple projects on both frontend and backend`,
				`Manually tested web apps in various browsers to ensure cross-browser compatibility`,
				`Worked on native android app which was used for communication internally`,
			],
		},
		{
			tabTitle: 'Freelancing',
			title: 'Freelance Application Developer',
			duration: 'January 2018 - Present',
			experience: [
				`Worked with multiple clients and delivered projects with high quality software that meets client's expectations`,
				`Designed and Developed complex intra-server communication, scheduling and auto-scaling system for Modd.io`,
				`Developed software on both client side as well as server side`,
				`Designed and developers hybrid apps for clients using React Native`,
			]
		},
	];

	return (
		<Container className='my-4 px-0'>
			<Box className='d-flex align-items-center'>
				<Box className='d-flex col-12 col-xl-9 px-0'>
					<Paper className='p-3 w-100'>
						<Box className='d-flex align-items-center mb-2'>
							<Hidden xlUp>
								<Icon color='disabled' className='mr-2'>
									code
								</Icon>
							</Hidden>
							<Typography variant='h5'>
								Experience
							</Typography>
						</Box>

						<Box className={`row m-0 ${isDesktop ? 'flex-row' : 'flex-column'}`}>
							<Box className='col-12 col-lg-3'>
								<Tabs
									orientation={isDesktop ? 'vertical' : 'horizontal'}
									variant='scrollable'
									indicatorColor='primary'
									value={activeTabIndex}
									onChange={(e, newTabIndex) => setActiveTabIndex(newTabIndex)}
									aria-label='Experience'
								>
									{
										experience.map((experienceDetails, index) => (
											<Tab key={index} label={experienceDetails.tabTitle} {...a11yProps(0)} />
										))
									}
								</Tabs>
							</Box>

							<Box className='col-12 col-lg-9 pt-3 px-0'>
								{
									experience.map((experienceDetails, index) => {
										return (
											<TabPanel value={activeTabIndex} index={index} key={index}>
												<Typography variant='h5' className='mb-1' color='textPrimary'>
													{experienceDetails.title}
												</Typography>
												<Typography className='mb-1' color='textSecondary'>
													Duration: {experienceDetails.duration}
												</Typography>

												<List component='nav' aria-label='main experience work'>
													{
														experienceDetails.experience.map((experienceDescription, index) => (
															<ListItem button key={index}>
																<ListItemText primary={experienceDescription} />
															</ListItem>
														))
													}
												</List>
											</TabPanel>
										);
									})
								}
							</Box>
						</Box>
					</Paper>
				</Box>
				
				<Hidden mdDown>
					<Box className='d-none d-xl-flex justify-content-center col-xl-3'>
						<Icon className={classes.sectionIcon} color='disabled'>
							code
						</Icon>
					</Box>
				</Hidden>
			</Box>
		</Container>
	)
}