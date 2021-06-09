import type {ChangeEvent, FC} from 'react';
import React, {useState} from 'react';
import clsx from 'clsx';
import {useSnackbar} from 'notistack';
import {Box, Button, makeStyles, TextField} from '@material-ui/core';
import {useDispatch} from 'src/store';
import {createOperation} from 'src/slices/pipeline';

interface OperationAddProps {
    className?: string;
}

const useStyles = makeStyles(() => ({
    root: {}
}));

const OperationAdd: FC<OperationAddProps> = ({
                                                 className,
                                                 ...rest
                                             }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const [isExpanded, setExpanded] = useState<boolean>(false);
    const [name, setName] = useState<string>('');

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        event.persist();
        setName(event.target.value);
    };

    const handleAddInit = (): void => {
        setExpanded(true);
    };

    const handleAddCancel = (): void => {
        setExpanded(false);
        setName('');
    };

    const handleAddConfirm = async (): Promise<void> => {
        try {
            await dispatch(createOperation(name || 'Untitled Operation'));
            setExpanded(false);
            setName('');
            enqueueSnackbar('Operation created', {
                variant: 'success'
            });
        } catch (err) {
            console.error(err);
            enqueueSnackbar('Something went wrong', {
                variant: 'error'
            });
        }
    };

    return (
        <div
            className={clsx(classes.root, className)}
            {...rest}
        >
            {isExpanded ? (
                <>
                    <TextField
                        fullWidth
                        label="Operation Title"
                        name="operationName"
                        onChange={handleChange}
                        value={name}
                        variant="outlined"
                    />
                    <Box
                        mt={2}
                        display="flex"
                        justifyContent="space-between"
                    >
                        <Button
                            onClick={handleAddCancel}
                            variant="text"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddConfirm}
                            variant="contained"
                            color="secondary"
                        >
                            Add
                        </Button>
                    </Box>
                </>
            ) : (
                <Box
                    display="flex"
                    justifyContent="center"
                >
                    <Button onClick={handleAddInit}>
                        Add another operation
                    </Button>
                </Box>
            )}
        </div>
    );
};

export default OperationAdd;
