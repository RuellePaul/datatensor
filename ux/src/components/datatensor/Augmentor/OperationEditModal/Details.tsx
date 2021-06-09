import type {FC} from 'react';
import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {useSnackbar} from 'notistack';
import {Box, makeStyles, TextField, Typography} from '@material-ui/core';
import {useDispatch} from 'src/store';
import {updateOperation} from 'src/slices/pipeline';
import type {Operation, List} from 'src/types/pipeline';

interface DetailsProps {
    className?: string;
    operation: Operation;
    list: List;
}

const useStyles = makeStyles(() => ({
    root: {}
}));

const Details: FC<DetailsProps> = ({
                                       operation,
                                       className,
                                       list,
                                       ...rest
                                   }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();

    const handleUpdate = _.debounce(async (update) => {
        try {
            await dispatch(updateOperation(operation.id, update));
            enqueueSnackbar('Operation updated', {
                variant: 'success'
            });
        } catch (err) {
            console.error(err);
            enqueueSnackbar('Something went wrong', {
                variant: 'error'
            });
        }
    }, 1000);

    return (
        <div
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Box mt={3}>
                <TextField
                    variant="outlined"
                    fullWidth
                    defaultValue={operation.name}
                    onChange={(event) => handleUpdate({name: event.target.value})}
                    label="Operation Title"
                />
            </Box>
            <Box mt={3}>
                <Typography
                    variant="h4"
                    color="textPrimary"
                >
                    Description
                </Typography>
                <Box mt={2}>
                    <TextField
                        multiline
                        rows={6}
                        fullWidth
                        variant="outlined"
                        onChange={(event) => handleUpdate({description: event.target.value})}
                        placeholder="Leave a message"
                        defaultValue={operation.description}
                    />
                </Box>
            </Box>
        </div>
    );
}

Details.propTypes = {
    // @ts-ignore
    operation: PropTypes.object.isRequired,
    className: PropTypes.string,
    // @ts-ignore
    list: PropTypes.object.isRequired
};

export default Details;
