import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Tooltip from '@material-ui/core/Tooltip';
import Hidden from '@material-ui/core/Hidden';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';
import CircularProgress from '@material-ui/core/CircularProgress';

import smartCopyLogo from './assets/smart-copy.png';
import chatzzLogo from './assets/chatzz.jpg';
import lostBoxLogo from './assets/lost_box.png';
import pdpVsTsLogo from './assets/pdp_vs_ts.png';

const getAlphaChannelFromDecimal = (opacityInDecimal) => {
	const totalDivisionInAlphaChannel = 255 // FF in hex = 0 - 256 in decimal;
	const requiredDivision = opacityInDecimal * totalDivisionInAlphaChannel; // translate 0 - 1 into 0 - 255
	const compatibleHexValue = Number(requiredDivision).toString(16);

	return compatibleHexValue;
}

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction='up' ref={ref} {...props} />;
});

const useClasses = makeStyles((theme) => {
	return {
		sectionIcon: {
			transform: 'scale(10)',
		},
		paragraphSpacing: {
			marginBottom: theme.spacing(2),
		},
		buttons: {
			[theme.breakpoints.down('sm')]: {
				marginBottom: theme.spacing(2),
			},
			marginRight: theme.spacing(2),
		},
		chip: {
			marginBottom: theme.spacing(1),
			marginRight: theme.spacing(1),
		},
		icon: {
			marginRight: theme.spacing(1),
		},
		divider: {
			margin: theme.spacing(2),
		},
		projectButton: {
			'&:hover': {
				color: theme.palette.primary.main,
				borderColor: theme.palette.primary.main,
				background: theme.palette.primary.main + getAlphaChannelFromDecimal(theme.palette.action.hoverOpacity)
			},
			padding: theme.spacing(2),
			width: '100%',
			height: '100%',
			marginRight: theme.spacing(2)
		},
		projectButtonLabel: {
			textTransform: 'none',
		},
		smartCopyDemoIframe: {
			minHeight: 400,
		},
	};
});

function a11yProps(index) {
	return {
		id: `project-tab-${index}`,
	};
}

const TabPanel = (props) => {
	const { children, value, index, ...other } = props;

	return (
		<Box
			p={3}
			hidden={value !== index}
			id={`project-tabpanel-${index}`}
			{...other}
		>
			{children}
		</Box>
	);
}

