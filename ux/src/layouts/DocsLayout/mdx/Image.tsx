import type {FC} from 'react';
import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import {Theme} from 'src/theme';


const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'block',
        margin: '24px auto',
        width: '100%',
        maxWidth: 700,
        border: `solid 1px ${theme.palette.divider}`
    }
}));

const Image: FC = (props) => {
    const classes = useStyles();

    return (  // eslint-disable-next-line
        <img
            className={classes.root}
            {...props}
        />
    );
};

export default Image;
