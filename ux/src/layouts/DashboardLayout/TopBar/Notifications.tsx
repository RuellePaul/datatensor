import React, {FC, useEffect, useRef, useState} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {useSnackbar} from 'notistack';
import moment from 'moment';
import clsx from 'clsx';
import {
    Avatar,
    Badge,
    Box,
    Button,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    makeStyles,
    Popover,
    SvgIcon,
    Tooltip,
    Typography
} from '@material-ui/core';
import {Done, Warning, Security, Face} from '@material-ui/icons';
import {Bell as BellIcon} from 'react-feather';
import {Theme} from 'src/theme';
import {useDispatch, useSelector} from 'src/store';
import {deleteNotifications, getNotifications} from 'src/slices/notification';

const titlesMap = {
    TASK_SUCCEED: 'Generator succeeded',
    TASK_FAILED: 'Generator failed',
    REGISTRATION: 'Welcome to datatensor 👋',
    EMAIL_CONFIRM_REQUIRED: 'Please confirm your email address',
    EMAIL_CONFIRM_DONE: 'Your email address has been verified !',
};

const iconsMap = {
    TASK_SUCCEED: Done,
    TASK_FAILED: Warning,
    REGISTRATION: Face,
    EMAIL_CONFIRM_REQUIRED: Security,
    EMAIL_CONFIRM_DONE: Done,

};

const useStyles = makeStyles((theme: Theme) => ({
    popover: {
        width: 320
    },
    icon: {
        color: theme.palette.text.primary
    },
    success: {
        background: theme.palette.success.light,
        color: theme.palette.getContrastText(theme.palette.success.light)
    },
    error: {
        background: theme.palette.error.main,
        color: theme.palette.getContrastText(theme.palette.error.main)
    },
}));

const Notifications: FC = () => {
    const classes = useStyles();
    const {notifications} = useSelector((state) => state.notifications);
    const ref = useRef<any>(null);
    const dispatch = useDispatch();
    const [isOpen, setOpen] = useState<boolean>(false);
    const {enqueueSnackbar} = useSnackbar();

    const handleOpen = (): void => {
        setOpen(true);
    };

    const handleClose = (): void => {
        setOpen(false);
    };

    const handleDeleteNotifications = async () => {
        try {
            dispatch(deleteNotifications());
        } catch (error) {
            enqueueSnackbar(error.message || 'Something went wrong', {variant: 'error'});
        }
    };

    useEffect(() => {
        dispatch(getNotifications());
    }, [dispatch]);

    return (
        <>
            <Tooltip title="Notifications">
                <IconButton
                    color="inherit"
                    ref={ref}
                    onClick={handleOpen}
                >
                    <Badge badgeContent={notifications.length} color="error">
                        <SvgIcon>
                            <BellIcon/>
                        </SvgIcon>
                    </Badge>
                </IconButton>
            </Tooltip>
            <Popover
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                classes={{paper: classes.popover}}
                anchorEl={ref.current}
                onClose={handleClose}
                open={isOpen}
            >
                <Box p={2}>
                    <Typography
                        variant="h5"
                        color="textPrimary"
                    >
                        Notifications
                    </Typography>
                </Box>
                {notifications.length === 0 ? (
                    <Box p={2}>
                        <Typography
                            variant="h6"
                            color="textPrimary"
                        >
                            There are no notifications
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <List disablePadding>
                            {notifications.map((notification) => {
                                const Icon = iconsMap[notification.type];

                                return (
                                    <ListItem
                                        component={RouterLink}
                                        divider
                                        key={notification._id}
                                        to="#"
                                    >
                                        <ListItemAvatar>
                                            <Avatar
                                                className={clsx({
                                                    [classes.icon]: true,
                                                    [classes.success]: notification.type === 'TASK_SUCCEED',
                                                    [classes.error]: notification.type === 'TASK_FAILED',
                                                })}
                                            >
                                                <SvgIcon fontSize="small">
                                                    <Icon/>
                                                </SvgIcon>
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={(
                                                <Box display='flex' justifyContent='space-between'
                                                     alignItems='baseline'>
                                                    {titlesMap[notification.type]}

                                                    <Typography variant='overline' color='textSecondary'>
                                                        {moment(notification.created_at).format('HH:mm:ss')}
                                                    </Typography>
                                                </Box>
                                            )}
                                            primaryTypographyProps={{variant: 'subtitle2', color: 'textPrimary'}}
                                            secondary={notification.description}
                                        />
                                    </ListItem>
                                );
                            })}
                        </List>
                        <Box
                            p={1}
                            display="flex"
                            justifyContent="center"
                        >
                            <Button
                                size="small"
                                onClick={handleDeleteNotifications}
                            >
                                Mark all as read
                            </Button>
                        </Box>
                    </>
                )}
            </Popover>
        </>
    );
};

export default Notifications;
