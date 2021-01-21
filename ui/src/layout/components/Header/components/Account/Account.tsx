import React, {FC, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {useUser} from 'hooks';

import {Avatar, Box, Divider, IconButton, Menu, MenuItem, Typography} from '@material-ui/core';
import {AccountCircle} from '@material-ui/icons';

const Account: FC = () => {

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
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
            >
                <Box width={150} p='0.5rem 1rem'>
                    <Typography
                        variant='body2'
                    >
                        Signed in as
                    </Typography>
                    <Typography
                        variant='body1'
                    >
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