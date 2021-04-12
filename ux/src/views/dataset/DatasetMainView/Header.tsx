import React, {FC} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {Breadcrumbs, Button, Grid, Link, makeStyles, SvgIcon, Typography} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {PlusCircle as PlusIcon} from 'react-feather';
import {Dataset} from 'src/types/dataset';

interface HeaderProps {
    dataset: Dataset;
    className?: string;
}

const useStyles = makeStyles(() => ({
    root: {}
}));

const Header: FC<HeaderProps> = ({dataset, className, ...rest}) => {
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
                    <Link
                        variant="body1"
                        color="inherit"
                        to="/app/manage/datasets"
                        component={RouterLink}
                    >
                        Manage
                    </Link>
                    <Link
                        variant="body1"
                        color="inherit"
                        to="/app/manage/datasets"
                        component={RouterLink}
                    >
                        Datasets
                    </Link>
                    <Typography
                        variant="body1"
                        color="textPrimary"
                    >
                        {dataset.name}
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
                    to="/app/manage/datasets/create"
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

Header.propTypes = {
    className: PropTypes.string
};

export default Header;
