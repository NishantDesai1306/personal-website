import React, { useRef } from 'react';

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
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
import CodeIcon from '@material-ui/icons/Code';
import GetAppIcon from '@material-ui/icons/GetApp';
import CloseIcon from '@material-ui/icons/Close';
import LaunchIcon from '@material-ui/icons/Launch';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';

import smartCopyLogo from './assets/smart-copy.png';
import chatzzLogo from './assets/chatzz.jpg';
import flutterLogo from './assets/flutter.png';
import chessLogo from './assets/chess.jpg';

const getAlphaChannelFromDecimal = (opacityInDecimal) => {
	const totalDivisionInAlphaChannel = 255 // FF in hex = 0 - 256 in decimal;
	const requiredDivision = opacityInDecimal * totalDivisionInAlphaChannel; // translate 0 - 1 into 0 - 255
	const compatibleHexValue = Number(requiredDivision).toString(16);

	return compatibleHexValue;
}

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction='up' ref={ref} {...props} />;
});

const useTechnologyChipClasses = makeStyles((theme) => {
	return {
		chip: {
			marginBottom: theme.spacing(1),
			marginRight: theme.spacing(1),
		},
	}
});
const TechnologyChip = ({ text, link }) => {
	const classes = useTechnologyChipClasses();

	return (
		<Chip
			color='primary'
			className={`${classes.chip} uses-internet`}
			label={text}
			clickable={!!link}
			onClick={() => link && window.open(link, '__blank')}
		/>
	)
}

const useOtherProjectButtonClasses = makeStyles((theme) => {
	return {
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
	}
});
const OtherProjectButton = ({ text, link, description }) => {
	const classes = useOtherProjectButtonClasses();

	return (
		<Box className='col-12 col-sm-6 pb-4 px-3'>
			<Tooltip title={description}>
				<Button
					classes={{
						root: `${classes.projectButton} uses-internet`,
						label: classes.projectButtonLabel
					}}
					onClick={() => window.open(link, '__blank')}
					variant='outlined'
					startIcon={<CodeIcon />}
				>
					{text}
				</Button>
			</Tooltip>
		</Box>
	)
};

