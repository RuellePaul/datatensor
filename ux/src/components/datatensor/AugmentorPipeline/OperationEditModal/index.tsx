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
import type {Theme} from 'src/theme';
import {useDispatch} from 'src/store';
import {deleteOperation} from 'src/slices/pipeline';
import type {Operation} from 'src/types/pipeline';
import {OPERATIONS_ICONS} from '../../../../config';
import ProbabilitySlider from './ProbabilitySlider';

interface OperationEditModalProps {
    className?: string;
    operation: Operation;
    onClose?: () => void;
    open: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
    content: {}
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
            PaperProps={{className: classes.content}}
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


            </DialogContent>

            <DialogActions>
                <Button
                    variant='outlined'
                    startIcon={<Delete/>}
                    onClick={handleDelete}
                >
                    Delete operation
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default OperationEditModal;