import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import Hidden from '@material-ui/core/Hidden';

import SideDrawer from './SideDrawer';
import AppBar from './AppBar';
import Introduction from './Introduction';
import AboutMe from './AboutMe';
import Experience from './Experience';
import Projects from './Projects';
import ContactMe from './ContactMe';
import ResumeFab from './Fab';

const useStyles = makeStyles((theme) => {
  return {
    introductionContainer: {
      background: theme.palette.primary.main,
      color: theme.palette.secondary.contrastText,
      width: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    introductionContainerHeightXlUp: {
      height: '80vh',
    },
    introductionContainerHeightMdDown: {
      minHeight: '100vh',
    },
    sectionContainer: {
      width: '80%',
      display: 'flex',
      alignItems: 'center',
      minHeight: '100vh',
    },
    updateButton: {
      position: 'fixed',
      bottom: 10,
      left: 20,
      zIndex: theme.zIndex.mobileStepper + 1
    },
  }
});

const initialState = {
  isDrawerOpen: false,
};

export default function App() {
  const classes = useStyles();
  const [state, setState] = React.useState(initialState);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('xl'));

  const toggleDrawer = (isDrawerOpen) => {
    setState({
      isDrawerOpen
    });
  }

  return (
    <div className='d-flex flex-column align-items-center bootstrap-wrapper'>
      <Tooltip title='Update'>
        <Fab
          id='app-update'
          color='secondary'
          className={`${classes.updateButton} d-none`}
        >
          <Icon>get_app</Icon>
        </Fab>
      </Tooltip>

      <div className='flex-grow-0 w-100'>
        <AppBar
          onOpenSideDrawer={() => toggleDrawer(true)}
        />

        <SideDrawer
          isDrawerOpen={state.isDrawerOpen}
          onClose={() => toggleDrawer(false)}
        />
      </div>

      <div className={`${classes.introductionContainer} ${isDesktop ? classes.introductionContainerHeightXlUp : classes.introductionContainerHeightMdDown}`}>
        <Toolbar className='dummy-placeholder' />
        <Introduction />
      </div>
      
      <div className={classes.sectionContainer} id='about-me'>
        <AboutMe />
      </div>

      <div className={classes.sectionContainer} id='experience'>
        <Experience />
      </div>

      <div className={classes.sectionContainer} id='projects'>
        <Projects />
      </div>
      
      <div className={classes.sectionContainer} id='contact-me'>
        <ContactMe />
      </div>

      <Hidden xlUp>
        <ResumeFab />
      </Hidden>      
    </div>
  );
}
