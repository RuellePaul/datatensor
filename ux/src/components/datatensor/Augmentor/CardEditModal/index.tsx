import type {FC} from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import {useSnackbar} from 'notistack';
import {Box, Dialog, Divider, Grid, IconButton, makeStyles, SvgIcon, Typography} from '@material-ui/core';
import {
    Archive as ArchiveIcon,
    ArrowRight as ArrowRightIcon,
    Copy as CopyIcon,
    Eye as EyeIcon,
    EyeOff as EyeOffIcon,
    File as FileIcon,
    Layout as LayoutIcon,
    Users as UsersIcon,
    XCircle as CloseIcon
} from 'react-feather';
import type {Theme} from 'src/theme';
import {useDispatch} from 'src/store';
import {deleteCard, updateCard} from 'src/slices/kanban';
import type {Card, List} from 'src/types/kanban';
import Details from './Details';
import ActionButton from './ActionButton';

interface CardEditModalProps {
    className?: string;
    card: Card;
    list: List;
    onClose?: () => void;
    open: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(3)
    },
    listName: {
        fontWeight: theme.typography.fontWeightMedium
    }
}));

const CardEditModal: FC<CardEditModalProps> = ({
                                                   card,
                                                   className,
                                                   list,
                                                   onClose,
                                                   open,
                                                   ...rest
                                               }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();

    const handleSubscribe = async (): Promise<void> => {
        try {
            await dispatch(updateCard(card.id, {isSubscribed: true}));
            enqueueSnackbar('Unsubscribed', {
                variant: 'success'
            });
        } catch (err) {
            console.error(err);
            enqueueSnackbar('Something went wrong', {
                variant: 'error'
            });
        }
    };

    const handleUnsubscribe = async (): Promise<void> => {
        try {
            await dispatch(updateCard(card.id, {isSubscribed: false}));
            enqueueSnackbar('Subscribed', {
                variant: 'success'
            });
        } catch (err) {
            console.error(err);
            enqueueSnackbar('Something went wrong', {
                variant: 'error'
            });
        }
    };

    const handleDelete = async (): Promise<void> => {
        try {
            await dispatch(deleteCard(card.id));
            enqueueSnackbar('Card archived', {
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
            maxWidth="md"
            fullWidth
            {...rest}
        >
            <div className={classes.root}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                >
                    <Typography
                        variant="body2"
                        color="textSecondary"
                    >
                        in list
                        {' '}
                        <span className={classes.listName}>
              {list.name}
            </span>
                    </Typography>
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
                            card={card}
                            list={list}
                        />
                        <Box mt={3}>
                            <Typography
                                variant="h4"
                                color="textPrimary"
                            >
                                Activity
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={4}
                    >
                        <Typography
                            variant="overline"
                            color="textSecondary"
                        >
                            Add to card
                        </Typography>
                        <ActionButton
                            icon={<UsersIcon/>}
                            disabled
                        >
                            Labels
                        </ActionButton>
                        <ActionButton
                            icon={<FileIcon/>}
                            disabled
                        >
                            Attachments
                        </ActionButton>
                        <Box mt={3}>
                            <Typography
                                variant="overline"
                                color="textSecondary"
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
                            {card.isSubscribed ? (
                                <ActionButton
                                    icon={<EyeOffIcon/>}
                                    onClick={handleUnsubscribe}
                                >
                                    Unwatch
                                </ActionButton>
                            ) : (
                                <ActionButton
                                    icon={<EyeIcon/>}
                                    onClick={handleSubscribe}
                                >
                                    Watch
                                </ActionButton>
                            )}
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

CardEditModal.propTypes = {
    // @ts-ignore
    card: PropTypes.object.isRequired,
    className: PropTypes.string,
    // @ts-ignore
    list: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    open: PropTypes.bool.isRequired
};

CardEditModal.defaultProps = {
    open: false,
    onClose: () => {
    }
};

export default CardEditModal;
