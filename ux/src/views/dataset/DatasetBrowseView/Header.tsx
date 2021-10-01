import React, {FC} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import clsx from 'clsx';
import {Breadcrumbs, Button, Grid, makeStyles, SvgIcon, Typography} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {Plus as PlusIcon} from 'react-feather';

interface HeaderProps {
    className?: string;
}

const useStyles = makeStyles(() => ({
    root: {}
}));

const Header: FC<HeaderProps> = ({className, ...rest}) => {
    const classes = useStyles();

    return (
        <Grid
            alignItems="center"
            container
            justify="space-between"
            spacing={3}
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Grid item>
                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small"/>}
                    aria-label="breadcrumb"
                >
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
                    See the latest datasets
                </Typography>
            </Grid>
            <Grid item>
                <Button
                    color="secondary"
                    component={RouterLink}
                    to="/app/datasets/create"
                    variant="contained"
                    startIcon={
                        <SvgIcon fontSize="small">
                            <PlusIcon/>
                        </SvgIcon>
                    }
                >
                    Add new dataset
                </Button>
            </Grid>
        </Grid>
    );
};

export default Header;
