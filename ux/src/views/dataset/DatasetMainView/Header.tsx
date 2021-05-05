import React, {FC} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {Breadcrumbs, capitalize, Grid, Link, makeStyles, Typography} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import useDataset from 'src/hooks/useDataset';

interface HeaderProps {
    className?: string;
}

const useStyles = makeStyles(() => ({
    root: {}
}));

const Header: FC<HeaderProps> = ({className, ...rest}) => {

    const classes = useStyles();

    const {dataset} = useDataset();

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
                        {dataset.name && capitalize(dataset.name)}
                    </Typography>
                </Breadcrumbs>
            </Grid>
        </Grid>
    );
};

Header.propTypes = {
    className: PropTypes.string
};

export default Header;
