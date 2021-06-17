import type {FC} from 'react';
import React from 'react';
import {useSnackbar} from 'notistack';
import {
    Box,
    Button,
    capitalize,
    Dialog,
    DialogActions,
    DialogContent,
    IconButton,
    makeStyles,
    SvgIcon,
    Typography
} from '@material-ui/core';
import {Close, Delete} from '@material-ui/icons';
import {Alert, AlertTitle} from '@material-ui/lab';
import type {Theme} from 'src/theme';
import {useDispatch} from 'src/store';
import {deleteOperation} from 'src/slices/pipeline';
import type {Operation} from 'src/types/pipeline';
import ProbabilitySlider from './ProbabilitySlider';
import OperationProperties from './OperationProperties';
import {OPERATIONS_DESCRIPTION, OPERATIONS_ICONS} from 'src/config';

interface OperationEditModalProps {
    className?: string;
    operation: Operation;
    onClose?: () => void;
    open: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
    deleteAction: {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.error.main,
        '&:hover': {
            backgroundColor: theme.palette.error.dark
        }
    }
}));

const OperationEditModal: FC<OperationEditModalProps> = ({
                                                             operation,
                                                             className,
                                                             onClose,
                                                             open,
                                                             ...rest
                                                         }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();

    const handleDelete = async (): Promise<void> => {
        try {
            await dispatch(deleteOperation(operation.id));
            enqueueSnackbar('Operation deleted');
        } catch (err) {
            console.error(err);
            enqueueSnackbar('Something went wrong', {
                variant: 'error'
            });
        }
    };

    return (
        <Dialog
            onClose={onClose}
            open={open}
            maxWidth='xs'
            fullWidth
            {...rest}
        >
            <DialogContent>
                <Box
                    display='flex'
                    mb={2}
                >
                    <Box mr={2}>
                        {OPERATIONS_ICONS[operation.type]}
                    </Box>
                    <Typography
                        variant='h5'
                    >
                        {capitalize(operation.type).replaceAll('_', ' ')}
                    </Typography>
                    <Box flexGrow={1}/>
                    <IconButton size='small' onClick={onClose}>
                        <SvgIcon>
                            <Close/>
                        </SvgIcon>
                    </IconButton>
                </Box>

                <ProbabilitySlider
                    operation={operation}
                />

                <OperationProperties
                    operation={operation}
                />

                <Box
                    my={1}
                    bgcolor='background.dark'
                >
                    <Alert severity='info'>
                        <AlertTitle>
                            Informations
                        </AlertTitle>
                        {OPERATIONS_DESCRIPTION[operation.type]}
                    </Alert>
                </Box>

            </DialogContent>

            <DialogActions>
                <Button
                    className={classes.deleteAction}
                    variant='outlined'
                    startIcon={<Delete/>}
                    onClick={handleDelete}
                    size='small'
                >
                    Delete operation
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default OperationEditModal;
