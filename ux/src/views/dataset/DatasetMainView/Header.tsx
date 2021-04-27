import React, {FC} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {Breadcrumbs, capitalize, Grid, Link, makeStyles, Typography} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
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
