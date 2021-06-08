import React, {FC, useRef, useState} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import clsx from 'clsx';
import {useSnackbar} from 'notistack';
import {
    Badge,
    Box,
    Button,
    IconButton,
    List,
    ListItem,
    ListItemText,
    makeStyles,
    Popover,
    SvgIcon,
    Tooltip,
    Typography,
    useTheme
} from '@material-ui/core';
import {FiberManualRecord} from '@material-ui/icons';
import {Bell as BellIcon} from 'react-feather';
import {Theme} from 'src/theme';
import {useDispatch, useSelector} from 'src/store';
import {deleteNotifications, readNotifications} from 'src/slices/notification';
import getDateDiff from 'src/utils/getDateDiff';
import {User} from 'src/types/user';
import useAuth from 'src/hooks/useAuth';

const titlesMap = {
    TASK_SUCCEED: 'Task succeeded ✅',
    TASK_FAILED: 'Task failed ❌',
    REGISTRATION: 'Welcome to datatensor 👋',
    EMAIL_CONFIRM_REQUIRED: 'Security 🔒',
    EMAIL_CONFIRM_DONE: 'Verified ✅',
};

const descriptionsMap = (user: User) => ({
    TASK_SUCCEED: 'Generator task completed successfully.',
    TASK_FAILED: 'Generator task has failed.',
    REGISTRATION: "We're glad to see you as one of our members. Happy hacking on Datatensor !",
    EMAIL_CONFIRM_REQUIRED: 'Please confirm your email address to access all datatensor features.',
    EMAIL_CONFIRM_DONE: `Your email address ${user.email} has been verified !`,
});

const useStyles = makeStyles((theme: Theme) => ({
    popover: {
        width: 320
    },
    highlight: {
        background: 'rgba(255, 255, 255, 0.08)'
    }
}));

const Notifications: FC = () => {
    const classes = useStyles();
    const theme = useTheme();

    const {user} = useAuth();

    const {notifications} = useSelector((state) => state.notifications);
    const ref = useRef<any>(null);
    const dispatch = useDispatch();
    const [isOpen, setOpen] = useState<boolean>(false);
    const {enqueueSnackbar} = useSnackbar();

    const handleReadNotifications = async () => {
        try {
            dispatch(readNotifications());
        } catch (error) {
            enqueueSnackbar(error.message || 'Something went wrong', {variant: 'error'});
        }
    };

    const handleDeleteNotifications = async () => {
        try {
            dispatch(deleteNotifications());
        } catch (error) {
            enqueueSnackbar(error.message || 'Something went wrong', {variant: 'error'});
        }
    };

    const handleOpen = (): void => {
        setOpen(true);
    };

    const handleClose = (): void => {
        setOpen(false);
        handleReadNotifications();
    };


    return (
        <>
            <Tooltip
                title="Notifications"
            >
                <IconButton
                    color="inherit"
                    ref={ref}
                    onClick={handleOpen}
                >
                    <Badge
                        badgeContent={notifications.filter(notification => !notification.opened).length}
                        color='error'
                        max={9}
                    >
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
                            You don't have notifications
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <List disablePadding>
                            {notifications
                                .slice()
                                .sort((a, b) => (new Date(b.created_at).getTime()) - (new Date(a.created_at).getTime()) ? -1 : 1)
                                .map((notification) => {
                                    return (
                                        <ListItem
                                            button
                                            className={clsx(notification.opened === false && classes.highlight)}
                                            component={RouterLink}
                                            divider
                                            key={notification._id}
                                            to="#"
                                        >
                                            <ListItemText
                                                primary={titlesMap[notification.type]}
                                                primaryTypographyProps={{variant: 'subtitle2', color: 'textPrimary'}}
                                                secondary={
                                                    <>
                                                        {descriptionsMap(user)[notification.type]}
                                                        <br/>
                                                        <Typography component='span' variant='caption'>
                                                            {getDateDiff(new Date(), notification.created_at, 'passed_event')}
                                                        </Typography>
                                                    </>
                                                }
                                            />
                                            {notification.opened === false && (
                                                <SvgIcon htmlColor={theme.palette.info.main} fontSize="small">
                                                    <FiberManualRecord color='inherit'/>
                                                </SvgIcon>
                                            )}
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
