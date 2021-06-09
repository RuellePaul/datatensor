import type {FC} from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import {useSnackbar} from 'notistack';
import {Box, Dialog, Divider, Grid, IconButton, makeStyles, SvgIcon, Typography} from '@material-ui/core';
import {
    Archive as ArchiveIcon,
    ArrowRight as ArrowRightIcon,
    Copy as CopyIcon,
    Layout as LayoutIcon,
    Users as UsersIcon,
    XCircle as CloseIcon
} from 'react-feather';
import type {Theme} from 'src/theme';
import {useDispatch} from 'src/store';
import {deleteOperation} from 'src/slices/pipeline';
import type {Operation} from 'src/types/pipeline';
import Details from './Details';
import ActionButton from './ActionButton';

interface OperationEditModalProps {
    className?: string;
    operation: Operation;
    onClose?: () => void;
    open: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(3)
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
            enqueueSnackbar('Operation archived', {
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
        <Dialog
            onClose={onClose}
            open={open}
            maxWidth='md'
            fullWidth
            {...rest}
        >
            <div className={classes.root}>
                <Box
                    display='flex'
                >
                    <Box flexGrow={1}/>
                    <IconButton onClick={onClose}>
                        <SvgIcon>
                            <CloseIcon/>
                        </SvgIcon>
                    </IconButton>
                </Box>
                <Grid
                    container
                    spacing={5}
                >
                    <Grid
                        item
                        xs={12}
                        sm={8}
                    >
                        <Details
                            operation={operation}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={4}
                    >
                        <Typography
                            variant='overline'
                            color='textSecondary'
                        >
                            Add to operation
                        </Typography>
                        <ActionButton
                            icon={<UsersIcon/>}
                            disabled
                        >
                            Labels
                        </ActionButton>
                        <Box mt={3}>
                            <Typography
                                variant='overline'
                                color='textSecondary'
                            >
                                Actions
                            </Typography>
                            <ActionButton
                                icon={<ArrowRightIcon/>}
                                disabled
                            >
                                Move
                            </ActionButton>
                            <ActionButton
                                icon={<CopyIcon/>}
                                disabled
                            >
                                Copy
                            </ActionButton>
                            <ActionButton
                                icon={<LayoutIcon/>}
                                disabled
                            >
                                Make Template
                            </ActionButton>
                            <Divider/>
                            <ActionButton
                                icon={<ArchiveIcon/>}
                                onClick={handleDelete}
                            >
                                Archive
                            </ActionButton>
                        </Box>
                    </Grid>
                </Grid>
            </div>
        </Dialog>
    );
};

OperationEditModal.propTypes = {
    // @ts-ignore
    operation: PropTypes.object.isRequired,
    className: PropTypes.string,
    // @ts-ignore
    onClose: PropTypes.func,
    open: PropTypes.bool.isRequired
};

OperationEditModal.defaultProps = {
    open: false,
    onClose: () => {
    }
};

export default OperationEditModal;
