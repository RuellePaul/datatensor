import React, {FC} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import clsx from 'clsx';
import {Breadcrumbs, Button, Grid, Link, makeStyles, SvgIcon, Typography} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {Edit as EditIcon} from 'react-feather';

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
                <Typography
                    variant="h3"
                    color="textPrimary"
                >
                    User details
                </Typography>
            </Grid>
            <Grid item>
                <Button
                    color="secondary"
                    variant="contained"
                    component={RouterLink}
                    to="/app/admin/manage/users/edit"
                    startIcon={
                        <SvgIcon fontSize="small">
                            <EditIcon/>
                        </SvgIcon>
                    }
                >
                    Edit
                </Button>
            </Grid>
        </Grid>
    );
};

export default Header;
