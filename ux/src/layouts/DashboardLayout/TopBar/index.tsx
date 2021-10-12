import React, {FC} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import clsx from 'clsx';
import {AppBar, Box, Hidden, IconButton, SvgIcon, Toolbar} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {Menu as MenuIcon} from 'react-feather';
import Logo from 'src/components/utils/Logo';
import {Theme} from 'src/theme';
import Account from './Account';
import Notifications from './Notifications';
import Settings from './Settings';


interface TopBarProps {
    className?: string;
    onMobileNavOpen?: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        zIndex: theme.zIndex.drawer + 100
    },
    toolbar: {
        minHeight: 64
    },
    logo: {
        '& polygon, & polygon.line': {
            fill: theme.palette.mode === 'light' ? 'white !important' : 'initial'
        }
    }
}));

const TopBar: FC<TopBarProps> = ({className, onMobileNavOpen, ...rest}) => {
    const classes = useStyles();

    return (
        <AppBar className={clsx(classes.root, className)} {...rest}>
            <Toolbar className={classes.toolbar}>
                <Hidden lgUp>
                    <IconButton color="inherit" onClick={onMobileNavOpen} size="large">
                        <SvgIcon fontSize="small">
                            <MenuIcon />
                        </SvgIcon>
                    </IconButton>
                </Hidden>
                <Hidden lgDown>
                    <RouterLink to="/">
                        <Logo className={classes.logo}/>
                    </RouterLink>
                </Hidden>
                <Box ml={2} flexGrow={1} />
                <Notifications />
                <Settings />
                <Box ml={2}>
                    <Account />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

TopBar.defaultProps = {
    onMobileNavOpen: () => {}
};

export default TopBar;
