import React, {FC} from 'react';
import {Box, LinearProgress} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {Theme} from 'src/theme';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        alignItems: 'center',
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
        left: 0,
        padding: theme.spacing(3),
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 2000
    }
}));

const SplashScreen: FC = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Box maxWidth={400} width="100%">
                <LinearProgress />
            </Box>
        </div>
    );
};

export default SplashScreen;
