import React, { useRef } from 'react';

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
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';
import CircularProgress from '@material-ui/core/CircularProgress';
import CodeIcon from '@material-ui/icons/Code';
import CloseIcon from '@material-ui/icons/Close';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';

import smartCopyLogo from './assets/smart-copy.png';
import chatzzLogo from './assets/chatzz.jpg';
import flutterLogo from './assets/flutter.png';
import chessLogo from './assets/chess.webp';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction='up' ref={ref} {...props} />;
});

const useTechnologyChipClasses = makeStyles((theme) => {
	return {
		chip: {
			marginBottom: theme.spacing(1),
			marginRight: theme.spacing(1),
			fontWeight: 500,
			'&:hover': {
				transform: 'translateY(-1px)',
				boxShadow: theme.shadows[4],
				transition: 'all 0.2s ease-in-out',
			}
		},
	}
});
const TechnologyChip = ({ text, link }) => {
	const classes = useTechnologyChipClasses();

	return (
		<Chip
			color='primary'
			variant='outlined'
			className={`${classes.chip} uses-internet`}
			label={text}
			clickable={!!link}
			role={undefined}
			component={link ? 'a' : 'div'}
			href={link}
			target={link ? '_blank' : undefined}
			rel={link ? 'noopener noreferrer' : undefined}
		/>
	)
}

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
			[theme.breakpoints.down('sm')]: { padding: theme.spacing(2) },
			borderRadius: 12,
			boxShadow: theme.shadows[2],
			'&:hover': {
				boxShadow: theme.shadows[4],
				transition: 'box-shadow 0.3s ease-in-out',
			}
		},
		otherProjectsPaper: {
			padding: theme.spacing(4),
			borderRadius: 12,
			boxShadow: theme.shadows[2],
			'&:hover': {
				boxShadow: theme.shadows[4],
				transition: 'box-shadow 0.3s ease-in-out',
			}
		},
		paragraphSpacing: {
			marginBottom: theme.spacing(2),
			lineHeight: 1.7,
			color: theme.palette.text.primary,
		},
		buttons: {
			[theme.breakpoints.down('sm')]: {
				marginBottom: theme.spacing(2),
			},
			marginRight: theme.spacing(2),
			textTransform: 'none',
			fontWeight: 500,
		},
		icon: {
			marginRight: theme.spacing(1),
		},
		divider: {
			margin: theme.spacing(2),
		},
		smartCopyDemoIframe: {
			minHeight: 'min(60vh, 480px)',
			border: 0,
		},
		youtubeChannelWarDemoIframe: {
			minHeight: 'min(70vh, 600px)',
			minWidth: 0,
			border: 0,
		},
		projectSection: {
			border: `1px solid ${theme.palette.divider}`,
			borderRadius: 8,
			padding: theme.spacing(3),
			[theme.breakpoints.down('sm')]: { padding: theme.spacing(2) },
			marginBottom: theme.spacing(3),
			backgroundColor: theme.palette.background.paper,
		},
		projectTitle: {
			fontWeight: 600,
			fontSize: '1.1rem',
			marginBottom: theme.spacing(2),
			color: theme.palette.text.primary,
		},
		tabs: {
			borderBottom: `1px solid ${theme.palette.divider}`,
			marginBottom: theme.spacing(3),
			'& .MuiTab-root': {
				minHeight: 64,
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
		otherProjectsTitle: {
			fontWeight: 600,
			marginBottom: theme.spacing(3),
			color: theme.palette.text.primary,
		}
	};
});

function a11yProps(index) {
	return {
		id: `project-tab-${index}`,
		'aria-controls': `project-tabpanel-${index}`,
	};
}

