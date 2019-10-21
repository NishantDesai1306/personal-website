import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme) => {
  return {
    fab: {
      position: 'fixed',
      bottom: 10,
      margin: 'auto',
      zIndex: 99999
    }
  }
});

const FabButton = () => {
	const classes = useStyles();

	return (
		<Tooltip title="Resume">
			<Fab
				color="primary" 
				className={classes.fab}
				onClick={() => window.open("/Nishant_Desai_Resume.pdf", "_blank")}
			>
				<Icon>description</Icon>
			</Fab>      
		</Tooltip>
	);
}

export default FabButton;