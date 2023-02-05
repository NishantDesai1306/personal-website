import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import WorkIcon from '@material-ui/icons/Work';

const useClasses = makeStyles((theme) => {
	return {
		sectionIcon: {
			transform: 'scale(10)',
			position: 'sticky',
			top: 155,
			marginTop: 40,
			marginBottom: 40,
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
			tabTitle: 'J.D. Power',
			url: 'https://jdpower.com',
			title: 'Senior Frontend Developer',
			duration: 'November 2022 - Present',
			experience: [
				`Worked on a NextJS based web application which connects users with car dealers or other users who want to sell their cars.`,
				`Debugged and resolved google ad issue which was plaguing the app for months.`,
			]
		},
		{
			tabTitle: 'FoodX',
			url: 'https://www.foodxtech.com/',
			title: 'Fullstack Developer (on Contract)',
			duration: 'September 2020 - September 2022',
			experience: [
				`Worked on a React based web application which lets users manage orders and products online.`,
				`Designed UI/UX solutions based on what's more feasible for a given task.`,
				`Took lead in designing multiple company wide features and their implementation.`,
			]
		},
		{
			tabTitle: 'modd.io',
			url: 'https://www.modd.io/',
			title: 'Application Developer',
			duration: 'January 2018 - September 2020',
			experience: [
				`Worked on a React based web application which lets users build their own multiplayer game.`,
				`Reduced S3 costs by 50% through a two-tier caching system.`,
				`Designed and built a provisioning and communication system among servers which is horizontally scalable.`,
				`Hosting games and Auto-scaling games on game servers to provide smooth UX.`,
				`Deploying private servers for users to create a new game session where only people with invite links can join in.`,
				`Designed and developers hybrid apps for clients using React Native`,
			]
		},
		{
			tabTitle: 'AppGambit',
			url: 'https://appgambit.com/',
			title: 'AppGambit (Formerly known as JumpByte)',
			duration: 'May 2016 - Dec 2017',
			experience: [
				`Developed and maintained notification server built on top of Meteor.`,
				`Developed and Managed multiple projects on both frontend and backend.`,
				`Manually tested web apps in various browsers to ensure cross-browser compatibility.`,
				`Worked on native android app which was used for communication internally.`,
			],
		},
	];

	return (
		<Container className='my-4 px-0'>
			<Box className='d-flex'>
				<Box className='d-flex col-12 col-xl-9 px-0'>
					<Paper className='p-3 w-100'>
						<Box className='d-flex align-items-center mb-2'>
							<Hidden xlUp>
								<WorkIcon color='disabled' className='mr-2' />
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
												
												<div className='mb-1'>
													<a href={experienceDetails.url} target="__blank">
														{experienceDetails.url}
													</a>
												</div>
												
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
					<Box className='d-none d-xl-flex justify-content-center col-xl-3 py-5'>
						<WorkIcon className={classes.sectionIcon} color='disabled' />
					</Box>
				</Hidden>
			</Box>
		</Container>
	)
}