const TabPanel = (props) => {
	const { children, value, index, ...other } = props;

	return (
		<Box
			p={{ xs: 0, md: 3 }}
			hidden={value !== index}
			id={`project-tabpanel-${index}`}
			role='tabpanel'
			aria-labelledby={`project-tab-${index}`}
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
				{ text: 'ExpressJS', link: 'https://expressjs.com' },
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
	
	const isDesktop = useMediaQuery(theme.breakpoints.up('xl'));
	const isXs = useMediaQuery(theme.breakpoints.down('sm'));

	const handleChange = (event, newValue) => {

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
		<Container className='my-5 px-0'>
			<Box className='row m-0'>
				<Box className='col-12 px-0'>
					<Paper className={classes.paper}>
						<Typography variant='h4' component='h2' className={classes.sectionTitle}>
							Projects
						</Typography>
						
						<Tabs
							aria-label='Projects'
							className={classes.tabs}
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
								{...a11yProps(3)}
							/>
						</Tabs>

						<Box>
							<TabPanel value={state.selectedTab} index={0}>
								<Typography className={classes.paragraphSpacing}>
									Smart Copy explores one problem across native and cross-platform apps: keeping copied text and notes accessible wherever you work. I built Android, Angular, React, and React Native implementations, including a Node.js backend and a Firebase-backed PWA.
								</Typography>

								<Box className={classes.projectSection}>
									<Typography className={classes.projectTitle}>
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
												aria-labelledby='smart-copy-demo-title'
											>
												<DialogContent className='d-flex flex-column pb-4'>
													<Box className='d-flex align-items-start justify-content-between mb-3'>
														<Typography variant='h6' component='h3' id='smart-copy-demo-title'>
															Smart Copy Demo
														</Typography>

														<IconButton
															onClick={() => setSmartCopyDemoModal(false)}
															aria-label='Close demo'
														>
															<CloseIcon />
														</IconButton>
													</Box>

													<Button component='a' href='https://www.youtube.com/watch?v=BB-6VMgOwFc' target='_blank' rel='noopener noreferrer'>
														Video not loading? Watch on YouTube
													</Button>

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

								<Box className={classes.projectSection}>
									<Typography className={classes.projectTitle}>
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
								</Box>

								<Box className={classes.projectSection}>
									<Typography className={classes.projectTitle}>
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
								</Box>

								<Box className={classes.projectSection}>
									<Typography className={classes.projectTitle}>
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
											href='https://github.com/NishantDesai1306/react-native-smart-copy'
											target='_blank'
											rel='noopener noreferrer'
										>
											<CodeIcon className={classes.icon} />
											Code
										</Button>
									</Box>
								</Box>
							</TabPanel>

							<TabPanel value={state.selectedTab} index={1}>
								<Typography className={classes.paragraphSpacing}>
									Chatzz is a Socket.io-based chat framework: a reusable Node.js foundation for adding real-time messaging to a chat application.
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
										href='https://github.com/NishantDesai1306/chatzz'
										target='_blank'
										rel='noopener noreferrer'
									>
										<CodeIcon className={classes.icon} />
										Code
									</Button>
								</Box>
							</TabPanel>

							<TabPanel value={state.selectedTab} index={2}>
								<Typography className={classes.paragraphSpacing}>
									A chess application built with React and Node.js. I integrated Stockfish 15 to show a position evaluation bar alongside the board, combining a focused interface with chess-engine feedback.
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
										href='https://github.com/NishantDesai1306/chess'
										target='_blank'
										rel='noopener noreferrer'
									>
										<CodeIcon className={classes.icon} />
										Code
									</Button>
								</Box>
							</TabPanel>

							<TabPanel value={state.selectedTab} index={3}>
								<Typography className={classes.paragraphSpacing}>
									YouTube Subscriber Counter
								</Typography>

								<Box className={classes.projectSection}>
									<Typography className={classes.paragraphSpacing}>
										A cross-platform Flutter app for comparing the subscriber counts of two YouTube channels, exploring a shared mobile UI framework.
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
											href='https://github.com/NishantDesai1306/youtube_channel_sub_counter/tree/master'
											target='_blank'
											rel='noopener noreferrer'
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
												aria-labelledby='youtube-demo-title'
											>
												<DialogContent className='d-flex flex-column pb-4'>
													<Box className='d-flex align-items-start justify-content-between mb-3'>
														<Typography variant='h6' component='h3' id='youtube-demo-title'>
															Youtube Channel War Demo
														</Typography>

														<IconButton
															onClick={() => setYoutubeChannelWarDemoModal(false)}
															aria-label='Close demo'
														>
															<CloseIcon />
														</IconButton>
													</Box>

													<Button component='a' href='https://www.youtube.com/watch?v=RwFfTf3dJww' target='_blank' rel='noopener noreferrer'>
														Video not loading? Watch on YouTube
													</Button>

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
			</Box>
		</Container>
	)
}