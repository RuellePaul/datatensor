import type {FC} from 'react';
import React from 'react';
import clsx from 'clsx';
import {Box, makeStyles} from '@material-ui/core';
import type {Operation} from 'src/types/pipeline';

interface DetailsProps {
    className?: string;
    operation: Operation;
}

const useStyles = makeStyles(() => ({
    root: {}
}));

const Details: FC<DetailsProps> = ({
                                       operation,
                                       className,
                                       ...rest
                                   }) => {
    const classes = useStyles();

    return (
        <div
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Box mt={3}>
                {operation.type}
            </Box>
        </div>
    );
}

export default Details;