const useClasses = makeStyles((theme) => {
	return {
		sectionIcon: {
			transform: 'scale(10)',
			position: 'sticky',
			top: 155,
			marginTop: -35,
			marginBottom: -35,
		},
		iconContainer: {
			padding: '90px 0',
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
		icon: {
			marginRight: theme.spacing(1),
		},
		divider: {
			margin: theme.spacing(2),
		},
		smartCopyDemoIframe: {
			minHeight: 400,
		},
		youtubeChannelWarDemoIframe: {
			minHeight: 800,
			minWidth: 500,
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
		youtubeChannelWarDemoModal: false,
		isYoutubeChannelWarDemoIframeLoaded: false,
	});
	const technologiesUsed = useRef({
		smartCopy: {
			nativeAndroid: [
				{ text: 'Android', link: 'https://www.android.com' },
				{ text: 'Java', link: 'https://www.java.com/en/' }
			],
			angularApp: [
				{ text: 'Angular', link: 'https://angular.io' },
				{ text: 'Angular Material', link: 'https://material.angular.io' },
				{ text: 'NodeJS', link: 'https://nodejs.org/en/' },
				{ text: 'ExpressJS', link: 'http://expressjs.com' },
				{ text: 'MongoDB', link: 'https://www.mongodb.com' },
				{ text: 'Mongoose', link: 'https://mongoosejs.com/docs/validation.html' },
			],
			reactApp: [
				{ text: 'React', link: 'https://reactjs.org' },
				{ text: 'Material UI', link: 'https://material-ui.com' },
				{ text: 'Firebase', link: 'https://firebase.google.com' },
				{ text: 'Work Box', link: 'https://developers.google.com/web/tools/workbox' },
			],
			reactNative: [
				{ text: 'React Native', link: 'https://facebook.github.io/react-native/' },
			]
		},
		chatzz: {
			app: [
				{ text: 'Socket.io', link: 'https://socket.io' },
				{ text: 'NodeJS', link: 'https://nodejs.org' }
			],
		},
		chess: {
			app: [
				{ text: 'NodeJS', link: 'https://nodejs.org' },
				{ text: 'React', link: 'https://reactjs.org' },
				{ text: 'Bootstrap', link: 'https://getbootstrap.com' },
			],
		},
		youtubeSubscriberCounter: {
			app: [
				{ text: 'Flutter', link: 'https://flutter.dev' },
			],
		},
	});
	const otherProjects = useRef([
		{
			text: 'Yarn cost calculator',
			link: 'https://github.com/NishantDesai1306/yarn-cost-calculator',
			description: 'Small Progress web app used for calculating overall cost at yarn mill.',
		},
		{
			text: 'NextJS Supabase boilerplate',
			link: 'https://github.com/NishantDesai1306/nextjs-supabase-contact-list',
			description: 'Boiler plate project for NextJS app and Supabase',
		},
	]);

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

	const setYoutubeChannelWarDemoModal = (isOpen) => {
		setState({
			...state,
			youtubeChannelWarDemoModal: isOpen,
			isYoutubeChannelWarDemoIframeLoaded: !isOpen,
		});
	}

	const onSmartCopyDemoIframeLoaded = () => {
		setState({
			...state,
			isSmartCopyDemoIframeLoaded: true,
		});
	}
	const onYoutubeChannelWarDemoIframeLoaded = () => {
		setState({
			...state,
			isYoutubeChannelWarDemoIframeLoaded: true,
		});
	}
	
	return (
		<Container className='mt-4 px-0'>
			<Box className='d-flex'>
				<Hidden mdDown>
					<Box className={clsx('d-xl-flex d-none justify-content-center col-xl-3', classes.iconContainer)}>
						<CodeIcon className={classes.sectionIcon} color='disabled' />
					</Box>
				</Hidden>

				<Box className='px-0 col-12 col-xl-9'>
					<Box className='mb-4'>
						<Paper className='w-100'>
							<Box className='d-flex align-items-center justify-content-start px-4 mb-2 pt-4'>
								<Hidden mdUp>
									<CodeIcon color='disabled' className='mr-2' />
								</Hidden>
								<Typography className='text-center' variant='h5'>
									Projects
								</Typography>
							</Box>
							
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
									icon={<Avatar src={chessLogo} />}
									label='Chess'
									{...a11yProps(2)}
								/>
								<Tab
									icon={<Avatar src={flutterLogo} />}
									label='YT Sub counter'
									{...a11yProps(4)}
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
												technologiesUsed.current.smartCopy.nativeAndroid.map(({ text, link, }, index) => (
													<TechnologyChip
														key={index}
														text={text}
														link={link}
													/>
												))
											}
										</Box>

										<Divider className={classes.divider} />

										<Box>
											{/* <Button
												variant='contained'
												color='primary'
												fullWidth={isXs}
												className={`${classes.buttons} uses-internet`}
												href='https://smartcopy.herokuapp.com/app/android/smart-copy-app.apk'
											>
												<GetAppIcon className={classes.icon} />
												Download
											</Button> */}

											<Button
												variant='contained'
												color='primary'
												fullWidth={isXs}
												className={`${classes.buttons} uses-internet`}
												onClick={() => setSmartCopyDemoModal(true)}
											>
												<PlayCircleFilledIcon className={classes.icon} />
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
																<CloseIcon />
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
																	onLoad={onSmartCopyDemoIframeLoaded}
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
												technologiesUsed.current.smartCopy.angularApp.map(({ text, link, }, index) => (
													<TechnologyChip
														key={index}
														text={text}
														link={link}
													/>
												))
											}
										</Box>

										{/* <Divider className={classes.divider} />

										<Box>
											<Button
												variant='contained'
												color='primary'
												fullWidth={isXs}
												className={`${classes.buttons} uses-internet`}
												onClick={() => window.open('https://smartcopy.herokuapp.com', '__blank')}
											>
												<LaunchIcon className={classes.icon} />
												Open
											</Button>

											<Button
												variant='contained'
												color='primary'
												fullWidth={isXs}
												className={`${classes.buttons} uses-internet`}
												onClick={() => window.open('https://github.com/NishantDesai1306/smart-copy-web-app-angular', '__blank')}
											>
												<CodeIcon className={classes.icon} />
												Code
											</Button>
										</Box> */}
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
												technologiesUsed.current.smartCopy.reactApp.map(({ text, link, }, index) => (
													<TechnologyChip
														key={index}
														text={text}
														link={link}
													/>
												))
											}
										</Box>

										{/* <Divider className={classes.divider} />

										<Box>
											<Button
												variant='contained'
												color='primary'
												className={`${classes.buttons} uses-internet`}
												fullWidth={isXs}
												onClick={() => window.open('https://smartcopy-195fd.web.app/login', '__blank')}
											>
												<LaunchIcon className={classes.icon} />
												Open
											</Button>

											<Button
												variant='contained'
												color='primary'
												fullWidth={isXs}
												className={`${classes.buttons} uses-internet`}
												onClick={() => window.open('https://github.com/NishantDesai1306/smart-copy-web-firebase', '__blank')}
											>
												<CodeIcon className={classes.icon} />
												Code
											</Button>
										</Box> */}
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
												technologiesUsed.current.smartCopy.reactNative.map(({ text, link, }, index) => (
													<TechnologyChip
														key={index}
														text={text}
														link={link}
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
												<CodeIcon className={classes.icon} />
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
											technologiesUsed.current.chatzz.app.map(({ text, link, }, index) => (
												<TechnologyChip
													key={index}
													text={text}
													link={link}
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
											<CodeIcon className={classes.icon} />
											Code
										</Button>
									</Box>
								</TabPanel>

								<TabPanel value={state.selectedTab} index={2}>
									<Typography className={classes.paragraphSpacing}>
										Simple chess app with clean UI with chess engine (Stockfish 15) based eval bar.
									</Typography>

									<Box>
										{
											technologiesUsed.current.chess.app.map(({ text, link, }, index) => (
												<TechnologyChip
													key={index}
													text={text}
													link={link}
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
											onClick={() => window.open('https://github.com/NishantDesai1306/chess', '__blank')}
										>
											<CodeIcon className={classes.icon} />
											Code
										</Button>
									</Box>
								</TabPanel>

								<TabPanel value={state.selectedTab} index={3}>
									<Typography className={classes.paragraphSpacing}>
										Youtube Subscriber counter	
									</Typography>

									<Box className='mb-4 border p-4 rounded'>
										<Typography className={classes.paragraphSpacing}>
											This is a cross platform app built using Flutter, it allows user to compare two youtube channels based on their subscribers count.
										</Typography>

										<Box>
											{
												technologiesUsed.current.youtubeSubscriberCounter.app.map(({ text, link, }, index) => (
													<TechnologyChip
														key={index}
														text={text}
														link={link}
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
												onClick={() => setYoutubeChannelWarDemoModal(true)}
											>
												<PlayCircleFilledIcon className={classes.icon} />
												Demo
											</Button>

											<Button
												variant='contained'
												color='primary'
												className={`${classes.buttons} uses-internet`}
												fullWidth={isXs}
												onClick={() => window.open('https://github.com/NishantDesai1306/youtube_channel_sub_counter/tree/master', '__blank')}
											>
												<CodeIcon className={classes.icon} />
												Code
											</Button>
										</Box>

										{
											state.youtubeChannelWarDemoModal && (
												<Dialog
													open
													TransitionComponent={Transition}
													keepMounted
													fullScreen={isXs}
													maxWidth='xl'
													onClose={() => setYoutubeChannelWarDemoModal(false)}
												>
													<DialogContent className='d-flex flex-column pb-4'>
														<Box className='d-flex align-items-start justify-content-between mb-3'>
															<Typography variant='h6'>
																Youtube Channel War Demo
															</Typography>

															<IconButton
																className='p-0'
																onClick={() => setYoutubeChannelWarDemoModal(false)}
															>
																<CloseIcon />
															</IconButton>
														</Box>

														<Box className='flex-grow-1 d-flex justify-content-center align-items-center w-100'>
															{
																!state.isYoutubeChannelWarDemoIframeLoaded && (
																	<CircularProgress
																		className='position-absolute'
																		thickness={4}
																	/>
																)
															}

															<iframe
																title='youtube-channel-war-demo'
																className={`w-100 h-100 ${classes.youtubeChannelWarDemoIframe}`}
																src='https://www.youtube.com/embed/RwFfTf3dJww'
																frameBorder='0'
																allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
																allowFullScreen
																onLoad={onYoutubeChannelWarDemoIframeLoaded}
															/>
														</Box>
													</DialogContent>
												</Dialog>
											)
										}
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
									otherProjects.current.map(({ text, link, description, }, index) => (
										<OtherProjectButton
											key={index}
											text={text}
											link={link}
											description={description}
										/>
									))
								}
							</Box>
						</Paper>
					</Box>
				</Box>
			</Box>
		</Container>
	)
}