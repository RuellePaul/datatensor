import React, {FC} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import clsx from 'clsx';
import {Box, Breadcrumbs, Button, Grid, Link, makeStyles, SvgIcon, Typography} from '@material-ui/core';
import {Download as DownloadIcon, PlusCircle as PlusCircleIcon, Upload as UploadIcon} from 'react-feather';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
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
                        to="/admin/manage"
                        component={RouterLink}
                    >
                        Management
                    </Link>
                    <Typography
                        variant="body1"
                        color="textPrimary"
                    >
                        Datasets
                    </Typography>
                </Breadcrumbs>
                <Typography
                    variant="h3"
                    color="textPrimary"
                >
                    All Datasets
                </Typography>
                <Box mt={2}>
                    <Button
                        className={classes.action}
                        startIcon={
                            <SvgIcon fontSize="small">
                                <UploadIcon/>
                            </SvgIcon>
                        }
                    >
                        Import
                    </Button>
                    <Button
                        className={classes.action}
                        startIcon={
                            <SvgIcon fontSize="small">
                                <DownloadIcon/>
                            </SvgIcon>
                        }
                    >
                        Export
                    </Button>
                </Box>
            </Grid>
            <Grid item>
                <Button
                    color="secondary"
                    variant="contained"
                    className={classes.action}
                    component={RouterLink}
                    to="/app/manage/datasets/create"
                    startIcon={
                        <SvgIcon fontSize="small">
                            <PlusCircleIcon/>
                        </SvgIcon>
                    }
                >
                    New Dataset
                </Button>
            </Grid>
        </Grid>
    );
};

export default Header;
