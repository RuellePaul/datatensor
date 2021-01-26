import React, {FC} from 'react';
import {LinearProgress} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    progress: {
        height: 2,
        marginBottom: -2
    }
}));

const Fallback: FC = ({children}) => {

    const classes = useStyles();

    return (
        <LinearProgress className={classes.progress}/>
    )
};

export default Fallback;