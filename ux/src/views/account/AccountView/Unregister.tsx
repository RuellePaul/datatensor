import React, {FC, useState} from 'react';
import clsx from 'clsx';
import {useSnackbar} from 'notistack';
import {Box, Button, CircularProgress, makeStyles} from '@material-ui/core';
import {Alert, AlertTitle} from '@material-ui/lab';
import {DeleteOutline as DeleteIcon} from '@material-ui/icons';
import {Theme} from 'src/theme';
import api from 'src/utils/api';

interface UnregisterProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    deleteAction: {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.error.main,
        '&:hover': {
            backgroundColor: theme.palette.error.dark
        }
    },
    loader: {
        width: '20px !important',
        height: '20px !important'
    }
}));

const Unregister: FC<UnregisterProps> = ({className, ...rest}) => {

    const classes = useStyles();

    const {enqueueSnackbar} = useSnackbar();

    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const handleUnregister = async () => {
        try {
            setIsDeleting(true);
            await api.post('/auth/unregister');
            window.location.href = '/';
        } catch (error) {
            enqueueSnackbar(error.message || 'Something went wrong', {variant: 'error'});
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <div
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Box mb={2}>
                <Alert severity="error">
                    <AlertTitle>Delete account</AlertTitle>
                    Be careful, once deleted, there is no going back. <strong>Your account will be lost forever</strong>
                </Alert>
            </Box>

            <Button
                className={classes.deleteAction}
                onClick={handleUnregister}
                startIcon={<DeleteIcon/>}
                endIcon={isDeleting && (
                    <CircularProgress
                        className={classes.loader}
                        color="inherit"
                    />
                )}
                disabled={isDeleting}
                variant="contained"
            >
                Delete account
            </Button>
        </div>
    );
};

export default Unregister;
