import React, {FC, useRef, useState} from 'react';
import {Link as RouterLink, useHistory} from 'react-router-dom';
import {useSnackbar} from 'notistack';
import {Box, ButtonBase, Divider, Hidden, ListItemIcon, ListItemText, Menu, MenuItem, Typography} from '@mui/material';
import {AccountBox as AccountIcon, Logout as LogoutIcon} from '@mui/icons-material';
import {makeStyles} from '@mui/styles';
import UserAvatar from 'src/components/UserAvatar';
import useAuth from 'src/hooks/useAuth';

const useStyles = makeStyles(theme => ({
    avatar: {
        height: 32,
        width: 32
    },
    username: {
        marginLeft: '8px !important'
    },
    popover: {
        width: 200
    }
}));

const Account: FC = () => {
    const classes = useStyles();
    const history = useHistory();
    const ref = useRef<any>(null);
    const {user, logout} = useAuth();
    const {enqueueSnackbar} = useSnackbar();
    const [isOpen, setOpen] = useState<boolean>(false);

    const handleOpen = (): void => {
        setOpen(true);
    };

    const handleClose = (): void => {
        setOpen(false);
    };

    const handleLogout = async (): Promise<void> => {
        try {
            handleClose();
            await logout();
            window.location.href = '/';
        } catch (err) {
            console.error(err);
            enqueueSnackbar('Unable to logout', {
                variant: 'error'
            });
        }
    };

    return (
        <>
            <Box
                display="flex"
                alignItems="center"
                component={ButtonBase}
                onClick={handleOpen}
                // @ts-ignore
                ref={ref}
            >
                <UserAvatar className={classes.avatar} />
                <Hidden mdDown>
                    <Typography className={classes.username} variant="h6" color="inherit">
                        {user.name}
                    </Typography>
                </Hidden>
            </Box>
            <Menu
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                keepMounted
                PaperProps={{className: classes.popover}}
                anchorEl={ref.current}
                open={isOpen}
            >
                <MenuItem component={RouterLink} to="/account">
                    <ListItemIcon>
                        <AccountIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Account</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
};

export default Account;
