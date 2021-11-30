import React, {FC} from 'react';
import {Link as RouterLink, useHistory} from 'react-router-dom';
import clsx from 'clsx';
import {AppBar, Box, Button, Divider, Hidden, Toolbar, Typography} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {APP_VERSION} from 'src/constants';
import Logo from 'src/components/utils/Logo';
import useAuth from '../../hooks/useAuth';
import UserAvatar from '../../components/UserAvatar';

interface TopBarProps {
    className?: string;
}

const useStyles = makeStyles(theme => ({
    root: {
        backdropFilter: theme.palette.mode === 'dark' ? 'blur(18px)' : 'none',
        boxShadow: theme.palette.mode === 'dark' ? 'rgb(19 47 76) 0px -1px 1px inset' : 'initial',
        backgroundColor: theme.palette.mode === 'dark' ? 'rgb(4 28 58 / 70%)' : 'rgb(255 255 255 / 70%)'
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

    return (
        <AppBar className={clsx(classes.root, className)} color="default" {...rest}>
            <Toolbar className={classes.toolbar}>
                <RouterLink to="/">
                    <Logo className={classes.logo} />
                </RouterLink>
                <Hidden smDown>
                    <Box>
                        <Typography variant="overline" color="textPrimary" component="p">
                            Datatensor
                        </Typography>

                        <Typography variant="caption" color="textSecondary" component="p" className={classes.version}>
                            Version {APP_VERSION}
                        </Typography>
                    </Box>
                </Hidden>
                <Box flexGrow={1} />
                <Hidden smDown>
                    <Button className={classes.link} component="a" onClick={() => history.push('/app')}>
                        About
                    </Button>
                </Hidden>
                <Button className={classes.link} component="a" onClick={() => history.push('/docs')}>
                    Documentation
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
