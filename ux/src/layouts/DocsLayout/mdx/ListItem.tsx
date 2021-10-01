import type {FC} from 'react';
import React from 'react';
import {makeStyles, Typography} from '@material-ui/core';

const useStyles = makeStyles(() => ({
    root: {}
}));

const Paragraph: FC = (props) => {
    const classes = useStyles();

    return (
        <Typography
            variant="body1"
            color="textPrimary"
            component="li"
            className={classes.root}
            {...props}
        />
    );
};

export default Paragraph;
