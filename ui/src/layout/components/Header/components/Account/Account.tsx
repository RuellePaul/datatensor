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

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    return (
        <>
            {user.id
                ? <IconButton
                    edge='end'
                    color='inherit'
                    onClick={handleMenu}
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
                <Box width={150} p='0.5rem 1rem'>
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
                        {user.website === 'github' && <GithubIcon/>}
                        {user.website === 'google' && <GoogleIcon/>}
                        {user.website === 'stackoverflow' && <StackoverflowIcon/>}
                        &nbsp;
                        {user.name}
                    </Typography>
                </Box>
                <Divider/>
                <Box p='0.5rem 0'>
                    <MenuItem dense onClick={handleClose}>Your profile</MenuItem>
                    <MenuItem dense onClick={handleClose}>Your datasets</MenuItem>
                </Box>
                <Divider/>
                <Box p='0.5rem 0'>
                    <MenuItem dense onClick={handleClose}>Upgrade</MenuItem>
                    <MenuItem dense onClick={handleClose}>Help</MenuItem>
                    <MenuItem dense onClick={handleClose}>Settings</MenuItem>
                    <MenuItem dense onClick={handleClose}>Sign out</MenuItem>
                </Box>

            </Menu>

        </>
    )
};

export default Account;