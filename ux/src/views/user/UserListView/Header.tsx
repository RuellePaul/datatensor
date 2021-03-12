import React, {FC} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {Box, Breadcrumbs, Button, Grid, Link, makeStyles, SvgIcon, Typography} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {Download as DownloadIcon, PlusCircle as PlusCircleIcon, Upload as UploadIcon} from 'react-feather';
import {Theme} from 'src/theme';

interface HeaderProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    action: {
        marginBottom: theme.spacing(1),
        '& + &': {
            marginLeft: theme.spacing(1)
        }
    }
}));

const Header: FC<HeaderProps> = ({className, ...rest}) => {
    const classes = useStyles();

    return (
        <Grid
            className={clsx(classes.root, className)}
            container
            justify="space-between"
            spacing={3}
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
                        to="/admin/management"
                        component={RouterLink}
                    >
                        Management
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
                    All Users
                </Typography>
                <Box mt={2}>
                    <Button startIcon={
                        <SvgIcon fontSize="small">
                            <UploadIcon/>
                        </SvgIcon>
                    }>
                        Import
                    </Button>
                    <Button startIcon={
                        <SvgIcon fontSize="small">
                            <DownloadIcon/>
                        </SvgIcon>
                    }>
                        Export
                    </Button>
                </Box>
            </Grid>
            <Grid item>
                <Button
                    color="secondary"
                    variant="contained"
                    startIcon={
                        <SvgIcon fontSize="small">
                            <PlusCircleIcon/>
                        </SvgIcon>
                    }
                >
                    New User
                </Button>
            </Grid>
        </Grid>
    );
};

Header.propTypes = {
    className: PropTypes.string
};

export default Header;