import React, { useEffect, useRef, useState } from 'react';

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
import { register } from './serviceWorkerRegistration';

const useStyles = makeStyles((theme) => {
  return {
    introductionContainer: {
      background: theme.palette.primary.main,
      color: theme.palette.secondary.contrastText,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      marginBottom: theme.spacing(3),
    },
    introductionContainerHeightXlUp: {
      minHeight: 'min(100vh, 900px)',
    },
    introductionContainerHeightMdDown: {
      minHeight: 0,
    },
    sectionContainer: {
      width: '80%',
      display: 'flex',
      alignItems: 'center',
      scrollMarginTop: theme.spacing(10),
      [theme.breakpoints.down('sm')]: {
        width: 'calc(100% - 32px)',
      },
    },

  }
});

export default function App() {
  const classes = useStyles();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [updateWorker, setUpdateWorker] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const removeUpdateListener = useRef(() => {});
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('xl'));

  useEffect(() => {
    let mounted = true;
    register({
      onUpdate: registration => {
        if (mounted && registration.waiting) setUpdateWorker(registration.waiting);
      },
    });
    return () => {
      mounted = false;
      removeUpdateListener.current();
    };
  }, []);

  const downloadUpdate = () => {
    if (!updateWorker || isUpdating) return;
    // Another open tab may have activated the worker since we offered it.
    if (updateWorker.state === 'activated') {
      window.location.reload();
      return;
    }
    if (updateWorker.state === 'redundant') {
      setUpdateWorker(null);
      return;
    }
    setIsUpdating(true);
    const onStateChange = () => {
      if (updateWorker.state === 'activated') {
        removeUpdateListener.current();
        window.location.reload();
      } else if (updateWorker.state === 'redundant') {
        removeUpdateListener.current();
        setIsUpdating(false);
        setUpdateWorker(null);
      }
    };
    removeUpdateListener.current = () => updateWorker.removeEventListener('statechange', onStateChange);
    updateWorker.addEventListener('statechange', onStateChange);
    updateWorker.postMessage({ type: 'SKIP_WAITING' });
  };

  return (
    <div className='d-flex flex-column align-items-center bootstrap-wrapper'>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={!!updateWorker}
        onClose={(event, reason) => {
          if (reason !== 'clickaway' && !isUpdating) setUpdateWorker(null);
        }}
        message="Update available"
        action={
          <React.Fragment>
            <Button color="inherit" size="small" disabled={isUpdating} onClick={downloadUpdate}>
              {isUpdating ? 'Updating…' : 'Update now'}
            </Button>
            <IconButton size="small" aria-label="Dismiss update" color="inherit" disabled={isUpdating} onClick={() => setUpdateWorker(null)}>
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

      <main id='main-content' tabIndex={-1} className='w-100 d-flex flex-column align-items-center'>
        <div className={`${classes.introductionContainer} ${isDesktop ? classes.introductionContainerHeightXlUp : classes.introductionContainerHeightMdDown}`}>
          <Toolbar className='dummy-placeholder' />
          <Introduction />
        </div>

        <div className={classes.sectionContainer} id='about-me' tabIndex={-1}>
          <AboutMe />
        </div>

        <div className={classes.sectionContainer} id='experience' tabIndex={-1}>
          <Experience />
        </div>

        <div className={classes.sectionContainer} id='projects' tabIndex={-1}>
          <Projects />
        </div>

        <div className={classes.sectionContainer} id='contact-me' tabIndex={-1}>
          <ContactMe />
        </div>
      </main>

      <Hidden xlUp>
        <ResumeFab />
      </Hidden>      
    </div>
  );
}
