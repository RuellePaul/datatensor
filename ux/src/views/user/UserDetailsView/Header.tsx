import React, {FC} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import clsx from 'clsx';
import {Breadcrumbs, Grid, Link, makeStyles, Typography} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

interface HeaderProps {
    className?: string;
    user: object;
}

const useStyles = makeStyles(() => ({
    root: {}
}));

const Header: FC<HeaderProps> = ({className, user, ...rest}) => {
    const classes = useStyles();

    return (
        <Grid
            container
            spacing={3}
            justify="space-between"
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Grid item>
                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small"/>}
                    aria-label="breadcrumb"
                >
                    <Link
                        variant="body1"
                        color="inherit"
                        to="/app"
                        component={RouterLink}
                    >
                        Dashboard
                    </Link>
                    <Link
                        variant="body1"
                        color="inherit"
                        to="/app/manage"
                        component={RouterLink}
                    >
                        Manage
                    </Link>
                    <Typography
                        variant="body1"
                        color="textPrimary"
                    >
                        Users
                    </Typography>
                </Breadcrumbs>
            </Grid>
        </Grid>
    );
};

export default Header;
