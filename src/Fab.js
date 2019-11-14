import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import constants from './constant';

const useStyles = makeStyles((theme) => {
  return {
    fab: {
      position: 'fixed',
      bottom: 10,
      right: 20,
			zIndex: theme.zIndex.mobileStepper + 1,
    }
  }
});

const FabButton = () => {
	const classes = useStyles();

	return (
		<Tooltip title='Resume'>
			<Fab
				color='primary' 
				className={`${classes.fab} uses-internet`}
				onClick={() => window.open(constants.USER_PROFILE.RESUME, '_blank')}
			>
				<Icon>description</Icon>
			</Fab>      
		</Tooltip>
	);
}

export default FabButton;