import React, { useCallback } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

import ownerImage from "./assets/owner.png";
import constants from "./constant";

const useStyles = makeStyles((theme) => {
  return {
    profilePicture: {
      height: 250,
      width: 250,
    },
  };
});

export default function Introduction(props) {
  const classes = useStyles();
  const particlesInit = useCallback(async (engine) => {
		await loadFull(engine);
  }, []);

  return (
    <Box
      className={`row align-items-center ${classes.main} p-lg-0 px-5 pb-5 m-0 flex-grow-1 position-relative`}
			style={{
				height: '100vh',
				maxWidth: '100vw',
				overflowX: 'hidden',
			}}
    >
			<Particles
				height="90vh"
				width="100vw"
				className="position-absolute"
        init={particlesInit}
        options={{
          background: {
            color: {
              value: "#3f51b5",
            },
          },
					fullScreen: false,
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: "#ffffff",
            },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            collisions: {
              enable: true,
            },
            move: {
              directions: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 6,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 50,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 5 },
            },
          },
          detectRetina: true,
        }}
      />

      <Box className="col-12 col-md-5 offset-md-1">
        <Box className="row justify-content-center align-items-center">
          <Avatar src={ownerImage} className={classes.profilePicture} />
        </Box>
      </Box>

      <Box className="col-12 col-md-5">
        <Typography variant="h6">Hello I'm </Typography>
        <Typography variant="h4" gutterBottom>
          {constants.USER_PROFILE.NAME}
        </Typography>

        <Typography variant="h4" color="textSecondary" gutterBottom>
          I build web and mobile based applications
        </Typography>

        <Typography variant="h6" color="textSecondary">
          I'm a software engineer working in Canada with expertise in building
          high-quality web applications.
        </Typography>
      </Box>
    </Box>
  );
}
