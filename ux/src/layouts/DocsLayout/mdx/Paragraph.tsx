import type {FC} from 'react';
import React from 'react';
import {Typography} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import type {Theme} from 'src/theme';


const useStyles = makeStyles((theme: Theme) => ({
    root: {
        marginBottom: theme.spacing(2),
        '& > a': {
            color: theme.palette.primary.main
        }
    }
}));

const Paragraph: FC = (props) => {
    const classes = useStyles();

    return (
        <Typography
            variant="body1"
            color="textPrimary"
            className={classes.root}
            {...props}
        />
    );
};

export default Paragraph;
