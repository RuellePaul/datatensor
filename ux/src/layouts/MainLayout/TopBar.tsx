import React, {FC} from 'react';
import {Link as RouterLink, useHistory} from 'react-router-dom';
import clsx from 'clsx';
import {AppBar, Box, Button, Divider, Hidden, Toolbar, Typography, useMediaQuery} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {Theme} from 'src/theme';
import {APP_VERSION} from 'src/constants';
import Logo from 'src/components/utils/Logo';
import UserAvatar from 'src/components/UserAvatar';
import useAuth from 'src/hooks/useAuth';

interface TopBarProps {
    className?: string;
}

const useStyles = makeStyles(theme => ({
    root: {
        backdropFilter: 'blur(16px)',
        boxShadow: theme.palette.mode === 'dark' ? 'rgb(19 47 76) 0px -1px 1px inset' : 'rgb(0 0 0) 0px -1px 1px inset',
        backgroundColor: theme.palette.mode === 'dark' ? 'rgb(10 25 40 / 60%)' : 'rgb(0 0 0 / 65%)',
        backgroundImage: 'none'
    },
    version: {
        marginTop: -5,
        fontSize: 11
    },
    toolbar: {
        height: 64
    },
    logo: {
        marginRight: theme.spacing(2)
    },
    link: {
        fontWeight: theme.typography.fontWeightMedium,
        '& + &': {
            marginLeft: theme.spacing(2)
        }
    },
    divider: {
        width: 1,
        height: 32,
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.down('sm')]: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1)
        }
    }
}));

const TopBar: FC<TopBarProps> = ({className, ...rest}) => {
    const classes = useStyles();
    const history = useHistory();

    const {user} = useAuth();
    const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));

    return (
        <AppBar className={clsx(classes.root, className)} color="default" {...rest}>
            <Toolbar className={classes.toolbar}>
                <RouterLink to="/">
                    <Logo className={classes.logo} />
                </RouterLink>
                <Hidden smDown>
                    <Box>
                        <Typography variant="overline" component="p" sx={{color: 'white'}}>
                            Datatensor
                        </Typography>

                        <Typography variant="caption" color="textSecondary" component="p" className={classes.version}>
                            Version {APP_VERSION}
                        </Typography>
                    </Box>
                </Hidden>
                <Box flexGrow={1} />
                <Button className={classes.link} component="a" onClick={() => history.push('/docs')}>
                    {isDesktop ? 'Documentation' : 'Docs'}
                </Button>
                <Divider className={classes.divider} />
                <Button
                    color="primary"
                    component="a"
                    variant="contained"
                    onClick={() => history.push('/login')}
                    endIcon={user !== null && <UserAvatar user={user} style={{width: 30, height: 30}} />}
                >
                    Dashboard
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;