export default function Projects(props) {
	const classes = useClasses();
	const theme = useTheme();
	const [state, setState] = React.useState({
		selectedTab: 0,
		smartCopyDemoModal: false,
		isSmartCopyDemoIframeLoaded: false,
	});

	const isDesktop = useMediaQuery(theme.breakpoints.up('xl'));
	const isXs = useMediaQuery(theme.breakpoints.down('sm'));

	const handleChange = (event, newValue) => {
		console.log(newValue);
		setState({
			...state,
			selectedTab: newValue,
		});
	};

	const setSmartCopyDemoModal = (isOpen) => {
		setState({
			...state,
			smartCopyDemoModal: isOpen,
			isSmartCopyDemoIframeLoaded: !isOpen,
		});
	}

	const iframeLoaded = () => {
		setState({
			...state,
			isSmartCopyDemoIframeLoaded: true,
		});
	}
	
	return (
		<Container className='mt-5 pt-5 px-0'>
			<Box className='d-flex'>
				<Hidden mdDown>
					<Box className='d-xl-flex d-none align-items-center justify-content-center col-xl-3'>
						<Icon className={classes.sectionIcon} color='disabled'>
							work
						</Icon>
					</Box>
				</Hidden>

				<Box className='px-0 col-12 col-xl-9'>
					<Box className='mb-4'>
						<Box className='d-flex align-items-center justify-content-center mb-2'>
							<Hidden mdUp>
								<Icon color='disabled' className='mr-2'>
									work
								</Icon>
							</Hidden>
							<Typography className='text-center' variant='h5'>
								Projects
							</Typography>
						</Box>

						<Paper className='w-100'>
							<Tabs
								className='border-bottom'
								variant={isDesktop ? 'fullWidth' : 'scrollable'}
								indicatorColor='primary'
								textColor='primary'
								value={state.selectedTab}
								onChange={handleChange}
							>
								<Tab
									icon={<Avatar src={smartCopyLogo} />}
									label='Smart Copy'
									{...a11yProps(0)}
								/>
								<Tab
									icon={<Avatar src={chatzzLogo} />}
									label='Chatzz'
									{...a11yProps(1)}
								/>
								<Tab
									icon={<Avatar src={lostBoxLogo} />}
									label='Lost Box'
									{...a11yProps(2)}
								/>
								<Tab
									icon={<Avatar src={pdpVsTsLogo} />}
									label='PewDiePie vs T-Series'
									{...a11yProps(3)}
								/>
							</Tabs>

							<Box>
								<TabPanel value={state.selectedTab} index={0}>
									<Typography className={classes.paragraphSpacing}>
										Smart Copy is a basic project which helps users in taking notes, I have built it using various frameworks as a starter project
									</Typography>

									<Box className='mb-4 border p-4 rounded'>
										<Typography variant='h6' className={classes.paragraphSpacing}>
											Android (Native)
										</Typography>
										<Typography className={classes.paragraphSpacing}>
											Smart Copy started from this project, in native android platform I leveraged the Android's floating window so that whenever a user double clicks on any input field in any app a dismissible floating bubble pops up which will show the list of all copied items in a floating list.
										</Typography>

										<Box>
											{
												[
													{ text: 'Android', link: 'https://www.android.com' },
													{ text: 'Java', link: 'https://www.java.com/en/' }
												].map((technology, index) => (
													<Chip
														key={index}
														color='primary'
														className={`${classes.chip} uses-internet`}
														label={technology.text}
														clickable={!!technology.link}
														onClick={() => technology.link && window.open(technology.link, '__blank')}
													/>
												))
											}
										</Box>

										<Divider className={classes.divider} />

										<Box>
											<Button
												variant='contained'
												color='primary'
												fullWidth={isXs}
												className={`${classes.buttons} uses-internet`}
												href='https://smartcopy.herokuapp.com/app/android/smart-copy-app.apk'
											>
												<Icon className={classes.icon}>get_app</Icon>
												Download
											</Button>

											<Button
												variant='contained'
												color='primary'
												fullWidth={isXs}
												className={`${classes.buttons} uses-internet`}
												onClick={() => setSmartCopyDemoModal(true)}
											>
												<Icon className={classes.icon}>play_circle_filled</Icon>
												Demo
											</Button>
										</Box>

										{
											state.smartCopyDemoModal && (
												<Dialog
													open
													TransitionComponent={Transition}
													keepMounted
													fullScreen={isXs}
													maxWidth='xl'
													onClose={() => setSmartCopyDemoModal(false)}
												>
													<DialogContent className='d-flex flex-column pb-4'>
														<Box className='d-flex align-items-start justify-content-between mb-3'>
															<Typography variant='h6'>
																Smart Copy Demo
															</Typography>

															<IconButton
																className='p-0'
																onClick={() => setSmartCopyDemoModal(false)}
															>
																<Icon>close</Icon>
															</IconButton>
														</Box>

														<Box className='flex-grow-1 d-flex justify-content-center align-items-center w-100'>
															{
																!state.isSmartCopyDemoIframeLoaded && (
																	<CircularProgress
																		className='position-absolute'
																		thickness={4}
																	/>
																)
															}

															{
																<iframe
																	title='smart-copy-demo'
																	className={`w-100 h-100 ${classes.smartCopyDemoIframe}`}
																	src='https://www.youtube.com/embed/BB-6VMgOwFc'
																	frameBorder='0'
																	allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
																	allowFullScreen
																	onLoad={iframeLoaded}
																/>
															}
														</Box>
													</DialogContent>
												</Dialog>
											)
										}
									</Box>

									<Box className='mb-4 border p-4 rounded'>
										<Typography variant='h6' className={classes.paragraphSpacing}>
											Angular App
										</Typography>
										<Typography className={classes.paragraphSpacing}>
											This is mobile responsive web companion of mobile app built using Angular v6, and it also connects to same database which means that all your items that you copy on android mobile app are now accessible in the web. I also wrote the NodeJS backend server which basically serves the data to the app.
										</Typography>

										<Box>
											{
												[
													{ text: 'Angular', link: 'https://angular.io' },
													{ text: 'Angular Material', link: 'https://material.angular.io' },
													{ text: 'NodeJS', link: 'https://nodejs.org/en/' },
													{ text: 'ExpressJS', link: 'http://expressjs.com' },
													{ text: 'MongoDB', link: 'https://www.mongodb.com' },
													{ text: 'Mongoose', link: 'https://mongoosejs.com/docs/validation.html' },
												].map((technology, index) => (
													<Chip
														key={index}
														color='primary'
														className={`${classes.chip} uses-internet`}
														label={technology.text}
														clickable={!!technology.link}
														onClick={() => technology.link && window.open(technology.link, '__blank')}
													/>
												))
											}
										</Box>

										<Divider className={classes.divider} />

										<Box>
											<Button
												variant='contained'
												color='primary'
												fullWidth={isXs}
												className={`${classes.buttons} uses-internet`}
												onClick={() => window.open('https://smartcopy.herokuapp.com', '__blank')}
											>
												<Icon className={classes.icon}>launch</Icon>
												Open
											</Button>

											<Button
												variant='contained'
												color='primary'
												fullWidth={isXs}
												className={`${classes.buttons} uses-internet`}
												onClick={() => window.open('https://github.com/NishantDesai1306/smart-copy-web-app-angular', '__blank')}
											>
												<Icon className={classes.icon}>code</Icon>
												Code
											</Button>
										</Box>
									</Box>

									<Box className='mb-4 border p-4 rounded'>
										<Typography variant='h6' className={classes.paragraphSpacing}>
											React App
										</Typography>
										<Typography className={classes.paragraphSpacing}>
											This is again another mobile responsive web companion of original smart copy mobile app, but it's built using React and it also a PWA so you can install it on your other smartphones as well as a desktop app. This app uses Firebase for file storage (Profile pictures) and Firestore as backend service to store and retrieve items.
										</Typography>

										<Box>
											{
												[
													{ text: 'ReactJS', link: 'https://reactjs.org' },
													{ text: 'Material UI', link: 'https://material-ui.com' },
													{ text: 'Firebase', link: 'https://firebase.google.com' },
													{ text: 'Work Box', link: 'https://developers.google.com/web/tools/workbox' },
												].map((technology, index) => (
													<Chip
														key={index}
														color='primary'
														className={`${classes.chip} uses-internet`}
														label={technology.text}
														clickable={!!technology.link}
														onClick={() => technology.link && window.open(technology.link, '__blank')}
													/>
												))
											}
										</Box>

										<Divider className={classes.divider} />

										<Box>
											<Button
												variant='contained'
												color='primary'
												className={`${classes.buttons} uses-internet`}
												fullWidth={isXs}
												onClick={() => window.open('https://smartcopy-195fd.web.app/login', '__blank')}
											>
												<Icon className={classes.icon}>launch</Icon>
												Open
											</Button>

											<Button
												variant='contained'
												color='primary'
												fullWidth={isXs}
												className={`${classes.buttons} uses-internet`}
												onClick={() => window.open('https://github.com/NishantDesai1306/smart-copy-web-firebase', '__blank')}
											>
												<Icon className={classes.icon}>code</Icon>
												Code
											</Button>
										</Box>
									</Box>

									<Box className='mb-4 border p-4 rounded'>
										<Typography variant='h6' className={classes.paragraphSpacing}>
											React Native
										</Typography>
										<Typography className={classes.paragraphSpacing}>
											A simple mobile app built using React Native, it supports the user accounts and shows list of items which you can edit/delete in the app. I started this project to learn more about hybrid mobile app frameworks which allows me to create same app for Android and iOS.
										</Typography>

										<Box>
											{
												[
													{ text: 'React Native', link: 'https://facebook.github.io/react-native/' },
												].map((technology, index) => (
													<Chip
														key={index}
														color='primary'
														className={`${classes.chip} uses-internet`}
														label={technology.text}
														clickable={!!technology.link}
														onClick={() => technology.link && window.open(technology.link, '__blank')}
													/>
												))
											}
										</Box>

										<Divider className={classes.divider} />

										<Box>
											<Button
												variant='contained'
												color='primary'
												fullWidth={isXs}
												className={`${classes.buttons} uses-internet`}
												onClick={() => window.open('https://github.com/NishantDesai1306/react-native-smart-copy', '__blank')}
											>
												<Icon className={classes.icon}>code</Icon>
												Code
											</Button>
										</Box>
									</Box>
								</TabPanel>

								<TabPanel value={state.selectedTab} index={1}>
									<Typography className={classes.paragraphSpacing}>
										Socket.io based chat framework that provides basic set of functions to create a chat application.
									</Typography>

									<Box>
										{
											[
												{ text: 'Socket.io', link: 'https://socket.io' },
												{ text: 'NodeJS', link: 'https://nodejs.org' }
											].map((technology, index) => (
												<Chip
													key={index}
													color='primary'
													className={`${classes.chip} uses-internet`}
													label={technology.text}
													clickable={!!technology.link}
													onClick={() => technology.link && window.open(technology.link, '__blank')}
												/>
											))
										}
									</Box>

									<Divider className={classes.divider} />

									<Box>
										<Button
											variant='contained'
											color='primary'
											className={`${classes.buttons} uses-internet`}
											fullWidth={isXs}
											onClick={() => window.open('https://github.com/NishantDesai1306/chatzz', '__blank')}
										>
											<Icon className={classes.icon}>code</Icon>
											Code
										</Button>
									</Box>
								</TabPanel>

								<TabPanel value={state.selectedTab} index={2}>
									<Typography className={classes.paragraphSpacing}>
										MEAN stack based web app which provides a platform to post missing items found near you, there's also a chat application which helps in communication between person who found the item and that item's owner.
										</Typography>
									<Box>
										{
											[
												{ text: 'MongoDB', link: 'https://mongodb.com' },
												{ text: 'ExpressJS', link: 'https://expressjs.com' },
												{ text: 'Angular', link: 'https://angular.io' },
												{ text: 'NodeJS', link: 'https://nodejs.org' },
												{ text: 'Chatzz', link: 'https://github.com/NishantDesai1306/chatzz' },
											].map((technology, index) => (
												<Chip
													key={index}
													color='primary'
													className={`${classes.chip} uses-internet`}
													label={technology.text}
													clickable={!!technology.link}
													onClick={() => technology.link && window.open(technology.link, '__blank')}
												/>
											))
										}
									</Box>

									<Divider className={classes.divider} />

									<Box>
										<Button
											variant='contained'
											color='primary'
											fullWidth={isXs}
											className={`${classes.buttons} uses-internet`}
											onClick={() => window.open('https://lost-box.herokuapp.com/login', '__blank')}
										>
											<Icon className={classes.icon}>launch</Icon>
											Open
										</Button>
										<Button
											variant='contained'
											color='primary'
											fullWidth={isXs}
											className={`${classes.buttons} uses-internet`}
											onClick={() => window.open('https://github.com/NishantDesai1306/lost-and-found', '__blank')}
										>
											<Icon className={classes.icon}>code</Icon>
											Code
										</Button>
									</Box>
								</TabPanel>

								<TabPanel value={state.selectedTab} index={3}>
									<Typography className={classes.paragraphSpacing}>
										During end of 2018 and start of 2019 a heated battle was going on between two Youtube channels PewDiePie and T-Series to get the throne of highest subscribed channel on the platform, so instead of going on youtube to get the latest subscriber score I built this mobile app which will fetch the subscriber count for those channels in real time.
									</Typography>

									<Box className='mb-4 border p-4 rounded'>
										<Typography variant='h6' className={classes.paragraphSpacing}>
											Full Version
										</Typography>
										<Typography className={classes.paragraphSpacing}>
											Full version of this app has additional features like app tour, night mode, screenshot feature, channel details and top videos of those youtube channels.
										</Typography>

										<Box>
											{
												[
													{ text: 'Flutter', link: 'https://flutter.dev' },
												].map((technology, index) => (
													<Chip
														key={index}
														color='primary'
														className={`${classes.chip} uses-internet`}
														label={technology.text}
														clickable={!!technology.link}
														onClick={() => technology.link && window.open(technology.link, '__blank')}
													/>
												))
											}
										</Box>

										<Divider className={classes.divider} />

										<Box>
											<Button
												variant='contained'
												color='primary'
												disabled
												className={`${classes.buttons} uses-internet`}
												fullWidth={isXs}
												href='https://smartcopy.herokuapp.com/app/android/smart-copy-app.apk'
											>
												<Icon className={classes.icon}>get_app</Icon>
												Download
											</Button>

											<Button
												variant='contained'
												color='primary'
												className={`${classes.buttons} uses-internet`}
												fullWidth={isXs}
												onClick={() => window.open('https://github.com/NishantDesai1306/pdp_vs_ts', '__blank')}
											>
												<Icon className={classes.icon}>code</Icon>
												Code
											</Button>
										</Box>
									</Box>

									<Box className='mb-4 border p-4 rounded'>
										<Typography variant='h6' className={classes.paragraphSpacing}>
											Lite Version (Source code less than 5kb)
										</Typography>
										<Typography className={classes.paragraphSpacing}>
											I created this lite version as it was the app that I submitted in <a href='https://flutter.dev/create' target='__blank'>Flutter Create</a> competition, the rules were simple I had to create a flutter app written with less than 5kb of dart code. It just shows the live subscriber count of PewDiePie and T-Series youtube channels.
										</Typography>

										<Box>
											{
												[
													{ text: 'Flutter', link: 'https://flutter.dev' },
												].map((technology, index) => (
													<Chip
														key={index}
														color='primary'
														className={`${classes.chip} uses-internet`}
														label={technology.text}
														clickable={!!technology.link}
														onClick={() => technology.link && window.open(technology.link, '__blank')}
													/>
												))
											}
										</Box>

										<Divider className={classes.divider} />

										<Box>
											<Button
												variant='contained'
												color='primary'
												disabled
												fullWidth={isXs}
												className={`${classes.buttons} uses-internet`}
												href='https://smartcopy.herokuapp.com/app/android/smart-copy-app.apk'
											>
												<Icon className={classes.icon}>get_app</Icon>
												Download
											</Button>

											<Button
												variant='contained'
												color='primary'
												className={`${classes.buttons} uses-internet`}
												fullWidth={isXs}
												onClick={() => window.open('https://github.com/NishantDesai1306/pdp_vs_ts_lite', '__blank')}
											>
												<Icon className={classes.icon}>code</Icon>
												Code
											</Button>
										</Box>
									</Box>
								</TabPanel>
							</Box>
						</Paper>
					</Box>

					<Box className='d-flex align-items-center justify-content-center'>
						<Paper className='w-100 p-4'>
							<Box>
								<Typography className={`mb-1 ${classes.paragraphSpacing}`}>
									Other Projects
								</Typography>
							</Box>

							<Box className='row'>
								{
									[
										{
											text: 'React Native Starter',
											link: 'https://github.com/NishantDesai1306/react-native-starter',
											description: 'Boiler plate project for React Native app',
										},
										{
											text: 'React Redux Node Starter',
											link: 'https://github.com/NishantDesai1306/react-redux-node-starter',
											description: 'Boiler plate project for MERN app with Redux store',
										},
										{
											text: 'Memory Game',
											link: 'https://memory-game-angular.herokuapp.com/game',
											description: 'Basic game in which user has to pick card of same color',
										},
										{
											text: 'MEAN5 Starter',
											link: 'https://github.com/NishantDesai1306/MEAN5-Angular-Material-Starter',
											description: 'Boiler plate project for MEAN stack with Angular 5',
										},
									].map(({ text, description, link }, index) => {
										return (
											<Box className='col-12 col-sm-6 pb-4 px-3' key={index}>
												<Tooltip title={description}>
													<Button
														classes={{
															root: `${classes.projectButton} uses-internet`,
															label: classes.projectButtonLabel
														}}
														onClick={() => window.open(link, '__blank')}
														variant='outlined'
														startIcon={<Icon>work</Icon>}
													>
														{text}
													</Button>
												</Tooltip>
											</Box>
										);
									})
								}
							</Box>
						</Paper>
					</Box>
				</Box>
			</Box>
		</Container>
	)
}