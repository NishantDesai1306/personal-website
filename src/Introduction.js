import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

import ownerImage from "./assets/owner.png";
import constants from "./constant";

const useStyles = makeStyles((theme) => {
  return {
    container: {
      height: '100vh',
      maxWidth: '100vw',
      overflowX: 'hidden',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 90% 90%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)`,
        pointerEvents: 'none',
        zIndex: 1,
      }
    },
    content: {
      position: 'relative',
      zIndex: 2,
      height: '100%',
      display: 'flex',
      alignItems: 'center',
    },
    profileSection: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    profilePicture: {
      height: 280,
      width: 280,
      border: `4px solid ${theme.palette.background.paper}`,
      boxShadow: theme.shadows[8],
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      '&:hover': {
        transform: 'scale(1.03) rotate(2deg)',
        boxShadow: `0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)`,
        filter: 'brightness(1.1)',
      }
    },
    textSection: {
      paddingLeft: theme.spacing(4),
      [theme.breakpoints.down('md')]: {
        paddingLeft: 0,
        paddingTop: theme.spacing(4),
        textAlign: 'center',
      }
    },
    greeting: {
      fontSize: '1.2rem',
      fontWeight: 500,
      color: '#ffffff',
      marginBottom: theme.spacing(1),
      opacity: 0.9,
      transition: 'all 0.3s ease',
      '&:hover': {
        opacity: 1,
        transform: 'translateX(5px)',
      }
    },
    name: {
      fontSize: '3.5rem',
      fontWeight: 700,
      color: '#ffffff',
      marginBottom: theme.spacing(2),
      lineHeight: 1.1,
      transition: 'all 0.3s ease',
      cursor: 'default',
      '&:hover': {
        textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
        transform: 'scale(1.02)',
      },
      [theme.breakpoints.down('md')]: {
        fontSize: '2.8rem',
      },
      [theme.breakpoints.down('sm')]: {
        fontSize: '2.2rem',
      }
    },
    title: {
      fontSize: '1.8rem',
      fontWeight: 600,
      color: theme.palette.text.primary,
      marginBottom: theme.spacing(2),
      lineHeight: 1.3,
      [theme.breakpoints.down('md')]: {
        fontSize: '1.5rem',
      },
      [theme.breakpoints.down('sm')]: {
        fontSize: '1.3rem',
      }
    },
    description: {
      fontSize: '1.1rem',
      lineHeight: 1.7,
      color: theme.palette.text.secondary,
      marginBottom: theme.spacing(3),
      maxWidth: '500px',
      [theme.breakpoints.down('md')]: {
        maxWidth: '100%',
      }
    },
    skillsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: theme.spacing(1),
      marginTop: theme.spacing(2),
      [theme.breakpoints.down('md')]: {
        justifyContent: 'center',
      }
    },
    skillChip: {
      fontWeight: 500,
      fontSize: '0.9rem',
      color: '#ffffff',
      borderColor: '#ffffff',
      '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: theme.shadows[4],
        transition: 'all 0.2s ease-in-out',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      }
    },
    accentLine: {
      width: 60,
      height: 4,
      background: '#ffffff',
      borderRadius: 2,
      marginBottom: theme.spacing(3),
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      '&:hover': {
        width: 80,
        background: `linear-gradient(90deg, #ffffff 0%, ${theme.palette.primary.main} 100%)`,
        boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
      },
      [theme.breakpoints.down('md')]: {
        margin: '0 auto',
        marginBottom: theme.spacing(3),
      }
    }
  };
});

export default function Introduction() {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <Container maxWidth="lg" className={classes.content}>
        <Box className="row align-items-center m-0 w-100">
          <Box className="col-12 col-lg-6">
            <Box className={classes.profileSection}>
              <Avatar src={ownerImage} className={classes.profilePicture} />
            </Box>
          </Box>

          <Box className="col-12 col-lg-6">
            <Box className={classes.textSection}>
              <Typography className={classes.greeting}>
                Hello, I'm
              </Typography>
              
              <Typography className={classes.name}>
                {constants.USER_PROFILE.NAME}
              </Typography>

              <Box className={classes.accentLine} />

              <Typography className={classes.title}>
                I build web and mobile applications
              </Typography>

              <Typography className={classes.description}>
                I'm a software engineer working in Canada with expertise in building
                high-quality web and mobile applications. Passionate about creating
                user-centric solutions that make a difference.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
