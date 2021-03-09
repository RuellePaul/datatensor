import React, {FC} from 'react';
import {Link as RouterLink, useHistory} from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {AppBar, Box, Button, Divider, Hidden, Link, makeStyles, Toolbar, Typography} from '@material-ui/core';
import {APP_VERSION} from 'src/constants';
import Logo from 'src/components/Logo';

interface TopBarProps {
    className?: string;
}

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default
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
        marginRight: theme.spacing(2)
    }
}));

const TopBar: FC<TopBarProps> = ({className, ...rest}) => {
    const classes = useStyles();
    const history = useHistory();

    return (
        <AppBar
            className={clsx(classes.root, className)}
            color="default"
            {...rest}
        >
            <Toolbar className={classes.toolbar}>
                <RouterLink to="/">
                    <Logo className={classes.logo}/>
                </RouterLink>
                <Hidden mdDown>
                    <Typography
                        variant="caption"
                        color="textSecondary"
                    >
                        Version
                        {' '}
                        {APP_VERSION}
                    </Typography>
                </Hidden>
                <Box flexGrow={1}/>
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
                <Link
                    className={classes.link}
                    color="textSecondary"
                    component={RouterLink}
                    to="/app"
                    underline="none"
                    variant="body2"
                >
                    Documentation
                </Link>
                <Divider className={classes.divider}/>
                <Button
                    color="secondary"
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
    className: PropTypes.string
};

export default TopBar;
