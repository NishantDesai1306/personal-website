import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
import DescriptionIcon from "@material-ui/icons/Description";

import constants from "./constant";

const useStyles = makeStyles((theme) => {
  return {
    fab: {
      position: "fixed",
      bottom: 10,
      right: 20,
      zIndex: theme.zIndex.mobileStepper + 1,
    },
  };
});

const FabButton = () => {
  const classes = useStyles();

  return (
    <Tooltip title="Resume">
      <Fab
        color="primary"
        className={`${classes.fab} uses-internet`}
        onClick={() => window.open(constants.USER_PROFILE.RESUME, "_blank")}
      >
        <DescriptionIcon />
      </Fab>
    </Tooltip>
  );
};

export default FabButton;
