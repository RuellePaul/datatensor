import type {FC} from 'react';
import React from 'react';
import makeStyles from '@mui/styles/makeStyles';


const useStyles = makeStyles(() => ({
    root: {
        display: 'block',
        margin: '24px auto',
        width: '100%',
        maxWidth: 500
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
