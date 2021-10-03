import type {FC} from 'react';
import React from 'react';
import {Link as RouterLink, useHistory} from 'react-router-dom';
import PropTypes from 'prop-types';
import {AppBar, Box, Button, Hidden, IconButton, Toolbar} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {Menu as MenuIcon} from 'react-feather';
import Logo from 'src/components/utils/Logo';

interface TopBarProps {
    onMobileNavOpen?: () => void;
}

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        boxShadow: 'none',
        borderBottom: `1px solid ${theme.palette.divider}`,
        zIndex: theme.zIndex.drawer + 100
    },
    toolbar: {
        height: 64
    }
}));

const TopBar: FC<TopBarProps> = ({ onMobileNavOpen }) => {

    const classes = useStyles();
    const history = useHistory();

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
                <Box
                    ml={2}
                    flexGrow={1}
                />
                <Button
                    color="primary"
                    component="a"
                    variant="contained"
                    size="small"
                    onClick={() => history.push('/app')}
                >
                    Dashboard
                </Button>
            </Toolbar>
        </AppBar>
    );
};

TopBar.propTypes = {
    onMobileNavOpen: PropTypes.func
};

TopBar.defaultProps = {
    onMobileNavOpen: () => {
    }
};

export default TopBar;
