import React, {FC} from 'react';
import {Link as RouterLink, useHistory} from 'react-router-dom';
import PropTypes from 'prop-types';
import {AppBar, Box, Button, Hidden, IconButton, Toolbar, Tooltip, Typography} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {Menu as MenuIcon} from 'react-feather';
import Logo from 'src/components/utils/Logo';
import UserAvatar from 'src/components/UserAvatar';
import useAuth from 'src/hooks/useAuth';

interface TopBarProps {
    onMobileNavOpen?: () => void;
}

const useStyles = makeStyles(theme => ({
    root: {
        color: theme.palette.text.primary,
        boxShadow: 'none',
        borderBottom: `1px solid ${theme.palette.divider}`,
        zIndex: theme.zIndex.drawer + 100
    },
    toolbar: {
        height: 64
    }
}));

const TopBar: FC<TopBarProps> = ({onMobileNavOpen}) => {
    const classes = useStyles();
    const history = useHistory();

    const {user} = useAuth();

    return (
        <AppBar className={classes.root}>
            <Toolbar className={classes.toolbar}>
                <Hidden lgUp>
                    <IconButton color="inherit" onClick={onMobileNavOpen} size="large">
                        <MenuIcon />
                    </IconButton>
                </Hidden>
                <Hidden lgDown>
                    <RouterLink to="/">
                        <Logo />
                    </RouterLink>
                </Hidden>
                <Hidden smDown>
                    <Box ml={1}>
                        <Typography variant="overline" component="p" sx={{color: 'white'}}>
                            Datatensor
                        </Typography>
                    </Box>
                </Hidden>
                <Box ml={2} flexGrow={1} />
                <Tooltip title={user === null ? 'Login to Datatensor' : 'Back to datasets'}>
                    <Button
                        color="primary"
                        component="a"
                        variant="contained"
                        onClick={() => history.push('/datasets')}
                        endIcon={user !== null && <UserAvatar user={user} style={{width: 30, height: 30}} />}
                    >
                        Datasets
                    </Button>
                </Tooltip>
            </Toolbar>
        </AppBar>
    );
};

TopBar.propTypes = {
    onMobileNavOpen: PropTypes.func
};

TopBar.defaultProps = {
    onMobileNavOpen: () => {}
};

export default TopBar;
