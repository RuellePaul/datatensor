import React, {FC, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {useUser} from 'hooks';

import {Avatar, Box, Divider, IconButton, Menu, MenuItem, Typography} from '@material-ui/core';
import {AccountCircle} from '@material-ui/icons';
import {makeStyles} from '@material-ui/core/styles';

import {GithubIcon, GoogleIcon, StackoverflowIcon} from 'components/Buttons/components/LoginOAuth/LoginOAuth';

const useStyles = makeStyles((theme) => ({
    menu: {
        marginTop: 40
    },
    profile: {
        width: 150,
        padding: '0.5rem 1rem',
        outline: 'none'
    },
    container: {
        display: 'flex',
        alignItems: 'center'
    }
}));

const Account: FC = () => {

    const classes = useStyles();
    const history = useHistory();

    const {user} = useUser();

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);

    const handleClose = () => setAnchorEl(null);

    const handleClick = (link: string) => {
        history.push(link);
        handleClose();
    };

    return (
        <>
            {user.id
                ? <IconButton
                    edge='end'
                    color='inherit'
                    onClick={handleOpen}
                >
                    <Avatar
                        src={user.avatar}
                        alt='User avatar'
                    />
                </IconButton>
                : <IconButton
                    edge='end'
                    color='inherit'
                    onClick={() => history.push('/login')}
                >
                    <AccountCircle fontSize='large'/>
                </IconButton>
            }
            <Menu
                className={classes.menu}
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
            >
                <Box
                    className={classes.profile}
                    tabIndex={-1}
                >
                    <Typography
                        variant='body2'
                        gutterBottom
                    >
                        Signed in as
                    </Typography>
                    <Typography
                        className={classes.container}
                        variant='body1'
                    >
                        {user.scope === 'github' && <GithubIcon/>}
                        {user.scope === 'google' && <GoogleIcon/>}
                        {user.scope === 'stackoverflow' && <StackoverflowIcon/>}
                        &nbsp;
                        {user.name}
                    </Typography>
                </Box>
                <Divider/>
                <Box p='0.5rem 0'>
                    <MenuItem dense autoFocus onClick={() => handleClick('/')}>Your profile</MenuItem>
                    <MenuItem dense onClick={() => handleClick('/')}>Your datasets</MenuItem>
                </Box>
                <Divider/>
                <Box p='0.5rem 0'>
                    <MenuItem dense onClick={() => handleClick('/')}>Upgrade</MenuItem>
                    <MenuItem dense onClick={() => handleClick('/')}>Help</MenuItem>
                    <MenuItem dense onClick={() => handleClick('/')}>Settings</MenuItem>
                    <MenuItem dense onClick={() => handleClick('/logout')}>Sign out</MenuItem>
                </Box>
            </Menu>
        </>
    )
};

export default Account;