import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Link from '@material-ui/core/Link';

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
		tabs: {
			borderRight: `1px solid ${theme.palette.divider}`,
			'& .MuiTab-root': {
				minHeight: 48,
				fontWeight: 500,
				textTransform: 'none',
				fontSize: '0.95rem',
				'&.Mui-selected': {
					fontWeight: 600,
					color: theme.palette.primary.main,
				},
				'&:hover': {
					backgroundColor: theme.palette.action.hover,
				}
			},
			'& .MuiTabs-indicator': {
				backgroundColor: theme.palette.primary.main,
			}
		},
		horizontalTabs: {
			borderBottom: `1px solid ${theme.palette.divider}`,
			marginBottom: theme.spacing(3),
			'& .MuiTab-root': {
				minHeight: 48,
				fontWeight: 500,
				textTransform: 'none',
				fontSize: '0.95rem',
				'&.Mui-selected': {
					fontWeight: 600,
					color: theme.palette.primary.main,
				},
				'&:hover': {
					backgroundColor: theme.palette.action.hover,
				}
			},
			'& .MuiTabs-indicator': {
				backgroundColor: theme.palette.primary.main,
			}
		},
		jobTitle: {
			fontWeight: 600,
			fontSize: '1.25rem',
			marginBottom: theme.spacing(1),
			color: theme.palette.text.primary,
		},
		companyLink: {
			color: theme.palette.primary.main,
			textDecoration: 'none',
			fontWeight: 500,
			'&:hover': {
				textDecoration: 'underline',
			}
		},
		duration: {
			color: theme.palette.text.secondary,
			fontSize: '0.9rem',
			marginBottom: theme.spacing(2),
			fontWeight: 500,
		},
		experienceList: {
			'& .MuiListItem-root': {
				paddingLeft: 0,
				paddingRight: 0,
				'&:hover': {
					backgroundColor: 'transparent',
				}
			},
			'& .MuiListItemText-primary': {
				fontSize: '0.95rem',
				lineHeight: 1.6,
				color: theme.palette.text.primary,
				marginBottom: theme.spacing(0.5),
			},
			'& .MuiListItemText-secondary': {
				fontSize: '0.9rem',
				lineHeight: 1.5,
				color: theme.palette.text.secondary,
				'& ol': {
					margin: theme.spacing(1, 0),
					paddingLeft: theme.spacing(3),
					'& li': {
						marginBottom: theme.spacing(0.5),
					}
				}
			}
		},
		tabPanel: {
			padding: theme.spacing(0, 3),
		}
	};
});

function a11yProps(index) {
	return {
		id: `vertical-tab-${index}`,
		'aria-controls': `vertical-tabpanel-${index}`,
	};
}

function TabPanel(props) {
	const { children, value, index, classes } = props;

	return (
		<Typography
			component='div'
			role='tabpanel'
			hidden={value !== index}
			id={`vertical-tabpanel-${index}`}
			aria-labelledby={`vertical-tab-${index}`}
			className={classes.tabPanel}
		>
			{children}
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
				`Streamlined implementation of Google Ads, eliminated cases when google would serve empty ads.`,
				`Lead migration of Material UI from v4 to v5`,
				`Helped in migration from pages router to app router in NextJS`,
				{
					main: `Improved overall performance and vitals of the application by carefully optimizing the codebase over months.`,
					subPoints: [
						'Mobile: Increased Increased "Good" URLs by 197% and reduced "Poor" URLs by 96% on Mobile.',
						'Desktop: Increased "Good" URLs by 168% and reduced "Poor" URLs by 21% on Desktop.',
					]
				}
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
		<Container className='my-5 px-0'>
			<Box className='row m-0'>
				<Box className='col-12 px-0'>
					<Paper className={classes.paper}>
						<Typography variant='h4' className={classes.sectionTitle}>
							Experience
						</Typography>

						<Box className={`row m-0 ${isDesktop ? 'flex-row' : 'flex-column'}`}>
							<Box className='col-12 col-lg-3'>
								<Tabs
									orientation={isDesktop ? 'vertical' : 'horizontal'}
									variant='scrollable'
									indicatorColor='primary'
									value={activeTabIndex}
									onChange={(e, newTabIndex) => setActiveTabIndex(newTabIndex)}
									aria-label='Experience'
									className={isDesktop ? classes.tabs : classes.horizontalTabs}
								>
									{
										experience.map((experienceDetails, index) => (
											<Tab key={index} label={experienceDetails.tabTitle} {...a11yProps(index)} />
										))
									}
								</Tabs>
							</Box>

							<Box className='col-12 col-lg-9'>
								{
									experience.map((experienceDetails, index) => {
										return (
											<TabPanel value={activeTabIndex} index={index} key={index} classes={classes}>
												<Typography className={classes.jobTitle}>
													{experienceDetails.title}
												</Typography>
												
												<Link 
													href={experienceDetails.url} 
													target="_blank" 
													rel="noopener noreferrer"
													className={classes.companyLink}
												>
													{experienceDetails.url}
												</Link>
												
												<Typography className={classes.duration}>
													{experienceDetails.duration}
												</Typography>

												<List component='nav' aria-label='main experience work' className={classes.experienceList}>
													{
														experienceDetails.experience.map((experienceDescription, index) => {
															if (experienceDescription.main) {
																return (
																	<ListItem key={index}>
																		<ListItemText
																			primary={experienceDescription.main}
																			secondary={(
																				<ol>
																					{
																						experienceDescription.subPoints.map((subPoint, index) => (
																							<li key={index}>{subPoint}</li>
																						))
																					}
																				</ol>
																			)}
																		/>
																	</ListItem>
																)
															}
															
															return (
																<ListItem key={index}>
																	<ListItemText
																		primary={experienceDescription}
																	/>
																</ListItem>
															)
														})
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
			</Box>
		</Container>
	)
}