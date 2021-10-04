import type {FC} from 'react';
import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import type {Theme} from 'src/theme';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingBottom: theme.spacing(1),
        paddingTop: theme.spacing(1),
        marginBottom: theme.spacing(2),
        borderLeft: `4px solid ${theme.palette.text.primary}`,
        '& > p': {
            color: theme.palette.text.primary,
            marginBottom: 0
        }
    }
}));

const Blockquote: FC = (props) => {
    const classes = useStyles();

    return (
        <blockquote
            className={classes.root}
            {...props}
        />
    );
};

export default Blockquote;
