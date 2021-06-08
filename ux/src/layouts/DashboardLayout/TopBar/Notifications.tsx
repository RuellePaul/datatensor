import React, {FC, useRef, useState} from 'react';
import {Link as RouterLink} from 'react-router-dom';
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
    Typography
} from '@material-ui/core';
import {Bell as BellIcon} from 'react-feather';
import {Theme} from 'src/theme';
import {useDispatch, useSelector} from 'src/store';
import {deleteNotifications} from 'src/slices/notification';
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

const descriptionsMap = (user : User) => ({
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

    const {user} = useAuth();

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

    return (
        <>
            <Tooltip title="Notifications">
                <IconButton
                    color="inherit"
                    ref={ref}
                    onClick={handleOpen}
                >
                    <Badge
                        badgeContent={notifications.length}
                        color='error'
                        max={99}
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
                            There are no notifications
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
