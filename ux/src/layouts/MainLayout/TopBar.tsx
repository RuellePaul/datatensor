import React, {FC} from 'react';
import {Link as RouterLink, useHistory} from 'react-router-dom';
import clsx from 'clsx';
import {AppBar, Box, Button, Divider, Hidden, Link, Toolbar, Typography} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {APP_VERSION} from 'src/constants';
import Logo from 'src/components/utils/Logo';

interface TopBarProps {
    className?: string;
}

const useStyles = makeStyles(theme => ({
    root: {
        backdropFilter: theme.palette.mode === 'dark' ? 'blur(18px)' : 'none',
        boxShadow: theme.palette.mode === 'dark' ? 'rgb(19 47 76) 0px -1px 1px inset' : 'initial',
        backgroundColor: theme.palette.mode === 'dark' ? 'rgb(0 30 60 / 65%)' : '#FFFFFF'
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
                    <Link
                        className={classes.link}
                        color="textSecondary"
                        component={RouterLink}
                        to="/app"
                        underline="none"
                        variant="body2"
                    >
                        About
                    </Link>
                </Hidden>
                <Link
                    className={classes.link}
                    color="textSecondary"
                    component={RouterLink}
                    to="/docs"
                    underline="none"
                    variant="body2"
                >
                    Documentation
                </Link>
                <Divider className={classes.divider} />
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

export default TopBar;
