import React, { useCallback, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import Hidden from '@material-ui/core/Hidden';
import CloseIcon from '@material-ui/icons/Close';

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
      flexDirection: 'column',
      marginBottom: theme.spacing(10),
    },
    introductionContainerHeightXlUp: {
      height: '100vh',
    },
    introductionContainerHeightMdDown: {
      minHeight: '100vh',
    },
    sectionContainer: {
      width: '80%',
      display: 'flex',
      alignItems: 'center',
    },
    updateButton: {
      position: 'fixed',
      bottom: 10,
      left: 20,
      zIndex: theme.zIndex.mobileStepper + 1
    },
  }
});

export default function App() {
  const classes = useStyles();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hideUpdateNotification, setHideUpdateNotification] = useState(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('xl'));

  const downloadUpdate = useCallback(() => {
    const registrationWaiting = window.deferredUpdate && window.deferredUpdate.waiting;
    if (registrationWaiting) {
      registrationWaiting.postMessage({ type: 'SKIP_WAITING' });
      registrationWaiting.addEventListener('statechange', e => {
        if (e.target.state === 'activated') {
          window.location.reload();
        }
      });
    }
  }, []);

  return (
    <div className='d-flex flex-column align-items-center bootstrap-wrapper'>
      <Snackbar
        id='app-update'
        className='d-none'
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={!hideUpdateNotification}
        onClose={() => setHideUpdateNotification(true)}
        message="Update available"
        action={
          <React.Fragment>
            <Button color="secondary" size="small" onClick={() => downloadUpdate()}>
              Download
            </Button>
            <IconButton size="small" aria-label="close" color="inherit" onClick={() => setHideUpdateNotification(true)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />

      <div className='flex-grow-0 w-100'>
        <AppBar
          onOpenSideDrawer={() => setIsDrawerOpen(true)}
        />

        <SideDrawer
          isDrawerOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
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
