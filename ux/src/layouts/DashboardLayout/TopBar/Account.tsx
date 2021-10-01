import React, {FC, useRef, useState} from 'react';
import {Link as RouterLink, useHistory} from 'react-router-dom';
import {useSnackbar} from 'notistack';
import {
    Box,
    ButtonBase,
    Hidden,
    Menu,
    MenuItem,
    Typography
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import UserAvatar from 'src/components/UserAvatar';
import useAuth from 'src/hooks/useAuth';

const useStyles = makeStyles(theme => ({
    avatar: {
        height: 32,
        width: 32,
        '& + span > .MuiAvatar-root': {
            border: `solid 1px ${theme.palette.primary.main}`
        }
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
            history.push('/');
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
                    <Typography
                        className={classes.username}
                        variant="h6"
                        color="inherit"
                    >
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
                <MenuItem component={RouterLink} to="/app/account">
                    Account
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </>
    );
};

export default Account;
