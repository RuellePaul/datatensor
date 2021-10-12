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
        backgroundColor: theme.palette.background.paper
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
        <AppBar className={clsx(classes.root, className)} color="default" {...rest}>
            <Toolbar className={classes.toolbar}>
                <RouterLink to="/">
                    <Logo className={classes.logo} />
                </RouterLink>
                <Box>
                    <Typography variant="overline" color="textPrimary" component="p">
                        Datatensor
                    </Typography>

                    <Hidden lgDown>
                        <Typography variant="caption" color="textSecondary" component="p" style={{marginTop: -3}}>
                            Version {APP_VERSION}
                        </Typography>
                    </Hidden>
                </Box>
                <Box flexGrow={1} />
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
