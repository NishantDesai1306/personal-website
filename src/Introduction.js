import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

import ownerImage from "./assets/owner.webp";
import constants from "./constant";
import { scrollToSection } from "./AppBar";

// Results taken verbatim from the Experience section; keep them in sync.
const HIGHLIGHTS = [
  'J.D. Power: 197% more "Good" and 96% fewer "Poor" mobile Core Web Vitals URLs',
  "modd.io: cut S3 costs by 50% with a two-tier caching system",
];

const useStyles = makeStyles((theme) => {
  const onHero = "#ffffff";
  const onHeroMuted = "rgba(255, 255, 255, 0.9)";

  return {
    container: {
      width: "100%",
      maxWidth: "100vw",
      overflowX: "hidden",
      position: "relative",
      color: onHero,
      padding: theme.spacing(4, 0, 6),
      [theme.breakpoints.up("lg")]: {
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(6, 0),
      },
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 90% 90%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)`,
        pointerEvents: "none",
        zIndex: 1,
      },
    },
    content: {
      position: "relative",
      zIndex: 2,
    },
    profileSection: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    profilePicture: {
      height: 120,
      width: 120,
      border: `4px solid ${theme.palette.background.paper}`,
      boxShadow: theme.shadows[8],
      [theme.breakpoints.up("sm")]: {
        height: 160,
        width: 160,
      },
      [theme.breakpoints.up("lg")]: {
        height: 280,
        width: 280,
      },
    },
    textSection: {
      paddingTop: theme.spacing(3),
      textAlign: "center",
      [theme.breakpoints.up("lg")]: {
        paddingTop: 0,
        paddingLeft: theme.spacing(4),
        textAlign: "left",
      },
    },
    greeting: {
      fontSize: "1.1rem",
      fontWeight: 500,
      color: onHeroMuted,
      marginBottom: theme.spacing(0.5),
    },
    name: {
      fontSize: "2.2rem",
      fontWeight: 700,
      color: onHero,
      lineHeight: 1.1,
      marginBottom: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        fontSize: "2.8rem",
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: "3.5rem",
      },
    },
    accentLine: {
      width: 60,
      height: 4,
      background: onHero,
      borderRadius: 2,
      margin: theme.spacing(0, "auto", 2),
      [theme.breakpoints.up("lg")]: {
        marginLeft: 0,
      },
    },
    title: {
      fontSize: "1.25rem",
      fontWeight: 600,
      color: onHero,
      lineHeight: 1.3,
      marginBottom: theme.spacing(1.5),
      [theme.breakpoints.up("sm")]: {
        fontSize: "1.5rem",
      },
    },
    description: {
      fontSize: "1.05rem",
      lineHeight: 1.6,
      color: onHeroMuted,
      marginBottom: theme.spacing(2),
      maxWidth: 560,
      marginLeft: "auto",
      marginRight: "auto",
      [theme.breakpoints.up("lg")]: {
        marginLeft: 0,
      },
    },
    highlights: {
      listStyle: "none",
      padding: 0,
      margin: theme.spacing(0, "auto", 3),
      maxWidth: 560,
      color: onHeroMuted,
      textAlign: "left",
      [theme.breakpoints.up("lg")]: {
        marginLeft: 0,
      },
      "& li": {
        position: "relative",
        paddingLeft: theme.spacing(2.5),
        marginBottom: theme.spacing(0.75),
        lineHeight: 1.5,
      },
      "& li::before": {
        content: '"✓"',
        position: "absolute",
        left: 0,
        fontWeight: 700,
        color: onHero,
      },
    },
    actions: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: theme.spacing(1.5),
      [theme.breakpoints.up("lg")]: {
        justifyContent: "flex-start",
      },
    },
    primaryAction: {
      backgroundColor: onHero,
      color: theme.palette.primary.main,
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.85)",
      },
    },
    secondaryAction: {
      color: onHero,
      borderColor: onHero,
      "&:hover": {
        borderColor: onHero,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
      },
    },
  };
});

export default function Introduction() {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <Container maxWidth="lg" className={classes.content}>
        <Box className="row align-items-center m-0 w-100">
          <Box className="col-12 col-lg-5">
            <Box className={classes.profileSection}>
              <Avatar
                src={ownerImage}
                alt={`Portrait of ${constants.USER_PROFILE.NAME}`}
                className={classes.profilePicture}
              />
            </Box>
          </Box>

          <Box className="col-12 col-lg-7">
            <Box className={classes.textSection}>
              <Typography className={classes.greeting}>Hello, I'm</Typography>

              <Typography component="h1" className={classes.name}>
                {constants.USER_PROFILE.NAME}
              </Typography>

              <Box className={classes.accentLine} />

              <Typography className={classes.title}>
                Senior Frontend Developer building fast React and Next.js apps
              </Typography>

              <Typography className={classes.description}>
                I'm a software engineer working in Canada. Since 2016 I have
                built web apps, scalable backends and React Native mobile apps,
                with a focus on performance and clean, intuitive UI.
              </Typography>

              <Box component="ul" className={classes.highlights} aria-label="Selected results">
                {HIGHLIGHTS.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </Box>

              <Box className={classes.actions}>
                <Button
                  variant="contained"
                  size="large"
                  disableElevation
                  className={classes.primaryAction}
                  href="#projects"
                  onClick={scrollToSection}
                >
                  View projects
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  className={classes.secondaryAction}
                  href="#contact-me"
                  onClick={scrollToSection}
                >
                  Contact me
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
