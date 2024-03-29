import type {FC} from 'react';
import React from 'react';
import makeStyles from '@mui/styles/makeStyles';


const useStyles = makeStyles(() => ({
    root: {
        paddingLeft: 2,
        paddingRight: 2,
        color: '#1a1a1a',
        fontFamily: 'Inconsolata, Monaco, Consolas, \'Courier New\', Courier, monospace',
        fontSize: 14,
        backgroundColor: 'rgb(255,229,100)'
    }
}));

const CodeInline: FC = (props) => {
    const classes = useStyles();

    return (
        <code
            className={classes.root}
            {...props}
        />
    );
};

export default CodeInline;
