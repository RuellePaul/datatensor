import type {FC} from 'react';
import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';


interface CodeProps {
    className?: string;
}

const useStyles = makeStyles(() => ({
    root: {}
}));

const Code: FC<CodeProps> = ({ className, ...rest }) => {
    const classes = useStyles();

    return (
        <code
            className={clsx(classes.root, className)}
            {...rest}
        />
    );
};

Code.propTypes = {
    className: PropTypes.string.isRequired
};

export default Code;
