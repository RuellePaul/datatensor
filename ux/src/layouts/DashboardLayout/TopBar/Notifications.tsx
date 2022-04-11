import React, {FC, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import {useSnackbar} from 'notistack';
import {
    Badge,
    Box,
    Button,
    capitalize,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Popover,
    SvgIcon,
    Tooltip,
    Typography,
    useTheme
} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {FiberManualRecord} from '@mui/icons-material';
import {Bell as BellIcon} from 'react-feather';
import {Theme} from 'src/theme';
import {useDispatch, useSelector} from 'src/store';
import {deleteNotifications, readNotifications, setNotifications} from 'src/slices/notification';
import useAuth from 'src/hooks/useAuth';
import useTasks from 'src/hooks/useTasks';
import {Notification} from 'src/types/notification';
import {User} from 'src/types/user';
import getDateDiff from 'src/utils/getDateDiff';
import {WS_HOSTNAME} from 'src/utils/api';
import {HEARTBEAT_DELAY} from 'src/constants';


const titlesMap = {
    TASK_SUCCEED: 'Task succeeded ✅',
    TASK_FAILED: 'Task failed ❌',
    REGISTRATION: 'Welcome to datatensor 👋',
    EMAIL_CONFIRM_REQUIRED: 'Security 🔒',
    EMAIL_CONFIRM_DONE: 'Verified ✅'
};

const descriptionsMap = (user: User) => ({
    TASK_SUCCEED: ' task completed successfully.',
    TASK_FAILED: ' task has failed.',
    REGISTRATION: "We're glad to see you as one of our members. Happy hacking on Datatensor !",
    EMAIL_CONFIRM_REQUIRED: 'Please confirm your email address to access all datatensor features.',
    EMAIL_CONFIRM_DONE: `Your email address ${user.email} has been verified !`
});

const useStyles = makeStyles((theme: Theme) => ({
    popover: {
        width: '100%',
        maxWidth: 320,
        height: 'unset !important',
        maxHeight: 520,
        padding: theme.spacing(2)
    },
    notification: {
        padding: theme.spacing(1),
        marginTop: 0,
        marginBottom: 4
    },
    highlight: {
        background: 'rgba(255, 255, 255, 0.08)'
    }
}));

let notificationsIntervalID;

const Notifications: FC = () => {
    const classes = useStyles();
    const theme = useTheme();

    const { user, accessToken } = useAuth();
    const { tasks, saveSelectedTask } = useTasks();

    const { notifications } = useSelector(state => state.notifications);
    const ref = useRef<any>(null);
    const dispatch = useDispatch();
    const [isOpen, setOpen] = useState<boolean>(false);
    const { enqueueSnackbar } = useSnackbar();

    const wsNotifications = useRef(null);

    // Send
    useEffect(() => {
        wsNotifications.current = new WebSocket(`${WS_HOSTNAME}/notifications`);
        wsNotifications.current.onopen = () => {
            console.info('Notifications websocket opened.');
        };
        wsNotifications.current.onclose = () => {
            console.info('Notifications websocket closed.');
        };

        return () => {
            wsNotifications.current.close();
            clearInterval(notificationsIntervalID);
        };
    }, []);

    // Receive notifications
    useEffect(() => {
        if (!wsNotifications.current) return;

        function sendNotificationsMessage() {
            if (wsNotifications.current && wsNotifications.current.readyState === WebSocket.OPEN) {
                console.log('Send notifications poll...');
                wsNotifications.current.send(accessToken);
            }
        }

        notificationsIntervalID = setInterval(sendNotificationsMessage, HEARTBEAT_DELAY);

        wsNotifications.current.onmessage = event => {
            dispatch(setNotifications(JSON.parse(event.data)));
        };
    }, [dispatch, accessToken]);

    const handleReadNotifications = async () => {
        try {
            dispatch(readNotifications());
        } catch (error) {
            enqueueSnackbar(error.message || 'Something went wrong', {
                variant: 'error'
            });
        }
    };

    const handleDeleteNotifications = async () => {
        try {
            dispatch(deleteNotifications());
        } catch (error) {
            enqueueSnackbar(error.message || 'Something went wrong', {
                variant: 'error'
            });
        } finally {
            handleClose();
        }
    };

    const handleOpen = (): void => {
        setOpen(true);
    };

    const handleClose = (): void => {
        setOpen(false);
        handleReadNotifications();
    };

    const handleNotificationClick = (notification: Notification): void => {
        if (notification.task_id) {
            handleClose();

            // @ts-ignore
            const task = tasks.find(task => task.id === notification.task_id);

            if (task) saveSelectedTask(task);
        }
    };

    return (
        <>
            <Tooltip title="Notifications">
                <IconButton color="inherit" ref={ref} onClick={handleOpen} size="large">
                    <Badge
                        badgeContent={notifications.filter(notification => !notification.opened).length}
                        color="error"
                        max={9}
                    >
                        <SvgIcon>
                            <BellIcon />
                        </SvgIcon>
                    </Badge>
                </IconButton>
            </Tooltip>
            <Popover
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                classes={{ paper: clsx(classes.popover, 'scroll') }}
                anchorEl={ref.current}
                onClose={handleClose}
                open={isOpen}
            >
                <Typography variant="h4" color="textPrimary" align="center" gutterBottom>
                    Notifications
                </Typography>
                {notifications.length === 0 ? (
                    <Typography variant="h6" color="textSecondary" align="center">
                        You don't have any notification
                    </Typography>
                ) : (
                    <>
                        <List disablePadding>
                            {notifications
                                .slice()
                                .sort((a, b) =>
                                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime() ? -1 : 1
                                )
                                .map(notification => {
                                    return (
                                        <ListItem
                                            button
                                            className={clsx(
                                                classes.notification,
                                                notification.opened === false && classes.highlight
                                            )}
                                            divider
                                            key={notification.id}
                                            onClick={() => handleNotificationClick(notification)}
                                        >
                                            <ListItemText
                                                primary={titlesMap[notification.type]}
                                                primaryTypographyProps={{
                                                    variant: 'subtitle2',
                                                    color: 'textPrimary'
                                                }}
                                                secondary={
                                                    <>
                                                        {['TASK_SUCCEED', 'TASK_FAILED'].includes(notification.type) &&
                                                            tasks &&
                                                            capitalize(
                                                                tasks.find(task => task.id === notification.task_id)
                                                                    ?.type || ''
                                                            )}
                                                        {descriptionsMap(user)[notification.type]}
                                                        <br />
                                                        <Typography component="span" variant="caption">
                                                            {getDateDiff(
                                                                new Date(),
                                                                notification.created_at,
                                                                'passed_event'
                                                            )}
                                                        </Typography>
                                                    </>
                                                }
                                            />
                                            {notification.opened === false && (
                                                <SvgIcon htmlColor={theme.palette.info.main} fontSize="small">
                                                    <FiberManualRecord color="inherit" />
                                                </SvgIcon>
                                            )}
                                        </ListItem>
                                    );
                                })}
                        </List>
                        <Box p={1} display="flex" justifyContent="center">
                            <Button size="small" onClick={handleDeleteNotifications}>
                                Delete all
                            </Button>
                        </Box>
                    </>
                )}
            </Popover>
        </>
    );
};

export default Notifications;
